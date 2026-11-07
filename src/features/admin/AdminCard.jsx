// src/features/admin/AdminCard.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Badge,
  Box,
  Collapse,
  Divider,
  Flex,
  HStack,
  Icon,
  IconButton,
  SimpleGrid,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import {
  LuMail,
  LuPhone,
  LuCalendar,
  LuChevronDown,
  LuUser,
  LuFingerprint,
  LuClock,
  LuShield,
  LuActivity,
  LuKeyRound,
} from "react-icons/lu";
import { useTranslation } from "react-i18next";
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

const ROLE_BADGE = {
  super: { colorScheme: "purple", labelKey: "adminsList.roleSuper" },
  admin: { colorScheme: "blue", labelKey: "adminsList.roleAdmin" },
};

function InfoCell({ icon, label, value, dir }) {
  return (
    <HStack spacing={2} align="start" minW={0}>
      <Flex
        align="center"
        justify="center"
        w={6}
        h={6}
        rounded="md"
        bg="blackAlpha.50"
        _dark={{ bg: "whiteAlpha.100" }}
        flexShrink={0}
        mt={0.5}>
        <Icon as={icon} boxSize={3} color="text-muted" />
      </Flex>
      <VStack align="start" spacing={0} minW={0} flex="1">
        <Text
          fontSize="2xs"
          color="text-muted"
          textTransform="uppercase"
          letterSpacing="0.05em"
          fontWeight="semibold">
          {label}
        </Text>
        <Text
          fontSize="xs"
          color="text-primary"
          fontWeight="medium"
          noOfLines={2}
          dir={dir}
          wordBreak="break-word">
          {value}
        </Text>
      </VStack>
    </HStack>
  );
}

export default function AdminCard({ admin }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const roleBadge = ROLE_BADGE[admin?.role] || ROLE_BADGE.admin;
  const isSuper = admin?.role === "super";
  const fullName =
    `${admin?.first_name ?? ""} ${admin?.last_name ?? ""}`.trim() ||
    admin?.email ||
    "—";

  const genderLabel =
    admin?.gender === "male"
      ? t("adminsList.genderMale")
      : admin?.gender === "female"
        ? t("adminsList.genderFemale")
        : "—";

  const permissionsText =
    Array.isArray(admin?.permissions) && admin.permissions.length
      ? admin.permissions.join(" · ")
      : t("adminsList.noPermissions");

  const avatarUrl = buildAdminAvatarUrl(admin?.avatar);

  const handleToggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleGoToProfile = () => {
    if (admin?._id) navigate(`/admin/details/${admin._id}`);
  };

  return (
    <Box
      bg="bg-card"
      borderWidth="1px"
      borderColor={isExpanded ? "syria.green.light" : "border-color"}
      rounded="xl"
      w="full"
      shadow={isExpanded ? "sm" : "none"}
      overflow="hidden"
      sx={{
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
        willChange: "box-shadow, border-color",
      }}>
      <Flex
        align="center"
        gap={{ base: 2, md: 3 }}
        px={{ base: 3, md: 4 }}
        py={2.5}>
        {/* ─── Avatar + Name: clickable → profile page ─── */}
        <HStack
          spacing={{ base: 2, md: 3 }}
          align="center"
          flex="1"
          minW={0}
          role="link"
          aria-label={t("adminsList.actionsView")}>
          <Box position="relative" flexShrink={0}>
            <Avatar
              size="sm"
              name={fullName}
              onClick={handleGoToProfile}
              cursor="pointer"
              src={avatarUrl}
              bg={isSuper ? "purple.500" : "syria.green.mid"}
              color="white"
              sx={{
                transition: "transform 0.2s ease",
                _hover: { transform: "scale(1.05)" },
              }}
            />
            <Box
              position="absolute"
              bottom="-1px"
              insetInlineEnd="-1px"
              w={2.5}
              h={2.5}
              rounded="full"
              bg={admin?.isActive ? "green.500" : "red.500"}
              borderWidth="2px"
              borderColor="bg-card"
              title={
                admin?.isActive
                  ? t("adminsList.statusActive")
                  : t("adminsList.statusInactive")
              }
            />
          </Box>

          <VStack align="start" spacing={0} minW={0} flex="1">
            <Text
              onClick={handleGoToProfile}
              cursor="pointer"
              fontWeight="semibold"
              fontSize="sm"
              color="text-primary"
              noOfLines={1}>
              {fullName}
            </Text>
            <HStack spacing={1} minW={0}>
              <Icon as={LuMail} boxSize={3} color="text-muted" flexShrink={0} />
              <Text fontSize="xs" color="text-muted" noOfLines={1}>
                {admin?.email || "—"}
              </Text>
            </HStack>
          </VStack>
        </HStack>

        <HStack
          spacing={1.5}
          display={{ base: "none", lg: "flex" }}
          fontSize="xs"
          color="text-secondary"
          minW="140px">
          <Icon as={LuPhone} boxSize={3.5} color="text-muted" />
          <Text noOfLines={1} dir="ltr">
            {admin?.phone_number || "—"}
          </Text>
        </HStack>

        <Divider
          orientation="vertical"
          h="6"
          borderColor="border-color"
          display={{ base: "none", lg: "block" }}
        />

        <HStack
          spacing={1.5}
          display={{ base: "none", xl: "flex" }}
          fontSize="xs"
          color="text-secondary"
          minW="140px">
          <Icon as={LuCalendar} boxSize={3.5} color="text-muted" />
          <Text noOfLines={1} dir="ltr">
            {admin?.birth_date
              ? formatNumeric(new Date(admin.birth_date))
              : "—"}
          </Text>
        </HStack>

        <Divider
          orientation="vertical"
          h="6"
          borderColor="border-color"
          display={{ base: "none", xl: "block" }}
        />

        <Badge
          colorScheme={roleBadge.colorScheme}
          variant="subtle"
          fontSize="2xs"
          rounded="md"
          px={2}
          py={0.5}
          textTransform="none"
          display={{ base: "none", md: "inline-flex" }}
          flexShrink={0}>
          {t(roleBadge.labelKey)}
        </Badge>

        <Badge
          colorScheme={admin?.isActive ? "green" : "red"}
          variant="subtle"
          fontSize="2xs"
          rounded="md"
          px={2}
          py={0.5}
          textTransform="none"
          flexShrink={0}
          display={{ base: "none", sm: "inline-flex" }}>
          {admin?.isActive
            ? t("adminsList.statusActive")
            : t("adminsList.statusInactive")}
        </Badge>

        {/* ─── Only this button toggles expand/collapse ─── */}
        <Tooltip
          label={
            isExpanded ? t("adminsList.collapseRow") : t("adminsList.expandRow")
          }
          placement="top">
          <IconButton
            size="xs"
            variant="ghost"
            icon={<LuChevronDown size={16} />}
            aria-label={
              isExpanded
                ? t("adminsList.collapseRow")
                : t("adminsList.expandRow")
            }
            aria-expanded={isExpanded}
            onClick={handleToggleExpand}
            flexShrink={0}
            color="text-muted"
            transform={isExpanded ? "rotate(180deg)" : "rotate(0deg)"}
            sx={{
              transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </Tooltip>
      </Flex>

      <Collapse
        in={isExpanded}
        animateOpacity
        unmountOnExit
        transition={{
          enter: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
          exit: { duration: 0.25, ease: [0.4, 0, 1, 1] },
        }}>
        <Divider borderColor="border-color" />
        <Box px={{ base: 3, md: 4 }} py={3}>
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={3}>
            <InfoCell
              icon={LuUser}
              label={t("adminsList.detailFirstName")}
              value={admin?.first_name || "—"}
            />
            <InfoCell
              icon={LuUser}
              label={t("adminsList.detailLastName")}
              value={admin?.last_name || "—"}
            />
            <InfoCell
              icon={LuActivity}
              label={t("adminsList.detailGender")}
              value={genderLabel}
            />
            <InfoCell
              icon={LuMail}
              label={t("adminsList.detailEmail")}
              value={admin?.email || "—"}
              dir="ltr"
            />
            <InfoCell
              icon={LuPhone}
              label={t("adminsList.detailPhone")}
              value={admin?.phone_number || "—"}
              dir="ltr"
            />
            <InfoCell
              icon={LuCalendar}
              label={t("adminsList.detailBirthDate")}
              value={
                admin?.birth_date
                  ? formatNumeric(new Date(admin.birth_date))
                  : "—"
              }
              dir="ltr"
            />
            <InfoCell
              icon={LuShield}
              label={t("adminsList.detailRole")}
              value={t(roleBadge.labelKey)}
            />
            <InfoCell
              icon={LuActivity}
              label={t("adminsList.detailStatus")}
              value={
                admin?.isActive
                  ? t("adminsList.statusActive")
                  : t("adminsList.statusInactive")
              }
            />
            <InfoCell
              icon={LuKeyRound}
              label={t("adminsList.detailPermissions")}
              value={permissionsText}
            />
            <InfoCell
              icon={LuFingerprint}
              label={t("adminsList.detailId")}
              value={admin?._id || "—"}
              dir="ltr"
            />
            <InfoCell
              icon={LuClock}
              label={t("adminsList.detailCreatedAt")}
              value={
                admin?.createdAt
                  ? formatNumeric(new Date(admin.createdAt))
                  : "—"
              }
              dir="ltr"
            />
            <InfoCell
              icon={LuClock}
              label={t("adminsList.detailUpdatedAt")}
              value={
                admin?.updatedAt
                  ? formatNumeric(new Date(admin.updatedAt))
                  : "—"
              }
              dir="ltr"
            />
          </SimpleGrid>
        </Box>
      </Collapse>
    </Box>
  );
}
