// src/pages/auth/LogoutPage.jsx
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Badge,
  Box,
  Button,
  Checkbox,
  CloseButton,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import {
  LuLogOut,
  LuTriangleAlert,
  LuShieldCheck,
  LuClock,
  LuMonitor,
  LuArrowLeft,
  LuUser,
  LuShield,
  LuFingerprint,
  LuKeyRound,
} from "react-icons/lu";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../auth/AuthContext";
import { authAPI } from "../../api/auth";
import { useAppToast } from "../../components/common/AppToast";
import { formatDateTimeNumeric } from "../../utils/date";

const labels = {
  ar: {
    pageTitle: "تسجيل الخروج",
    pageSubtitle: "إنهاء الجلسة الحالية بأمان",
    youAre: "أنت",
    roleSuper: "مسؤول أعلى",
    roleAdmin: "مسؤول",
    roleUser: "مستخدم",
    sectionSession: "معلومات الجلسة",
    sectionWarning: "تنبيه أمني",
    userLabel: "المستخدم الحالي",
    roleLabel: "الدور",
    deviceLabel: "الجهاز",
    deviceValue: "المتصفح الحالي",
    timeLabel: "الوقت الحالي",
    securityLabel: "حالة الأمان",
    securityValue: "نشطة · مشفّرة",
    sessionLabel: "رقم الجلسة",
    warningText:
      "سيتم إنهاء جلستك على هذا المتصفح. أي بيانات غير محفوظة ستفقد. ستحتاج إلى تسجيل الدخول مرة أخرى للوصول إلى لوحة التحكم.",
    save: "تسجيل الخروج",
    cancel: "البقاء في الصفحة",
    dialogTitle: "تأكيد تسجيل الخروج",
    dialogBody:
      "سيتم إنهاء جلستك على هذا الجهاز نهائيًا. ستحتاج إلى تسجيل الدخول مرة أخرى للمتابعة.",
    dialogConfirm: "نعم، سجّل الخروج",
    dialogCancel: "إلغاء",
    checkboxLabel:
      "أفهم أن جلستي الحالية ستنتهي، وأن أي بيانات غير محفوظة ستفقد.",
    signingOut: "جارٍ تسجيل الخروج...",
    successToast: "تم تسجيل الخروج بنجاح",
    errorToast: "تعذر تسجيل الخروج، تم إنهاء الجلسة محليًا",
    close: "إغلاق",
  },
  en: {
    pageTitle: "Sign Out",
    pageSubtitle: "End your current session securely",
    youAre: "You are",
    roleSuper: "Super Admin",
    roleAdmin: "Admin",
    roleUser: "User",
    sectionSession: "Session Information",
    sectionWarning: "Security Notice",
    userLabel: "Current User",
    roleLabel: "Role",
    deviceLabel: "Device",
    deviceValue: "Current Browser",
    timeLabel: "Current Time",
    securityLabel: "Security Status",
    securityValue: "Active · Encrypted",
    sessionLabel: "Session ID",
    warningText:
      "Your session on this browser will be ended. Any unsaved data will be lost. You will need to sign in again to access the dashboard.",
    save: "Sign Out",
    cancel: "Stay on Page",
    dialogTitle: "Confirm Sign Out",
    dialogBody:
      "Your session on this device will be ended permanently. You will need to sign in again to continue.",
    dialogConfirm: "Yes, sign out",
    dialogCancel: "Cancel",
    checkboxLabel:
      "I understand that my current session will end and any unsaved data will be lost.",
    signingOut: "Signing out...",
    successToast: "Signed out successfully",
    errorToast: "Sign out failed, session cleared locally",
    close: "Close",
  },
};

const ROLE_LABEL = {
  super: "roleSuper",
  admin: "roleAdmin",
};

const RED_BTN_SX = {
  bg: "error.500",
  color: "white",
  transition: "all 0.15s",
  _hover: {
    bg: "error.600",
    transform: "translateY(-1px)",
    shadow: "md",
  },
  _active: {
    bg: "error.700",
    transform: "translateY(0)",
  },
  _disabled: {
    opacity: 0.45,
    cursor: "not-allowed",
    transform: "none",
    shadow: "none",
    _hover: {
      bg: "error.500",
      transform: "none",
      shadow: "none",
    },
  },
  _dark: {
    bg: "error.500",
    _hover: {
      bg: "error.500",
    },
    _active: {
      bg: "error.600",
    },
    _disabled: {
      bg: "error.500",
      _hover: {
        bg: "error.500",
      },
    },
  },
};

const RED_ICON_BOX_SX = {
  bg: "error.500",
  color: "white",
  _dark: { bg: "error.500" },
};

function Card({ children, p }) {
  return (
    <Box
      bg="bg-card"
      borderWidth="1px"
      borderColor="border-color"
      rounded="xl"
      p={p || { base: 4, md: 5 }}
      h="100%"
      shadow="sm"
      transition="background 0.2s, border-color 0.2s">
      {children}
    </Box>
  );
}

function SectionHeader({
  icon,
  title,
  subtitle,
  iconBg,
  iconDarkBg,
  iconColor,
  iconDarkColor,
}) {
  return (
    <HStack spacing={2.5} mb={4}>
      <Flex
        align="center"
        justify="center"
        w={8}
        h={8}
        rounded="md"
        bg={iconBg || "syria.green.light"}
        color={iconColor || "white"}
        flexShrink={0}
        _dark={{
          bg: iconDarkBg || iconBg || "syria.green.light",
          color: iconDarkColor || iconColor || "white",
        }}>
        <Icon as={icon} boxSize={4} />
      </Flex>
      <VStack align="start" spacing={0}>
        <Heading size="xs" color="text-primary">
          {title}
        </Heading>
        {subtitle && (
          <Text fontSize="2xs" color="text-muted">
            {subtitle}
          </Text>
        )}
      </VStack>
    </HStack>
  );
}

function InfoField({
  icon,
  label,
  value,
  badge,
  iconColor = "text-muted",
  iconDarkColor,
}) {
  return (
    <FormControl>
      <FormLabel
        fontSize="xs"
        fontWeight="semibold"
        color="text-secondary"
        mb={1}>
        <HStack spacing={1.5}>
          <Icon
            as={icon}
            boxSize={4}
            color={iconColor}
            sx={iconDarkColor ? { _dark: { color: iconDarkColor } } : undefined}
          />
          <Text>{label}</Text>
        </HStack>
      </FormLabel>
      {badge || (
        <Text
          fontSize="sm"
          fontWeight="medium"
          color="text-primary"
          noOfLines={1}>
          {value}
        </Text>
      )}
    </FormControl>
  );
}

export default function LogoutPage() {
  const { i18n } = useTranslation();
  const { admin, logout } = useAuth();
  const appToast = useAppToast();
  const navigate = useNavigate();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasConfirmed, setHasConfirmed] = useState(false);

  const lang = i18n.language === "ar" ? "ar" : "en";
  const isRTL = lang === "ar";
  const L = labels[lang];

  const fullName = admin
    ? `${admin.first_name ?? ""} ${admin.last_name ?? ""}`.trim() ||
      admin.email ||
      "—"
    : "—";

  const roleKey = ROLE_LABEL[admin?.role] || "roleUser";
  const roleLabel = L[roleKey];
  const isSuper = admin?.role === "super";
  const currentRoleColor = isSuper ? "purple" : "blue";

  // ✅ تحديد موضع زر الإغلاق حسب اتجاه اللغة
  const closePosition = isRTL ? { left: 3 } : { right: 3 };

  const handleClose = () => {
    if (isSubmitting) return;
    setHasConfirmed(false);
    onClose();
  };

  const handleOpen = () => {
    setHasConfirmed(false);
    onOpen();
  };

  const handleConfirm = async () => {
    if (isSubmitting || !hasConfirmed) return;
    setIsSubmitting(true);

    try {
      await authAPI.logout();
      appToast.success(L.successToast);
    } catch {
      appToast.error(L.errorToast);
    } finally {
      onClose();
      try {
        logout();
      } catch {
        // حتى لو فشل، نكمل التوجيه
      }
      navigate("/login", { replace: true });
    }
  };

  return (
    <Box w="full" py={1} dir={isRTL ? "rtl" : "ltr"}>
      {/* ─── Page header ─── */}
      <Flex
        align={{ base: "start", md: "center" }}
        direction={{ base: "column", md: "row" }}
        gap={3}
        mb={5}
        pb={4}
        borderBottomWidth="1px"
        borderColor="border-color">
        <Flex
          align="center"
          justify="center"
          p={2}
          rounded="md"
          flexShrink={0}
          sx={RED_ICON_BOX_SX}>
          <Icon as={LuLogOut} boxSize={5} />
        </Flex>
        <VStack align="start" spacing={0.5} flex="1">
          <HStack spacing={2} wrap="wrap">
            <Heading size="md" color="text-primary">
              {L.pageTitle}
            </Heading>
            <Badge
              colorScheme={currentRoleColor}
              variant="solid"
              fontSize="2xs"
              rounded="md"
              px={2}
              py={0.5}
              fontWeight="semibold"
              textTransform="none">
              {L.youAre}: {roleLabel}
            </Badge>
          </HStack>
          <Text fontSize="xs" color="text-muted">
            {L.pageSubtitle}
          </Text>
        </VStack>
      </Flex>

      <VStack align="stretch" spacing={4}>
        {/* ═══ 1. Session Info ═══ */}
        <Card>
          <SectionHeader
            icon={LuKeyRound}
            title={L.sectionSession}
            subtitle={L.deviceValue}
            iconBg="syria.green.light"
            iconDarkBg="syria.green.light"
          />

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <InfoField
              icon={LuUser}
              label={L.userLabel}
              value={fullName}
              iconColor="syria.green.mid"
              iconDarkColor="syria.green.light"
            />
            <InfoField
              icon={LuShield}
              label={L.roleLabel}
              iconColor={isSuper ? "purple.500" : "blue.500"}
              iconDarkColor={isSuper ? "purple.300" : "blue.300"}
              badge={
                <Badge
                  colorScheme={currentRoleColor}
                  variant="subtle"
                  fontSize="xs"
                  rounded="md"
                  px={2}
                  py={0.5}
                  textTransform="none">
                  {roleLabel}
                </Badge>
              }
            />
            <InfoField
              icon={LuMonitor}
              label={L.deviceLabel}
              value={L.deviceValue}
              iconColor="blue.500"
              iconDarkColor="blue.300"
            />
            <InfoField
              icon={LuClock}
              label={L.timeLabel}
              value={formatDateTimeNumeric()}
              iconColor="orange.500"
              iconDarkColor="orange.300"
            />
            <InfoField
              icon={LuShieldCheck}
              label={L.securityLabel}
              iconColor="green.500"
              iconDarkColor="green.300"
              badge={
                <Badge
                  colorScheme="green"
                  variant="subtle"
                  fontSize="xs"
                  rounded="md"
                  px={2}
                  py={0.5}
                  textTransform="none">
                  {L.securityValue}
                </Badge>
              }
            />
            <InfoField
              icon={LuFingerprint}
              label={L.sessionLabel}
              value={admin?._id ? `#${String(admin._id).slice(-6)}` : "—"}
              iconColor="syria.wheat.dark"
              iconDarkColor="syria.wheat.mid"
            />
          </SimpleGrid>
        </Card>

        {/* ═══ 2. Warning ═══ */}
        <Card>
          <SectionHeader
            icon={LuTriangleAlert}
            title={L.sectionWarning}
            iconBg="orange.100"
            iconDarkBg="orange.900"
            iconColor="orange.600"
            iconDarkColor="orange.200"
          />
          <Text fontSize="sm" color="text-secondary" lineHeight="tall">
            {L.warningText}
          </Text>
        </Card>

        {/* ═══ 3. Actions ═══ */}
        <Flex
          justify="flex-end"
          gap={2}
          pt={3}
          borderTopWidth="1px"
          borderColor="border-color"
          direction={{ base: "column-reverse", sm: "row" }}>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            leftIcon={<LuArrowLeft size={14} />}
            onClick={() => navigate(-1)}
            isDisabled={isSubmitting}
            minW={{ base: "full", sm: "auto" }}
            color="text-primary"
            _hover={{
              bg: "blackAlpha.100",
              _dark: { bg: "whiteAlpha.100" },
            }}>
            {L.cancel}
          </Button>
          <Button
            type="button"
            size="sm"
            rightIcon={<LuLogOut size={14} />}
            onClick={handleOpen}
            minW={{ base: "full", sm: "auto" }}
            sx={RED_BTN_SX}>
            {L.save}
          </Button>
        </Flex>
      </VStack>

      {/* ═══ Confirm Dialog ═══ */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={handleClose}
        isCentered
        motionPreset="slideInBottom">
        <AlertDialogOverlay bg="blackAlpha.600" backdropFilter="blur(4px)">
          <AlertDialogContent
            bg="bg-card"
            borderWidth="1px"
            borderColor="border-color"
            rounded="xl"
            mx={4}
            overflow="hidden"
            dir={isRTL ? "rtl" : "ltr"}
            position="relative">
            {/* ✅ زر الإغلاق — يتبع اتجاه اللغة */}
            <CloseButton
              position="absolute"
              top={3}
              {...closePosition}
              onClick={handleClose}
              isDisabled={isSubmitting}
              size="sm"
              aria-label={L.close}
              zIndex={2}
              color="text-primary"
            />

            <AlertDialogHeader
              fontSize="lg"
              fontWeight="bold"
              color="text-primary"
              pt={5}
              pb={0}>
              <HStack spacing={3} pe={8}>
                <Flex
                  align="center"
                  justify="center"
                  w={11}
                  h={11}
                  rounded="md"
                  flexShrink={0}
                  sx={RED_ICON_BOX_SX}>
                  <Icon as={LuTriangleAlert} boxSize={5} />
                </Flex>
                <Text textAlign="start">{L.dialogTitle}</Text>
              </HStack>
            </AlertDialogHeader>

            <AlertDialogBody pt={3}>
              <VStack align="stretch" spacing={4}>
                <Text
                  color="text-secondary"
                  fontSize="sm"
                  lineHeight="tall"
                  textAlign="start">
                  {L.dialogBody}
                </Text>

                {/* Checkbox verification */}
                <Box
                  p={3}
                  rounded="lg"
                  bg="error.50"
                  borderWidth="1px"
                  borderColor="error.200"
                  _dark={{
                    bg: "error.900",
                    borderColor: "error.700",
                  }}>
                  <Checkbox
                    colorScheme="red"
                    isChecked={hasConfirmed}
                    onChange={(e) => setHasConfirmed(e.target.checked)}
                    isDisabled={isSubmitting}
                    size="md"
                    alignItems="flex-start"
                    sx={{
                      "& .chakra-checkbox__control": {
                        mt: "2px",
                      },
                    }}>
                    <Text
                      fontSize="sm"
                      fontWeight="medium"
                      color="error.800"
                      _dark={{ color: "error.100" }}
                      lineHeight="tall"
                      textAlign="start">
                      {L.checkboxLabel}
                    </Text>
                  </Checkbox>
                </Box>
              </VStack>
            </AlertDialogBody>

            <AlertDialogFooter
              gap={2}
              pb={5}
              flexDirection={{ base: "column-reverse", sm: "row" }}
              justifyContent="flex-end">
              <Button
                ref={cancelRef}
                variant="ghost"
                size="sm"
                onClick={handleClose}
                isDisabled={isSubmitting}
                minW={{ base: "full", sm: "auto" }}
                color="text-primary"
                _hover={{
                  bg: "blackAlpha.100",
                  _dark: { bg: "whiteAlpha.100" },
                }}>
                {L.dialogCancel}
              </Button>
              <Button
                size="sm"
                leftIcon={<LuLogOut size={14} />}
                onClick={handleConfirm}
                isLoading={isSubmitting}
                loadingText={L.signingOut}
                isDisabled={!hasConfirmed}
                minW={{ base: "full", sm: "auto" }}
                sx={RED_BTN_SX}>
                {L.dialogConfirm}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
