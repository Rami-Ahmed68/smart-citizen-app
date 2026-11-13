import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  LuBaby,
  LuContact,
  LuExternalLink,
  LuLayers,
  LuLayoutDashboard,
  LuMapPin,
  LuSearch,
  LuShield,
  LuUser,
  LuUserCheck,
  LuUserCog,
  LuX,
} from "react-icons/lu";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../auth/AuthContext";
import { dashboardAPI } from "../../api/dashboard.api";
import { useAppToast } from "../../components/common/AppToast";
import { GOVERNORATES, getLocationLabel } from "../../utils/citizenLabels";
import DashboardSkeleton from "./DashboardSkeleton";

function QuickNavCard({ icon, title, subtitle, onClick, color }) {
  return (
    <Box
      as="button"
      type="button"
      onClick={onClick}
      textAlign="start"
      w="full"
      bg="bg-card"
      borderWidth="1px"
      borderColor="border-color"
      rounded="md"
      p={4}
      transition="all 0.2s ease"
      _hover={{
        borderColor: color || "syria.green.mid",
        transform: "translateY(-2px)",
        shadow: "md",
      }}
      _active={{ transform: "translateY(0)" }}
      _focusVisible={{
        outline: "2px solid",
        outlineColor: "syria.green.mid",
        outlineOffset: "2px",
      }}
      cursor="pointer">
      <HStack spacing={3} align="center">
        <Flex
          align="center"
          justify="center"
          w={10}
          h={10}
          rounded="md"
          bg={color || "syria.green.mid"}
          color="syria.wheat.light"
          flexShrink={0}>
          <Icon as={icon} boxSize={5} />
        </Flex>
        <VStack align="start" spacing={0.5} flex="1" minW={0}>
          <Text
            fontSize="sm"
            fontWeight="bold"
            color="text-primary"
            noOfLines={1}>
            {title}
          </Text>
          <Text fontSize="2xs" color="text-muted" noOfLines={1}>
            {subtitle}
          </Text>
        </VStack>
        <Icon as={LuExternalLink} boxSize={3.5} color="text-muted" />
      </HStack>
    </Box>
  );
}

function StatCard({ icon, label, value, hint, color, isRTL }) {
  return (
    <Box
      bg="bg-card"
      borderWidth="1px"
      borderColor="border-color"
      rounded="md"
      p={5}
      position="relative"
      overflow="hidden"
      transition="all 0.25s ease"
      _hover={{ borderColor: color, shadow: "md" }}>
      <Box
        position="absolute"
        top={-3}
        insetInlineEnd={-3}
        opacity={0.05}
        color={color}
        pointerEvents="none">
        <Icon as={icon} boxSize={20} />
      </Box>
      <VStack align="start" spacing={2.5} position="relative">
        <HStack spacing={2} w="full">
          <Flex
            align="center"
            justify="center"
            w={8}
            h={8}
            rounded="md"
            bg={color}
            color="syria.wheat.light"
            flexShrink={0}>
            <Icon as={icon} boxSize={4} />
          </Flex>
          <Text
            fontSize="2xs"
            fontWeight="semibold"
            color="text-muted"
            textTransform="uppercase"
            letterSpacing="wider"
            noOfLines={1}>
            {label}
          </Text>
        </HStack>
        <Text
          fontSize="3xl"
          fontWeight="bold"
          color="text-primary"
          lineHeight="1"
          fontFamily="mono">
          {value}
        </Text>
        {hint && (
          <Text fontSize="2xs" color="text-muted" noOfLines={1}>
            {hint}
          </Text>
        )}
      </VStack>
    </Box>
  );
}

function GovernorateTile({ name, count, onClick, isRTL, t }) {
  return (
    <Box
      as="button"
      type="button"
      onClick={onClick}
      textAlign="start"
      w="full"
      bg="bg-card"
      borderWidth="1px"
      borderColor="border-color"
      rounded="md"
      p={3}
      transition="all 0.2s ease"
      _hover={{
        borderColor: "syria.green.mid",
        transform: "translateY(-1px)",
        shadow: "sm",
      }}
      _active={{ transform: "translateY(0)" }}
      _focusVisible={{
        outline: "2px solid",
        outlineColor: "syria.green.mid",
        outlineOffset: "2px",
      }}
      cursor="pointer">
      <VStack align="start" spacing={1.5}>
        <HStack spacing={1.5} w="full">
          <Icon as={LuMapPin} boxSize={3} color="syria.wheat.dark" />
          <Text
            fontSize="2xs"
            fontWeight="semibold"
            color="text-muted"
            noOfLines={1}
            flex="1">
            {getLocationLabel(name, t)}
          </Text>
        </HStack>
        <Text
          fontSize="xl"
          fontWeight="bold"
          color="text-primary"
          fontFamily="mono"
          noOfLines={1}>
          {count}
        </Text>
      </VStack>
    </Box>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { admin: currentAdmin } = useAuth();
  const appToast = useAppToast();

  const isRTL = i18n.language === "ar";
  const isSuper = currentAdmin?.role === "super";

  const [stats, setStats] = useState({
    totalCitizens: 0,
    males: 0,
    females: 0,
    totalFamilies: 0,
  });
  const [governorateCounts, setGovernorateCounts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [govSearch, setGovSearch] = useState("");

  const appToastRef = useRef(appToast);
  appToastRef.current = appToast;
  const tRef = useRef(t);
  tRef.current = t;

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await dashboardAPI.getStats();
      const data = response?.data || {};

      setStats({
        totalCitizens: data.totalCitizens || 0,
        males: data.males || 0,
        females: data.females || 0,
        totalFamilies: data.totalFamilies || 0,
      });

      setGovernorateCounts(data.byGovernorate || {});
    } catch (err) {
      appToastRef.current.error(err, tRef.current("dashboard.loadError"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const filteredGovernorates = useMemo(() => {
    const q = govSearch.trim().toLowerCase();
    if (!q) return GOVERNORATES;
    return GOVERNORATES.filter((gov) => {
      const label = getLocationLabel(gov, t).toLowerCase();
      return gov.toLowerCase().includes(q) || label.includes(q);
    });
  }, [govSearch, t]);

  const formatNumber = (n) =>
    new Intl.NumberFormat("en-US").format(Number(n) || 0);

  const goToCitizens = () => navigate("/citizens");
  const goToFamilies = () => navigate("/family");
  const goToAdmins = () => navigate("/admins");
  const goToCreateCitizen = () => navigate("/citizens/create");
  const goToGovernorate = () => navigate("/citizens");

  if (isLoading) {
    return <DashboardSkeleton isRTL={isRTL} />;
  }

  return (
    <Box w="full" py={1} dir={isRTL ? "rtl" : "ltr"}>
      <Flex
        direction={{ base: "column", md: "row" }}
        align={{ base: "flex-start", md: "center" }}
        justify="space-between"
        mb={5}
        pb={4}
        borderBottomWidth="1px"
        borderColor="border-color"
        gap={3}
        w="full">
        <HStack
          spacing={3}
          align="center"
          flex={{ base: "none", md: "1" }}
          minW={0}
          w={{ base: "full", md: "auto" }}>
          <Flex
            align="center"
            justify="center"
            w={12}
            h={12}
            rounded="md"
            bg="syria.green.mid"
            color="syria.wheat.light"
            flexShrink={0}
            shadow="sm">
            <Icon as={LuLayoutDashboard} boxSize={6} />
          </Flex>
          <VStack align="start" spacing={0.5} flex="1" minW={0}>
            <Heading
              size="lg"
              color="text-primary"
              fontWeight="bold"
              noOfLines={1}>
              {t("dashboard.pageTitle")}
            </Heading>
            <Text fontSize="sm" color="text-muted" noOfLines={1}>
              {t("dashboard.subtitle")}
            </Text>
          </VStack>
        </HStack>

        <HStack
          spacing={2}
          wrap="wrap"
          flexShrink={0}
          w={{ base: "full", md: "auto" }}
          justify={{ base: "flex-end", md: "flex-start" }}>
          <Button
            size="sm"
            variant="outline"
            colorScheme="gray"
            leftIcon={<Icon as={LuUserCheck} boxSize={3.5} />}
            rounded="md"
            onClick={goToCitizens}>
            {t("dashboard.quickNav.citizens")}
          </Button>
          <Button
            size="sm"
            bg="syria.green.mid"
            color="syria.wheat.light"
            leftIcon={<Icon as={LuUser} boxSize={3.5} />}
            rounded="md"
            fontWeight="semibold"
            _hover={{
              bg: "syria.green.light",
              transform: "translateY(-1px)",
              shadow: "md",
            }}
            _active={{ bg: "syria.green.dark", transform: "translateY(0)" }}
            transition="all 0.2s ease"
            onClick={goToCreateCitizen}>
            {t("dashboard.addCitizen")}
          </Button>
        </HStack>
      </Flex>

      <Text
        fontSize="2xs"
        fontWeight="bold"
        color="text-muted"
        textTransform="uppercase"
        letterSpacing="wider"
        mb={3}>
        {t("dashboard.sections.quickNav")}
      </Text>

      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={3} mb={6}>
        <QuickNavCard
          icon={LuContact}
          title={t("dashboard.quickNav.citizens")}
          subtitle={t("dashboard.quickNav.citizensHint")}
          onClick={goToCitizens}
          color="syria.green.mid"
        />
        <QuickNavCard
          icon={LuLayers}
          title={t("dashboard.quickNav.families")}
          subtitle={t("dashboard.quickNav.familiesHint")}
          onClick={goToFamilies}
          color="info.500"
        />
        {isSuper && (
          <QuickNavCard
            icon={LuShield}
            title={t("dashboard.quickNav.admins")}
            subtitle={t("dashboard.quickNav.adminsHint")}
            onClick={goToAdmins}
            color="syria.umber.mid"
          />
        )}
        <QuickNavCard
          icon={LuUserCog}
          title={t("dashboard.quickNav.profile")}
          subtitle={t("dashboard.quickNav.profileHint")}
          onClick={() => navigate(`/profile/${currentAdmin?._id || ""}`)}
          color="syria.wheat.dark"
        />
      </SimpleGrid>

      <Text
        fontSize="2xs"
        fontWeight="bold"
        color="text-muted"
        textTransform="uppercase"
        letterSpacing="wider"
        mb={3}>
        {t("dashboard.sections.stats")}
      </Text>

      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={3} mb={6}>
        <StatCard
          icon={LuUserCheck}
          label={t("dashboard.stats.totalCitizens")}
          value={formatNumber(stats.totalCitizens)}
          hint={t("dashboard.stats.totalCitizensHint")}
          color="syria.green.mid"
          isRTL={isRTL}
        />
        <StatCard
          icon={LuUser}
          label={t("dashboard.stats.males")}
          value={formatNumber(stats.males)}
          hint={t("dashboard.stats.malesHint")}
          color="info.500"
          isRTL={isRTL}
        />
        <StatCard
          icon={LuBaby}
          label={t("dashboard.stats.females")}
          value={formatNumber(stats.females)}
          hint={t("dashboard.stats.femalesHint")}
          color="syria.umber.mid"
          isRTL={isRTL}
        />
        <StatCard
          icon={LuLayers}
          label={t("dashboard.stats.totalFamilies")}
          value={formatNumber(stats.totalFamilies)}
          hint={t("dashboard.stats.totalFamiliesHint")}
          color="syria.wheat.dark"
          isRTL={isRTL}
        />
      </SimpleGrid>

      <Box
        bg="bg-card"
        borderWidth="1px"
        borderColor="border-color"
        rounded="md"
        p={4}>
        <Flex
          justify="space-between"
          align="center"
          gap={3}
          mb={4}
          pb={3}
          borderBottomWidth="1px"
          borderColor="border-color"
          wrap="wrap">
          <HStack spacing={2}>
            <Flex
              align="center"
              justify="center"
              w={8}
              h={8}
              rounded="md"
              bg="syria.wheat.dark"
              color="syria.wheat.light"
              flexShrink={0}>
              <Icon as={LuMapPin} boxSize={4} />
            </Flex>
            <VStack align="start" spacing={0}>
              <Text fontSize="sm" fontWeight="bold" color="text-primary">
                {t("dashboard.governorates.title")}
              </Text>
              <Text fontSize="2xs" color="text-muted">
                {t("dashboard.governorates.subtitle")}
              </Text>
            </VStack>
          </HStack>

          <InputGroup size="sm" maxW="260px" flexShrink={0}>
            <InputLeftElement pointerEvents="none">
              <Icon as={LuSearch} color="text-muted" boxSize={3.5} />
            </InputLeftElement>
            <Input
              value={govSearch}
              onChange={(e) => setGovSearch(e.target.value)}
              placeholder={t("dashboard.governorates.searchPlaceholder")}
              rounded="sm"
              bg="bg-input"
              borderColor="border-color"
              fontSize="xs"
              _hover={{ borderColor: "syria.green.light" }}
              _focus={{ borderColor: "syria.green.mid", boxShadow: "none" }}
            />
            {govSearch && (
              <InputRightElement>
                <Icon
                  as={LuX}
                  boxSize={3.5}
                  color="text-muted"
                  cursor="pointer"
                  onClick={() => setGovSearch("")}
                />
              </InputRightElement>
            )}
          </InputGroup>
        </Flex>

        {filteredGovernorates.length === 0 ? (
          <Flex justify="center" align="center" py={8}>
            <Text fontSize="sm" color="text-muted" fontStyle="italic">
              {t("dashboard.governorates.noResults")}
            </Text>
          </Flex>
        ) : (
          <SimpleGrid
            columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 7 }}
            spacing={3}>
            {filteredGovernorates.map((gov) => (
              <GovernorateTile
                key={gov}
                name={gov}
                count={formatNumber(governorateCounts[gov] || 0)}
                onClick={goToGovernorate}
                isRTL={isRTL}
                t={t}
              />
            ))}
          </SimpleGrid>
        )}
      </Box>
    </Box>
  );
}
