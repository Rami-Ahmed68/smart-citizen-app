// src/pages/admin/AddAdminPage.jsx
import { useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Badge,
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Text,
  VStack,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import {
  LuUser,
  LuMail,
  LuLock,
  LuEye,
  LuEyeOff,
  LuPhone,
  LuCalendar,
  LuArrowRight,
  LuUserPlus,
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../auth/AuthContext";
import { adminsAPI } from "../../api/admins.api";
import { useAppToast } from "../../components/common/AppToast";

const FIELD_MAX = {
  first_name: 50,
  last_name: 50,
  email: 100,
  phone_number: 16,
  password: 64,
  confirmPassword: 64,
};

const ROLE_BADGE = {
  super: { colorScheme: "purple", labelKey: "addAdmin.roleSuper" },
  admin: { colorScheme: "blue", labelKey: "addAdmin.roleAdmin" },
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

function SectionHeader({ icon, title, subtitle }) {
  return (
    <HStack spacing={2.5} mb={4}>
      <Flex
        align="center"
        justify="center"
        w={8}
        h={8}
        rounded="md"
        bg="syria.green.light"
        color="white"
        flexShrink={0}
        _dark={{ bg: "syria.green.mid" }}>
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

function LabelWithCounter({ label, current = "", max }) {
  return (
    <HStack justify="space-between" align="center" mb={1}>
      <FormLabel
        fontSize="xs"
        fontWeight="semibold"
        mb={0}
        color="text-secondary">
        {label}
      </FormLabel>
      {max !== undefined && (
        <Text
          fontSize="2xs"
          color={current.length > max ? "red.500" : "text-muted"}
          fontFamily="mono">
          {current.length}/{max}
        </Text>
      )}
    </HStack>
  );
}

export default function AddAdminPage() {
  const { t } = useTranslation();
  const { admin: currentAdmin } = useAuth();
  const appToast = useAppToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone_number: "",
    birth_date: "",
    gender: "male",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const set = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const currentRoleBadge = ROLE_BADGE[currentAdmin?.role] || ROLE_BADGE.admin;

  const handlePhoneChange = (e) => {
    const cleaned = e.target.value.replace(/[^\d+]/g, "");
    set("phone_number", cleaned);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (form.password !== form.confirmPassword) {
      appToast.error(t("addAdmin.passwordMismatch"));
      return;
    }
    if (form.password.length < 8) {
      appToast.error(t("addAdmin.passShort"));
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        password: form.password,
        phone_number: form.phone_number.trim(),
        birth_date: form.birth_date,
        gender: form.gender,
      };

      await adminsAPI.create(payload);
      appToast.success(t("addAdmin.successTitle"), t("addAdmin.successDesc"));
      navigate("/admins", { replace: true });
    } catch (err) {
      appToast.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDatePicker = (e) => {
    if (e.currentTarget.showPicker) {
      try {
        e.currentTarget.showPicker();
      } catch {
        /* ignore */
      }
    }
  };

  return (
    <Box w="full" py={1}>
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
          w={11}
          h={11}
          rounded="lg"
          bgGradient="linear(to-br, syria.green.light, syria.green.mid)"
          color="white"
          flexShrink={0}
          _dark={{
            bgGradient: "linear(to-br, syria.green.mid, syria.green.light)",
          }}>
          <Icon as={LuUserPlus} boxSize={5} />
        </Flex>
        <VStack align="start" spacing={0.5} flex="1">
          <HStack spacing={2} wrap="wrap">
            <Heading size="md" color="text-primary">
              {t("addAdmin.pageTitle")}
            </Heading>
            <Badge
              colorScheme={currentRoleBadge.colorScheme}
              variant="solid"
              fontSize="2xs"
              rounded="md"
              px={2}
              py={0.5}
              fontWeight="semibold"
              textTransform="none">
              {t("addAdmin.youAre")}: {t(currentRoleBadge.labelKey)}
            </Badge>
          </HStack>
          <Text fontSize="xs" color="text-muted">
            {t("addAdmin.pageSubtitle")}
          </Text>
        </VStack>
      </Flex>

      <Alert
        status="info"
        rounded="lg"
        mb={4}
        variant="left-accent"
        fontSize="sm">
        <AlertIcon boxSize={4} />
        <AlertDescription fontSize="xs">
          {t("addAdmin.infoNote")}
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit}>
        <VStack align="stretch" spacing={4}>
          {/* ═══ 1. Personal ═══ */}
          <Card>
            <SectionHeader
              icon={LuUser}
              title={t("addAdmin.sectionPersonal")}
            />

            <Grid
              templateColumns={{
                base: "1fr",
                md: "1fr 1fr",
                xl: "1fr 1fr 1fr",
              }}
              gap={4}>
              <FormControl isRequired>
                <LabelWithCounter
                  label={t("addAdmin.firstName")}
                  current={form.first_name}
                  max={FIELD_MAX.first_name}
                />
                <Input
                  size="sm"
                  value={form.first_name}
                  onChange={(e) => set("first_name", e.target.value)}
                  placeholder={t("addAdmin.firstNamePlaceholder")}
                  minLength={2}
                  maxLength={FIELD_MAX.first_name}
                />
              </FormControl>

              <FormControl isRequired>
                <LabelWithCounter
                  label={t("addAdmin.lastName")}
                  current={form.last_name}
                  max={FIELD_MAX.last_name}
                />
                <Input
                  size="sm"
                  value={form.last_name}
                  onChange={(e) => set("last_name", e.target.value)}
                  placeholder={t("addAdmin.lastNamePlaceholder")}
                  minLength={2}
                  maxLength={FIELD_MAX.last_name}
                />
              </FormControl>

              <FormControl isRequired>
                <LabelWithCounter
                  label={t("addAdmin.phone")}
                  current={form.phone_number}
                  max={FIELD_MAX.phone_number}
                />
                <InputGroup size="sm">
                  <InputLeftElement pointerEvents="none">
                    <Icon as={LuPhone} color="text-muted" boxSize={4} />
                  </InputLeftElement>
                  <Input
                    type="tel"
                    value={form.phone_number}
                    onChange={handlePhoneChange}
                    placeholder={t("addAdmin.phonePlaceholder")}
                    maxLength={FIELD_MAX.phone_number}
                    pattern="^\+?[0-9]{7,15}$"
                  />
                </InputGroup>
                <FormHelperText fontSize="2xs" mt={1}>
                  {t("addAdmin.phoneHint")}
                </FormHelperText>
              </FormControl>

              <FormControl isRequired>
                <FormLabel
                  fontSize="xs"
                  fontWeight="semibold"
                  mb={1}
                  color="text-secondary">
                  {t("addAdmin.birthDate")}
                </FormLabel>
                <InputGroup size="sm">
                  <InputLeftElement pointerEvents="none" zIndex={1}>
                    <Icon as={LuCalendar} color="text-muted" boxSize={4} />
                  </InputLeftElement>
                  <Input
                    type="date"
                    value={form.birth_date}
                    onChange={(e) => set("birth_date", e.target.value)}
                    max={new Date().toISOString().split("T")[0]}
                    onClick={openDatePicker}
                    cursor="pointer"
                    sx={{
                      "&::-webkit-calendar-picker-indicator": {
                        cursor: "pointer",
                        opacity: 0.55,
                        transition: "opacity 0.15s",
                        marginInlineStart: 1,
                      },
                      "&:hover::-webkit-calendar-picker-indicator": {
                        opacity: 0.9,
                      },
                      _dark: {
                        "&::-webkit-calendar-picker-indicator": {
                          filter: "invert(1) brightness(1.6)",
                          opacity: 0.6,
                        },
                      },
                    }}
                  />
                </InputGroup>
              </FormControl>

              <GridItem colSpan={{ base: 1, md: 1, xl: 2 }}>
                <FormControl isRequired>
                  <FormLabel
                    fontSize="xs"
                    fontWeight="semibold"
                    mb={1}
                    color="text-secondary">
                    {t("addAdmin.gender")}
                  </FormLabel>
                  <RadioGroup
                    value={form.gender}
                    onChange={(v) => set("gender", v)}>
                    <HStack spacing={5}>
                      <Radio value="male" colorScheme="blue" size="sm">
                        {t("addAdmin.male")}
                      </Radio>
                      <Radio value="female" colorScheme="pink" size="sm">
                        {t("addAdmin.female")}
                      </Radio>
                    </HStack>
                  </RadioGroup>
                </FormControl>
              </GridItem>
            </Grid>
          </Card>

          {/* ═══ 2. Account ═══ */}
          <Card>
            <SectionHeader icon={LuMail} title={t("addAdmin.sectionAccount")} />

            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
              <GridItem colSpan={{ base: 1, md: 2 }}>
                <FormControl isRequired>
                  <LabelWithCounter
                    label={t("addAdmin.email")}
                    current={form.email}
                    max={FIELD_MAX.email}
                  />
                  <InputGroup size="sm">
                    <InputLeftElement pointerEvents="none">
                      <Icon as={LuMail} color="text-muted" boxSize={4} />
                    </InputLeftElement>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      placeholder={t("addAdmin.emailPlaceholder")}
                      autoComplete="email"
                      maxLength={FIELD_MAX.email}
                    />
                  </InputGroup>
                </FormControl>
              </GridItem>

              <FormControl isRequired>
                <LabelWithCounter
                  label={t("addAdmin.password")}
                  current={form.password}
                  max={FIELD_MAX.password}
                />
                <InputGroup size="sm">
                  <InputLeftElement pointerEvents="none">
                    <Icon as={LuLock} color="text-muted" boxSize={4} />
                  </InputLeftElement>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => set("password", e.target.value)}
                    placeholder={t("addAdmin.passwordPlaceholder")}
                    autoComplete="new-password"
                    maxLength={FIELD_MAX.password}
                  />
                  <InputRightElement>
                    <IconButton
                      type="button"
                      size="xs"
                      variant="ghost"
                      aria-label={
                        showPassword
                          ? t("addAdmin.hidePassword")
                          : t("addAdmin.showPassword")
                      }
                      icon={showPassword ? <LuEyeOff /> : <LuEye />}
                      onClick={() => setShowPassword((s) => !s)}
                    />
                  </InputRightElement>
                </InputGroup>
                <FormHelperText fontSize="2xs" mt={1}>
                  {t("addAdmin.passShort")}
                </FormHelperText>
              </FormControl>

              <FormControl isRequired>
                <LabelWithCounter
                  label={t("addAdmin.confirmPassword")}
                  current={form.confirmPassword}
                  max={FIELD_MAX.confirmPassword}
                />
                <InputGroup size="sm">
                  <InputLeftElement pointerEvents="none">
                    <Icon as={LuLock} color="text-muted" boxSize={4} />
                  </InputLeftElement>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={(e) => set("confirmPassword", e.target.value)}
                    placeholder={t("addAdmin.passwordPlaceholder")}
                    autoComplete="new-password"
                    maxLength={FIELD_MAX.confirmPassword}
                  />
                </InputGroup>
                {form.confirmPassword &&
                  form.password !== form.confirmPassword && (
                    <FormHelperText color="red.500" fontSize="2xs" mt={1}>
                      {t("addAdmin.passwordMismatch")}
                    </FormHelperText>
                  )}
              </FormControl>
            </Grid>
          </Card>

          {/* ═══ Actions ═══ */}
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
              onClick={() => navigate(-1)}
              isDisabled={isSubmitting}
              minW={{ base: "full", sm: "auto" }}>
              {t("addAdmin.cancel")}
            </Button>
            <Button
              type="submit"
              size="sm"
              colorScheme="green"
              rightIcon={<LuArrowRight size={14} />}
              isLoading={isSubmitting}
              loadingText={t("addAdmin.saving")}
              minW={{ base: "full", sm: "auto" }}>
              {t("addAdmin.save")}
            </Button>
          </Flex>
        </VStack>
      </form>
    </Box>
  );
}
