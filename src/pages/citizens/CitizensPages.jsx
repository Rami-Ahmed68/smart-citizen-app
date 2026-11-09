// src/pages/citizen/CitizensPage.jsx
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Divider,
  Flex,
  HStack,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Select,
  SimpleGrid,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  LuRefreshCw,
  LuUserPlus,
  LuChevronLeft,
  LuChevronRight,
  LuContact,
  LuSlidersHorizontal,
  LuX,
  LuCalendar,
  LuGlobe,
  LuSearch,
  LuEye,
  LuLock,
} from "react-icons/lu";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../auth/AuthContext";
import { citizensAPI } from "../../api/citizens.api";
import { useAppToast } from "../../components/common/AppToast";
import CitizenCard from "../../features/citizen/components/CitizenCard";
import { COUNTRIES } from "../../utils/countries";
import {
  GOVERNORATES,
  RELIGIONS,
  getLocationLabel,
  getReligionLabel,
  getCountryLabel,
} from "../../utils/citizenLabels";

const getTodayISO = () => new Date().toISOString().split("T")[0];

function EmptyState({ isFiltering, onAddClick, canCreate }) {
  const { t } = useTranslation();
  return (
    <Box
      bg="bg-card"
      borderWidth="1px"
      borderColor="border-color"
      rounded="md"
      py={12}
      px={6}
      textAlign="center">
      <Flex
        align="center"
        justify="center"
        w={16}
        h={16}
        rounded="md"
        bgGradient="linear(135deg, syria.green.mid 0%, syria.green.light 100%)"
        color="white"
        mx="auto"
        mb={4}
        shadow="md"
        position="relative">
        <Icon as={LuContact} boxSize={8} />
        <Box
          position="absolute"
          top={-1.5}
          insetInlineEnd={-1.5}
          w={4}
          h={4}
          rounded="full"
          bg="syria.wheat.mid"
          borderWidth="2px"
          borderColor="bg-card"
        />
      </Flex>
      <Heading size="sm" color="text-primary" mb={2}>
        {isFiltering
          ? t("citizens.emptyFilterTitle")
          : t("citizens.emptyTitle")}
      </Heading>
      <Text fontSize="sm" color="text-muted" mb={5}>
        {isFiltering ? t("citizens.emptyFilterHint") : t("citizens.emptyHint")}
      </Text>
      {!isFiltering && canCreate && (
        <Button
          size="sm"
          leftIcon={<LuUserPlus size={14} />}
          onClick={onAddClick}
          rounded="md"
          sx={{
            bg: "syria.green.mid",
            color: "white",
            _hover: { bg: "syria.green.light" },
            _active: { bg: "syria.green.dark" },
            _dark: {
              bg: "syria.green.mid",
              color: "white",
              _hover: { bg: "syria.green.light" },
              _active: { bg: "syria.green.dark" },
            },
          }}>
          {t("citizens.addNew")}
        </Button>
      )}
    </Box>
  );
}

export default function CitizensPage() {
  const { t, i18n } = useTranslation();
  const { admin } = useAuth();
  const appToast = useAppToast();
  const navigate = useNavigate();
  const isRTL = i18n.language === "ar";
  const lang = i18n.language === "ar" ? "ar" : "en";

  const userRole = admin?.role;
  const userPermissions = admin?.permissions || [];
  const isSuper = userRole === "super";
  const hasReadPermission = isSuper || userPermissions.includes("read");
  const canCreate = isSuper || userPermissions.includes("create");

  const [citizens, setCitizens] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    pages: 1,
    hasNext: false,
    hasPrev: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [targetIdFilter, setTargetIdFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [maritalFilter, setMaritalFilter] = useState("");
  const [religionFilter, setReligionFilter] = useState("");
  const [citizenshipFilter, setCitizenshipFilter] = useState("");
  const [nationalityFilter, setNationalityFilter] = useState("");
  const [birthDateFilter, setBirthDateFilter] = useState("");
  const [page, setPage] = useState(1);
  const [searchTrigger, setSearchTrigger] = useState(0);

  const appToastRef = useRef(appToast);
  appToastRef.current = appToast;
  const tRef = useRef(t);
  tRef.current = t;

  const fetchCitizens = useCallback(
    async (mode = "initial") => {
      if (mode === "initial") setIsLoading(true);
      if (mode === "refresh") setIsRefreshing(true);

      try {
        const params = {
          page,
          limit: pagination.limit,
        };

        if (targetIdFilter.trim()) params.target_id = targetIdFilter.trim();
        if (locationFilter) params.location = locationFilter;
        if (genderFilter) params.gender = genderFilter;
        if (maritalFilter) params.marital_status = maritalFilter;
        if (citizenshipFilter) params.citizenship_type = citizenshipFilter;
        if (religionFilter) params.religion = religionFilter;
        if (nationalityFilter) {
          params.original_nationality = nationalityFilter;
        }
        if (birthDateFilter) {
          params.birth_date_from = birthDateFilter;
          params.birth_date_to = birthDateFilter;
        }

        const res = await citizensAPI.getAll(params);
        const list = res?.data ?? [];
        const pg = res?.pagination ?? {};

        setCitizens(Array.isArray(list) ? list : []);
        setPagination((prev) => ({
          total: pg.total ?? list.length,
          page: pg.page ?? page,
          limit: pg.limit ?? prev.limit,
          pages: pg.pages ?? 1,
          hasNext: pg.hasNext ?? false,
          hasPrev: pg.hasPrev ?? false,
        }));
      } catch (err) {
        if (mode !== "refresh") {
          appToastRef.current.error(err, tRef.current("citizens.errorLoad"));
          setCitizens([]);
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [
      page,
      pagination.limit,
      targetIdFilter,
      locationFilter,
      genderFilter,
      maritalFilter,
      citizenshipFilter,
      religionFilter,
      nationalityFilter,
      birthDateFilter,
    ],
  );

  useEffect(() => {
    fetchCitizens("initial");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchTrigger]);

  const handleSearch = () => {
    setPage(1);
    setSearchTrigger((t) => t + 1);
  };

  const handleRefresh = () => fetchCitizens("refresh");

  const handleClearFilters = () => {
    setTargetIdFilter("");
    setLocationFilter("");
    setGenderFilter("");
    setMaritalFilter("");
    setCitizenshipFilter("");
    setReligionFilter("");
    setNationalityFilter("");
    setBirthDateFilter("");
    setPage(1);
    setSearchTrigger((t) => t + 1);
  };

  const filterCount = [
    targetIdFilter.trim(),
    locationFilter,
    genderFilter,
    maritalFilter,
    citizenshipFilter,
    religionFilter,
    nationalityFilter,
    birthDateFilter,
  ].filter(Boolean).length;

  const isFiltering = filterCount > 0;
  const today = getTodayISO();

  return (
    <Box w="full" py={1} dir={isRTL ? "rtl" : "ltr"}>
      <Flex
        align={{ base: "start", md: "center" }}
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        gap={4}
        mb={6}
        pb={5}
        borderBottomWidth="1px"
        borderColor="border-color">
        <HStack spacing={4} align="center" flex="1" minW={0}>
          <Box position="relative" flexShrink={0}>
            <Flex
              align="center"
              justify="center"
              w={12}
              h={12}
              rounded="md"
              bgGradient="linear(135deg, syria.green.mid 0%, syria.green.light 100%)"
              color="white"
              shadow="md">
              <Icon as={LuContact} boxSize={6} />
            </Flex>
          </Box>

          <VStack align="start" spacing={1.5} minW={0} flex="1">
            <Heading
              size="lg"
              color="text-primary"
              fontWeight="bold"
              letterSpacing="tight"
              noOfLines={1}>
              {t("citizens.pageTitle")}
            </Heading>
            <HStack spacing={2}>
              <Text fontSize="xs" color="text-muted" noOfLines={1}>
                {t("citizens.pageSubtitle")}
              </Text>
            </HStack>
          </VStack>

          <Badge
            colorScheme={hasReadPermission ? "success" : "error"}
            variant="subtle"
            fontSize="2xs"
            rounded="md"
            px={2.5}
            py={1}
            textTransform="none"
            fontWeight="medium"
            display="inline-flex"
            alignItems="center"
            gap={1.5}
            flexShrink={0}
            whiteSpace="nowrap">
            <Icon as={hasReadPermission ? LuEye : LuLock} boxSize={3} />
            {hasReadPermission
              ? t("citizens.readAccess")
              : t("citizens.noReadAccess")}
          </Badge>
        </HStack>

        {canCreate && (
          <Button
            size="sm"
            leftIcon={<LuUserPlus size={14} />}
            onClick={() => navigate("/citizens/create")}
            rounded="md"
            shadow="sm"
            flexShrink={0}
            sx={{
              bg: "syria.green.mid",
              color: "white",
              _hover: { bg: "syria.green.light", shadow: "md" },
              _active: { bg: "syria.green.dark" },
              _dark: {
                bg: "syria.green.mid",
                color: "white",
                _hover: { bg: "syria.green.light" },
                _active: { bg: "syria.green.dark" },
              },
            }}>
            {t("citizens.addNew")}
          </Button>
        )}
      </Flex>

      <Box
        bg="bg-card"
        borderWidth="1px"
        borderColor="border-color"
        rounded="md"
        p={{ base: 3, md: 4 }}
        mb={5}
        shadow="sm">
        <HStack
          spacing={3}
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
            bg="syria.wheat.dark"
            color="white"
            flexShrink={0}
            shadow="sm">
            <Icon as={LuSlidersHorizontal} boxSize={4} />
          </Flex>
          <Text fontSize="sm" fontWeight="bold" color="text-primary" flex="1">
            {t("citizens.filtersTitle")}
          </Text>
          {isFiltering && (
            <Badge
              colorScheme="orange"
              variant="subtle"
              fontSize="2xs"
              rounded="sm"
              px={2}
              py={0.5}
              textTransform="none"
              fontWeight="medium">
              {filterCount} {t("citizens.activeFilters")}
            </Badge>
          )}
        </HStack>

        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 5 }}
          spacing={3}
          alignItems="end">
          <Select
            size="sm"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            rounded="sm"
            borderColor="border-color"
            bg="bg-input"
            _hover={{ borderColor: "syria.green.light" }}
            _focus={{ borderColor: "syria.green.mid", boxShadow: "none" }}
            placeholder={t("citizens.filterLocation")}>
            {GOVERNORATES.map((gov) => (
              <option key={gov} value={gov}>
                {getLocationLabel(gov, t)}
              </option>
            ))}
          </Select>

          <Select
            size="sm"
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            rounded="sm"
            borderColor="border-color"
            bg="bg-input"
            _hover={{ borderColor: "syria.green.light" }}
            _focus={{ borderColor: "syria.green.mid", boxShadow: "none" }}
            placeholder={t("citizens.filterGender")}>
            <option value="male">{t("citizens.genderMale")}</option>
            <option value="female">{t("citizens.genderFemale")}</option>
          </Select>

          <Select
            size="sm"
            value={maritalFilter}
            onChange={(e) => setMaritalFilter(e.target.value)}
            rounded="sm"
            borderColor="border-color"
            bg="bg-input"
            _hover={{ borderColor: "syria.green.light" }}
            _focus={{ borderColor: "syria.green.mid", boxShadow: "none" }}
            placeholder={t("citizens.filterMaritalStatus")}>
            <option value="Single">{t("citizens.maritalSingleMale")}</option>
            <option value="Married">{t("citizens.maritalMarriedMale")}</option>
            <option value="Divorced">
              {t("citizens.maritalDivorcedMale")}
            </option>
            <option value="Widowed">{t("citizens.maritalWidowedMale")}</option>
          </Select>

          <Select
            size="sm"
            value={religionFilter}
            onChange={(e) => setReligionFilter(e.target.value)}
            rounded="sm"
            borderColor="border-color"
            bg="bg-input"
            _hover={{ borderColor: "syria.green.light" }}
            _focus={{ borderColor: "syria.green.mid", boxShadow: "none" }}
            placeholder={t("citizens.filterReligion")}>
            {RELIGIONS.map((rel) => (
              <option key={rel} value={rel}>
                {getReligionLabel(rel, t)}
              </option>
            ))}
          </Select>

          <Select
            size="sm"
            value={citizenshipFilter}
            onChange={(e) => setCitizenshipFilter(e.target.value)}
            rounded="sm"
            borderColor="border-color"
            bg="bg-input"
            _hover={{ borderColor: "syria.green.light" }}
            _focus={{ borderColor: "syria.green.mid", boxShadow: "none" }}
            placeholder={t("citizens.filterCitizenship")}>
            <option value="by_birth">{t("citizens.citizenshipByBirth")}</option>
            <option value="naturalized">
              {t("citizens.citizenshipNaturalized")}
            </option>
          </Select>
        </SimpleGrid>

        <HStack my={4}>
          <Divider flex="1" borderColor="border-color" />
          <HStack spacing={1.5} px={3}>
            <Icon as={LuGlobe} boxSize={3} color="syria.wheat.dark" />
            <Text
              fontSize="2xs"
              color="text-muted"
              fontWeight="semibold"
              textTransform="uppercase"
              letterSpacing="wider">
              {t("citizens.advancedFilters")}
            </Text>
          </HStack>
          <Divider flex="1" borderColor="border-color" />
        </HStack>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3} alignItems="end">
          <Box>
            <Text
              fontSize="2xs"
              color="text-muted"
              fontWeight="semibold"
              mb={1}
              textTransform="uppercase"
              letterSpacing="wider">
              {t("citizens.filterCitizenId")}
            </Text>
            <InputGroup size="sm">
              {isRTL ? (
                <InputRightElement pointerEvents="none">
                  <Icon as={LuSearch} color="syria.green.mid" boxSize={4} />
                </InputRightElement>
              ) : (
                <InputLeftElement pointerEvents="none">
                  <Icon as={LuSearch} color="syria.green.mid" boxSize={4} />
                </InputLeftElement>
              )}
              <Input
                type="text"
                value={targetIdFilter}
                onChange={(e) => setTargetIdFilter(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                maxLength={24}
                placeholder={t("citizens.filterCitizenIdPlaceholder")}
                textAlign={isRTL ? "right" : "left"}
                pl={isRTL ? 3 : undefined}
                pr={isRTL ? 10 : undefined}
                rounded="sm"
                borderColor="border-color"
                bg="bg-input"
                transition="none"
                _hover={{ borderColor: "border-color" }}
                _focus={{
                  borderColor: "syria.green.mid",
                  boxShadow: "0 0 0 1px var(--chakra-colors-syria-green-mid)",
                }}
              />
            </InputGroup>
          </Box>

          <Select
            size="sm"
            value={nationalityFilter}
            onChange={(e) => setNationalityFilter(e.target.value)}
            rounded="sm"
            borderColor="border-color"
            bg="bg-input"
            _hover={{ borderColor: "syria.green.light" }}
            _focus={{ borderColor: "syria.green.mid", boxShadow: "none" }}
            placeholder={t("citizens.filterOriginalNationality")}>
            {COUNTRIES.map((country) => (
              <option key={country} value={country}>
                {getCountryLabel(country, lang)}
              </option>
            ))}
          </Select>

          <Box>
            <Text
              fontSize="2xs"
              color="text-muted"
              fontWeight="semibold"
              mb={1}
              textTransform="uppercase"
              letterSpacing="wider">
              {t("citizens.filterBirthDate")}
            </Text>
            <InputGroup size="sm">
              <InputLeftElement pointerEvents="none">
                <Icon as={LuCalendar} color="syria.green.mid" boxSize={4} />
              </InputLeftElement>
              <Input
                type="date"
                value={birthDateFilter}
                onChange={(e) => setBirthDateFilter(e.target.value)}
                max={today}
                rounded="sm"
                borderColor="border-color"
                bg="bg-input"
                transition="none"
                _hover={{ borderColor: "border-color" }}
                _focus={{
                  borderColor: "syria.green.mid",
                  boxShadow: "0 0 0 1px var(--chakra-colors-syria-green-mid)",
                }}
                sx={{
                  "&::-webkit-calendar-picker-indicator": {
                    cursor: "pointer",
                    opacity: 0.7,
                  },
                  "&::-webkit-datetime-edit-fields-wrapper": {
                    padding: 0,
                  },
                  "&::-webkit-inner-spin-button": {
                    display: "none",
                  },
                }}
              />
            </InputGroup>
          </Box>
        </SimpleGrid>

        <Flex
          justify="space-between"
          align="center"
          mt={4}
          pt={3}
          borderTopWidth="1px"
          borderColor="border-color"
          gap={2}
          wrap="wrap"
          direction={{ base: "column-reverse", sm: "row" }}>
          <Button
            size="sm"
            leftIcon={<LuRefreshCw size={14} />}
            onClick={handleRefresh}
            isLoading={isRefreshing}
            loadingText={t("citizens.refresh")}
            rounded="md"
            shadow="sm"
            sx={{
              bg: "syria.green.mid",
              _hover: { bg: "syria.green.dark", shadow: "md" },
              color: "white",
            }}
            minW={{ base: "full", sm: "auto" }}>
            {t("citizens.refresh")}
          </Button>

          <HStack spacing={2} w={{ base: "full", sm: "auto" }}>
            {isFiltering && (
              <Button
                size="sm"
                leftIcon={<LuX size={14} />}
                onClick={handleClearFilters}
                rounded="md"
                shadow="sm"
                sx={{
                  bg: "syria.umber.light",
                  _hover: { bg: "syria.umber.mid", shadow: "md" },
                  color: "white",
                }}
                flex={{ base: 1, sm: "auto" }}>
                {t("citizens.clearFilters")}
              </Button>
            )}
            <Button
              size="sm"
              leftIcon={<LuSearch size={14} />}
              onClick={handleSearch}
              rounded="md"
              shadow="sm"
              flex={{ base: 1, sm: "auto" }}
              sx={{
                bg: "syria.green.mid",
                color: "white",
                _hover: { bg: "syria.green.light", shadow: "md" },
                _active: { bg: "syria.green.dark" },
                _focusVisible: {
                  boxShadow: "0 0 0 3px var(--chakra-colors-syria-green-light)",
                },
                _dark: {
                  bg: "syria.green.mid",
                  color: "white",
                  _hover: { bg: "syria.green.light" },
                  _active: { bg: "syria.green.dark" },
                },
              }}>
              {t("citizens.search")}
            </Button>
          </HStack>
        </Flex>
      </Box>

      {isLoading ? (
        <Stack spacing={3}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Box
              key={i}
              bg="bg-card"
              borderWidth="1px"
              borderColor="border-color"
              rounded="md"
              p={4}>
              <HStack spacing={3}>
                <SkeletonCircle size="10" />
                <VStack align="start" spacing={2} flex="1">
                  <Skeleton height="14px" width="180px" rounded="sm" />
                  <Skeleton height="10px" width="120px" rounded="sm" />
                </VStack>
                <Skeleton height="20px" width="60px" rounded="sm" />
              </HStack>
            </Box>
          ))}
        </Stack>
      ) : citizens.length === 0 ? (
        <EmptyState
          isFiltering={isFiltering}
          onAddClick={() => navigate("/citizens/create")}
          canCreate={canCreate}
        />
      ) : (
        <VStack align="stretch" spacing={2}>
          {citizens.map((citizen) => (
            <CitizenCard key={citizen._id} citizen={citizen} />
          ))}
        </VStack>
      )}

      {!isLoading && pagination.pages > 1 && (
        <Flex
          justify="space-between"
          align="center"
          mt={5}
          pt={4}
          borderTopWidth="1px"
          borderColor="border-color"
          gap={3}
          direction={{ base: "column", sm: "row" }}>
          <Text fontSize="xs" color="text-muted">
            {t("citizens.page")}{" "}
            <Text as="span" fontWeight="semibold" color="text-primary">
              {pagination.page}
            </Text>{" "}
            {t("citizens.of")}{" "}
            <Text as="span" fontWeight="semibold" color="text-primary">
              {pagination.pages}
            </Text>{" "}
            —{" "}
            <Text as="span" fontWeight="semibold" color="text-primary">
              {pagination.total}
            </Text>{" "}
            {t("citizens.results")}
          </Text>

          <ButtonGroup size="sm" isAttached variant="outline">
            <Button
              leftIcon={isRTL ? <LuChevronRight /> : <LuChevronLeft />}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              isDisabled={!pagination.hasPrev}
              rounded="sm">
              {t("citizens.prev")}
            </Button>
            <Button
              rightIcon={isRTL ? <LuChevronLeft /> : <LuChevronRight />}
              onClick={() => setPage((p) => p + 1)}
              isDisabled={!pagination.hasNext}
              rounded="sm">
              {t("citizens.next")}
            </Button>
          </ButtonGroup>
        </Flex>
      )}
    </Box>
  );
}
