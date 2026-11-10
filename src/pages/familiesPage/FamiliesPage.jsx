import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  SimpleGrid,
  Skeleton,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import {
  LuBaby,
  LuLayers,
  LuPlus,
  LuRefreshCw,
  LuRotateCcw,
  LuSearch,
  LuUser,
  LuUserCheck,
} from "react-icons/lu";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../auth/AuthContext";
import { familiesAPI } from "../../api/families.api";
import { useAppToast } from "../../components/common/AppToast";
import {
  FamilyCard,
  getObjectIdString,
} from "../../features/family/FamilyCard";
import { FamilyCardSkeleton } from "./FamilySkeleton";
import CreateFamilyModal from "../../features/family/CreateFamilyModal";

const EMPTY_DRAFT_FILTERS = {
  citizen_id: "",
  relation: "",
  has_father: "",
  has_mother: "",
  has_children: "",
  sort: "createdAt-desc",
};

function isValidObjectId(id) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

function StatCard({ icon, label, value, color = "syria.green.mid" }) {
  return (
    <Box
      bg="bg-card"
      borderWidth="1px"
      borderColor="border-color"
      rounded="md"
      p={4}
      position="relative"
      overflow="hidden"
      transition="all 0.25s ease"
      _hover={{
        borderColor: color,
        shadow: "md",
        transform: "translateY(-1px)",
      }}>
      <Box
        position="absolute"
        top={-3}
        insetInlineEnd={-3}
        opacity={0.05}
        color={color}
        pointerEvents="none">
        <Icon as={icon} boxSize={20} />
      </Box>
      <HStack spacing={3} align="center" position="relative">
        <Flex
          align="center"
          justify="center"
          w={10}
          h={10}
          rounded="md"
          bg={color}
          color="white"
          flexShrink={0}
          shadow="sm">
          <Icon as={icon} boxSize={5} />
        </Flex>
        <VStack align="start" spacing={0} flex="1" minW={0}>
          <Text
            fontSize="2xs"
            color="text-muted"
            fontWeight="semibold"
            textTransform="uppercase"
            letterSpacing="wider"
            noOfLines={1}>
            {label}
          </Text>
          <Text
            fontSize="xl"
            fontWeight="bold"
            color="text-primary"
            noOfLines={1}
            title={value}>
            {value}
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
}

function StatCardSkeleton() {
  return (
    <Box
      bg="bg-card"
      borderWidth="1px"
      borderColor="border-color"
      rounded="md"
      p={4}>
      <HStack spacing={3} align="center">
        <Skeleton height="40px" width="40px" rounded="md" />
        <VStack align="start" spacing={1.5} flex="1">
          <Skeleton height="10px" width="60%" rounded="sm" />
          <Skeleton height="20px" width="40%" rounded="sm" />
        </VStack>
      </HStack>
    </Box>
  );
}

export default function FamiliesPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { admin: currentAdmin } = useAuth();
  const appToast = useAppToast();

  const isRTL = i18n.language === "ar";
  const isSuper = currentAdmin?.role === "super";
  const canCreate = isSuper || currentAdmin?.permissions?.includes("create");

  const [families, setFamilies] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [stats, setStats] = useState({
    total: 0,
    withFather: 0,
    withMother: 0,
    withChildren: 0,
  });
  const [isInitialStatsLoad, setIsInitialStatsLoad] = useState(true);

  const [draftFilters, setDraftFilters] = useState(EMPTY_DRAFT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState({
    page: 1,
    limit: 12,
    ...EMPTY_DRAFT_FILTERS,
  });

  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();

  const appToastRef = useRef(appToast);
  appToastRef.current = appToast;
  const tRef = useRef(t);
  tRef.current = t;

  const loadStats = useCallback(async () => {
    try {
      const [allRes, fatherRes, motherRes, childrenRes] = await Promise.all([
        familiesAPI.getAll({ limit: 1 }),
        familiesAPI.getAll({ limit: 1, has_father: "true" }),
        familiesAPI.getAll({ limit: 1, has_mother: "true" }),
        familiesAPI.getAll({ limit: 1, has_children: "true" }),
      ]);
      setStats({
        total: allRes.pagination?.total || 0,
        withFather: fatherRes.pagination?.total || 0,
        withMother: motherRes.pagination?.total || 0,
        withChildren: childrenRes.pagination?.total || 0,
      });
    } catch {
      // silent
    } finally {
      setIsInitialStatsLoad(false);
    }
  }, []);

  const loadFamilies = useCallback(async () => {
    setIsLoading(true);
    try {
      const [sortBy, sortOrder] = appliedFilters.sort.split("-");
      const params = {
        page: appliedFilters.page,
        limit: appliedFilters.limit,
        sortBy,
        sortOrder,
      };

      if (appliedFilters.citizen_id) {
        params.citizen_id = appliedFilters.citizen_id;
        if (appliedFilters.relation) {
          params.relation = appliedFilters.relation;
        }
      } else {
        if (appliedFilters.has_father !== "") {
          params.has_father = appliedFilters.has_father;
        }
        if (appliedFilters.has_mother !== "") {
          params.has_mother = appliedFilters.has_mother;
        }
      }

      if (appliedFilters.has_children !== "") {
        params.has_children = appliedFilters.has_children;
      }

      const response = await familiesAPI.getAll(params);
      setFamilies(response.data || []);
      setPagination(response.pagination || null);
    } catch (err) {
      appToastRef.current.error(err, tRef.current("families.loadError"));
      setFamilies([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  }, [appliedFilters]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadFamilies();
  }, [loadFamilies]);

  const setDraft = (key, value) => {
    setDraftFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    const trimmedCitizenId = draftFilters.citizen_id.trim();

    if (trimmedCitizenId && !isValidObjectId(trimmedCitizenId)) {
      appToastRef.current.error(
        null,
        tRef.current("families.filters.invalidCitizenId"),
      );
      return;
    }

    setAppliedFilters({
      page: 1,
      limit: appliedFilters.limit,
      citizen_id: trimmedCitizenId,
      relation: trimmedCitizenId ? draftFilters.relation : "",
      has_father: draftFilters.has_father,
      has_mother: draftFilters.has_mother,
      has_children: draftFilters.has_children,
      sort: draftFilters.sort,
    });
  };

  const handleReset = () => {
    setDraftFilters(EMPTY_DRAFT_FILTERS);
    setAppliedFilters({
      page: 1,
      limit: appliedFilters.limit,
      ...EMPTY_DRAFT_FILTERS,
    });
  };

  const handleRefresh = () => {
    loadFamilies();
    loadStats();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const setPage = (page) => {
    setAppliedFilters((prev) => ({ ...prev, page }));
  };

  const hasActiveFilters =
    appliedFilters.citizen_id !== "" ||
    appliedFilters.has_father !== "" ||
    appliedFilters.has_mother !== "" ||
    appliedFilters.has_children !== "";

  const handleCreate = () => {
    onCreateOpen();
  };

  const handleFamilyCreated = () => {
    loadFamilies();
    loadStats();
  };

  const handleView = (id) => {
    if (id) navigate(`/family/details/${id}`);
  };

  const handleNavigateToCitizen = (id) => {
    if (id) navigate(`/citizen/details/${id}`);
  };

  const currentPage = pagination?.page || 1;
  const pages = pagination?.pages || 1;
  const hasNext = pagination?.hasNext || false;
  const hasPrev = pagination?.hasPrev || false;

  const renderStatsRow = () => {
    if (isInitialStatsLoad) {
      return (
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={3} mb={4}>
          {[1, 2, 3, 4].map((i) => (
            <StatCardSkeleton key={i} />
          ))}
        </SimpleGrid>
      );
    }

    return (
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={3} mb={4}>
        <StatCard
          icon={LuLayers}
          label={t("families.stats.total")}
          value={String(stats.total)}
          color="syria.green.mid"
        />
        <StatCard
          icon={LuUserCheck}
          label={t("families.stats.withFather")}
          value={String(stats.withFather)}
          color="info.500"
        />
        <StatCard
          icon={LuUserCheck}
          label={t("families.stats.withMother")}
          value={String(stats.withMother)}
          color="syria.umber.mid"
        />
        <StatCard
          icon={LuBaby}
          label={t("families.stats.withChildren")}
          value={String(stats.withChildren)}
          color="syria.wheat.dark"
        />
      </SimpleGrid>
    );
  };

  const renderEmptyState = () => {
    if (hasActiveFilters) {
      return (
        <Center py={16}>
          <VStack spacing={4}>
            <Icon as={LuSearch} boxSize={16} color="text-muted" opacity={0.4} />
            <Heading size="sm" color="text-primary">
              {t("families.noResults.title")}
            </Heading>
            <Text fontSize="sm" color="text-muted" textAlign="center">
              {t("families.noResults.description")}
            </Text>
            <Button
              size="sm"
              variant="outline"
              colorScheme="red"
              leftIcon={<LuRotateCcw size={12} />}
              onClick={handleReset}>
              {t("families.noResults.action")}
            </Button>
          </VStack>
        </Center>
      );
    }

    return (
      <Center py={16}>
        <VStack spacing={4}>
          <Icon as={LuLayers} boxSize={16} color="text-muted" opacity={0.4} />
          <Heading size="sm" color="text-primary">
            {t("families.empty.title")}
          </Heading>
          <Text fontSize="sm" color="text-muted" textAlign="center">
            {t("families.empty.description")}
          </Text>
          {canCreate && (
            <Button
              bg="syria.green.mid"
              color="syria.wheat.light"
              _hover={{ bg: "syria.green.light" }}
              _active={{ bg: "syria.green.dark" }}
              transition="all 0.2s ease"
              rounded="md"
              fontWeight="semibold"
              leftIcon={<LuPlus size={14} />}
              onClick={handleCreate}>
              {t("families.empty.action")}
            </Button>
          )}
        </VStack>
      </Center>
    );
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
            <Icon as={LuLayers} boxSize={6} />
          </Flex>
          <VStack align="start" spacing={0.5} flex="1" minW={0}>
            <Heading
              size="lg"
              color="text-primary"
              fontWeight="bold"
              noOfLines={1}>
              {t("families.pageTitle")}
            </Heading>
            <Text fontSize="sm" color="text-muted" noOfLines={1}>
              {t("families.subtitle")}
            </Text>
          </VStack>
        </HStack>

        {canCreate && (
          <Button
            size="sm"
            bg="syria.green.mid"
            color="syria.wheat.light"
            leftIcon={<LuPlus size={14} />}
            onClick={handleCreate}
            _hover={{
              bg: "syria.green.light",
              transform: "translateY(-1px)",
              shadow: "md",
            }}
            _active={{ bg: "syria.green.dark", transform: "translateY(0)" }}
            transition="all 0.2s ease"
            rounded="md"
            fontWeight="semibold">
            {t("families.createFamily")}
          </Button>
        )}
      </Flex>

      {renderStatsRow()}

      <Box
        bg="bg-card"
        borderWidth="1px"
        borderColor="border-color"
        rounded="md"
        p={3}
        mb={4}>
        <SimpleGrid
          columns={{ base: 1, sm: 2, lg: 3, xl: 6 }}
          spacing={3}
          mb={3}>
          <Box gridColumn={{ base: "span 1", lg: "span 2" }}>
            <Text
              fontSize="2xs"
              color="text-muted"
              fontWeight="semibold"
              mb={1}>
              {t("families.filters.citizenId")}
            </Text>
            <InputGroup size="sm">
              <InputLeftElement pointerEvents="none">
                <Icon as={LuUser} boxSize={3.5} color="text-muted" />
              </InputLeftElement>
              <Input
                value={draftFilters.citizen_id}
                onChange={(e) => setDraft("citizen_id", e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("families.filters.citizenIdPlaceholder")}
                rounded="sm"
                bg="bg-input"
                borderColor="border-color"
                fontFamily="mono"
                fontSize="xs"
                dir="ltr"
                maxLength={24}
                _hover={{ borderColor: "syria.green.light" }}
                _focus={{ borderColor: "syria.green.mid", boxShadow: "none" }}
              />
            </InputGroup>
          </Box>

          <Box>
            <Text
              fontSize="2xs"
              color="text-muted"
              fontWeight="semibold"
              mb={1}>
              {t("families.filters.relation")}
            </Text>
            <Select
              size="sm"
              value={draftFilters.relation}
              onChange={(e) => setDraft("relation", e.target.value)}
              isDisabled={!draftFilters.citizen_id.trim()}
              rounded="sm"
              bg="bg-input"
              borderColor="border-color"
              fontSize="xs"
              _hover={{ borderColor: "syria.green.light" }}
              _focus={{ borderColor: "syria.green.mid", boxShadow: "none" }}>
              <option value="">{t("families.filters.relationAny")}</option>
              <option value="father">
                {t("families.filters.relationFather")}
              </option>
              <option value="mother">
                {t("families.filters.relationMother")}
              </option>
              <option value="child">
                {t("families.filters.relationChild")}
              </option>
            </Select>
          </Box>

          <Box>
            <Text
              fontSize="2xs"
              color="text-muted"
              fontWeight="semibold"
              mb={1}>
              {t("families.filters.hasFather")}
            </Text>
            <Select
              size="sm"
              value={draftFilters.has_father}
              onChange={(e) => setDraft("has_father", e.target.value)}
              isDisabled={!!draftFilters.citizen_id.trim()}
              rounded="sm"
              bg="bg-input"
              borderColor="border-color"
              fontSize="xs"
              _hover={{ borderColor: "syria.green.light" }}
              _focus={{ borderColor: "syria.green.mid", boxShadow: "none" }}>
              <option value="">{t("families.filters.all")}</option>
              <option value="true">{t("families.filters.yes")}</option>
              <option value="false">{t("families.filters.no")}</option>
            </Select>
          </Box>

          <Box>
            <Text
              fontSize="2xs"
              color="text-muted"
              fontWeight="semibold"
              mb={1}>
              {t("families.filters.hasMother")}
            </Text>
            <Select
              size="sm"
              value={draftFilters.has_mother}
              onChange={(e) => setDraft("has_mother", e.target.value)}
              isDisabled={!!draftFilters.citizen_id.trim()}
              rounded="sm"
              bg="bg-input"
              borderColor="border-color"
              fontSize="xs"
              _hover={{ borderColor: "syria.green.light" }}
              _focus={{ borderColor: "syria.green.mid", boxShadow: "none" }}>
              <option value="">{t("families.filters.all")}</option>
              <option value="true">{t("families.filters.yes")}</option>
              <option value="false">{t("families.filters.no")}</option>
            </Select>
          </Box>

          <Box>
            <Text
              fontSize="2xs"
              color="text-muted"
              fontWeight="semibold"
              mb={1}>
              {t("families.filters.hasChildren")}
            </Text>
            <Select
              size="sm"
              value={draftFilters.has_children}
              onChange={(e) => setDraft("has_children", e.target.value)}
              rounded="sm"
              bg="bg-input"
              borderColor="border-color"
              fontSize="xs"
              _hover={{ borderColor: "syria.green.light" }}
              _focus={{ borderColor: "syria.green.mid", boxShadow: "none" }}>
              <option value="">{t("families.filters.all")}</option>
              <option value="true">{t("families.filters.yes")}</option>
              <option value="false">{t("families.filters.no")}</option>
            </Select>
          </Box>

          <Box>
            <Text
              fontSize="2xs"
              color="text-muted"
              fontWeight="semibold"
              mb={1}>
              {t("families.filters.sortBy")}
            </Text>
            <Select
              size="sm"
              value={draftFilters.sort}
              onChange={(e) => setDraft("sort", e.target.value)}
              rounded="sm"
              bg="bg-input"
              borderColor="border-color"
              fontSize="xs"
              _hover={{ borderColor: "syria.green.light" }}
              _focus={{ borderColor: "syria.green.mid", boxShadow: "none" }}>
              <option value="createdAt-desc">
                {t("families.sort.newest")}
              </option>
              <option value="createdAt-asc">{t("families.sort.oldest")}</option>
              <option value="updatedAt-desc">
                {t("families.sort.recentlyUpdated")}
              </option>
              <option value="updatedAt-asc">
                {t("families.sort.leastRecentlyUpdated")}
              </option>
            </Select>
          </Box>
        </SimpleGrid>

        <HStack spacing={2} justify="flex-end" flexWrap="wrap">
          <Button
            size="sm"
            bg="syria.green.mid"
            color="syria.wheat.light"
            leftIcon={<LuRefreshCw size={12} />}
            onClick={handleRefresh}
            isDisabled={isLoading}
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
            rounded="md"
            fontWeight="semibold">
            {t("families.filters.refresh")}
          </Button>

          <Button
            size="sm"
            bg="syria.umber.mid"
            color="syria.wheat.light"
            leftIcon={<LuRotateCcw size={12} />}
            onClick={handleReset}
            isDisabled={isLoading}
            _hover={{
              bg: "syria.umber.light",
              transform: "translateY(-1px)",
              shadow: "md",
            }}
            _active={{ bg: "syria.umber.dark", transform: "translateY(0)" }}
            _disabled={{
              opacity: 0.6,
              cursor: "not-allowed",
              _hover: {
                bg: "syria.umber.mid",
                transform: "none",
                shadow: "none",
              },
            }}
            transition="all 0.2s ease"
            rounded="md"
            fontWeight="semibold">
            {t("families.filters.reset")}
          </Button>

          <Button
            size="sm"
            bg="syria.green.mid"
            color="syria.wheat.light"
            leftIcon={<LuSearch size={12} />}
            onClick={handleSearch}
            isLoading={isLoading}
            loadingText={t("families.filters.searching")}
            _hover={{
              bg: "syria.green.light",
              transform: "translateY(-1px)",
              shadow: "md",
            }}
            _active={{ bg: "syria.green.dark", transform: "translateY(0)" }}
            transition="all 0.2s ease"
            rounded="md"
            fontWeight="semibold">
            {t("families.filters.search")}
          </Button>
        </HStack>
      </Box>

      {isLoading ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          {Array.from({ length: 6 }).map((_, i) => (
            <FamilyCardSkeleton key={i} />
          ))}
        </SimpleGrid>
      ) : families.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} mb={4}>
            {families.map((family) => (
              <FamilyCard
                key={getObjectIdString(family._id)}
                family={family}
                onView={handleView}
                onNavigate={handleNavigateToCitizen}
                t={t}
              />
            ))}
          </SimpleGrid>

          {pages > 1 && (
            <Flex
              justify="center"
              align="center"
              gap={2}
              mt={6}
              flexWrap="wrap">
              <Button
                size="sm"
                variant="outline"
                colorScheme="green"
                onClick={() => setPage(currentPage - 1)}
                isDisabled={!hasPrev || isLoading}>
                {t("families.pagination.previous")}
              </Button>
              <Text fontSize="sm" color="text-muted" fontWeight="medium">
                {t("families.pagination.page")} {currentPage}{" "}
                {t("families.pagination.of")} {pages}
              </Text>
              <Button
                size="sm"
                variant="outline"
                colorScheme="green"
                onClick={() => setPage(currentPage + 1)}
                isDisabled={!hasNext || isLoading}>
                {t("families.pagination.next")}
              </Button>
            </Flex>
          )}
        </>
      )}

      <CreateFamilyModal
        isOpen={isCreateOpen}
        onClose={onCreateClose}
        onCreated={handleFamilyCreated}
        t={t}
        appToast={appToast}
      />
    </Box>
  );
}
