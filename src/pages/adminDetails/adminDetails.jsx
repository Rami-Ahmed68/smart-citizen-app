// src/pages/admin/AdminDetailsPage.jsx
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Radio,
  RadioGroup,
  SimpleGrid,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Spinner,
  Switch,
  Text,
  Tooltip,
  useDisclosure,
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
  LuTrash2,
  LuTriangleAlert,
  LuCircleCheck,
  LuX,
  LuShieldCheck,
  LuCalendarDays,
  LuRefreshCw,
  LuEye,
  LuPlus,
} from "react-icons/lu";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../auth/AuthContext";
import { adminsAPI } from "../../api/admins.api";
import { useAppToast } from "../../components/common/AppToast";
import { formatNumeric } from "../../utils/date";
import DeleteAdminDialog from "../../components/common/DeleteAdminDialog";

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

function StatCard({ icon, label, value, color = "syria.green.mid" }) {
  return (
    <Box
      bg="bg-card"
      borderWidth="1px"
      borderColor="border-color"
      rounded="md"
      p={4}>
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

function SectionHeader({ icon, title }) {
  return (
    <HStack spacing={2.5} mb={4}>
      <Flex
        align="center"
        justify="center"
        w={8}
        h={8}
        rounded="sm"
        bg="syria.green.mid"
        color="white"
        flexShrink={0}>
        <Icon as={icon} boxSize={4} />
      </Flex>
      <Heading size="xs" color="text-primary" fontWeight="bold">
        {title}
      </Heading>
    </HStack>
  );
}

function Card({ children }) {
  return (
    <Box
      bg="bg-card"
      borderWidth="1px"
      borderColor="border-color"
      rounded="md"
      p={{ base: 4, md: 5 }}
      shadow="sm">
      {children}
    </Box>
  );
}

function ContactBadge({
  href,
  colorScheme,
  icon,
  children,
  target,
  rounded = "sm",
}) {
  return (
    <Badge
      as="a"
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      colorScheme={colorScheme}
      variant="subtle"
      fontSize="xs"
      rounded={rounded}
      px={2.5}
      py={1}
      textTransform="none"
      fontWeight="medium"
      cursor="pointer"
      display="inline-flex"
      alignItems="center"
      gap={1.5}
      transition="opacity 0.15s ease"
      _hover={{ opacity: 0.8 }}>
      <Icon as={icon} boxSize={3} />
      {children}
    </Badge>
  );
}

export default function AdminDetailsPage() {
  const { target_id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { admin: currentAdmin } = useAuth();
  const appToast = useAppToast();

  const isRTL = i18n.language === "ar";
  const isSelf = currentAdmin?._id === target_id;
  const isSuperSelf = currentAdmin?.role === "super" && isSelf;

  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    birth_date: "",
    gender: "male",
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const appToastRef = useRef(appToast);
  appToastRef.current = appToast;
  const tRef = useRef(t);
  tRef.current = t;
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;

  useEffect(() => {
    if (isSuperSelf) return;

    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await adminsAPI.getById(target_id);
        if (cancelled) return;
        setAdmin(data);
        setForm({
          first_name: data?.first_name ?? "",
          last_name: data?.last_name ?? "",
          phone_number: data?.phone_number ?? "",
          birth_date: toInputDate(data?.birth_date),
          gender: data?.gender ?? "male",
        });
      } catch (err) {
        if (cancelled) return;
        appToastRef.current.error(err, tRef.current("adminDetails.loadError"));
        navigateRef.current("/admins", { replace: true });
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [target_id, isSuperSelf]);

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

  const avatarUrl = buildAdminAvatarUrl(admin?.avatar);

  const set = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {};

      const trimmedFirst = form.first_name.trim();
      const trimmedLast = form.last_name.trim();
      const trimmedPhone = form.phone_number.trim();

      if (trimmedFirst && trimmedFirst !== (admin.first_name ?? "")) {
        payload.first_name = trimmedFirst;
      }
      if (trimmedLast && trimmedLast !== (admin.last_name ?? "")) {
        payload.last_name = trimmedLast;
      }
      if (trimmedPhone && trimmedPhone !== (admin.phone_number ?? "")) {
        payload.phone_number = trimmedPhone;
      }
      if (
        form.birth_date &&
        form.birth_date !== toInputDate(admin.birth_date)
      ) {
        payload.birth_date = form.birth_date;
      }
      if (form.gender && form.gender !== (admin.gender ?? "")) {
        payload.gender = form.gender;
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

      await adminsAPI.update(target_id, payload);
      const updated = await adminsAPI.getById(target_id);
      setAdmin(updated);
      setForm({
        first_name: updated?.first_name ?? "",
        last_name: updated?.last_name ?? "",
        phone_number: updated?.phone_number ?? "",
        birth_date: toInputDate(updated?.birth_date),
        gender: updated?.gender ?? "male",
      });
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
      gender: admin?.gender ?? "male",
    });
    setIsEditing(false);
  };

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      await adminsAPI.toggleStatus(target_id);
      const updated = await adminsAPI.getById(target_id);
      setAdmin(updated);
      appToast.success(t("adminDetails.toggleSuccess"));
    } catch (err) {
      appToast.error(err, t("adminDetails.toggleError"));
    } finally {
      setIsToggling(false);
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await adminsAPI.remove(target_id);
      appToast.success(t("adminDetails.deleteSuccess"));
      onClose();
      navigate("/admins", { replace: true });
    } catch (err) {
      appToast.error(err, t("adminDetails.deleteError"));
    } finally {
      setIsDeleting(false);
    }
  };

  if (isSuperSelf) {
    return <Navigate to={`/profile/${currentAdmin._id}`} replace />;
  }

  if (isLoading) {
    return (
      <Box w="full" py={1} dir={isRTL ? "rtl" : "ltr"}>
        <VStack
          align="start"
          spacing={2}
          mb={5}
          pb={4}
          borderBottomWidth="1px"
          borderColor="border-color">
          <Skeleton height="28px" width="180px" rounded="sm" />
          <Skeleton height="12px" width="260px" rounded="sm" />
        </VStack>
        <Box
          bg="bg-card"
          borderWidth="1px"
          borderColor="border-color"
          rounded="md"
          overflow="hidden"
          mb={4}>
          <Box h="96px" bg="bg-input" />
          <Box px={{ base: 4, md: 6 }} pb={5} mt="-40px">
            <HStack align="flex-end" spacing={4}>
              <SkeletonCircle
                size="20"
                borderWidth="4px"
                borderColor="bg-card"
                boxSizing="content-box"
              />
              <VStack align="start" spacing={2} pb={2} flex="1">
                <Skeleton height="20px" width="180px" rounded="sm" />
                <Skeleton height="12px" width="120px" rounded="sm" />
              </VStack>
            </HStack>
          </Box>
        </Box>
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={3} mb={4}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Box
              key={i}
              bg="bg-card"
              borderWidth="1px"
              borderColor="border-color"
              rounded="md"
              p={4}>
              <SkeletonText noOfLines={2} spacing={2} />
            </Box>
          ))}
        </SimpleGrid>
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
          {Array.from({ length: 2 }).map((_, i) => (
            <Box
              key={i}
              bg="bg-card"
              borderWidth="1px"
              borderColor="border-color"
              rounded="md"
              p={5}>
              <SkeletonText noOfLines={5} spacing={3} />
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    );
  }

  if (!admin) return null;

  return (
    <Box w="full" py={1} dir={isRTL ? "rtl" : "ltr"}>
      <Box mb={5} pb={2} borderBottomWidth="2px" borderColor="border-color">
        <Heading size="lg" color="text-primary" fontWeight="bold">
          {t("adminDetails.breadcrumbDetails")}
        </Heading>
      </Box>

      <Box
        bg="bg-card"
        borderWidth="1px"
        borderColor="border-color"
        rounded="md"
        overflow="hidden"
        shadow="sm"
        mb={4}
        position="relative">
        <Box
          h="96px"
          bgGradient="linear(to-br, syria.green.mid, syria.green.light)"
          position="relative"
          overflow="hidden"
          zIndex={0}>
          <Box
            position="absolute"
            top="-50px"
            insetInlineEnd="-20px"
            w="180px"
            h="180px"
            borderRadius="full"
            bg="whiteAlpha.100"
          />
          <Box
            position="absolute"
            bottom="-80px"
            insetInlineStart="40%"
            w="160px"
            h="160px"
            borderRadius="full"
            bg="whiteAlpha.100"
          />
        </Box>

        <Box
          px={{ base: 4, md: 6 }}
          pb={5}
          mt="-40px"
          position="relative"
          zIndex={2}>
          <Flex
            direction={{ base: "column", md: "row" }}
            align={{ base: "start", md: "flex-end" }}
            gap={4}
            justify="space-between">
            <HStack align="flex-end" spacing={4} flex="1" minW={0}>
              <Avatar
                size="xl"
                name={fullName}
                src={avatarUrl}
                bg={
                  admin?.role === "super"
                    ? "syria.umber.mid"
                    : "syria.green.mid"
                }
                color="white"
                borderWidth="4px"
                borderColor="bg-card"
                flexShrink={0}
                position="relative"
                zIndex={3}
              />
              <VStack align="start" spacing={1.5} pb={2} minW={0} flex="1">
                <HStack
                  spacing={2}
                  wrap="wrap"
                  backdropFilter="blur(20px)"
                  p={2}
                  borderRadius="md">
                  <Heading
                    size="md"
                    color="text-primary"
                    fontWeight="bold"
                    noOfLines={1}>
                    {fullName}
                  </Heading>
                  <Badge
                    bg={roleStyle.bg}
                    color="white"
                    fontSize="2xs"
                    rounded="sm"
                    px={2}
                    py={0.5}
                    fontWeight="semibold"
                    textTransform="none">
                    {t(roleStyle.labelKey)}
                  </Badge>
                  <Badge
                    colorScheme={admin?.isActive ? "success" : "error"}
                    variant="subtle"
                    fontSize="2xs"
                    rounded="sm"
                    px={2}
                    py={0.5}
                    textTransform="none">
                    {admin?.isActive
                      ? t("adminDetails.statusActive")
                      : t("adminDetails.statusInactive")}
                  </Badge>
                </HStack>

                <HStack spacing={2} wrap="wrap" pt={0.5}>
                  {admin?.email && (
                    <ContactBadge
                      href={toGmailCompose(admin.email)}
                      target="_blank"
                      colorScheme="info"
                      rounded="md"
                      icon={LuMail}>
                      <Text>{admin.email}</Text>
                    </ContactBadge>
                  )}
                  {admin?.phone_number && (
                    <ContactBadge
                      href={`https://wa.me/${toWhatsAppNumber(admin.phone_number)}`}
                      target="_blank"
                      rounded="md"
                      colorScheme="success"
                      icon={LuPhone}>
                      <Text dir="ltr">{admin.phone_number}</Text>
                    </ContactBadge>
                  )}
                </HStack>
              </VStack>
            </HStack>

            <HStack spacing={2} pb={{ base: 0, md: 2 }}>
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
            </HStack>
          </Flex>
        </Box>
      </Box>

      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={3} mb={4}>
        <StatCard
          icon={LuShield}
          label={t("adminDetails.statRole")}
          value={t(roleStyle.labelKey)}
          color={
            admin?.role === "super" ? "syria.umber.mid" : "syria.green.mid"
          }
        />
        <StatCard
          icon={admin?.isActive ? LuCircleCheck : LuPower}
          label={t("adminDetails.statStatus")}
          value={
            admin?.isActive
              ? t("adminDetails.statusActive")
              : t("adminDetails.statusInactive")
          }
          color={admin?.isActive ? "success.500" : "error.500"}
        />
        <StatCard
          icon={LuCalendarDays}
          label={t("adminDetails.statMemberSince")}
          value={
            admin?.createdAt ? formatNumeric(new Date(admin.createdAt)) : "—"
          }
          color="syria.wheat.dark"
        />
        <StatCard
          icon={LuRefreshCw}
          label={t("adminDetails.statLastUpdate")}
          value={
            admin?.updatedAt ? formatNumeric(new Date(admin.updatedAt)) : "—"
          }
          color="syria.green.light"
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4} mb={4}>
        <Card>
          <SectionHeader icon={LuUser} title={t("adminDetails.personalInfo")} />
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
                _focus={{ borderColor: "syria.green.mid", boxShadow: "none" }}
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
                isEditing={isEditing}>
                <RadioGroup
                  value={form.gender}
                  onChange={(v) => set("gender", v)}>
                  <HStack spacing={4}>
                    <Radio value="male" colorScheme="success" size="sm">
                      {t("adminDetails.genderMale")}
                    </Radio>
                    <Radio value="female" colorScheme="success" size="sm">
                      {t("adminDetails.genderFemale")}
                    </Radio>
                  </HStack>
                </RadioGroup>
              </DetailField>
            </Box>
          </SimpleGrid>
        </Card>

        <Card>
          <SectionHeader
            icon={LuShieldCheck}
            title={t("adminDetails.accountInfo")}
          />
          <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
            <Box gridColumn={{ base: "span 1", sm: "span 2" }}>
              <DetailField
                icon={LuMail}
                label={t("adminDetails.detailEmail")}
                value={admin?.email}
              />
            </Box>
            <DetailField
              icon={LuShield}
              label={t("adminDetails.detailRole")}
              value={t(roleStyle.labelKey)}
            />
            <DetailField
              icon={LuPower}
              label={t("adminDetails.detailStatus")}
              value={
                admin?.isActive
                  ? t("adminDetails.statusActive")
                  : t("adminDetails.statusInactive")
              }
            />
            <Box gridColumn={{ base: "span 1", sm: "span 2" }}>
              <DetailField
                icon={LuFingerprint}
                label={t("adminDetails.detailId")}
                value={admin?._id}
              />
            </Box>
            <DetailField
              icon={LuClock}
              label={t("adminDetails.detailCreatedAt")}
              value={
                admin?.createdAt
                  ? formatNumeric(new Date(admin.createdAt))
                  : "—"
              }
            />
            <DetailField
              icon={LuClock}
              label={t("adminDetails.detailUpdatedAt")}
              value={
                admin?.updatedAt
                  ? formatNumeric(new Date(admin.updatedAt))
                  : "—"
              }
            />
          </SimpleGrid>
        </Card>
      </SimpleGrid>

      <Box mb={4}>
        <Card>
          <Flex
            justify="space-between"
            align="center"
            mb={4}
            wrap="wrap"
            gap={2}>
            <HStack spacing={2.5}>
              <Flex
                align="center"
                justify="center"
                w={8}
                h={8}
                rounded="sm"
                bg="syria.green.mid"
                color="white"
                flexShrink={0}>
                <Icon as={LuKeyRound} boxSize={4} />
              </Flex>
              <Heading size="xs" color="text-primary" fontWeight="bold">
                {t("adminDetails.permissionsInfo")}
              </Heading>
            </HStack>
            {Array.isArray(admin?.permissions) &&
              admin.permissions.length > 0 && (
                <Badge
                  colorScheme="success"
                  variant="subtle"
                  fontSize="2xs"
                  rounded="sm"
                  px={2}
                  py={0.5}
                  textTransform="none">
                  {admin.permissions.length}{" "}
                  {t("adminDetails.permissionsCount")}
                </Badge>
              )}
          </Flex>

          {Array.isArray(admin?.permissions) && admin.permissions.length ? (
            <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={3}>
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
        </Card>
      </Box>

      <Box mb={4}>
        <Card>
          <SectionHeader
            icon={LuPower}
            title={t("adminDetails.actionsTitle")}
          />
          <HStack spacing={3}>
            <Switch
              colorScheme="success"
              size="md"
              isChecked={admin?.isActive}
              onChange={handleToggle}
              isDisabled={isToggling || isSelf}
            />
            <VStack align="start" spacing={0} flex="1">
              <Text fontSize="sm" fontWeight="semibold" color="text-primary">
                {admin?.isActive
                  ? t("adminDetails.statusActive")
                  : t("adminDetails.statusInactive")}
              </Text>
              <Text fontSize="xs" color="text-muted">
                {isSelf
                  ? t("adminDetails.cannotToggleSelf")
                  : t("adminDetails.toggleHint")}
              </Text>
            </VStack>
            {isToggling && <Spinner size="sm" color="syria.green.mid" />}
          </HStack>
        </Card>
      </Box>

      <Box
        rounded="md"
        borderWidth="1px"
        borderColor="error.800"
        bg="bg-card"
        p={{ base: 4, md: 5 }}>
        <HStack spacing={2.5} mb={1}>
          <Flex
            align="center"
            justify="center"
            w={8}
            h={8}
            rounded="sm"
            bg="error.500"
            color="white"
            flexShrink={0}>
            <Icon as={LuTriangleAlert} boxSize={4} />
          </Flex>
          <Heading
            size="xs"
            color="error.600"
            _dark={{ color: "error.300" }}
            fontWeight="bold">
            {t("adminDetails.dangerZone")}
          </Heading>
        </HStack>
        <Text fontSize="xs" color="text-muted" mb={4} mt={1}>
          {t("adminDetails.dangerZoneHint")}
        </Text>
        <Flex justify="flex-end">
          <Tooltip
            label={isSelf ? t("adminDetails.cannotDeleteSelf") : ""}
            isDisabled={!isSelf}
            hasArrow>
            <Button
              size="sm"
              variant="solid"
              bg="error.500"
              color="white"
              leftIcon={<LuTrash2 size={14} />}
              onClick={onOpen}
              isDisabled={isSelf}
              rounded="md"
              _hover={{ bg: "error.400" }}
              _active={{ bg: "error.600" }}>
              {t("adminDetails.delete")}
            </Button>
          </Tooltip>
        </Flex>
      </Box>

      <DeleteAdminDialog
        isOpen={isOpen}
        onClose={onClose}
        admin={admin}
        fullName={fullName}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        isRTL={isRTL}
      />
    </Box>
  );
}
