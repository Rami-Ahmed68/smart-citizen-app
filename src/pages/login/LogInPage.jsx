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
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Stack,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { LuMail, LuLock, LuEye, LuEyeOff } from "react-icons/lu";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../auth/AuthContext";
import { getErrorMessage } from "../../api/axios";
import { getTodayISO } from "../../utils/date";
import logo from "../../assets/new_syrian_logo.png";

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
    <Flex minH="100vh">
      <Box
        flex="1"
        display={{ base: "none", lg: "flex" }}
        bg="syria.green.dark"
        color="white"
        position="relative"
        overflow="hidden"
        alignItems="center"
        justifyContent="center"
        p={12}>
        <Box
          position="absolute"
          inset="0"
          opacity="0.04"
          backgroundImage="repeating-linear-gradient(45deg, #ffffff 0, #ffffff 1px, transparent 1px, transparent 24px)"
          pointerEvents="none"
        />

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
          <Box position="relative">
            <Box
              w="140px"
              h="140px"
              borderRadius="full"
              border="2px solid"
              borderColor="syria.wheat.dark"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg="whiteAlpha.100"
              backdropFilter="blur(12px)"
              p={6}>
              <Image
                src={logo}
                alt="Syrian Arab Republic Emblem"
                w="100%"
                h="100%"
                objectFit="contain"
                filter="drop-shadow(0 2px 8px rgba(0,0,0,0.35))"
              />
            </Box>
            <Box
              position="absolute"
              inset="-14px"
              borderRadius="full"
              border="1px solid"
              borderColor="syria.wheat.dark"
              opacity={0.4}
            />
          </Box>

          <HStack spacing={3} w="100%" justify="center">
            <Box
              h="1px"
              flex="1"
              bgGradient="linear(to-r, transparent, syria.wheat.mid)"
            />
            <Text
              fontSize="2xs"
              letterSpacing="0.4em"
              color="syria.wheat.mid"
              textTransform="uppercase"
              fontWeight="semibold">
              Secure Portal
            </Text>
            <Box
              h="1px"
              flex="1"
              bgGradient="linear(to-l, transparent, syria.wheat.mid)"
            />
          </HStack>

          <VStack spacing={3}>
            <Text
              fontSize="4xl"
              fontWeight="bold"
              letterSpacing="0.12em"
              fontFamily="Georgia, 'Times New Roman', serif"
              textTransform="uppercase"
              lineHeight="shorter">
              {t("auth.brandName")}
            </Text>
            <Text
              fontSize="xs"
              letterSpacing="0.3em"
              color="whiteAlpha.700"
              textTransform="uppercase">
              {t("auth.brandTagline")}
            </Text>
          </VStack>

          <Text
            fontSize="sm"
            color="whiteAlpha.800"
            lineHeight="tall"
            maxW="360px"
            fontWeight="300">
            {t("auth.heroDescription")}
          </Text>

          <VStack spacing={2}>
            <Divider borderColor="whiteAlpha.200" w="60px" />
            <Text
              fontSize="2xs"
              color="whiteAlpha.500"
              letterSpacing="0.15em"
              textTransform="uppercase">
              {t("auth.copyright")} {getTodayISO()}
            </Text>
          </VStack>
        </VStack>
      </Box>

      <Flex flex="1" align="center" justify="center" p={{ base: 6, md: 12 }}>
        <Box w="100%" maxW="420px">
          <VStack spacing={8} align="stretch">
            <VStack
              spacing={3}
              display={{ base: "flex", lg: "none" }}
              align="center"
              pt={4}>
              <Box
                w="96px"
                h="96px"
                borderRadius="full"
                border="2px solid"
                borderColor="syria.green.mid"
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg="syria.green.dark"
                p={4}
                _dark={{
                  bg: "whiteAlpha.100",
                  borderColor: "syria.wheat.mid",
                }}>
                <Image
                  src={logo}
                  alt="Syrian Arab Republic Emblem"
                  w="100%"
                  h="100%"
                  objectFit="contain"
                />
              </Box>
              <Text
                fontSize="xl"
                fontWeight="bold"
                letterSpacing="0.15em"
                textTransform="uppercase"
                fontFamily="Georgia, 'Times New Roman', serif"
                color="text-primary">
                {t("auth.brandName")}
              </Text>
              <Text
                fontSize="2xs"
                letterSpacing="0.25em"
                color="text-muted"
                textTransform="uppercase">
                {t("auth.brandTagline")}
              </Text>
            </VStack>

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
                      <Icon as={LuMail} color="text-muted" boxSize={5} />
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
                      fontSize="md"
                      h="52px"
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
                      <Icon as={LuLock} color="text-muted" boxSize={5} />
                    </InputLeftElement>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      bg="bg-input"
                      borderRadius="lg"
                      fontSize="md"
                      h="52px"
                      _focusVisible={{
                        borderColor: "brand.500",
                        boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                      }}
                    />
                    <InputRightElement h="full" w="52px">
                      <IconButton
                        aria-label={
                          showPassword
                            ? t("auth.hidePassword")
                            : t("auth.showPassword")
                        }
                        icon={showPassword ? <LuEyeOff /> : <LuEye />}
                        variant="ghost"
                        size="md"
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
                  h="52px"
                  bg="syria.green.mid"
                  color="white"
                  _hover={{
                    bg: "syria.green.dark",
                    transform: "translateY(-1px)",
                    boxShadow: "lg",
                  }}
                  _active={{
                    bg: "syria.green.dark",
                    transform: "translateY(0)",
                  }}
                  isLoading={isSubmitting}
                  loadingText={t("auth.signingIn")}
                  isDisabled={!email || !password}
                  letterSpacing="0.05em"
                  fontWeight="semibold"
                  fontSize="md"
                  transition="all 0.2s">
                  {t("auth.signIn")}
                </Button>
              </Stack>
            </form>

            <Divider borderColor="border-color" />

            <HStack
              spacing={2}
              justify="center"
              fontSize="2xs"
              color="text-muted"
              letterSpacing="0.05em">
              <Text
                fontSize="2xs"
                color="whiteAlpha.500"
                letterSpacing="0.15em"
                textTransform="uppercase">
                {t("auth.copyright")} {getTodayISO()}
              </Text>
            </HStack>
          </VStack>
        </Box>
      </Flex>
    </Flex>
  );
}
