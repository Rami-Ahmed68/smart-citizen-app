// src/pages/admin/AdminsPage.jsx
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
  Badge,
  Box,
  Button,
  CloseButton,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  SimpleGrid,
  Skeleton,
  Spinner,
  Text,
  Tooltip,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import {
  LuUsers,
  LuUserCog,
  LuUserPlus,
  LuShieldCheck,
  LuShieldOff,
  LuSearch,
  LuTrash2,
  LuRotateCw,
  LuTriangleAlert,
  LuInbox,
  LuCircleCheck,
  LuX,
} from "react-icons/lu";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../auth/AuthContext";
import { adminsAPI } from "../../api/admins.api";
import { useAppToast } from "../../components/common/AppToast";
import AdminCard from "../../features/admin/AdminCard";
import AdminCardSkeleton from "../../features/admin/AdminCardSkeleton";

const ROLE_BADGE = {
  super: { colorScheme: "purple", labelKey: "adminsList.roleSuper" },
  admin: { colorScheme: "blue", labelKey: "adminsList.roleAdmin" },
};

const FILTERS = [
  { key: "all", value: "all" },
  { key: "active", value: "active" },
  { key: "inactive", value: "inactive" },
  { key: "super", value: "super" },
  { key: "admin", value: "admin" },
];

const PAGE_LIMIT = 12;
const SKELETON_MIN_DELAY = 600;

function extractItems(res) {
  const items =
    res?.data?.admins ??
    res?.data?.items ??
    res?.admins ??
    res?.items ??
    res?.data ??
    res ??
    [];
  return Array.isArray(items) ? items : [];
}

function extractPagination(res) {
  return (
    res?.pagination ??
    res?.data?.pagination ??
    res?.meta ??
    res?.data?.meta ??
    null
  );
}

function StatCard({ icon, label, value, accent, darkAccent, isLoading }) {
  return (
    <Box
      bg="bg-card"
      borderWidth="1px"
      borderColor="border-color"
      rounded="md"
      p={3}
      shadow="sm"
      transition="all 0.2s"
      _hover={{ shadow: "md", transform: "translateY(-1px)" }}>
      <HStack spacing={2.5}>
        <Flex
          align="center"
          justify="center"
          w={9}
          h={9}
          rounded="md"
          bg={accent}
          color="white"
          flexShrink={0}
          _dark={{ bg: darkAccent || accent }}>
          <Icon as={icon} boxSize={4} />
        </Flex>
        <VStack align="start" spacing={0} flex="1" minW={0}>
          <Text
            fontSize="2xs"
            fontWeight="semibold"
            color="text-muted"
            textTransform="uppercase"
            letterSpacing="0.03em"
            noOfLines={1}>
            {label}
          </Text>
          {isLoading ? (
            <Skeleton height="20px" width="36px" />
          ) : (
            <Text
              fontSize="lg"
              fontWeight="bold"
              color="text-primary"
              lineHeight="1.2">
              {value}
            </Text>
          )}
        </VStack>
      </HStack>
    </Box>
  );
}

function EmptyState({ icon, title, hint }) {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      py={16}
      px={6}
      textAlign="center">
      <Flex
        align="center"
        justify="center"
        w={20}
        h={20}
        rounded="full"
        bg="blackAlpha.50"
        _dark={{ bg: "whiteAlpha.50" }}
        mb={4}>
        <Icon as={icon} boxSize={10} color="text-muted" />
      </Flex>
      <Heading size="sm" color="text-primary" mb={1}>
        {title}
      </Heading>
      <Text fontSize="sm" color="text-muted" maxW="md">
        {hint}
      </Text>
    </Flex>
  );
}

export default function AdminsPage() {
  const { t, i18n } = useTranslation();
  const { admin: currentAdmin } = useAuth();
  const appToast = useAppToast();
  const navigate = useNavigate();

  const isRTL = i18n.language === "ar";

  const [admins, setAdmins] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [togglingId, setTogglingId] = useState(null);
  const [pendingAdmin, setPendingAdmin] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const sentinelRef = useRef(null);
  const pageRef = useRef(0);
  const isLoadingRef = useRef(false);
  const appToastRef = useRef(appToast);
  const tRef = useRef(t);

  appToastRef.current = appToast;
  tRef.current = t;

  const currentRoleBadge = ROLE_BADGE[currentAdmin?.role] || ROLE_BADGE.admin;

  const fetchPage = useCallback(
    async (pageNum, append = false, showRefresh = false) => {
      if (isLoadingRef.current) return;
      isLoadingRef.current = true;

      if (append) setIsLoadingMore(true);
      else if (showRefresh) setIsRefreshing(true);
      else setIsLoading(true);

      try {
        const params = {
          page: Number(pageNum),
          limit: Number(PAGE_LIMIT),
        };
        if (search) params.search = search;
        if (filter === "active") params.isActive = true;
        if (filter === "inactive") params.isActive = false;
        if (filter === "super") params.role = "super";
        if (filter === "admin") params.role = "admin";

        const [res] = await Promise.all([
          adminsAPI.getAll(params),
          new Promise((resolve) => setTimeout(resolve, SKELETON_MIN_DELAY)),
        ]);

        const items = extractItems(res);
        const pag = extractPagination(res);

        setAdmins((prev) => (append ? [...prev, ...items] : items));
        setPagination(pag);
        pageRef.current = pageNum;

        if (typeof pag?.hasNext === "boolean") {
          setHasMore(pag.hasNext);
        } else {
          const totalPages = pag?.totalPages ?? pag?.pages ?? 1;
          setHasMore(pageNum < totalPages);
        }
      } catch (err) {
        appToastRef.current.error(err, tRef.current("adminsList.errorLoad"));
        if (!append) setAdmins([]);
        setHasMore(false);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
        setIsRefreshing(false);
        isLoadingRef.current = false;
      }
    },
    [search, filter],
  );

  useEffect(() => {
    pageRef.current = 0;
    setHasMore(true);
    setAdmins([]);
    fetchPage(1, false);
  }, [fetchPage]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !isLoadingRef.current &&
          !isLoading &&
          !isLoadingMore
        ) {
          fetchPage(pageRef.current + 1, true);
        }
      },
      { rootMargin: "300px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, isLoading, isLoadingMore, fetchPage]);

  const stats = useMemo(() => {
    const total = pagination?.total ?? admins.length;
    const active = admins.filter((a) => a?.isActive).length;
    const superCount = admins.filter((a) => a?.role === "super").length;
    const inactive = admins.filter((a) => !a?.isActive).length;
    return { total, active, superCount, inactive };
  }, [admins, pagination]);

  const handleSearch = () => {
    const newSearch = searchInput.trim();

    if (newSearch === "") {
      appToast.warning(
        t("adminsList.searchEmpty"),
        t("adminsList.searchEmptyHint"),
      );
      return;
    }

    setSearch(newSearch);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    if (search) {
      setSearch("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleRefresh = () => {
    pageRef.current = 0;
    setHasMore(true);
    setAdmins([]);
    fetchPage(1, false, true);
  };

  const handleEdit = (admin) => {
    navigate(`/admins/${admin._id}`);
  };

  const handleToggle = async (admin) => {
    setTogglingId(admin._id);
    try {
      await adminsAPI.toggleStatus(admin._id);
      appToast.success(t("adminsList.toggleSuccess"));
      handleRefresh();
    } catch (err) {
      appToast.error(err, t("adminsList.toggleError"));
    } finally {
      setTogglingId(null);
    }
  };

  const handleOpenDelete = (admin) => {
    setPendingAdmin(admin);
    onOpen();
  };

  const handleCloseDelete = () => {
    if (isDeleting) return;
    setPendingAdmin(null);
    onClose();
  };

  const handleConfirmDelete = async () => {
    if (!pendingAdmin || isDeleting) return;
    setIsDeleting(true);
    try {
      await adminsAPI.remove(pendingAdmin._id);
      appToast.success(t("adminsList.deleteSuccess"));
      onClose();
      setPendingAdmin(null);
      handleRefresh();
    } catch (err) {
      appToast.error(err, t("adminsList.deleteError"));
    } finally {
      setIsDeleting(false);
    }
  };

  const hasActiveFilters = search || filter !== "all";

  return (
    <Box w="full" py={1} dir={isRTL ? "rtl" : "ltr"}>
      <Flex
        align={{ base: "start", md: "center" }}
        direction={{ base: "column", md: "row" }}
        gap={3}
        mb={5}
        pb={4}
        borderBottomWidth="1px"
        borderColor="border-color">
        <Flex
          align="center"
          justify="center"
          p={3}
          rounded="lg"
          bgGradient="linear(to-br, syria.green.light, syria.green.mid)"
          color="white"
          flexShrink={0}
          _dark={{
            bgGradient: "linear(to-br, syria.green.mid, syria.green.light)",
          }}>
          <Icon as={LuUsers} boxSize={5} />
        </Flex>
        <VStack align="start" spacing={0.5} flex="1">
          <HStack spacing={2} wrap="wrap">
            <Heading size="md" color="text-primary">
              {t("adminsList.pageTitle")}
            </Heading>
            <Badge
              colorScheme={currentRoleBadge.colorScheme}
              variant="solid"
              fontSize="2xs"
              rounded="md"
              px={2}
              py={0.5}
              fontWeight="semibold"
              textTransform="none">
              {t("adminsList.youAre")}: {t(currentRoleBadge.labelKey)}
            </Badge>
          </HStack>
          <Text fontSize="xs" color="text-muted">
            {t("adminsList.pageSubtitle")}
          </Text>
        </VStack>
        <Button
          size="sm"
          colorScheme="green"
          leftIcon={<LuUserPlus size={14} />}
          onClick={() => navigate("/add/admin")}>
          {t("adminsList.addNew")}
        </Button>
      </Flex>

      <SimpleGrid columns={{ base: 2, sm: 2, lg: 4 }} spacing={2.5} mb={4}>
        <StatCard
          icon={LuUsers}
          label={t("adminsList.statTotal")}
          value={stats.total}
          accent="syria.green.light"
          darkAccent="syria.green.mid"
          isLoading={isLoading}
        />
        <StatCard
          icon={LuShieldCheck}
          label={t("adminsList.statActive")}
          value={stats.active}
          accent="green.500"
          darkAccent="green.600"
          isLoading={isLoading}
        />
        <StatCard
          icon={LuUserCog}
          label={t("adminsList.statSuper")}
          value={stats.superCount}
          accent="purple.500"
          darkAccent="purple.600"
          isLoading={isLoading}
        />
        <StatCard
          icon={LuShieldOff}
          label={t("adminsList.statInactive")}
          value={stats.inactive}
          accent="error.500"
          darkAccent="error.600"
          isLoading={isLoading}
        />
      </SimpleGrid>

      <Flex
        gap={3}
        mb={4}
        direction={{ base: "column", md: "row" }}
        align={{ base: "stretch", md: "center" }}
        justify="space-between"
        wrap="wrap">
        <HStack spacing={2} maxW={{ base: "full", md: "440px" }} w="full">
          <InputGroup size="sm" flex="1">
            <InputLeftElement pointerEvents="none">
              <Icon as={LuSearch} color="text-muted" boxSize={4} />
            </InputLeftElement>
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("adminsList.searchPlaceholder")}
              bg="bg-input"
              pe={searchInput ? 9 : undefined}
            />
            {searchInput && (
              <InputRightElement>
                <IconButton
                  size="xs"
                  variant="ghost"
                  icon={<LuX size={12} />}
                  onClick={handleClearSearch}
                  aria-label={t("adminsList.clearSearch")}
                />
              </InputRightElement>
            )}
          </InputGroup>
          <Button
            size="sm"
            colorScheme="green"
            leftIcon={<LuSearch size={14} />}
            onClick={handleSearch}
            flexShrink={0}>
            {t("adminsList.searchButton")}
          </Button>
        </HStack>

        <HStack
          spacing={2}
          wrap="wrap"
          justify={{ base: "space-between", md: "flex-end" }}>
          <HStack spacing={1} wrap="wrap">
            {FILTERS.map((f) => (
              <Button
                key={f.value}
                size="xs"
                onClick={() => setFilter(f.value)}
                variant={filter === f.value ? "solid" : "outline"}
                colorScheme={filter === f.value ? "green" : "gray"}
                fontWeight={filter === f.value ? "semibold" : "normal"}
                rounded="md">
                {t(
                  `adminsList.filter${f.key.charAt(0).toUpperCase() + f.key.slice(1)}`,
                )}
              </Button>
            ))}
          </HStack>

          <Tooltip label={t("adminsList.refresh")} placement="top">
            <IconButton
              size="sm"
              variant="ghost"
              icon={<LuRotateCw size={14} />}
              onClick={handleRefresh}
              isLoading={isRefreshing}
              aria-label={t("adminsList.refresh")}
            />
          </Tooltip>
        </HStack>
      </Flex>

      {isLoading ? (
        <VStack spacing={2} align="stretch">
          {Array.from({ length: 6 }).map((_, i) => (
            <AdminCardSkeleton key={i} />
          ))}
        </VStack>
      ) : admins.length === 0 ? (
        hasActiveFilters ? (
          <EmptyState
            icon={LuSearch}
            title={t("adminsList.emptyFilterTitle")}
            hint={t("adminsList.emptyFilterHint")}
          />
        ) : (
          <EmptyState
            icon={LuInbox}
            title={t("adminsList.emptyTitle")}
            hint={t("adminsList.emptyHint")}
          />
        )
      ) : (
        <>
          <VStack spacing={2} align="stretch">
            {admins.map((admin) => (
              <AdminCard
                key={admin._id}
                admin={admin}
                onEdit={handleEdit}
                onToggle={handleToggle}
                onDelete={handleOpenDelete}
                isToggling={togglingId === admin._id}
              />
            ))}
          </VStack>

          {hasMore && (
            <>
              <VStack spacing={2} align="stretch" mt={2}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <AdminCardSkeleton key={`more-${i}`} />
                ))}
              </VStack>
              <Box ref={sentinelRef} h="40px" mt={2} />
              {isLoadingMore && (
                <Flex justify="center" mt={2}>
                  <Spinner size="md" color="syria.green.mid" thickness="3px" />
                </Flex>
              )}
            </>
          )}

          {!hasMore && admins.length > 0 && (
            <Flex
              justify="center"
              align="center"
              gap={2}
              mt={8}
              color="text-muted">
              <Icon as={LuCircleCheck} boxSize={4} />
              <Text fontSize="sm">{t("adminsList.endOfList")}</Text>
            </Flex>
          )}
        </>
      )}

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={handleCloseDelete}
        isCentered
        motionPreset="slideInBottom">
        <AlertDialogOverlay bg="blackAlpha.600" backdropFilter="blur(4px)">
          <AlertDialogContent
            bg="bg-card"
            borderWidth="1px"
            borderColor="border-color"
            rounded="xl"
            mx={4}
            overflow="hidden"
            dir={isRTL ? "rtl" : "ltr"}
            position="relative">
            <CloseButton
              position="absolute"
              top={3}
              {...(isRTL ? { left: 3 } : { right: 3 })}
              onClick={handleCloseDelete}
              isDisabled={isDeleting}
              size="sm"
              aria-label={t("adminsList.deleteCancel")}
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
                  rounded="md"
                  bg="error.500"
                  color="white"
                  flexShrink={0}
                  _dark={{ bg: "error.500" }}>
                  <Icon as={LuTriangleAlert} boxSize={5} />
                </Flex>
                <Text textAlign="start">{t("adminsList.deleteTitle")}</Text>
              </HStack>
            </AlertDialogHeader>

            <AlertDialogBody pt={3}>
              <VStack align="stretch" spacing={3}>
                <Text color="text-secondary" fontSize="sm" textAlign="start">
                  {t("adminsList.deleteBody")}
                </Text>
                {pendingAdmin && (
                  <Box
                    p={3}
                    rounded="lg"
                    bg="error.50"
                    borderWidth="1px"
                    borderColor="error.200"
                    _dark={{ bg: "error.900", borderColor: "error.700" }}>
                    <HStack spacing={3}>
                      <Avatar
                        size="sm"
                        name={`${pendingAdmin.first_name} ${pendingAdmin.last_name}`}
                        src={pendingAdmin.avatar}
                      />
                      <VStack align="start" spacing={0} minW={0}>
                        <Text
                          fontSize="sm"
                          fontWeight="semibold"
                          color="text-primary"
                          noOfLines={1}>
                          {`${pendingAdmin.first_name ?? ""} ${pendingAdmin.last_name ?? ""}`.trim() ||
                            pendingAdmin.email}
                        </Text>
                        <Text fontSize="2xs" color="text-muted" noOfLines={1}>
                          {pendingAdmin.email}
                        </Text>
                      </VStack>
                    </HStack>
                  </Box>
                )}
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
                onClick={handleCloseDelete}
                isDisabled={isDeleting}
                minW={{ base: "full", sm: "auto" }}>
                {t("adminsList.deleteCancel")}
              </Button>
              <Button
                size="sm"
                colorScheme="red"
                leftIcon={<LuTrash2 size={14} />}
                onClick={handleConfirmDelete}
                isLoading={isDeleting}
                loadingText={t("adminsList.deleting")}
                minW={{ base: "full", sm: "auto" }}>
                {t("adminsList.deleteConfirm")}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
