// src/pages/citizen/DeleteCitizenDialog.jsx
import { useEffect, useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
  Box,
  Button,
  CloseButton,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { LuTrash2, LuTriangleAlert } from "react-icons/lu";
import { useTranslation } from "react-i18next";

const CONFIRM_WORD = "Delete";

export default function DeleteCitizenDialog({
  isOpen,
  onClose,
  citizen,
  isDeleting,
  onConfirm,
  isRTL,
}) {
  const { t } = useTranslation();
  const cancelRef = useRef();
  const inputRef = useRef();
  const [confirmText, setConfirmText] = useState("");

  const fullName =
    `${citizen?.first_name ?? ""} ${citizen?.last_name ?? ""}`.trim() || "—";

  useEffect(() => {
    if (!isOpen) setConfirmText("");
  }, [isOpen]);

  const isMatch = confirmText.trim() === CONFIRM_WORD;

  const handleConfirm = () => {
    if (!isMatch || isDeleting) return;
    onConfirm();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && isMatch && !isDeleting) {
      e.preventDefault();
      onConfirm();
    }
  };

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      initialFocusRef={inputRef}
      onClose={isDeleting ? () => {} : onClose}
      isCentered
      motionPreset="slideInBottom">
      <AlertDialogOverlay bg="blackAlpha.600" backdropFilter="blur(4px)">
        <AlertDialogContent
          bg="bg-card"
          borderWidth="1px"
          borderColor="border-color"
          rounded="md"
          mx={4}
          overflow="hidden"
          dir={isRTL ? "rtl" : "ltr"}
          position="relative">
          <CloseButton
            position="absolute"
            top={3}
            {...(isRTL ? { left: 3 } : { right: 3 })}
            onClick={onClose}
            isDisabled={isDeleting}
            size="sm"
            aria-label={t("citizens.deleteCancel")}
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
                rounded="sm"
                bg="error.500"
                color="white"
                flexShrink={0}>
                <Icon as={LuTriangleAlert} boxSize={5} />
              </Flex>
              <Text textAlign="start">{t("citizens.deleteTitle")}</Text>
            </HStack>
          </AlertDialogHeader>

          <AlertDialogBody pt={3}>
            <VStack align="stretch" spacing={4}>
              <Text color="text-secondary" fontSize="sm" textAlign="start">
                {t("citizens.deleteBody")}
              </Text>

              <Box
                p={3}
                rounded="sm"
                bg="bg-input"
                borderWidth="1px"
                borderColor="border-color">
                <HStack spacing={3}>
                  <Avatar size="sm" name={fullName} />
                  <VStack align="start" spacing={0} minW={0}>
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                      color="text-primary"
                      noOfLines={1}>
                      {fullName}
                    </Text>
                    <Text fontSize="2xs" color="text-muted" noOfLines={1}>
                      {citizen?.national_id || citizen?.email || "—"}
                    </Text>
                  </VStack>
                </HStack>
              </Box>

              <FormControl>
                <FormLabel
                  fontSize="sm"
                  color="text-secondary"
                  fontWeight="medium"
                  mb={2}>
                  {t("citizens.deleteTypeToConfirm")}{" "}
                  <Text
                    as="span"
                    fontWeight="bold"
                    color="error.500"
                    fontFamily="mono">
                    {CONFIRM_WORD}
                  </Text>
                </FormLabel>
                <Input
                  ref={inputRef}
                  size="sm"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={CONFIRM_WORD}
                  autoComplete="off"
                  spellCheck={false}
                  rounded="sm"
                  fontFamily="mono"
                  dir="ltr"
                  borderColor="border-color"
                  _hover={{ borderColor: "border-color" }}
                  _focus={{
                    borderColor: "error.500",
                    boxShadow: "none",
                  }}
                  _focusVisible={{
                    borderColor: "error.500",
                    boxShadow: "0 0 0 1px var(--chakra-colors-error-500)",
                  }}
                />
              </FormControl>
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
              onClick={onClose}
              isDisabled={isDeleting}
              rounded="md"
              minW={{ base: "full", sm: "auto" }}>
              {t("citizens.deleteCancel")}
            </Button>
            <Button
              size="sm"
              variant="solid"
              bg="error.500"
              color="white"
              leftIcon={<LuTrash2 size={14} />}
              onClick={handleConfirm}
              isDisabled={!isMatch}
              isLoading={isDeleting}
              loadingText={t("citizens.deleting")}
              rounded="md"
              _hover={{ bg: isMatch ? "error.400" : "error.500" }}
              _active={{ bg: "error.600" }}
              _disabled={{ opacity: 0.4, cursor: "not-allowed" }}
              minW={{ base: "full", sm: "auto" }}>
              {t("citizens.deleteConfirm")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
