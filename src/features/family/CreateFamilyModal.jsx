// src/features/family/CreateFamilyModal.jsx
import { useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Heading,
  Icon,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  LuBaby,
  LuCircleAlert,
  LuPlus,
  LuUser,
  LuUserCheck,
  LuX,
} from "react-icons/lu";
import { useTranslation } from "react-i18next";
import { familiesAPI } from "../../api/families.api";

function isValidObjectId(id) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

function FormSection({ icon, title, subtitle, action, children }) {
  return (
    <Box>
      <HStack
        spacing={2.5}
        mb={3}
        pb={2.5}
        borderBottomWidth="1px"
        borderColor="border-color"
        align="center">
        <Flex
          align="center"
          justify="center"
          w={7}
          h={7}
          rounded="sm"
          bg="syria.green.mid"
          color="white"
          flexShrink={0}
          shadow="sm">
          <Icon as={icon} boxSize={3.5} />
        </Flex>
        <VStack align="start" spacing={0} flex="1" minW={0}>
          <Text
            fontSize="xs"
            color="text-primary"
            fontWeight="bold"
            noOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text fontSize="2xs" color="text-muted" noOfLines={1}>
              {subtitle}
            </Text>
          )}
        </VStack>
        {action}
      </HStack>
      {children}
    </Box>
  );
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  error,
  isSubmitting,
  isOptional,
  optionalText,
}) {
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel
        fontSize="xs"
        fontWeight="semibold"
        color="text-primary"
        mb={1.5}>
        <HStack spacing={1.5}>
          <Text>{label}</Text>
          {isOptional && (
            <Text fontSize="2xs" color="text-muted" fontWeight="normal">
              ({optionalText})
            </Text>
          )}
        </HStack>
      </FormLabel>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        fontFamily="mono"
        dir="ltr"
        size="sm"
        maxLength={24}
        rounded="sm"
        bg="bg-input"
        borderColor="border-color"
        isDisabled={isSubmitting}
        _hover={{ borderColor: "syria.green.light" }}
        _focus={{ borderColor: "syria.green.mid", boxShadow: "none" }}
      />
      <FormErrorMessage fontSize="2xs">{error}</FormErrorMessage>
    </FormControl>
  );
}

export default function CreateFamilyModal({
  isOpen,
  onClose,
  onCreated,
  t,
  appToast,
}) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [fatherId, setFatherId] = useState("");
  const [motherId, setMotherId] = useState("");
  const [childInputs, setChildInputs] = useState([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const resetForm = () => {
    setFatherId("");
    setMotherId("");
    setChildInputs([""]);
    setErrors({});
  };

  const handleClose = () => {
    if (isSubmitting) return;
    resetForm();
    onClose();
  };

  const validate = () => {
    const newErrors = {};
    const trimmedFather = fatherId.trim();
    const trimmedMother = motherId.trim();

    if (!trimmedFather && !trimmedMother) {
      newErrors.parents = t("families.createModal.errors.atLeastOneParent");
      setErrors(newErrors);
      return false;
    }

    if (trimmedFather && !isValidObjectId(trimmedFather)) {
      newErrors.father = t("families.createModal.errors.invalidId");
    }

    if (trimmedMother && !isValidObjectId(trimmedMother)) {
      newErrors.mother = t("families.createModal.errors.invalidId");
    }

    if (trimmedFather && trimmedMother && trimmedFather === trimmedMother) {
      newErrors.parents = t("families.createModal.errors.sameParent");
    }

    for (const childInput of childInputs) {
      const trimmed = childInput.trim();
      if (!trimmed) continue;
      if (!isValidObjectId(trimmed)) {
        newErrors.children = t("families.createModal.errors.invalidId");
        break;
      }
      if (trimmed === trimmedFather || trimmed === trimmedMother) {
        newErrors.children = t("families.createModal.errors.childIsParent");
        break;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const trimmedFather = fatherId.trim();
      const trimmedMother = motherId.trim();
      const validChildren = [
        ...new Set(childInputs.map((c) => c.trim()).filter(Boolean)),
      ];

      await familiesAPI.create({
        father: trimmedFather || null,
        mother: trimmedMother || null,
        children_ids: validChildren,
      });

      appToast.success(t("families.createModal.success"));
      resetForm();
      onCreated();
      onClose();
    } catch (err) {
      appToast.error(err, t("families.createModal.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChildChange = (idx, value) => {
    const next = [...childInputs];
    next[idx] = value;
    setChildInputs(next);
  };

  const handleChildRemove = (idx) => {
    if (childInputs.length === 1) {
      setChildInputs([""]);
    } else {
      setChildInputs(childInputs.filter((_, i) => i !== idx));
    }
  };

  const handleAddChild = () => {
    setChildInputs([...childInputs, ""]);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      isCentered
      size="xl"
      closeOnOverlayClick={!isSubmitting}
      closeOnEsc={!isSubmitting}
      scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent
        dir={isRTL ? "rtl" : "ltr"}
        bg="bg-card"
        borderWidth="1px"
        borderColor="border-color"
        rounded="md"
        overflow="hidden">
        <ModalHeader p={0}>
          <Flex
            align="center"
            gap={3}
            px={{ base: 4, md: 5 }}
            py={4}
            bg="bg-input"
            borderBottomWidth="1px"
            borderColor="border-color">
            <Flex
              align="center"
              justify="center"
              w={10}
              h={10}
              rounded="md"
              bg="syria.green.mid"
              color="white"
              flexShrink={0}
              shadow="sm">
              <Icon as={LuUserCheck} boxSize={5} />
            </Flex>
            <VStack align="start" spacing={0.5} flex="1" minW={0} pe={10}>
              <Heading
                size="sm"
                color="text-primary"
                fontWeight="bold"
                noOfLines={1}>
                {t("families.createModal.title")}
              </Heading>
              <Text
                fontSize="xs"
                color="text-muted"
                fontWeight="normal"
                noOfLines={2}>
                {t("families.createModal.subtitle")}
              </Text>
            </VStack>
          </Flex>
        </ModalHeader>

        <IconButton
          aria-label={t("families.createModal.close")}
          icon={<LuX size={16} />}
          position="absolute"
          top={4}
          left={isRTL ? 4 : "auto"}
          right={isRTL ? "auto" : 4}
          size="sm"
          variant="ghost"
          colorScheme="gray"
          onClick={handleClose}
          isDisabled={isSubmitting}
          rounded="md"
          zIndex={2}
        />

        <ModalBody py={5} px={{ base: 4, md: 5 }}>
          <VStack spacing={5} align="stretch">
            <Alert
              status="info"
              rounded="md"
              bg="info.50"
              _dark={{ bg: "whiteAlpha.100" }}
              borderWidth="1px"
              borderColor="info.200"
              alignItems="flex-start">
              <AlertIcon boxSize={4} mt={0.5} />
              <AlertDescription fontSize="xs" color="text-primary">
                {t("families.createModal.hint")}
              </AlertDescription>
            </Alert>

            <FormSection
              icon={LuUser}
              title={t("families.createModal.parentsSection")}
              subtitle={t("families.createModal.parentsSubtitle")}>
              <SimpleGrid
                columns={{ base: 1, sm: 2 }}
                spacing={3}
                alignItems="flex-start">
                <FormField
                  label={t("families.createModal.fatherId")}
                  value={fatherId}
                  onChange={setFatherId}
                  placeholder={t("families.createModal.idPlaceholder")}
                  error={errors.father}
                  isSubmitting={isSubmitting}
                  isOptional
                  optionalText={t("families.createModal.optional")}
                />
                <FormField
                  label={t("families.createModal.motherId")}
                  value={motherId}
                  onChange={setMotherId}
                  placeholder={t("families.createModal.idPlaceholder")}
                  error={errors.mother}
                  isSubmitting={isSubmitting}
                  isOptional
                  optionalText={t("families.createModal.optional")}
                />
              </SimpleGrid>

              {errors.parents && (
                <Alert
                  status="error"
                  rounded="md"
                  bg="error.50"
                  _dark={{ bg: "whiteAlpha.100" }}
                  borderWidth="1px"
                  borderColor="error.200"
                  mt={3}>
                  <AlertIcon boxSize={4} />
                  <AlertDescription fontSize="xs" color="text-primary">
                    {errors.parents}
                  </AlertDescription>
                </Alert>
              )}
            </FormSection>

            <FormSection
              icon={LuBaby}
              title={t("families.createModal.childrenSection")}
              subtitle={t("families.createModal.childrenSubtitle")}
              action={
                <Button
                  size="xs"
                  variant="outline"
                  colorScheme="green"
                  leftIcon={<LuPlus size={10} />}
                  onClick={handleAddChild}
                  isDisabled={isSubmitting}
                  rounded="sm">
                  {t("families.createModal.addChild")}
                </Button>
              }>
              {childInputs.length === 0 ? (
                <Text
                  fontSize="xs"
                  color="text-muted"
                  fontStyle="italic"
                  textAlign="center"
                  py={3}>
                  {t("families.createModal.noChildren")}
                </Text>
              ) : (
                <VStack spacing={2} align="stretch">
                  {childInputs.map((childInput, idx) => (
                    <Box
                      key={idx}
                      p={2.5}
                      rounded="md"
                      bg="bg-input"
                      borderWidth="1px"
                      borderColor={
                        errors.children ? "error.300" : "border-color"
                      }>
                      <HStack spacing={2} align="flex-end">
                        <FormControl isInvalid={!!errors.children} flex="1">
                          <FormLabel
                            fontSize="2xs"
                            fontWeight="semibold"
                            color="text-muted"
                            mb={1}>
                            <HStack spacing={1.5}>
                              <Text>
                                {t("families.createModal.childN")} {idx + 1}
                              </Text>
                              <Text
                                fontSize="2xs"
                                color="text-muted"
                                fontWeight="normal">
                                ({t("families.createModal.optional")})
                              </Text>
                            </HStack>
                          </FormLabel>
                          <Input
                            value={childInput}
                            onChange={(e) =>
                              handleChildChange(idx, e.target.value)
                            }
                            placeholder={t(
                              "families.createModal.idPlaceholder",
                            )}
                            fontFamily="mono"
                            dir="ltr"
                            size="sm"
                            maxLength={24}
                            rounded="sm"
                            bg="bg-card"
                            borderColor="border-color"
                            isDisabled={isSubmitting}
                            _hover={{ borderColor: "syria.green.light" }}
                            _focus={{
                              borderColor: "syria.green.mid",
                              boxShadow: "none",
                            }}
                          />
                        </FormControl>
                        <IconButton
                          size="sm"
                          variant="ghost"
                          colorScheme="error"
                          icon={<LuX size={14} />}
                          aria-label={t("families.createModal.removeChild")}
                          onClick={() => handleChildRemove(idx)}
                          isDisabled={isSubmitting}
                          flexShrink={0}
                        />
                      </HStack>
                    </Box>
                  ))}
                  {errors.children && (
                    <Text fontSize="2xs" color="error.500">
                      {errors.children}
                    </Text>
                  )}
                </VStack>
              )}
            </FormSection>

            <Divider borderColor="border-color" />

            <HStack spacing={2} color="text-muted" fontSize="2xs" align="start">
              <Icon
                as={LuCircleAlert}
                boxSize={3.5}
                color="syria.wheat.dark"
                flexShrink={0}
                mt={0.5}
              />
              <Text flex="1">{t("families.createModal.footerNote")}</Text>
            </HStack>
          </VStack>
        </ModalBody>

        <ModalFooter
          px={{ base: 4, md: 5 }}
          py={4}
          bg="bg-input"
          borderTopWidth="1px"
          borderColor="border-color">
          <HStack spacing={2} w="full" justify="flex-end">
            <Button
              variant="outline"
              colorScheme="gray"
              onClick={handleClose}
              size="sm"
              isDisabled={isSubmitting}
              rounded="md">
              {t("families.createModal.cancel")}
            </Button>
            <Button
              bg="syria.green.mid"
              color="syria.wheat.light"
              _hover={{
                bg: "syria.green.light",
                transform: "translateY(-1px)",
                shadow: "md",
              }}
              _active={{ bg: "syria.green.dark", transform: "translateY(0)" }}
              _disabled={{
                opacity: 0.6,
                cursor: "not-allowed",
                _hover: {
                  bg: "syria.green.mid",
                  transform: "none",
                  shadow: "none",
                },
              }}
              transition="all 0.2s ease"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              loadingText={t("families.createModal.creating")}
              size="sm"
              rounded="md"
              fontWeight="semibold">
              {t("families.createModal.create")}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
