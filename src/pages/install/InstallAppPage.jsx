// src/pages/install/InstallAppPage.jsx
import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Icon,
  SimpleGrid,
  Text,
  VStack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  List,
  ListItem,
  Divider,
} from "@chakra-ui/react";
import {
  LuDownload,
  LuSmartphone,
  LuMonitor,
  LuShieldCheck,
  LuZap,
  LuWifiOff,
  LuBellRing,
  LuInfo,
  LuCircleCheck,
} from "react-icons/lu";
import { useTranslation } from "react-i18next";

const FEATURE_KEYS = [
  { key: "offline", icon: LuWifiOff },
  { key: "fast", icon: LuZap },
  { key: "secure", icon: LuShieldCheck },
  { key: "notifications", icon: LuBellRing },
];

const PLATFORMS = ["ios", "android", "desktop"];

export default function InstallAppPage() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const instructionsRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const onInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", onInstalled);

    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(display-mode: standalone)").matches
    ) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isInstalled) return;

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice?.outcome === "accepted") {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
      return;
    }

    instructionsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const buttonLabel = isInstalled
    ? t("install.hero.installed")
    : deferredPrompt
      ? t("install.hero.installButton")
      : t("install.hero.installUnavailable");

  return (
    <Box w="full" dir={isRTL ? "rtl" : "ltr"} maxW="1100px" mx="auto">
      {/* ==================== PAGE HEADER ==================== */}
      <Box mb={8} pb={5} borderBottomWidth="1px" borderColor="border-color">
        <HStack spacing={3} mb={2}>
          <Flex
            w={10}
            h={10}
            rounded="md"
            align="center"
            justify="center"
            bg="syria.green.mid"
            color="syria.wheat.light"
            flexShrink={0}>
            <Icon as={LuSmartphone} boxSize={5} />
          </Flex>
          <VStack align="start" spacing={0}>
            <Heading size="md" color="text-primary" fontWeight="bold">
              {t("install.hero.title")}
            </Heading>
            <Text fontSize="xs" color="text-muted">
              {t("install.hero.subtitle")}
            </Text>
          </VStack>
        </HStack>
      </Box>

      {/* ==================== INSTALL CARD (الزر الرئيسي) ==================== */}
      <Box
        bg="bg-card"
        borderWidth="1px"
        borderColor="border-color"
        rounded="md"
        p={{ base: 5, md: 6 }}
        mb={6}>
        <Flex
          direction={{ base: "column", md: "row" }}
          align={{ base: "stretch", md: "center" }}
          justify="space-between"
          gap={4}>
          <HStack spacing={3} align="flex-start" flex="1">
            <Flex
              w={10}
              h={10}
              rounded="md"
              bg="syria.green.mid"
              color="syria.wheat.light"
              align="center"
              justify="center"
              flexShrink={0}>
              <Icon as={LuDownload} boxSize={5} />
            </Flex>
            <VStack align="start" spacing={1}>
              <Text fontWeight="bold" fontSize="sm" color="text-primary">
                {isInstalled
                  ? t("install.hero.installedBadge")
                  : t("install.hero.installPromptTitle")}
              </Text>
              <Text fontSize="xs" color="text-muted" lineHeight="tall">
                {isInstalled
                  ? t("install.hero.installedHint")
                  : t("install.hero.installPromptHint")}
              </Text>
            </VStack>
          </HStack>

          <Button
            size="md"
            onClick={handleInstallClick}
            isDisabled={isInstalled}
            leftIcon={<LuDownload size={16} />}
            bg="syria.green.mid"
            color="syria.wheat.light"
            _hover={{ bg: "syria.green.light" }}
            _active={{ bg: "syria.green.dark" }}
            _disabled={{
              opacity: 0.6,
              cursor: "not-allowed",
              _hover: { bg: "syria.green.mid" },
            }}
            rounded="md"
            fontWeight="semibold"
            px={6}
            flexShrink={0}>
            {buttonLabel}
          </Button>
        </Flex>
      </Box>

      {/* ==================== FEATURES ==================== */}
      <Box mb={6}>
        <Heading size="sm" mb={4} color="text-primary" fontWeight="bold">
          {t("install.features.title")}
        </Heading>

        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={3}>
          {FEATURE_KEYS.map(({ key, icon }) => (
            <Box
              key={key}
              bg="bg-card"
              borderWidth="1px"
              borderColor="border-color"
              rounded="md"
              p={4}>
              <Flex
                w={8}
                h={8}
                rounded="md"
                align="center"
                justify="center"
                bg="bg-input"
                color="syria.green.mid"
                mb={3}>
                <Icon as={icon} boxSize={4} />
              </Flex>
              <Text
                fontWeight="semibold"
                fontSize="xs"
                color="text-primary"
                mb={1}>
                {t(`install.features.${key}.title`)}
              </Text>
              <Text fontSize="2xs" color="text-muted" lineHeight="tall">
                {t(`install.features.${key}.desc`)}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      {/* ==================== PLATFORM INSTRUCTIONS ==================== */}
      <Box
        ref={instructionsRef}
        bg="bg-card"
        borderWidth="1px"
        borderColor="border-color"
        rounded="md"
        p={{ base: 4, md: 5 }}
        mb={6}>
        <HStack spacing={2} mb={4}>
          <Icon as={LuInfo} boxSize={4} color="text-muted" />
          <Heading size="sm" color="text-primary" fontWeight="bold">
            {t("install.platforms.title")}
          </Heading>
        </HStack>

        <Tabs variant="line" colorScheme="green" isFitted>
          <TabList mb={4} borderColor="border-color">
            {PLATFORMS.map((p) => (
              <Tab
                key={p}
                fontSize="xs"
                fontWeight="medium"
                color="text-secondary"
                _selected={{ color: "syria.green.mid", fontWeight: "bold" }}
                pb={3}>
                <HStack spacing={2}>
                  <Icon
                    as={p === "desktop" ? LuMonitor : LuSmartphone}
                    boxSize={3.5}
                  />
                  <Text>{t(`install.platforms.${p}.name`)}</Text>
                </HStack>
              </Tab>
            ))}
          </TabList>

          <TabPanels>
            {PLATFORMS.map((platform) => (
              <TabPanel key={platform} px={0} pt={2}>
                <List spacing={2.5}>
                  {[1, 2, 3, 4].map((n) => (
                    <ListItem
                      key={n}
                      display="flex"
                      alignItems="flex-start"
                      gap={3}>
                      <Flex
                        w={6}
                        h={6}
                        rounded="full"
                        bg="bg-input"
                        color="text-secondary"
                        align="center"
                        justify="center"
                        flexShrink={0}
                        fontWeight="bold"
                        fontSize="2xs"
                        mt={0.5}>
                        {n}
                      </Flex>
                      <Text
                        fontSize="xs"
                        color="text-secondary"
                        lineHeight="tall">
                        {t(`install.platforms.${platform}.step${n}`)}
                      </Text>
                    </ListItem>
                  ))}
                </List>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Box>

      {/* ==================== NOTE ==================== */}
      <Box
        p={4}
        rounded="md"
        bg="bg-input"
        borderWidth="1px"
        borderColor="border-color">
        <HStack spacing={3} align="flex-start">
          <Icon
            as={LuCircleCheck}
            boxSize={4}
            color="text-muted"
            mt={0.5}
            flexShrink={0}
          />
          <Text fontSize="2xs" color="text-muted" lineHeight="tall">
            {t("install.note")}
          </Text>
        </HStack>
      </Box>
    </Box>
  );
}
