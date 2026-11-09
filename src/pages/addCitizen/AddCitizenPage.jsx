// src/pages/addCitizen/AddCitizenPage.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Heading,
  Icon,
  IconButton,
  Image,
  Input,
  Select,
  SimpleGrid,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import {
  LuCalendar,
  LuCamera,
  LuCircleCheck,
  LuCircleUserRound,
  LuGlobe,
  LuImagePlus,
  LuMail,
  LuMapPin,
  LuPhone,
  LuRefreshCw,
  LuUser,
  LuUserPlus,
  LuX,
} from "react-icons/lu";
import { useTranslation } from "react-i18next";
import { citizensAPI } from "../../api/citizens.api";
import { useAppToast } from "../../components/common/AppToast";
import { COUNTRIES } from "../../utils/countries";
import {
  GOVERNORATES,
  RELIGIONS,
  getLocationLabel,
  getReligionLabel,
  getGenderLabel,
  getCountryLabel,
} from "../../utils/citizenLabels";

const MAX_PHOTO_SIZE_MB = 5;
const MAX_PHOTO_SIZE_BYTES = MAX_PHOTO_SIZE_MB * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const EMPTY_FORM = {
  first_name: "",
  last_name: "",
  birth_date: "",
  gender: "",
  phone_number: "",
  email: "",
  religion: "Muslim",
  original_nationality: "Syria",
  location: "Damascus",
};

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

function SectionHeader({ icon, title, subtitle }) {
  return (
    <HStack
      spacing={2.5}
      mb={4}
      pb={3}
      borderBottomWidth="1px"
      borderColor="border-color">
      <Flex
        align="center"
        justify="center"
        w={8}
        h={8}
        rounded="sm"
        bg="syria.green.mid"
        color="white"
        flexShrink={0}
        shadow="sm">
        <Icon as={icon} boxSize={4} />
      </Flex>
      <VStack align="start" spacing={0} flex="1" minW={0}>
        <Heading size="xs" color="text-primary" fontWeight="bold">
          {title}
        </Heading>
        {subtitle && (
          <Text fontSize="2xs" color="text-muted" noOfLines={1}>
            {subtitle}
          </Text>
        )}
      </VStack>
    </HStack>
  );
}

function Card({ children, ...props }) {
  return (
    <Box
      bg="bg-card"
      borderWidth="1px"
      borderColor="border-color"
      rounded="md"
      p={{ base: 4, md: 5 }}
      shadow="sm"
      {...props}>
      {children}
    </Box>
  );
}

function FormInput({
  icon,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  hint,
  isDisabled,
  max,
  maxLength,
  inputMode,
  dir,
}) {
  return (
    <FormControl isInvalid={!!error} isDisabled={isDisabled}>
      <FormLabel
        fontSize="xs"
        fontWeight="semibold"
        color="text-primary"
        mb={1.5}>
        <HStack spacing={1.5}>
          <Icon as={icon} boxSize={3.5} color="text-muted" />
          <Text>{label}</Text>
        </HStack>
      </FormLabel>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        size="sm"
        rounded="sm"
        bg="bg-input"
        borderColor="border-color"
        dir={dir}
        max={max}
        maxLength={maxLength}
        inputMode={inputMode}
        _hover={{ borderColor: "syria.green.light" }}
        _focus={{ borderColor: "syria.green.mid", boxShadow: "none" }}
      />
      {hint && !error && (
        <FormHelperText fontSize="2xs" color="text-muted" mt={1}>
          {hint}
        </FormHelperText>
      )}
      <FormErrorMessage fontSize="2xs">{error}</FormErrorMessage>
    </FormControl>
  );
}

function FormSelect({
  icon,
  label,
  value,
  onChange,
  error,
  isDisabled,
  children,
}) {
  return (
    <FormControl isInvalid={!!error} isDisabled={isDisabled}>
      <FormLabel
        fontSize="xs"
        fontWeight="semibold"
        color="text-primary"
        mb={1.5}>
        <HStack spacing={1.5}>
          <Icon as={icon} boxSize={3.5} color="text-muted" />
          <Text>{label}</Text>
        </HStack>
      </FormLabel>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        size="sm"
        rounded="sm"
        bg="bg-input"
        borderColor="border-color"
        _hover={{ borderColor: "syria.green.light" }}
        _focus={{ borderColor: "syria.green.mid", boxShadow: "none" }}>
        {children}
      </Select>
      <FormErrorMessage fontSize="2xs">{error}</FormErrorMessage>
    </FormControl>
  );
}

function PhotoUploader({
  file,
  preview,
  onSelect,
  onRemove,
  error,
  isDisabled,
  t,
}) {
  const inputRef = useRef(null);

  const handleClick = () => {
    if (isDisabled) return;
    inputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    onSelect(selected);
    e.target.value = "";
  };

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel
        fontSize="xs"
        fontWeight="semibold"
        color="text-primary"
        mb={1.5}>
        <HStack spacing={1.5}>
          <Icon as={LuCamera} boxSize={3.5} color="text-muted" />
          <Text>{t("addCitizen.sections.photo")}</Text>
          <Text color="error.500" fontSize="xs">
            *
          </Text>
        </HStack>
      </FormLabel>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        onChange={handleFileChange}
        style={{ display: "none" }}
        disabled={isDisabled}
      />

      {preview ? (
        <VStack spacing={3} align="stretch">
          <Box
            position="relative"
            rounded="md"
            overflow="hidden"
            borderWidth="2px"
            borderColor="syria.green.light"
            bg="bg-input"
            aspectRatio="1 / 1">
            <Image
              src={preview}
              alt={t("addCitizen.photo.selected")}
              w="full"
              h="full"
              objectFit="cover"
            />
            <HStack
              spacing={1.5}
              position="absolute"
              top={2}
              insetInlineEnd={2}>
              <Tooltip label={t("addCitizen.photo.change")} hasArrow>
                <IconButton
                  size="xs"
                  icon={<LuRefreshCw size={12} />}
                  onClick={handleClick}
                  isDisabled={isDisabled}
                  colorScheme="success"
                  rounded="md"
                  aria-label={t("addCitizen.photo.change")}
                />
              </Tooltip>
              <Tooltip label={t("addCitizen.photo.remove")} hasArrow>
                <IconButton
                  size="xs"
                  icon={<LuX size={12} />}
                  onClick={onRemove}
                  isDisabled={isDisabled}
                  colorScheme="error"
                  rounded="md"
                  aria-label={t("addCitizen.photo.remove")}
                />
              </Tooltip>
            </HStack>
          </Box>

          <HStack spacing={2} fontSize="2xs" color="text-muted">
            <Icon as={LuCircleCheck} boxSize={3.5} color="success.500" />
            <Text noOfLines={1} flex="1" title={file?.name}>
              {file?.name || "—"}
            </Text>
            <Text fontFamily="mono">
              {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : ""}
            </Text>
          </HStack>
        </VStack>
      ) : (
        <Box
          as="button"
          type="button"
          onClick={handleClick}
          disabled={isDisabled}
          w="full"
          aspectRatio="1 / 1"
          rounded="md"
          borderWidth="2px"
          borderStyle="dashed"
          borderColor={error ? "error.300" : "border-color"}
          bg="bg-input"
          color="text-muted"
          transition="all 0.2s ease"
          _hover={{
            borderColor: error ? "error.500" : "syria.green.mid",
            bg: "bg-card",
            color: "syria.green.mid",
          }}
          _focusVisible={{
            borderColor: "syria.green.mid",
            boxShadow: "0 0 0 2px var(--chakra-colors-syria-green-mid)",
          }}
          cursor={isDisabled ? "not-allowed" : "pointer"}
          opacity={isDisabled ? 0.6 : 1}>
          <VStack spacing={3} justify="center" h="full" p={4}>
            <Flex
              align="center"
              justify="center"
              w={14}
              h={14}
              rounded="full"
              bg="bg-card"
              borderWidth="1px"
              borderColor="border-color">
              <Icon as={LuImagePlus} boxSize={6} />
            </Flex>
            <VStack spacing={1} align="center">
              <Text fontSize="sm" fontWeight="semibold">
                {t("addCitizen.photo.select")}
              </Text>
              <Text fontSize="2xs" textAlign="center" px={2}>
                {t("addCitizen.photo.formats")}
              </Text>
            </VStack>
          </VStack>
        </Box>
      )}

      <FormErrorMessage fontSize="2xs">{error}</FormErrorMessage>
      {!error && (
        <FormHelperText fontSize="2xs" color="text-muted" mt={1}>
          {t("addCitizen.photo.hint")}
        </FormHelperText>
      )}
    </FormControl>
  );
}

export default function AddCitizenPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const appToast = useAppToast();

  const isRTL = i18n.language === "ar";
  const lang = isRTL ? "ar" : "en";

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handlePhotoSelect = (file) => {
    const newErrors = { ...errors };

    if (!file) {
      setPhotoFile(null);
      setPhotoPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      newErrors.photo = t("addCitizen.photo.invalidType");
      setErrors(newErrors);
      return;
    }

    if (file.size > MAX_PHOTO_SIZE_BYTES) {
      newErrors.photo = t("addCitizen.photo.tooLarge");
      setErrors(newErrors);
      return;
    }

    if (file.size === 0) {
      newErrors.photo = t("addCitizen.photo.empty");
      setErrors(newErrors);
      return;
    }

    delete newErrors.photo;
    setErrors(newErrors);
    setPhotoFile(file);
    setPhotoPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  };

  const handlePhotoRemove = () => {
    setPhotoFile(null);
    setPhotoPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setErrors((prev) => {
      const next = { ...prev };
      delete next.photo;
      return next;
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!photoFile) {
      newErrors.photo = t("addCitizen.errors.photoRequired");
    }

    const trimmedFirst = form.first_name.trim();
    if (!trimmedFirst) {
      newErrors.first_name = t("addCitizen.errors.required");
    } else if (trimmedFirst.length < 2) {
      newErrors.first_name = t("addCitizen.errors.firstNameMin");
    } else if (trimmedFirst.length > 100) {
      newErrors.first_name = t("addCitizen.errors.firstNameMax");
    }

    const trimmedLast = form.last_name.trim();
    if (!trimmedLast) {
      newErrors.last_name = t("addCitizen.errors.required");
    } else if (trimmedLast.length < 2) {
      newErrors.last_name = t("addCitizen.errors.lastNameMin");
    } else if (trimmedLast.length > 100) {
      newErrors.last_name = t("addCitizen.errors.lastNameMax");
    }

    if (!form.birth_date) {
      newErrors.birth_date = t("addCitizen.errors.required");
    } else {
      const bd = new Date(form.birth_date);
      if (Number.isNaN(bd.getTime())) {
        newErrors.birth_date = t("addCitizen.errors.birthDateInvalid");
      } else if (bd > new Date()) {
        newErrors.birth_date = t("addCitizen.errors.birthDateFuture");
      }
    }

    if (!form.gender) {
      newErrors.gender = t("addCitizen.errors.genderInvalid");
    }

    if (!form.phone_number) {
      newErrors.phone_number = t("addCitizen.errors.required");
    } else if (!/^09[0-9]{8}$/.test(form.phone_number.trim())) {
      newErrors.phone_number = t("addCitizen.errors.phoneInvalid");
    }

    if (!form.email) {
      newErrors.email = t("addCitizen.errors.required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = t("addCitizen.errors.emailInvalid");
    }

    if (!form.religion) {
      newErrors.religion = t("addCitizen.errors.religionInvalid");
    }

    if (!form.original_nationality) {
      newErrors.original_nationality = t(
        "addCitizen.errors.nationalityInvalid",
      );
    }

    if (!form.location) {
      newErrors.location = t("addCitizen.errors.locationInvalid");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validate()) {
      const firstErrorEl = document.querySelector(
        "[aria-invalid='true'], .chakra-form__error-message",
      );
      firstErrorEl?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("photo", photoFile);
      formData.append("first_name", form.first_name.trim());
      formData.append("last_name", form.last_name.trim());
      formData.append("birth_date", form.birth_date);
      formData.append("gender", form.gender);
      formData.append("phone_number", form.phone_number.trim());
      formData.append("email", form.email.trim().toLowerCase());
      formData.append("religion", form.religion);
      formData.append("original_nationality", form.original_nationality);
      formData.append("location", form.location);

      await citizensAPI.create(formData);

      appToast.success(t("addCitizen.success.message"));
      navigate("/citizens");
    } catch (err) {
      appToast.error(err, t("addCitizen.errors.submitFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/citizens");
  };

  return (
    <Box w="full" py={1} dir={isRTL ? "rtl" : "ltr"}>
      <Flex
        mb={5}
        pb={4}
        borderBottomWidth="1px"
        borderColor="border-color"
        justify="space-between"
        align="center"
        gap={4}
        wrap="wrap">
        <HStack spacing={3} align="center" flex="1" minW={0}>
          <Flex
            align="center"
            justify="center"
            w={12}
            h={12}
            rounded="md"
            bg="syria.green.mid"
            color="white"
            flexShrink={0}
            shadow="sm">
            <Icon as={LuUserPlus} boxSize={6} />
          </Flex>
          <VStack align="start" spacing={0.5} flex="1" minW={0}>
            <Heading
              size="lg"
              color="text-primary"
              fontWeight="bold"
              noOfLines={1}>
              {t("addCitizen.pageTitle")}
            </Heading>
            <Text fontSize="sm" color="text-muted" noOfLines={1}>
              {t("addCitizen.subtitle")}
            </Text>
          </VStack>
        </HStack>
      </Flex>

      <form onSubmit={handleSubmit} noValidate>
        <SimpleGrid columns={{ base: 1, lg: 12 }} spacing={4} mb={4}>
          <Box gridColumn={{ base: "span 1", lg: "span 4" }}>
            <Card>
              <SectionHeader
                icon={LuCamera}
                title={t("addCitizen.sections.photo")}
                subtitle={t("addCitizen.photo.hint")}
              />
              <PhotoUploader
                file={photoFile}
                preview={photoPreview}
                onSelect={handlePhotoSelect}
                onRemove={handlePhotoRemove}
                error={errors.photo}
                isDisabled={isSubmitting}
                t={t}
              />
            </Card>
          </Box>

          <Box gridColumn={{ base: "span 1", lg: "span 8" }}>
            <VStack spacing={4} align="stretch">
              <Card>
                <SectionHeader
                  icon={LuUser}
                  title={t("addCitizen.sections.personalInfo")}
                />
                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                  <FormInput
                    icon={LuUser}
                    label={t("addCitizen.fields.firstName")}
                    value={form.first_name}
                    onChange={(v) => setField("first_name", v)}
                    placeholder={t("addCitizen.placeholders.firstName")}
                    error={errors.first_name}
                    isDisabled={isSubmitting}
                    maxLength={100}
                  />
                  <FormInput
                    icon={LuUser}
                    label={t("addCitizen.fields.lastName")}
                    value={form.last_name}
                    onChange={(v) => setField("last_name", v)}
                    placeholder={t("addCitizen.placeholders.lastName")}
                    error={errors.last_name}
                    isDisabled={isSubmitting}
                    maxLength={100}
                  />
                  <FormInput
                    icon={LuCalendar}
                    label={t("addCitizen.fields.birthDate")}
                    value={form.birth_date}
                    onChange={(v) => setField("birth_date", v)}
                    type="date"
                    max={todayISO()}
                    error={errors.birth_date}
                    isDisabled={isSubmitting}
                  />
                  <FormSelect
                    icon={LuCircleUserRound}
                    label={t("addCitizen.fields.gender")}
                    value={form.gender}
                    onChange={(v) => setField("gender", v)}
                    error={errors.gender}
                    isDisabled={isSubmitting}>
                    <option value="">
                      {t("addCitizen.placeholders.selectGender")}
                    </option>
                    <option value="male">{getGenderLabel("male", t)}</option>
                    <option value="female">
                      {getGenderLabel("female", t)}
                    </option>
                  </FormSelect>
                </SimpleGrid>
              </Card>

              <Card>
                <SectionHeader
                  icon={LuPhone}
                  title={t("addCitizen.sections.contactInfo")}
                />
                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                  <FormInput
                    icon={LuPhone}
                    label={t("addCitizen.fields.phone")}
                    value={form.phone_number}
                    onChange={(v) =>
                      setField(
                        "phone_number",
                        v.replace(/[^\d]/g, "").slice(0, 10),
                      )
                    }
                    placeholder={t("addCitizen.placeholders.phone")}
                    error={errors.phone_number}
                    isDisabled={isSubmitting}
                    maxLength={10}
                    inputMode="numeric"
                    dir="ltr"
                  />
                  <FormInput
                    icon={LuMail}
                    label={t("addCitizen.fields.email")}
                    value={form.email}
                    onChange={(v) => setField("email", v)}
                    placeholder={t("addCitizen.placeholders.email")}
                    type="email"
                    error={errors.email}
                    isDisabled={isSubmitting}
                    maxLength={254}
                    dir="ltr"
                  />
                </SimpleGrid>
              </Card>

              <Card>
                <SectionHeader
                  icon={LuGlobe}
                  title={t("addCitizen.sections.background")}
                />
                <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={4}>
                  <FormSelect
                    icon={LuUser}
                    label={t("addCitizen.fields.religion")}
                    value={form.religion}
                    onChange={(v) => setField("religion", v)}
                    error={errors.religion}
                    isDisabled={isSubmitting}>
                    {RELIGIONS.map((rel) => (
                      <option key={rel} value={rel}>
                        {getReligionLabel(rel, t)}
                      </option>
                    ))}
                  </FormSelect>
                  <FormSelect
                    icon={LuGlobe}
                    label={t("addCitizen.fields.nationality")}
                    value={form.original_nationality}
                    onChange={(v) => setField("original_nationality", v)}
                    error={errors.original_nationality}
                    isDisabled={isSubmitting}>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {getCountryLabel(c, lang)}
                      </option>
                    ))}
                  </FormSelect>
                  <FormSelect
                    icon={LuMapPin}
                    label={t("addCitizen.fields.location")}
                    value={form.location}
                    onChange={(v) => setField("location", v)}
                    error={errors.location}
                    isDisabled={isSubmitting}>
                    {GOVERNORATES.map((g) => (
                      <option key={g} value={g}>
                        {getLocationLabel(g, t)}
                      </option>
                    ))}
                  </FormSelect>
                </SimpleGrid>
              </Card>
            </VStack>
          </Box>
        </SimpleGrid>

        <Alert
          status="info"
          rounded="md"
          bg="info.50"
          _dark={{ bg: "whiteAlpha.100" }}
          borderWidth="1px"
          borderColor="info.200"
          mb={4}>
          <AlertIcon boxSize={4} />
          <AlertDescription fontSize="xs" color="text-primary">
            {t("addCitizen.photo.hint")}
          </AlertDescription>
        </Alert>

        <Flex justify="flex-end" gap={2}>
          <Button
            variant="outline"
            colorScheme="gray"
            onClick={handleCancel}
            size="sm"
            isDisabled={isSubmitting}
            rounded="md">
            {t("addCitizen.actions.cancel")}
          </Button>
          <Button
            type="submit"
            colorScheme="success"
            size="sm"
            rounded="md"
            isLoading={isSubmitting}
            loadingText={t("addCitizen.actions.creating")}>
            {t("addCitizen.actions.create")}
          </Button>
        </Flex>
      </form>
    </Box>
  );
}
