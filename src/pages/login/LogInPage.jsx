// src/pages/auth/LoginPage.jsx
import { useState } from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Stack,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { LuMail, LuLock, LuEye, LuEyeOff, LuShield } from "react-icons/lu";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../auth/AuthContext";
import { getErrorMessage } from "../../api/axios";

const GOLD = "#c9a961";
const NAVY = "#0a1628";
const NAVY_MID = "#12294d";
const NAVY_LIGHT = "#1e3a5f";

export default function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      toast({
        title: t("auth.loginError"),
        description: getErrorMessage(err, t("auth.loginErrorDesc")),
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Flex minH="100vh" bg="bg-body">
      {/* ═══════════════ الشريط الحكومي (شاشات كبيرة فقط) ═══════════════ */}
      <Box
        flex="1"
        display={{ base: "none", lg: "flex" }}
        bgGradient={`linear(135deg, ${NAVY} 0%, ${NAVY_MID} 55%, ${NAVY_LIGHT} 100%)`}
        color="white"
        position="relative"
        overflow="hidden"
        alignItems="center"
        justifyContent="center"
        p={12}>
        {/* نمط قُطري خفيف */}
        <Box
          position="absolute"
          inset="0"
          opacity="0.04"
          backgroundImage="repeating-linear-gradient(45deg, #ffffff 0, #ffffff 1px, transparent 1px, transparent 24px)"
          pointerEvents="none"
        />

        {/* توهجات زخرفية */}
        <Box
          position="absolute"
          top="-25%"
          right="-15%"
          w="600px"
          h="600px"
          borderRadius="full"
          bg="whiteAlpha.50"
          filter="blur(120px)"
          pointerEvents="none"
        />
        <Box
          position="absolute"
          bottom="-30%"
          left="-20%"
          w="500px"
          h="500px"
          borderRadius="full"
          bg="whiteAlpha.50"
          filter="blur(120px)"
          pointerEvents="none"
        />

        <VStack
          spacing={10}
          maxW="460px"
          position="relative"
          zIndex={1}
          textAlign="center">
          {/* ختم مؤسسي */}
          <Box position="relative">
            <Box
              w="128px"
              h="128px"
              borderRadius="full"
              border="2px solid"
              borderColor={GOLD}
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg="whiteAlpha.100"
              backdropFilter="blur(12px)">
              <Icon as={LuShield} boxSize={14} color={GOLD} strokeWidth={1.5} />
            </Box>
            <Box
              position="absolute"
              inset="-14px"
              borderRadius="full"
              border="1px solid"
              borderColor={`${GOLD}40`}
            />
          </Box>

          {/* فاصل ذهبي مع نقش */}
          <HStack spacing={3} w="100%" justify="center">
            <Box
              h="1px"
              flex="1"
              bgGradient="linear(to-r, transparent, #c9a961)"
            />
            <Text
              fontSize="2xs"
              letterSpacing="0.4em"
              color={GOLD}
              textTransform="uppercase"
              fontWeight="semibold">
              Secure Portal
            </Text>
            <Box
              h="1px"
              flex="1"
              bgGradient="linear(to-l, transparent, #c9a961)"
            />
          </HStack>

          {/* اسم المنصة */}
          <VStack spacing={3}>
            <Text
              fontSize="3xl"
              fontWeight="bold"
              letterSpacing="0.12em"
              fontFamily="Georgia, 'Times New Roman', serif"
              textTransform="uppercase"
              lineHeight="shorter">
              Smart Citizen
            </Text>
            <Text
              fontSize="xs"
              letterSpacing="0.3em"
              color="whiteAlpha.700"
              textTransform="uppercase">
              National Administrative Platform
            </Text>
          </VStack>

          <Text
            fontSize="sm"
            color="whiteAlpha.800"
            lineHeight="tall"
            maxW="360px"
            fontWeight="300">
            منصة إدارة المواطنين الذكية — نظام حكومي آمن ومعتمد للوصول إلى
            بيانات المواطنين وإدارة الطلبات والخدمات.
          </Text>

          <VStack spacing={2}>
            <Divider borderColor="whiteAlpha.200" w="60px" />
            <Text
              fontSize="2xs"
              color="whiteAlpha.500"
              letterSpacing="0.15em"
              textTransform="uppercase">
              © 2026 Smart Citizen · All Rights Reserved
            </Text>
          </VStack>
        </VStack>
      </Box>

      {/* ═══════════════ قسم النموذج (بلا بوردر) ═══════════════ */}
      <Flex
        flex="1"
        align="center"
        justify="center"
        p={{ base: 6, md: 12 }}
        bg="bg-body">
        <Box w="100%" maxW="400px">
          <VStack spacing={8} align="stretch">
            {/* شعار الجوال */}
            <VStack
              spacing={3}
              display={{ base: "flex", lg: "none" }}
              align="center"
              pt={4}>
              <Box
                w="80px"
                h="80px"
                borderRadius="full"
                border="2px solid"
                borderColor="brand.500"
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg="brand.50"
                _dark={{ bg: "brand.900", borderColor: "brand.400" }}>
                <Icon
                  as={LuShield}
                  boxSize={9}
                  color="brand.500"
                  _dark={{ color: "brand.300" }}
                  strokeWidth={1.5}
                />
              </Box>
              <Text
                fontSize="lg"
                fontWeight="bold"
                letterSpacing="0.15em"
                textTransform="uppercase"
                fontFamily="Georgia, 'Times New Roman', serif">
                Smart Citizen
              </Text>
              <Text
                fontSize="2xs"
                letterSpacing="0.25em"
                color="text-muted"
                textTransform="uppercase">
                Secure Administrative Portal
              </Text>
            </VStack>

            {/* العنوان */}
            <VStack spacing={1} align="start">
              <Heading
                size="lg"
                letterSpacing="tight"
                color="text-primary"
                fontWeight="bold">
                {t("auth.welcomeBack")}
              </Heading>
              <Text color="text-secondary" fontSize="sm">
                {t("auth.loginSubtitle")}
              </Text>
            </VStack>

            {/* النموذج */}
            <form onSubmit={handleSubmit}>
              <Stack spacing={5}>
                <FormControl isRequired>
                  <FormLabel
                    fontSize="xs"
                    fontWeight="semibold"
                    letterSpacing="0.08em"
                    textTransform="uppercase"
                    color="text-secondary">
                    {t("auth.email")}
                  </FormLabel>
                  <InputGroup size="lg">
                    <InputLeftElement pointerEvents="none">
                      <Icon as={LuMail} color="text-muted" boxSize={4.5} />
                    </InputLeftElement>
                    <Input
                      type="email"
                      placeholder="admin@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      autoFocus
                      bg="bg-input"
                      borderRadius="lg"
                      _focusVisible={{
                        borderColor: "brand.500",
                        boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                      }}
                    />
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel
                    fontSize="xs"
                    fontWeight="semibold"
                    letterSpacing="0.08em"
                    textTransform="uppercase"
                    color="text-secondary">
                    {t("auth.password")}
                  </FormLabel>
                  <InputGroup size="lg">
                    <InputLeftElement pointerEvents="none">
                      <Icon as={LuLock} color="text-muted" boxSize={4.5} />
                    </InputLeftElement>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      bg="bg-input"
                      borderRadius="lg"
                      _focusVisible={{
                        borderColor: "brand.500",
                        boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                      }}
                    />
                    <InputRightElement h="full">
                      <IconButton
                        aria-label={
                          showPassword
                            ? t("auth.hidePassword")
                            : t("auth.showPassword")
                        }
                        icon={showPassword ? <LuEyeOff /> : <LuEye />}
                        variant="ghost"
                        size="sm"
                        color="text-muted"
                        onClick={() => setShowPassword((s) => !s)}
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <Button
                  type="submit"
                  size="lg"
                  w="100%"
                  mt={2}
                  bgGradient={`linear(to-r, ${NAVY_MID}, ${NAVY_LIGHT})`}
                  color="white"
                  _hover={{
                    bgGradient: `linear(to-r, ${NAVY}, ${NAVY_MID})`,
                    transform: "translateY(-1px)",
                    boxShadow: "lg",
                  }}
                  _active={{ transform: "translateY(0)" }}
                  isLoading={isSubmitting}
                  loadingText={t("auth.signingIn")}
                  isDisabled={!email || !password}
                  letterSpacing="0.05em"
                  fontWeight="semibold"
                  transition="all 0.2s">
                  {t("auth.signIn")}
                </Button>
              </Stack>
            </form>

            <Divider />

            {/* مؤشر الأمان */}
            <HStack
              spacing={2}
              justify="center"
              fontSize="2xs"
              color="text-muted"
              letterSpacing="0.05em">
              <Icon as={LuShield} boxSize={3} />
              <Text>محمي بتشفير TLS 1.3 · جميع المحاولات مسجلة</Text>
            </HStack>
          </VStack>
        </Box>
      </Flex>
    </Flex>
  );
}
