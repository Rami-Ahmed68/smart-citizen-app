// src/pages/notFound/NotFoundPage.jsx
import {
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Icon,
  Text,
  VStack,
  Divider,
} from "@chakra-ui/react";
import { LuArrowLeft, LuArrowRight, LuSearchX } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function NotFoundPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const isRTL = i18n.language === "ar";
  const homeIcon = isRTL ? LuArrowLeft : LuArrowRight;

  return (
    <Box
      w="full"
      minH="80vh"
      display="flex"
      flexDir="column"
      bg="bg-body"
      rounded="md"
      overflow="hidden"
      dir={isRTL ? "rtl" : "ltr"}>
      <Box h="3px" bg="syria.green.mid" flexShrink={0} />

      <Flex flex="1" direction={{ base: "column", lg: "row" }} minH="0">
        <Flex
          flex={{ base: "none", lg: "0 0 42%" }}
          bg="syria.green.dark"
          color="syria.wheat.light"
          position="relative"
          overflow="hidden"
          align="center"
          justify="center"
          py={{ base: 12, md: 16, lg: 0 }}
          minH={{ base: "260px", lg: "auto" }}>
          <Box
            position="absolute"
            inset={0}
            pointerEvents="none"
            opacity={0.04}
            bgImage="linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)"
            bgSize="40px 40px"
          />
          <Box
            position="absolute"
            inset={0}
            pointerEvents="none"
            bg="radial-gradient(circle at center, rgba(185,167,121,0.16), transparent 65%)"
          />

          <VStack spacing={3} position="relative" textAlign="center" px={6}>
            <Flex
              w={14}
              h={14}
              rounded="md"
              align="center"
              justify="center"
              bg="syria.green.mid"
              borderWidth="1px"
              borderColor="syria.wheat.dark"
              mb={1}>
              <Icon as={LuSearchX} boxSize={7} />
            </Flex>
            <Text
              fontSize={{ base: "7xl", md: "8xl", lg: "9xl" }}
              fontWeight="900"
              lineHeight="1"
              letterSpacing="tight"
              color="syria.wheat.light">
              404
            </Text>
            <Text
              fontSize="2xs"
              fontWeight="bold"
              letterSpacing="0.35em"
              textTransform="uppercase"
              color="syria.wheat.mid"
              ps="0.35em">
              {t("notFound.codeLabel")}
            </Text>
          </VStack>
        </Flex>

        <Flex
          flex="1"
          align="center"
          justify="center"
          px={{ base: 6, md: 10, lg: 12 }}
          py={{ base: 10, md: 12 }}>
          <VStack align="stretch" spacing={5} maxW="520px" w="full">
            <HStack spacing={3}>
              <Flex
                w={10}
                h={10}
                rounded="md"
                bg="syria.green.mid"
                color="syria.wheat.light"
                align="center"
                justify="center"
                flexShrink={0}>
                <Icon as={LuSearchX} boxSize={5} />
              </Flex>
              <VStack align="start" spacing={0.5} minW={0}>
                <Text
                  fontSize="2xs"
                  fontWeight="bold"
                  letterSpacing="0.2em"
                  color="text-muted"
                  textTransform="uppercase">
                  {t("notFound.headerTitle")}
                </Text>
                <Text fontSize="2xs" color="text-muted">
                  {t("notFound.headerSubtitle")}
                </Text>
              </VStack>
            </HStack>

            <Divider borderColor="border-color" />

            <Heading
              size="lg"
              color="text-primary"
              fontWeight="bold"
              lineHeight="short">
              {t("notFound.title")}
            </Heading>

            <Text fontSize="sm" color="text-secondary" lineHeight="tall">
              {t("notFound.description")}
            </Text>

            <Box
              bg="bg-card"
              borderWidth="1px"
              borderColor="border-color"
              borderInlineStartWidth="3px"
              borderInlineStartColor="syria.green.mid"
              rounded="md"
              p={4}>
              <Text fontSize="xs" color="text-secondary" lineHeight="tall">
                {t("notFound.hint")}
              </Text>
            </Box>

            <Flex
              gap={2}
              pt={1}
              direction={{ base: "column-reverse", sm: "row" }}>
              <Button
                size="sm"
                variant="outline"
                colorScheme="gray"
                rounded="md"
                onClick={() => navigate(-1)}
                minW={{ base: "full", sm: "auto" }}
                flex={{ sm: "1" }}>
                {t("notFound.back")}
              </Button>
              <Button
                size="sm"
                rounded="md"
                bg="syria.green.mid"
                color="syria.wheat.light"
                _hover={{ bg: "syria.green.light" }}
                _active={{ bg: "syria.green.dark" }}
                leftIcon={<Icon as={homeIcon} boxSize={3.5} />}
                onClick={() => navigate("/")}
                minW={{ base: "full", sm: "auto" }}
                flex={{ sm: "1" }}
                fontWeight="semibold">
                {t("notFound.home")}
              </Button>
            </Flex>
          </VStack>
        </Flex>
      </Flex>

      <Box
        borderTopWidth="1px"
        borderColor="border-color"
        bg="bg-card"
        px={{ base: 5, md: 8 }}
        py={3}
        flexShrink={0}>
        <Text textAlign="center" fontSize="2xs" color="text-muted">
          {t("notFound.footer")}
        </Text>
      </Box>
    </Box>
  );
}
