// src/pages/profile/ProfilePage.jsx
import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  GridItem,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  LuUser,
  LuMail,
  LuPhone,
  LuCalendar,
  LuShield,
  LuActivity,
  LuKeyRound,
  LuFingerprint,
  LuClock,
  LuPencil,
  LuPower,
  LuCircleCheck,
  LuX,
  LuShieldCheck,
  LuCalendarDays,
  LuRefreshCw,
  LuEye,
  LuEyeOff,
  LuPlus,
  LuTrash2,
  LuLock,
  LuSparkles,
} from "react-icons/lu";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../auth/AuthContext";
import { adminsAPI } from "../../api/admins.api";
import { useAppToast } from "../../components/common/AppToast";
import { formatNumeric } from "../../utils/date";

/* ─── Avatar URL builder (env-driven) ─── */
const RAW_API_URL = process.env.REACT_APP_API_URL || "";
const RAW_ADMIN_AVATAR_PATH =
  process.env.REACT_APP_ADMIN_AVATAR_PATH || "/uploads/admins";

const API_URL = RAW_API_URL.replace(/\/+$/, "");
const ADMIN_AVATAR_PATH = RAW_ADMIN_AVATAR_PATH.replace(/^\/+|\/+$/g, "");

function buildAdminAvatarUrl(filename) {
  if (!filename || typeof filename !== "string") return undefined;
  if (/^https?:\/\//i.test(filename)) return filename;
  if (!API_URL) return undefined;

  const cleanFile = filename.replace(/^\/+/, "");

  return ADMIN_AVATAR_PATH
    ? `${API_URL}/${ADMIN_AVATAR_PATH}/${cleanFile}`
    : `${API_URL}/${cleanFile}`;
}

/* ─── Constants ─── */
const ROLE_STYLE = {
  super: { bg: "syria.umber.mid", labelKey: "adminDetails.roleSuper" },
  admin: { bg: "syria.green.mid", labelKey: "adminDetails.roleAdmin" },
};

const PERMISSION_STYLE = {
  read: { icon: LuEye, color: "info" },
  create: { icon: LuPlus, color: "success" },
  update: { icon: LuPencil, color: "warning" },
  delete: { icon: LuTrash2, color: "error" },
};

const SECTION_ACCENT = {
  personal: "syria.green.mid",
  account: "info.500",
  security: "warning.500",
  permissions: "syria.umber.mid",
};

function toInputDate(value) {
  if (!value) return "";
  try {
    return new Date(value).toISOString().split("T")[0];
  } catch {
    return "";
  }
}

function toWhatsAppNumber(phone) {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  return digits.startsWith("0") ? `963${digits.slice(1)}` : digits;
}

function toGmailCompose(email) {
  if (!email) return "";
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
}

function PremiumSection({ number, icon, title, accent, children }) {
  return (
    <Box
      bg="bg-card"
      borderWidth="1px"
      borderColor="border-color"
      rounded="md"
      overflow="hidden"
      shadow="sm"
      transition="all 0.25s ease"
      _hover={{ shadow: "md", borderColor: accent }}
      h="100%"
      display="flex"
      flexDirection="column">
      <Flex
        align="center"
        gap={3}
        px={5}
        py={4}
        borderBottomWidth="1px"
        borderColor="border-color">
        <Flex
          align="center"
          justify="center"
          w={10}
          h={10}
          rounded="md"
          bg={accent}
          color="white"
          flexShrink={0}
          shadow="sm">
          <Icon as={icon} boxSize={5} />
        </Flex>
        <VStack align="start" spacing={0} flex="1" minW={0}>
          <Text
            fontSize="2xs"
            fontFamily="mono"
            color="text-muted"
            fontWeight="bold"
            letterSpacing="wider"
            lineHeight="1">
            {String(number).padStart(2, "0")}
          </Text>
          <Heading
            size="sm"
            color="text-primary"
            fontWeight="bold"
            noOfLines={1}
            mt={0.5}>
            {title}
          </Heading>
        </VStack>
      </Flex>
      <Box p={{ base: 4, md: 5 }} flex="1">
        {children}
      </Box>
    </Box>
  );
}

function InfoRow({ icon, label, value, last = false }) {
  return (
    <Flex
      align="center"
      gap={3}
      py={2.5}
      borderBottomWidth={last ? 0 : "1px"}
      borderColor="border-color">
      <Flex
        align="center"
        justify="center"
        w={7}
        h={7}
        rounded="sm"
        bg="bg-input"
        color="text-muted"
        flexShrink={0}>
        <Icon as={icon} boxSize={3.5} />
      </Flex>
      <Text fontSize="xs" color="text-muted" flex="1" noOfLines={1}>
        {label}
      </Text>
      <Text
        fontSize="sm"
        fontWeight="semibold"
        color="text-primary"
        textAlign="end"
        noOfLines={1}
        title={value}>
        {value || "—"}
      </Text>
    </Flex>
  );
}

function ContactBadge({ href, colorScheme, icon, children, target }) {
  return (
    <Badge
      as="a"
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      colorScheme={colorScheme}
      variant="subtle"
      fontSize="xs"
      rounded="md"
      px={3}
      py={1.5}
      textTransform="none"
      fontWeight="medium"
      cursor="pointer"
      display="inline-flex"
      alignItems="center"
      gap={1.5}
      transition="opacity 0.15s ease"
      _hover={{ opacity: 0.8 }}>
      <Icon as={icon} boxSize={3.5} />
      {children}
    </Badge>
  );
}

function DetailField({ icon, label, value, isEditing, children }) {
  return (
    <FormControl>
      <FormLabel
        fontSize="xs"
        fontWeight="semibold"
        color="text-muted"
        mb={1.5}
        letterSpacing="wide">
        <HStack spacing={1.5}>
          <Icon as={icon} boxSize={3.5} color="text-muted" />
          <Text>{label}</Text>
        </HStack>
      </FormLabel>
      {isEditing && children ? (
        children
      ) : (
        <Text
          fontSize="sm"
          fontWeight="medium"
          color="text-primary"
          noOfLines={2}>
          {value || "—"}
        </Text>
      )}
    </FormControl>
  );
}

function StatPill({ icon, label, value, color }) {
  return (
    <Box
      bg="bg-card"
      borderWidth="1px"
      borderColor="border-color"
      rounded="md"
      px={4}
      py={3}
      transition="all 0.2s ease"
      _hover={{ shadow: "md" }}>
      <HStack spacing={3} align="center">
        <Flex
          align="center"
          justify="center"
          w={9}
          h={9}
          rounded="sm"
          bg="bg-input"
          color={color}
          flexShrink={0}>
          <Icon as={icon} boxSize={4} />
        </Flex>
        <VStack align="start" spacing={0} flex="1" minW={0}>
          <Text
            fontSize="2xs"
            color="text-muted"
            fontWeight="semibold"
            noOfLines={1}>
            {label}
          </Text>
          <Text
            fontSize="sm"
            fontWeight="bold"
            color="text-primary"
            noOfLines={1}
            title={value}>
            {value}
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
}

function PasswordField({ icon, label, value, onChange, visible, onToggle }) {
  const { t } = useTranslation();
  return (
    <FormControl>
      <FormLabel
        fontSize="xs"
        fontWeight="semibold"
        color="text-secondary"
        mb={1.5}>
        <HStack spacing={1.5}>
          <Icon as={icon} boxSize={3.5} color="text-muted" />
          <Text>{label}</Text>
        </HStack>
      </FormLabel>
      <InputGroup size="sm">
        <Input
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          rounded="sm"
          autoComplete="new-password"
          maxLength={64}
          borderColor="border-color"
          _hover={{ borderColor: "border-color" }}
          _focus={{
            borderColor: "warning.500",
            boxShadow: "none",
          }}
          _focusVisible={{
            borderColor: "warning.500",
            boxShadow: "0 0 0 1px var(--chakra-colors-warning-500)",
          }}
        />
        <InputRightElement>
          <IconButton
            type="button"
            size="xs"
            variant="ghost"
            aria-label={
              visible ? t("profile.hidePassword") : t("profile.showPassword")
            }
            icon={visible ? <LuEyeOff /> : <LuEye />}
            onClick={onToggle}
          />
        </InputRightElement>
      </InputGroup>
    </FormControl>
  );
}

export default function ProfilePage() {
  const {
    admin: currentAdmin,
    isLoading: isAuthLoading,
    clearSession,
  } = useAuth();
  const { t, i18n } = useTranslation();
  const appToast = useAppToast();
  const navigate = useNavigate();
  const isRTL = i18n.language === "ar";

  const [fetchedAdmin, setFetchedAdmin] = useState(null);
  const [isFetchingAdmin, setIsFetchingAdmin] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    birth_date: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_new_password: "",
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const appToastRef = useRef(appToast);
  appToastRef.current = appToast;
  const tRef = useRef(t);
  tRef.current = t;
  const currentAdminRef = useRef(currentAdmin);
  currentAdminRef.current = currentAdmin;

  const currentAdminId = currentAdmin?._id;

  useEffect(() => {
    if (!currentAdminId) {
      setIsFetchingAdmin(false);
      return;
    }

    let cancelled = false;

    const fetchAdmin = async () => {
      setIsFetchingAdmin(true);
      try {
        const fresh = await adminsAPI.getById(currentAdminId);
        if (cancelled || !fresh) return;

        setFetchedAdmin(fresh);
        setForm({
          first_name: fresh.first_name ?? "",
          last_name: fresh.last_name ?? "",
          phone_number: fresh.phone_number ?? "",
          birth_date: toInputDate(fresh.birth_date),
        });
      } catch (err) {
        if (cancelled) return;

        const fallback = currentAdminRef.current;
        appToastRef.current.error(err, tRef.current("adminDetails.loadError"));

        setFetchedAdmin(fallback);
        setForm({
          first_name: fallback?.first_name ?? "",
          last_name: fallback?.last_name ?? "",
          phone_number: fallback?.phone_number ?? "",
          birth_date: toInputDate(fallback?.birth_date),
        });
      } finally {
        if (!cancelled) setIsFetchingAdmin(false);
      }
    };

    fetchAdmin();

    return () => {
      cancelled = true;
    };
  }, [currentAdminId]);

  if (isAuthLoading || isFetchingAdmin) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Spinner size="lg" color="syria.green.mid" />
      </Flex>
    );
  }

  if (!currentAdmin) {
    return <Navigate to="/login" replace />;
  }

  const admin = fetchedAdmin ?? currentAdmin;
  const isSuper = admin?.role === "super";
  const accentColor = isSuper ? "syria.umber.mid" : "syria.green.mid";

  const tPermission = (perm) => {
    const key = `adminDetails.permissions.${perm}`;
    const translated = t(key);
    return translated === key ? perm : translated;
  };

  const roleStyle = ROLE_STYLE[admin?.role] || ROLE_STYLE.admin;
  const fullName =
    `${admin?.first_name ?? ""} ${admin?.last_name ?? ""}`.trim() ||
    admin?.email ||
    "—";
  const memberSince = admin?.createdAt
    ? formatNumeric(new Date(admin.createdAt))
    : "—";

  const avatarUrl = buildAdminAvatarUrl(admin?.avatar);

  const set = (field, value) => setForm((p) => ({ ...p, [field]: value }));
  const setPwd = (field, value) =>
    setPasswordForm((p) => ({ ...p, [field]: value }));

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {};

      const trimFirst = form.first_name.trim();
      const trimLast = form.last_name.trim();
      const trimPhone = form.phone_number.trim();

      if (trimFirst && trimFirst !== (admin.first_name ?? "")) {
        payload.first_name = trimFirst;
      }
      if (trimLast && trimLast !== (admin.last_name ?? "")) {
        payload.last_name = trimLast;
      }
      if (trimPhone && trimPhone !== (admin.phone_number ?? "")) {
        payload.phone_number = trimPhone;
      }
      if (
        form.birth_date &&
        form.birth_date !== toInputDate(admin.birth_date)
      ) {
        payload.birth_date = form.birth_date;
      }

      if (Object.keys(payload).length === 0) {
        if (typeof appToast.info === "function") {
          appToast.info(t("adminDetails.noChanges"));
        } else {
          appToast.success(t("adminDetails.noChanges"));
        }
        setIsEditing(false);
        return;
      }

      await adminsAPI.updateMe(payload);

      const fresh = await adminsAPI.getById(currentAdminId);
      if (fresh) {
        setFetchedAdmin(fresh);
        setForm({
          first_name: fresh.first_name ?? "",
          last_name: fresh.last_name ?? "",
          phone_number: fresh.phone_number ?? "",
          birth_date: toInputDate(fresh.birth_date),
        });
      }

      appToast.success(t("adminDetails.saveSuccess"));
      setIsEditing(false);
    } catch (err) {
      appToast.error(err, t("adminDetails.saveError"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setForm({
      first_name: admin?.first_name ?? "",
      last_name: admin?.last_name ?? "",
      phone_number: admin?.phone_number ?? "",
      birth_date: toInputDate(admin?.birth_date),
    });
    setIsEditing(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (isChangingPassword) return;

    const { current_password, new_password, confirm_new_password } =
      passwordForm;

    if (!current_password || !new_password || !confirm_new_password) return;

    if (new_password.length < 8) {
      appToast.error(t("profile.passwordTooShort"));
      return;
    }
    if (new_password !== confirm_new_password) {
      appToast.error(t("profile.passwordMismatch"));
      return;
    }
    if (new_password === current_password) {
      appToast.error(t("profile.passwordSameAsCurrent"));
      return;
    }

    setIsChangingPassword(true);
    try {
      await adminsAPI.changeMyPassword({
        current_password,
        new_password,
        confirm_new_password,
      });
      appToast.success(t("profile.passwordChanged"));
      setPasswordForm({
        current_password: "",
        new_password: "",
        confirm_new_password: "",
      });
      setTimeout(() => {
        clearSession();
        navigate("/login", { replace: true });
      }, 1200);
    } catch (err) {
      appToast.error(err, t("profile.passwordChangeError"));
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <Box w="full" py={1} dir={isRTL ? "rtl" : "ltr"}>
      <Box
        bg="bg-card"
        borderWidth="1px"
        borderColor="border-color"
        rounded="md"
        overflow="hidden"
        shadow="md"
        mb={5}
        position="relative">
        <Box
          h="160px"
          bgGradient="linear(135deg, syria.green.mid 0%, syria.green.light 100%)"
          position="relative"
          overflow="hidden">
          <Box
            position="absolute"
            inset={0}
            sx={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: "22px 22px",
            }}
            pointerEvents="none"
          />
          <Box
            position="absolute"
            top="-70px"
            insetInlineEnd="-40px"
            w="220px"
            h="220px"
            rounded="full"
            bg="whiteAlpha.100"
            pointerEvents="none"
          />
          <Box
            position="absolute"
            bottom="-110px"
            insetInlineStart="18%"
            w="240px"
            h="240px"
            rounded="full"
            bg="whiteAlpha.100"
            pointerEvents="none"
          />
          <Box
            position="absolute"
            top={4}
            insetInlineStart={5}
            color="whiteAlpha.600">
            <Icon as={LuSparkles} boxSize={4} />
          </Box>
        </Box>

        <Flex justify="center" mt="-56px" position="relative" zIndex={2}>
          <Box position="relative">
            <Avatar
              size="2xl"
              name={fullName}
              src={avatarUrl}
              bg={accentColor}
              color="white"
              borderWidth="6px"
              borderColor="bg-card"
              shadow="2xl"
              transition="transform 0.2s ease"
              _hover={{ transform: "scale(1.03)" }}
            />
          </Box>
        </Flex>

        <VStack spacing={3} px={6} pt={4} pb={6} align="center">
          <Heading
            size="lg"
            color="text-primary"
            fontWeight="bold"
            textAlign="center">
            {fullName}
          </Heading>

          <HStack spacing={2} wrap="wrap" justify="center">
            <Badge
              bg={roleStyle.bg}
              color="white"
              fontSize="2xs"
              rounded="sm"
              px={2.5}
              py={1}
              fontWeight="semibold"
              textTransform="none">
              {t(roleStyle.labelKey)}
            </Badge>
            <Badge
              colorScheme={admin?.isActive ? "success" : "error"}
              variant="subtle"
              fontSize="2xs"
              rounded="sm"
              px={2.5}
              py={1}
              textTransform="none">
              {admin?.isActive
                ? t("adminDetails.statusActive")
                : t("adminDetails.statusInactive")}
            </Badge>
          </HStack>

          <HStack spacing={2} wrap="wrap" justify="center" pt={1}>
            {admin?.email && (
              <ContactBadge
                href={toGmailCompose(admin.email)}
                target="_blank"
                colorScheme="info"
                icon={LuMail}>
                <Text>{admin.email}</Text>
              </ContactBadge>
            )}
            {admin?.phone_number && (
              <ContactBadge
                href={`https://wa.me/${toWhatsAppNumber(admin.phone_number)}`}
                target="_blank"
                colorScheme="success"
                icon={LuPhone}>
                <Text dir="ltr">{admin.phone_number}</Text>
              </ContactBadge>
            )}
          </HStack>
        </VStack>
      </Box>

      <SimpleGrid columns={{ base: 2, lg: 4 }} spacing={3} mb={5}>
        <StatPill
          icon={LuShield}
          label={t("adminDetails.statRole")}
          value={t(roleStyle.labelKey)}
          color={accentColor}
        />
        <StatPill
          icon={admin?.isActive ? LuCircleCheck : LuPower}
          label={t("adminDetails.statStatus")}
          value={
            admin?.isActive
              ? t("adminDetails.statusActive")
              : t("adminDetails.statusInactive")
          }
          color={admin?.isActive ? "success.500" : "error.500"}
        />
        <StatPill
          icon={LuCalendarDays}
          label={t("adminDetails.statMemberSince")}
          value={memberSince}
          color="syria.wheat.dark"
        />
        <StatPill
          icon={LuRefreshCw}
          label={t("adminDetails.statLastUpdate")}
          value={
            admin?.updatedAt ? formatNumeric(new Date(admin.updatedAt)) : "—"
          }
          color="syria.green.light"
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 12 }} spacing={5}>
        <GridItem colSpan={{ base: 1, lg: 7 }}>
          <PremiumSection
            number={1}
            icon={LuUser}
            title={t("adminDetails.personalInfo")}
            accent={SECTION_ACCENT.personal}>
            <Flex justify="flex-end" mb={4} gap={2}>
              {!isEditing ? (
                <Button
                  size="sm"
                  colorScheme="success"
                  leftIcon={<LuPencil size={14} />}
                  onClick={() => setIsEditing(true)}
                  rounded="md">
                  {t("adminDetails.edit")}
                </Button>
              ) : (
                <>
                  <Button
                    size="sm"
                    colorScheme="error"
                    variant="outline"
                    leftIcon={<LuX size={14} />}
                    onClick={handleCancelEdit}
                    isDisabled={isSaving}
                    rounded="md">
                    {t("adminDetails.cancelEdit")}
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="success"
                    leftIcon={<LuCircleCheck size={14} />}
                    onClick={handleSave}
                    isLoading={isSaving}
                    loadingText={t("adminDetails.saving")}
                    rounded="md">
                    {t("adminDetails.save")}
                  </Button>
                </>
              )}
            </Flex>

            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
              <DetailField
                icon={LuUser}
                label={t("adminDetails.detailFirstName")}
                value={admin?.first_name}
                isEditing={isEditing}>
                <Input
                  size="sm"
                  value={form.first_name}
                  onChange={(e) => set("first_name", e.target.value)}
                  maxLength={50}
                  rounded="sm"
                />
              </DetailField>

              <DetailField
                icon={LuUser}
                label={t("adminDetails.detailLastName")}
                value={admin?.last_name}
                isEditing={isEditing}>
                <Input
                  size="sm"
                  value={form.last_name}
                  onChange={(e) => set("last_name", e.target.value)}
                  maxLength={50}
                  rounded="sm"
                />
              </DetailField>

              <DetailField
                icon={LuPhone}
                label={t("adminDetails.detailPhone")}
                value={admin?.phone_number}
                isEditing={isEditing}>
                <InputGroup size="sm">
                  <InputLeftElement pointerEvents="none">
                    <Icon as={LuPhone} color="text-muted" boxSize={4} />
                  </InputLeftElement>
                  <Input
                    type="tel"
                    value={form.phone_number}
                    onChange={(e) =>
                      set("phone_number", e.target.value.replace(/[^\d+]/g, ""))
                    }
                    maxLength={15}
                    dir="ltr"
                    rounded="sm"
                  />
                </InputGroup>
              </DetailField>

              <DetailField
                icon={LuCalendar}
                label={t("adminDetails.detailBirthDate")}
                value={
                  admin?.birth_date
                    ? formatNumeric(new Date(admin.birth_date))
                    : "—"
                }
                isEditing={isEditing}>
                <Input
                  type="date"
                  size="sm"
                  value={form.birth_date}
                  onChange={(e) => set("birth_date", e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  rounded="sm"
                  cursor="pointer"
                  borderColor="border-color"
                  _hover={{ borderColor: "border-color" }}
                  _focus={{
                    borderColor: "syria.green.mid",
                    boxShadow: "none",
                  }}
                  _focusVisible={{
                    borderColor: "syria.green.mid",
                    boxShadow: "0 0 0 1px var(--chakra-colors-syria-green-mid)",
                  }}
                  transition="none"
                  sx={{
                    "&::-webkit-calendar-picker-indicator": {
                      cursor: "pointer",
                    },
                  }}
                />
              </DetailField>

              <Box gridColumn={{ base: "span 1", sm: "span 2" }}>
                <DetailField
                  icon={LuActivity}
                  label={t("adminDetails.detailGender")}
                  value={
                    admin?.gender === "male"
                      ? t("adminDetails.genderMale")
                      : admin?.gender === "female"
                        ? t("adminDetails.genderFemale")
                        : "—"
                  }
                />
              </Box>
            </SimpleGrid>
          </PremiumSection>
        </GridItem>

        <GridItem colSpan={{ base: 1, lg: 5 }}>
          <PremiumSection
            number={2}
            icon={LuShieldCheck}
            title={t("adminDetails.accountInfo")}
            accent={SECTION_ACCENT.account}>
            <VStack align="stretch" spacing={0}>
              <InfoRow
                icon={LuMail}
                label={t("adminDetails.detailEmail")}
                value={admin?.email}
              />
              <InfoRow
                icon={LuShield}
                label={t("adminDetails.detailRole")}
                value={t(roleStyle.labelKey)}
              />
              <InfoRow
                icon={LuPower}
                label={t("adminDetails.detailStatus")}
                value={
                  admin?.isActive
                    ? t("adminDetails.statusActive")
                    : t("adminDetails.statusInactive")
                }
              />
              <InfoRow
                icon={LuFingerprint}
                label={t("adminDetails.detailId")}
                value={admin?._id}
              />
              <InfoRow
                icon={LuClock}
                label={t("adminDetails.detailCreatedAt")}
                value={
                  admin?.createdAt
                    ? formatNumeric(new Date(admin.createdAt))
                    : "—"
                }
              />
              <InfoRow
                icon={LuClock}
                label={t("adminDetails.detailUpdatedAt")}
                value={
                  admin?.updatedAt
                    ? formatNumeric(new Date(admin.updatedAt))
                    : "—"
                }
                last
              />
            </VStack>
          </PremiumSection>
        </GridItem>

        <GridItem colSpan={{ base: 1, lg: 5 }}>
          <PremiumSection
            number={3}
            icon={LuLock}
            title={t("profile.passwordSection")}
            accent={SECTION_ACCENT.security}>
            <form onSubmit={handleChangePassword}>
              <VStack spacing={3} align="stretch">
                <PasswordField
                  icon={LuLock}
                  label={t("profile.currentPassword")}
                  value={passwordForm.current_password}
                  onChange={(e) => setPwd("current_password", e.target.value)}
                  visible={showCurrent}
                  onToggle={() => setShowCurrent((s) => !s)}
                />
                <PasswordField
                  icon={LuKeyRound}
                  label={t("profile.newPassword")}
                  value={passwordForm.new_password}
                  onChange={(e) => setPwd("new_password", e.target.value)}
                  visible={showNew}
                  onToggle={() => setShowNew((s) => !s)}
                />
                <PasswordField
                  icon={LuKeyRound}
                  label={t("profile.confirmPassword")}
                  value={passwordForm.confirm_new_password}
                  onChange={(e) =>
                    setPwd("confirm_new_password", e.target.value)
                  }
                  visible={showConfirm}
                  onToggle={() => setShowConfirm((s) => !s)}
                />

                <Button
                  type="submit"
                  size="sm"
                  colorScheme="success"
                  leftIcon={<LuLock size={14} />}
                  isLoading={isChangingPassword}
                  loadingText={t("profile.changing")}
                  isDisabled={
                    !passwordForm.current_password ||
                    !passwordForm.new_password ||
                    !passwordForm.confirm_new_password
                  }
                  rounded="md"
                  mt={2}
                  w="full">
                  {t("profile.changePassword")}
                </Button>
              </VStack>
            </form>
          </PremiumSection>
        </GridItem>

        <GridItem colSpan={{ base: 1, lg: 7 }}>
          <PremiumSection
            number={4}
            icon={LuKeyRound}
            title={t("adminDetails.permissionsInfo")}
            accent={SECTION_ACCENT.permissions}>
            {Array.isArray(admin?.permissions) && admin.permissions.length ? (
              <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
                {admin.permissions.map((p) => {
                  const style = PERMISSION_STYLE[p];
                  if (!style) {
                    return (
                      <Box
                        key={p}
                        p={3}
                        rounded="sm"
                        bg="bg-input"
                        borderWidth="1px"
                        borderColor="border-color">
                        <Text
                          fontSize="xs"
                          fontWeight="medium"
                          color="text-primary">
                          {p}
                        </Text>
                      </Box>
                    );
                  }
                  const IconComp = style.icon;
                  return (
                    <Box
                      key={p}
                      p={3}
                      rounded="sm"
                      bg={`${style.color}.50`}
                      borderWidth="1px"
                      borderColor={`${style.color}.200`}
                      _dark={{
                        bg: `${style.color}.900`,
                        borderColor: `${style.color}.700`,
                      }}>
                      <HStack spacing={2.5}>
                        <Flex
                          align="center"
                          justify="center"
                          w={8}
                          h={8}
                          rounded="sm"
                          bg={`${style.color}.500`}
                          color="white"
                          flexShrink={0}>
                          <Icon as={IconComp} boxSize={4} />
                        </Flex>
                        <Text
                          fontSize="sm"
                          fontWeight="semibold"
                          color={`${style.color}.700`}
                          _dark={{ color: `${style.color}.100` }}>
                          {tPermission(p)}
                        </Text>
                      </HStack>
                    </Box>
                  );
                })}
              </SimpleGrid>
            ) : (
              <Text fontSize="sm" color="text-muted" fontStyle="italic">
                {t("adminDetails.permissionsEmpty")}
              </Text>
            )}
          </PremiumSection>
        </GridItem>
      </SimpleGrid>
    </Box>
  );
}
