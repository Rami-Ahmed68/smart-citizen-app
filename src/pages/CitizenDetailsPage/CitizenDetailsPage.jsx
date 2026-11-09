// src/pages/citizen/CitizenDetailsPage.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  SimpleGrid,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Select,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
  Alert,
  AlertIcon,
  AlertDescription,
} from "@chakra-ui/react";
import {
  LuUser,
  LuMail,
  LuPhone,
  LuCalendar,
  LuActivity,
  LuMapPin,
  LuHeart,
  LuBookOpen,
  LuGlobe,
  LuShield,
  LuClock,
  LuPencil,
  LuCircleCheck,
  LuX,
  LuTrash2,
  LuTriangleAlert,
  LuUsers,
  LuLock,
  LuExternalLink,
  LuFingerprint,
  LuCopy,
  LuLayers,
} from "react-icons/lu";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../auth/AuthContext";
import { citizensAPI } from "../../api/citizens.api";
import { useAppToast } from "../../components/common/AppToast";
import DeleteCitizenDialog from "../../features/citizen/components/DeleteCitizenDialog";
import { formatNumeric } from "../../utils/date";
import { COUNTRIES } from "../../utils/countries";
import {
  GOVERNORATES,
  RELIGIONS,
  getLocationLabel,
  getReligionLabel,
  getGenderLabel,
  getMaritalStatusLabel,
  getCitizenshipTypeLabel,
  getCountryLabel,
} from "../../utils/citizenLabels";

const RAW_API_URL = process.env.REACT_APP_API_URL || "";
const RAW_CITIZEN_AVATAR_PATH =
  process.env.REACT_APP_CITIZEN_AVATAR_PATH || "/uploads/citizens";

const API_URL = RAW_API_URL.replace(/\/+$/, "");
const CITIZEN_AVATAR_PATH = RAW_CITIZEN_AVATAR_PATH.replace(/^\/+|\/+$/g, "");

function buildCitizenAvatarUrl(filename) {
  if (!filename || typeof filename !== "string") return undefined;
  if (/^https?:\/\//i.test(filename)) return filename;
  if (!API_URL) return undefined;
  const cleanFile = filename.replace(/^\/+/, "");
  return CITIZEN_AVATAR_PATH
    ? `${API_URL}/${CITIZEN_AVATAR_PATH}/${cleanFile}`
    : `${API_URL}/${cleanFile}`;
}

function toInputDate(value) {
  if (!value) return "";
  try {
    return new Date(value).toISOString().split("T")[0];
  } catch {
    return "";
  }
}

function calculateAge(birthDate) {
  if (!birthDate) return null;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function getObjectIdString(value) {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    if (value.$oid) return String(value.$oid);
    if (typeof value.toHexString === "function") {
      try {
        return value.toHexString();
      } catch {
        return null;
      }
    }
    if (value._id) return getObjectIdString(value._id);
    const str = String(value);
    return str !== "[object Object]" ? str : null;
  }
  return String(value);
}

function isPopulatedRelation(value) {
  if (!value || typeof value !== "object") return false;
  return !!(value.first_name || value.last_name);
}

function getRelationId(value) {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (isPopulatedRelation(value)) return getObjectIdString(value._id);
  return getObjectIdString(value);
}

function getRelationData(value) {
  if (!value) return null;
  if (isPopulatedRelation(value)) return value;
  return null;
}

function extractRelations(citizen, selfId) {
  if (!citizen) {
    return {
      father: null,
      mother: null,
      siblingsCount: 0,
      parentsFamilyId: null,
      ownFamilies: [],
      totalChildren: 0,
    };
  }

  const parentsFamily = citizen.parents_family_id
    ? getRelationData(citizen.parents_family_id) || citizen.parents_family_id
    : null;

  const father = parentsFamily?.father
    ? getRelationData(parentsFamily.father) || parentsFamily.father
    : null;

  const mother = parentsFamily?.mother
    ? getRelationData(parentsFamily.mother) || parentsFamily.mother
    : null;

  const siblings = (parentsFamily?.children_ids || [])
    .map((c) => getRelationData(c) || c)
    .filter((c) => c && getRelationId(c) !== selfId);

  const ownFamiliesRaw = Array.isArray(citizen.own_family_ids)
    ? citizen.own_family_ids
    : [];

  const ownFamilies = [];
  let totalChildren = 0;

  for (const familyRef of ownFamiliesRaw) {
    const familyDoc = getRelationData(familyRef) || familyRef;
    if (!familyDoc) continue;

    const familyId = getRelationId(familyDoc);
    const spouseRef =
      citizen.gender === "male" ? familyDoc.mother : familyDoc.father;
    const spouse = spouseRef ? getRelationData(spouseRef) || spouseRef : null;
    const children = (familyDoc.children_ids || [])
      .map((c) => getRelationData(c) || c)
      .filter(Boolean);

    totalChildren += children.length;

    ownFamilies.push({
      familyId,
      spouse,
      children,
      childrenCount: children.length,
    });
  }

  return {
    father,
    mother,
    siblingsCount: siblings.length,
    parentsFamilyId: getRelationId(parentsFamily),
    ownFamilies,
    totalChildren,
  };
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

function SectionHeader({ icon, title, accent = "syria.green.mid", actions }) {
  return (
    <HStack
      spacing={2.5}
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
        bg={accent}
        color="white"
        flexShrink={0}
        shadow="sm">
        <Icon as={icon} boxSize={4} />
      </Flex>
      <Heading size="xs" color="text-primary" fontWeight="bold" flex="1">
        {title}
      </Heading>
      {actions}
    </HStack>
  );
}

function Card({ children }) {
  return (
    <Box
      bg="bg-card"
      borderWidth="1px"
      borderColor="border-color"
      rounded="md"
      p={{ base: 4, md: 5 }}
      shadow="sm"
      h="100%">
      {children}
    </Box>
  );
}

function DetailField({ icon, label, value, dir }) {
  return (
    <FormControl>
      <FormLabel
        fontSize="xs"
        fontWeight="semibold"
        color="text-muted"
        mb={1.5}
        letterSpacing="wide">
        <HStack spacing={1.5}>
          <Icon as={icon} boxSize={3.5} color="text-muted" />
          <Text>{label}</Text>
        </HStack>
      </FormLabel>
      <Text
        fontSize="sm"
        fontWeight="medium"
        color="text-primary"
        noOfLines={2}
        dir={dir}>
        {value || "—"}
      </Text>
    </FormControl>
  );
}

function EditableField({ icon, label, value, isEditing, children }) {
  return (
    <FormControl>
      <FormLabel
        fontSize="xs"
        fontWeight="semibold"
        color="text-muted"
        mb={1.5}
        letterSpacing="wide">
        <HStack spacing={1.5}>
          <Icon as={icon} boxSize={3.5} color="text-muted" />
          <Text>{label}</Text>
        </HStack>
      </FormLabel>
      {isEditing && children ? (
        children
      ) : (
        <Text
          fontSize="sm"
          fontWeight="medium"
          color="text-primary"
          noOfLines={2}>
          {value || "—"}
        </Text>
      )}
    </FormControl>
  );
}

function PersonInlineRow({ person, label, fallbackText, onNavigate, t }) {
  const labelWidth = "70px";

  if (!person) {
    return (
      <HStack spacing={2} fontSize="xs" color="text-muted">
        <Text fontWeight="semibold" minW={labelWidth}>
          {label}:
        </Text>
        <Text fontStyle="italic">{fallbackText}</Text>
      </HStack>
    );
  }

  const pid = getRelationId(person);
  const fullName =
    `${person.first_name || ""} ${person.last_name || ""}`.trim() || "—";
  const avatar = buildCitizenAvatarUrl(person.photo);

  return (
    <HStack spacing={2}>
      <Text
        fontSize="xs"
        color="text-muted"
        fontWeight="semibold"
        minW={labelWidth}>
        {label}:
      </Text>
      <Avatar
        size="xs"
        name={fullName}
        src={avatar}
        bg="syria.green.mid"
        color="white"
      />
      <Text
        fontSize="xs"
        fontWeight="medium"
        color="text-primary"
        flex="1"
        noOfLines={1}>
        {fullName}
      </Text>
      <Tooltip label={t("citizenDetails.viewLinkedProfile")} hasArrow>
        <IconButton
          size="xs"
          variant="ghost"
          colorScheme="success"
          icon={<LuExternalLink size={10} />}
          aria-label={t("citizenDetails.viewLinkedProfile")}
          onClick={() => onNavigate(pid)}
        />
      </Tooltip>
    </HStack>
  );
}

function ParentsFamilyCard({
  father,
  mother,
  siblingsCount,
  familyId,
  onViewFamily,
  onNavigate,
  t,
}) {
  return (
    <Box
      bg="bg-input"
      borderWidth="1px"
      borderColor="border-color"
      rounded="md"
      p={3}>
      <HStack
        spacing={2}
        mb={2.5}
        pb={2}
        borderBottomWidth="1px"
        borderColor="border-color">
        <Icon as={LuUsers} boxSize={3.5} color="syria.wheat.dark" />
        <Text
          fontSize="2xs"
          color="text-muted"
          fontWeight="bold"
          textTransform="uppercase"
          letterSpacing="wider"
          flex="1">
          {t("citizenDetails.parentsFamily")}
        </Text>
        {familyId && (
          <Badge fontFamily="mono" colorScheme="green" fontSize="2xs" px={2}>
            #{familyId.slice(-8)}
          </Badge>
        )}
      </HStack>

      {familyId ? (
        <VStack spacing={2} align="stretch">
          <PersonInlineRow
            person={father}
            label={t("citizenDetails.detailFather")}
            fallbackText={t("citizenDetails.notLinked")}
            onNavigate={onNavigate}
            t={t}
          />
          <PersonInlineRow
            person={mother}
            label={t("citizenDetails.detailMother")}
            fallbackText={t("citizenDetails.notLinked")}
            onNavigate={onNavigate}
            t={t}
          />
          <HStack spacing={2}>
            <Text
              fontSize="xs"
              color="text-muted"
              fontWeight="semibold"
              minW="70px">
              {t("citizenDetails.detailSiblings")}:
            </Text>
            <Text fontSize="xs" color="text-primary" fontWeight="medium">
              {siblingsCount}
            </Text>
          </HStack>
          <Button
            size="xs"
            colorScheme="success"
            variant="outline"
            leftIcon={<LuExternalLink size={10} />}
            onClick={() => onViewFamily(familyId)}
            alignSelf="flex-start">
            {t("citizenDetails.viewFamily")}
          </Button>
        </VStack>
      ) : (
        <HStack spacing={2} py={1}>
          <Icon as={LuX} boxSize={3.5} color="text-muted" />
          <Text fontSize="xs" color="text-muted" fontStyle="italic">
            {t("citizenDetails.notLinked")}
          </Text>
        </HStack>
      )}
    </Box>
  );
}

function OwnFamilyCard({ family, onViewFamily, onNavigate, t }) {
  return (
    <Box
      bg="bg-input"
      borderWidth="1px"
      borderColor="border-color"
      rounded="md"
      p={3}>
      <HStack
        spacing={2}
        mb={2.5}
        pb={2}
        borderBottomWidth="1px"
        borderColor="border-color">
        <Icon as={LuLayers} boxSize={3.5} color="syria.wheat.dark" />
        <Text
          fontSize="2xs"
          color="text-muted"
          fontWeight="bold"
          textTransform="uppercase"
          letterSpacing="wider"
          flex="1">
          {t("citizenDetails.ownFamilies")}
        </Text>
        <Badge fontFamily="mono" colorScheme="green" fontSize="2xs" px={2}>
          #{family.familyId?.slice(-8) || "—"}
        </Badge>
      </HStack>

      <VStack spacing={2} align="stretch">
        <PersonInlineRow
          person={family.spouse}
          label={t("citizenDetails.detailSpouse")}
          fallbackText={t("citizenDetails.noSpouse")}
          onNavigate={onNavigate}
          t={t}
        />
        <HStack spacing={2}>
          <Text
            fontSize="xs"
            color="text-muted"
            fontWeight="semibold"
            minW="70px">
            {t("citizenDetails.detailChildren")}:
          </Text>
          <Text fontSize="xs" color="text-primary" fontWeight="medium">
            {family.childrenCount}
          </Text>
        </HStack>
        <Button
          size="xs"
          colorScheme="success"
          variant="outline"
          leftIcon={<LuExternalLink size={10} />}
          onClick={() => onViewFamily(family.familyId)}
          alignSelf="flex-start"
          isDisabled={!family.familyId}>
          {t("citizenDetails.viewFamily")}
        </Button>
      </VStack>
    </Box>
  );
}

function EmptyOwnFamiliesCard({ t }) {
  return (
    <Box
      bg="bg-input"
      borderWidth="1px"
      borderColor="border-color"
      rounded="md"
      p={3}>
      <HStack
        spacing={2}
        mb={2.5}
        pb={2}
        borderBottomWidth="1px"
        borderColor="border-color">
        <Icon as={LuLayers} boxSize={3.5} color="syria.wheat.dark" />
        <Text
          fontSize="2xs"
          color="text-muted"
          fontWeight="bold"
          textTransform="uppercase"
          letterSpacing="wider"
          flex="1">
          {t("citizenDetails.ownFamilies")}
        </Text>
        <Text fontSize="2xs" color="text-muted" fontFamily="mono">
          0
        </Text>
      </HStack>
      <HStack spacing={2} py={1}>
        <Icon as={LuX} boxSize={3.5} color="text-muted" />
        <Text fontSize="xs" color="text-muted" fontStyle="italic">
          {t("citizenDetails.noOwnFamilies")}
        </Text>
      </HStack>
    </Box>
  );
}

export default function CitizenDetailsPage() {
  const { target_id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { admin: currentAdmin } = useAuth();
  const appToast = useAppToast();

  const isRTL = i18n.language === "ar";
  const lang = isRTL ? "ar" : "en";

  const userRole = currentAdmin?.role;
  const userPermissions = currentAdmin?.permissions || [];
  const isSuper = userRole === "super";
  const canUpdate = isSuper || userPermissions.includes("update");
  const canDelete = isSuper || userPermissions.includes("delete");

  const [citizen, setCitizen] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    birth_date: "",
    gender: "male",
    religion: "Muslim",
    original_nationality: "Syria",
    location: "Damascus",
    marital_status: "Single",
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const appToastRef = useRef(appToast);
  appToastRef.current = appToast;
  const tRef = useRef(t);
  tRef.current = t;
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;

  const relations = useMemo(
    () => extractRelations(citizen, target_id),
    [citizen, target_id],
  );

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      try {
        const data = await citizensAPI.getById(target_id);
        if (cancelled) return;

        setCitizen(data);
        setForm({
          first_name: data?.first_name ?? "",
          last_name: data?.last_name ?? "",
          phone_number: data?.phone_number ?? "",
          email: data?.email ?? "",
          birth_date: toInputDate(data?.birth_date),
          gender: data?.gender ?? "male",
          religion: data?.religion ?? "Muslim",
          original_nationality: data?.original_nationality ?? "Syria",
          location: data?.location ?? "Damascus",
          marital_status: data?.marital_status ?? "Single",
        });
      } catch (err) {
        if (cancelled) return;
        appToastRef.current.error(
          err,
          tRef.current("citizenDetails.loadError"),
        );
        navigateRef.current("/citizens", { replace: true });
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [target_id]);

  const fullName = citizen
    ? `${citizen.first_name ?? ""} ${citizen.last_name ?? ""}`.trim() || "—"
    : "—";

  const avatarUrl = buildCitizenAvatarUrl(citizen?.photo);
  const genderLabel = getGenderLabel(citizen?.gender, t);
  const maritalLabel = getMaritalStatusLabel(
    citizen?.marital_status,
    citizen?.gender,
    t,
  );
  const citizenshipLabel = getCitizenshipTypeLabel(
    citizen?.citizenship_type,
    t,
  );
  const nationalityLabel = getCountryLabel(citizen?.original_nationality, lang);
  const religionLabel = getReligionLabel(citizen?.religion, t);
  const locationLabel = getLocationLabel(citizen?.location, t);
  const age = calculateAge(citizen?.birth_date);

  const familyCount = relations.ownFamilies.length;
  const totalChildren = relations.totalChildren;

  const set = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const resetForm = () => {
    setForm({
      first_name: citizen?.first_name ?? "",
      last_name: citizen?.last_name ?? "",
      phone_number: citizen?.phone_number ?? "",
      email: citizen?.email ?? "",
      birth_date: toInputDate(citizen?.birth_date),
      gender: citizen?.gender ?? "male",
      religion: citizen?.religion ?? "Muslim",
      original_nationality: citizen?.original_nationality ?? "Syria",
      location: citizen?.location ?? "Damascus",
      marital_status: citizen?.marital_status ?? "Single",
    });
  };

  const handleStartEdit = () => {
    resetForm();
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    resetForm();
    setIsEditing(false);
  };

  const handleCopyId = () => {
    if (!citizen?._id) return;
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(String(citizen._id));
      }
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } catch {
      appToast.error(t("citizenDetails.copyError"));
    }
  };

  const applyUpdatedCitizen = (updated) => {
    setCitizen(updated);
    setForm({
      first_name: updated?.first_name ?? "",
      last_name: updated?.last_name ?? "",
      phone_number: updated?.phone_number ?? "",
      email: updated?.email ?? "",
      birth_date: toInputDate(updated?.birth_date),
      gender: updated?.gender ?? "male",
      religion: updated?.religion ?? "Muslim",
      original_nationality: updated?.original_nationality ?? "Syria",
      location: updated?.location ?? "Damascus",
      marital_status: updated?.marital_status ?? "Single",
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {};

      const trimFirst = form.first_name.trim();
      const trimLast = form.last_name.trim();
      const trimPhone = form.phone_number.trim();
      const trimEmail = form.email.trim();

      if (trimFirst && trimFirst !== (citizen.first_name ?? "")) {
        payload.first_name = trimFirst;
      }
      if (trimLast && trimLast !== (citizen.last_name ?? "")) {
        payload.last_name = trimLast;
      }
      if (trimPhone && trimPhone !== (citizen.phone_number ?? "")) {
        payload.phone_number = trimPhone;
      }
      if (trimEmail && trimEmail !== (citizen.email ?? "")) {
        payload.email = trimEmail;
      }
      if (
        form.birth_date &&
        form.birth_date !== toInputDate(citizen.birth_date)
      ) {
        payload.birth_date = form.birth_date;
      }
      if (form.gender && form.gender !== (citizen.gender ?? "")) {
        payload.gender = form.gender;
      }
      if (form.religion && form.religion !== (citizen.religion ?? "")) {
        payload.religion = form.religion;
      }
      if (
        form.original_nationality &&
        form.original_nationality !== (citizen.original_nationality ?? "")
      ) {
        payload.original_nationality = form.original_nationality;
      }
      if (form.location && form.location !== (citizen.location ?? "")) {
        payload.location = form.location;
      }

      if (Object.keys(payload).length === 0) {
        if (typeof appToast.info === "function") {
          appToast.info(t("citizenDetails.noChanges"));
        } else {
          appToast.success(t("citizenDetails.noChanges"));
        }
        setIsEditing(false);
        return;
      }

      await citizensAPI.update(target_id, payload);
      const updated = await citizensAPI.getById(target_id);
      applyUpdatedCitizen(updated);
      appToast.success(t("citizenDetails.saveSuccess"));
      setIsEditing(false);
    } catch (err) {
      appToast.error(err, t("citizenDetails.saveError"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await citizensAPI.remove(target_id);
      appToast.success(t("citizenDetails.deleteSuccess"));
      onClose();
      navigate("/citizens", { replace: true });
    } catch (err) {
      appToast.error(err, t("citizenDetails.deleteError"));
    } finally {
      setIsDeleting(false);
    }
  };

  const goToCitizen = (id) => {
    if (id) navigate(`/citizen/details/${id}`);
  };

  const goToFamily = (id) => {
    if (id) navigate(`/family/details/${id}`);
  };

  if (isLoading) {
    return (
      <Box w="full" py={1} dir={isRTL ? "rtl" : "ltr"}>
        <VStack align="start" spacing={1} mb={5}>
          <Skeleton height="24px" width="200px" rounded="sm" />
          <Skeleton height="12px" width="280px" rounded="sm" />
        </VStack>
        <Box
          bg="bg-card"
          borderWidth="1px"
          borderColor="border-color"
          rounded="md"
          overflow="hidden"
          mb={4}>
          <Box h="96px" bg="bg-input" />
          <Box px={{ base: 4, md: 6 }} pb={5} mt="-40px">
            <HStack align="flex-end" spacing={4}>
              <SkeletonCircle
                size="20"
                borderWidth="4px"
                borderColor="bg-card"
                boxSizing="content-box"
              />
              <VStack align="start" spacing={2} pb={2} flex="1">
                <Skeleton height="20px" width="180px" rounded="sm" />
                <Skeleton height="12px" width="120px" rounded="sm" />
              </VStack>
            </HStack>
          </Box>
        </Box>
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={3} mb={4}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Box
              key={i}
              bg="bg-card"
              borderWidth="1px"
              borderColor="border-color"
              rounded="md"
              p={4}>
              <SkeletonText noOfLines={2} spacing={2} />
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    );
  }

  if (!citizen) return null;

  return (
    <Box w="full" py={1} dir={isRTL ? "rtl" : "ltr"}>
      <Box mb={5} pb={4} borderBottomWidth="1px" borderColor="border-color">
        <VStack align="start" spacing={1} minW={0}>
          <Heading
            size="md"
            color="text-primary"
            fontWeight="bold"
            noOfLines={1}>
            {t("citizenDetails.pageTitle")}
          </Heading>
          <Text fontSize="xs" color="text-muted" noOfLines={1}>
            {t("citizenDetails.subtitle")}
          </Text>
        </VStack>
      </Box>

      <Box
        bg="bg-card"
        borderWidth="1px"
        borderColor="border-color"
        rounded="md"
        overflow="hidden"
        shadow="sm"
        mb={4}
        position="relative">
        <Box
          h="96px"
          bgGradient="linear(135deg, syria.green.mid 0%, syria.green.light 100%)"
          position="relative"
          overflow="hidden">
          <Box
            position="absolute"
            top="-50px"
            insetInlineEnd="-20px"
            w="180px"
            h="180px"
            borderRadius="full"
            bg="whiteAlpha.100"
          />
          <Box
            position="absolute"
            bottom="-80px"
            insetInlineStart="40%"
            w="160px"
            h="160px"
            borderRadius="full"
            bg="whiteAlpha.100"
          />
          <Box
            position="absolute"
            top={3}
            insetInlineStart={4}
            color="whiteAlpha.600">
            <Icon as={LuUsers} boxSize={4} />
          </Box>
        </Box>

        <Box
          px={{ base: 4, md: 6 }}
          pb={5}
          mt="-40px"
          position="relative"
          zIndex={2}>
          <Flex
            direction={{ base: "column", md: "row" }}
            align={{ base: "start", md: "flex-end" }}
            gap={4}
            justify="space-between">
            <HStack align="flex-end" spacing={4} flex="1" minW={0}>
              <Avatar
                size="xl"
                name={fullName}
                src={avatarUrl}
                bg="syria.green.mid"
                color="white"
                borderWidth="4px"
                borderColor="bg-card"
                flexShrink={0}
                position="relative"
                zIndex={3}
              />
              <VStack align="start" spacing={1.5} pb={2} minW={0} flex="1">
                <HStack
                  spacing={2}
                  wrap="wrap"
                  backdropFilter="blur(20px)"
                  p={2}
                  borderRadius="md">
                  <Heading
                    size="md"
                    color="text-primary"
                    fontWeight="bold"
                    noOfLines={1}>
                    {fullName}
                  </Heading>
                  <Badge
                    bg="syria.green.mid"
                    color="white"
                    fontSize="2xs"
                    rounded="sm"
                    px={2}
                    py={0.5}
                    fontWeight="semibold"
                    textTransform="none">
                    {locationLabel}
                  </Badge>
                  <Badge
                    colorScheme="green"
                    variant="subtle"
                    fontSize="2xs"
                    rounded="sm"
                    px={2}
                    py={0.5}
                    textTransform="none">
                    {citizenshipLabel}
                  </Badge>
                </HStack>

                <HStack
                  spacing={3}
                  color="text-muted"
                  fontSize="sm"
                  wrap="wrap">
                  {citizen?.email && (
                    <HStack spacing={1}>
                      <Icon as={LuMail} boxSize={3.5} />
                      <Text>{citizen.email}</Text>
                    </HStack>
                  )}
                  {citizen?.phone_number && (
                    <>
                      <Text opacity={0.4}>•</Text>
                      <HStack spacing={1}>
                        <Icon as={LuPhone} boxSize={3.5} />
                        <Text dir="ltr">{citizen.phone_number}</Text>
                      </HStack>
                    </>
                  )}
                  {citizen?._id && (
                    <>
                      <Text opacity={0.4}>•</Text>
                      <Tooltip
                        label={t("citizenDetails.clickToCopy")}
                        hasArrow
                        placement="top">
                        <HStack
                          spacing={1}
                          cursor="pointer"
                          onClick={handleCopyId}
                          _hover={{ color: "syria.green.mid" }}
                          transition="color 0.15s ease">
                          <Icon
                            as={copiedId ? LuCircleCheck : LuFingerprint}
                            boxSize={3.5}
                            color={copiedId ? "success.500" : "inherit"}
                          />
                          <Text
                            fontFamily="mono"
                            fontSize="xs"
                            dir="ltr"
                            color={copiedId ? "success.500" : "inherit"}>
                            #{getObjectIdString(citizen._id).slice(-8)}
                          </Text>
                        </HStack>
                      </Tooltip>
                    </>
                  )}
                </HStack>
              </VStack>
            </HStack>

            <HStack spacing={2} pb={{ base: 0, md: 2 }}>
              {canUpdate &&
                (!isEditing ? (
                  <Button
                    size="sm"
                    colorScheme="success"
                    leftIcon={<LuPencil size={14} />}
                    onClick={handleStartEdit}
                    rounded="md">
                    {t("citizenDetails.edit")}
                  </Button>
                ) : (
                  <>
                    <Button
                      size="sm"
                      colorScheme="error"
                      variant="outline"
                      leftIcon={<LuX size={14} />}
                      onClick={handleCancelEdit}
                      isDisabled={isSaving}
                      rounded="md">
                      {t("citizenDetails.cancelEdit")}
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="success"
                      leftIcon={<LuCircleCheck size={14} />}
                      onClick={handleSave}
                      isLoading={isSaving}
                      loadingText={t("citizenDetails.saving")}
                      rounded="md">
                      {t("citizenDetails.save")}
                    </Button>
                  </>
                ))}
            </HStack>
          </Flex>
        </Box>
      </Box>

      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={3} mb={4}>
        <StatCard
          icon={LuCalendar}
          label={t("citizenDetails.statAge")}
          value={age !== null ? `${age} ${t("citizenDetails.years")}` : "—"}
          color="syria.wheat.dark"
        />
        <StatCard
          icon={LuMapPin}
          label={t("citizenDetails.statLocation")}
          value={locationLabel}
          color="syria.green.mid"
        />
        <StatCard
          icon={LuUsers}
          label={t("citizenDetails.statChildren")}
          value={String(totalChildren)}
          color="syria.umber.mid"
        />
        <StatCard
          icon={LuLayers}
          label={t("citizenDetails.statFamilies")}
          value={String(familyCount)}
          color="syria.green.light"
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 12 }} spacing={4} mb={4}>
        <Box gridColumn={{ base: "span 1", lg: "span 7" }}>
          <Card>
            <SectionHeader
              icon={LuUser}
              title={t("citizenDetails.personalInfo")}
              actions={
                !canUpdate && (
                  <Tooltip label={t("citizenDetails.editRestricted")} hasArrow>
                    <Badge
                      colorScheme="gray"
                      variant="subtle"
                      fontSize="2xs"
                      rounded="sm"
                      px={2}
                      py={0.5}
                      textTransform="none"
                      display="inline-flex"
                      alignItems="center"
                      gap={1}>
                      <Icon as={LuLock} boxSize={3} />
                      {t("citizenDetails.readOnly")}
                    </Badge>
                  </Tooltip>
                )
              }
            />
            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
              <EditableField
                icon={LuUser}
                label={t("citizenDetails.detailFirstName")}
                value={citizen.first_name}
                isEditing={isEditing && canUpdate}>
                <Input
                  size="sm"
                  value={form.first_name}
                  onChange={(e) => set("first_name", e.target.value)}
                  placeholder={t("citizenDetails.firstNamePlaceholder")}
                  maxLength={100}
                  rounded="sm"
                  bg="bg-input"
                  borderColor="border-color"
                  _hover={{ borderColor: "syria.green.light" }}
                  _focus={{ borderColor: "syria.green.mid", boxShadow: "none" }}
                />
              </EditableField>

              <EditableField
                icon={LuUser}
                label={t("citizenDetails.detailLastName")}
                value={citizen.last_name}
                isEditing={isEditing && canUpdate}>
                <Input
                  size="sm"
                  value={form.last_name}
                  onChange={(e) => set("last_name", e.target.value)}
                  placeholder={t("citizenDetails.lastNamePlaceholder")}
                  maxLength={100}
                  rounded="sm"
                  bg="bg-input"
                  borderColor="border-color"
                  _hover={{ borderColor: "syria.green.light" }}
                  _focus={{ borderColor: "syria.green.mid", boxShadow: "none" }}
                />
              </EditableField>

              <EditableField
                icon={LuCalendar}
                label={t("citizenDetails.detailBirthDate")}
                value={
                  citizen.birth_date
                    ? formatNumeric(new Date(citizen.birth_date))
                    : "—"
                }
                isEditing={isEditing && canUpdate}>
                <Input
                  type="date"
                  size="sm"
                  value={form.birth_date}
                  onChange={(e) => set("birth_date", e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  rounded="sm"
                  bg="bg-input"
                  transition="none"
                  borderColor="border-color"
                  _hover={{ borderColor: "border-color" }}
                  _focus={{
                    borderColor: "syria.green.mid",
                    boxShadow: "0 0 0 1px var(--chakra-colors-syria-green-mid)",
                  }}
                  sx={{
                    "&::-webkit-calendar-picker-indicator": {
                      cursor: "pointer",
                    },
                  }}
                />
              </EditableField>

              <EditableField
                icon={LuActivity}
                label={t("citizenDetails.detailGender")}
                value={genderLabel}
                isEditing={isEditing && canUpdate}>
                <Select
                  size="sm"
                  value={form.gender}
                  onChange={(e) => set("gender", e.target.value)}
                  rounded="sm"
                  bg="bg-input"
                  borderColor="border-color"
                  _hover={{ borderColor: "syria.green.light" }}
                  _focus={{
                    borderColor: "syria.green.mid",
                    boxShadow: "none",
                  }}>
                  <option value="male">{t("citizenDetails.genderMale")}</option>
                  <option value="female">
                    {t("citizenDetails.genderFemale")}
                  </option>
                </Select>
              </EditableField>

              <EditableField
                icon={LuHeart}
                label={t("citizenDetails.detailMaritalStatus")}
                value={maritalLabel}
                isEditing={isEditing && canUpdate}>
                <Select
                  size="sm"
                  value={form.marital_status}
                  onChange={(e) => set("marital_status", e.target.value)}
                  rounded="sm"
                  bg="bg-input"
                  borderColor="border-color"
                  isDisabled
                  _hover={{ borderColor: "syria.green.light" }}>
                  <option value="Single">
                    {t("citizenDetails.maritalSingleMale")}
                  </option>
                  <option value="Married">
                    {t("citizenDetails.maritalMarriedMale")}
                  </option>
                  <option value="Divorced">
                    {t("citizenDetails.maritalDivorcedMale")}
                  </option>
                  <option value="Widowed">
                    {t("citizenDetails.maritalWidowedMale")}
                  </option>
                </Select>
              </EditableField>

              <EditableField
                icon={LuBookOpen}
                label={t("citizenDetails.detailReligion")}
                value={religionLabel}
                isEditing={isEditing && canUpdate}>
                <Select
                  size="sm"
                  value={form.religion}
                  onChange={(e) => set("religion", e.target.value)}
                  rounded="sm"
                  bg="bg-input"
                  borderColor="border-color"
                  _hover={{ borderColor: "syria.green.light" }}
                  _focus={{
                    borderColor: "syria.green.mid",
                    boxShadow: "none",
                  }}>
                  {RELIGIONS.map((rel) => (
                    <option key={rel} value={rel}>
                      {getReligionLabel(rel, t)}
                    </option>
                  ))}
                </Select>
              </EditableField>

              <EditableField
                icon={LuGlobe}
                label={t("citizenDetails.detailOriginalNationality")}
                value={nationalityLabel}
                isEditing={isEditing && canUpdate}>
                <Select
                  size="sm"
                  value={form.original_nationality}
                  onChange={(e) => set("original_nationality", e.target.value)}
                  rounded="sm"
                  bg="bg-input"
                  borderColor="border-color"
                  _hover={{ borderColor: "syria.green.light" }}
                  _focus={{
                    borderColor: "syria.green.mid",
                    boxShadow: "none",
                  }}>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {getCountryLabel(c, lang)}
                    </option>
                  ))}
                </Select>
              </EditableField>

              <EditableField
                icon={LuMapPin}
                label={t("citizenDetails.detailLocation")}
                value={locationLabel}
                isEditing={isEditing && canUpdate}>
                <Select
                  size="sm"
                  value={form.location}
                  onChange={(e) => set("location", e.target.value)}
                  rounded="sm"
                  bg="bg-input"
                  borderColor="border-color"
                  _hover={{ borderColor: "syria.green.light" }}
                  _focus={{
                    borderColor: "syria.green.mid",
                    boxShadow: "none",
                  }}>
                  {GOVERNORATES.map((g) => (
                    <option key={g} value={g}>
                      {getLocationLabel(g, t)}
                    </option>
                  ))}
                </Select>
              </EditableField>
            </SimpleGrid>
          </Card>
        </Box>

        <Box gridColumn={{ base: "span 1", lg: "span 5" }}>
          <Card>
            <SectionHeader
              icon={LuPhone}
              title={t("citizenDetails.contactInfo")}
            />
            <SimpleGrid columns={{ base: 1 }} spacing={4}>
              <EditableField
                icon={LuMail}
                label={t("citizenDetails.detailEmail")}
                value={citizen.email}
                isEditing={isEditing && canUpdate}>
                <Input
                  type="email"
                  size="sm"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder={t("citizenDetails.emailPlaceholder")}
                  maxLength={254}
                  rounded="sm"
                  dir="ltr"
                  bg="bg-input"
                  borderColor="border-color"
                  _hover={{ borderColor: "syria.green.light" }}
                  _focus={{ borderColor: "syria.green.mid", boxShadow: "none" }}
                />
              </EditableField>

              <EditableField
                icon={LuPhone}
                label={t("citizenDetails.detailPhone")}
                value={citizen.phone_number}
                isEditing={isEditing && canUpdate}>
                <Input
                  type="tel"
                  size="sm"
                  value={form.phone_number}
                  onChange={(e) =>
                    set("phone_number", e.target.value.replace(/[^\d+]/g, ""))
                  }
                  placeholder={t("citizenDetails.phonePlaceholder")}
                  maxLength={15}
                  rounded="sm"
                  dir="ltr"
                  bg="bg-input"
                  borderColor="border-color"
                  _hover={{ borderColor: "syria.green.light" }}
                  _focus={{ borderColor: "syria.green.mid", boxShadow: "none" }}
                />
              </EditableField>

              <DetailField
                icon={LuShield}
                label={t("citizenDetails.detailCitizenshipType")}
                value={citizenshipLabel}
              />
            </SimpleGrid>
          </Card>
        </Box>
      </SimpleGrid>

      <Box mb={4}>
        <Card>
          <SectionHeader
            icon={LuUsers}
            title={t("citizenDetails.familyInfo")}
            accent="syria.wheat.dark"
          />

          <Alert status="info" rounded="md" mb={4}>
            <AlertIcon />
            <AlertDescription fontSize="xs">
              {t("citizenDetails.familyManagedNotice")}
            </AlertDescription>
          </Alert>

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
            <ParentsFamilyCard
              father={relations.father}
              mother={relations.mother}
              siblingsCount={relations.siblingsCount}
              familyId={relations.parentsFamilyId}
              onViewFamily={goToFamily}
              onNavigate={goToCitizen}
              t={t}
            />

            {relations.ownFamilies.length === 0 ? (
              <EmptyOwnFamiliesCard t={t} />
            ) : (
              relations.ownFamilies.map((family, idx) => (
                <OwnFamilyCard
                  key={family.familyId || idx}
                  family={family}
                  onViewFamily={goToFamily}
                  onNavigate={goToCitizen}
                  t={t}
                />
              ))
            )}
          </SimpleGrid>
        </Card>
      </Box>

      <Box mb={4}>
        <Card>
          <SectionHeader
            icon={LuClock}
            title={t("citizenDetails.auditInfo")}
            accent="info.500"
          />
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={4}>
            <FormControl>
              <FormLabel
                fontSize="xs"
                fontWeight="semibold"
                color="text-muted"
                mb={1.5}
                letterSpacing="wide">
                <HStack spacing={1.5}>
                  <Icon as={LuFingerprint} boxSize={3.5} color="text-muted" />
                  <Text>{t("citizenDetails.detailId")}</Text>
                </HStack>
              </FormLabel>
              <HStack spacing={2} minW={0}>
                <Text
                  fontSize="xs"
                  fontWeight="medium"
                  color="text-primary"
                  fontFamily="mono"
                  wordBreak="break-all"
                  dir="ltr"
                  flex="1"
                  noOfLines={2}
                  title={getObjectIdString(citizen._id)}>
                  {getObjectIdString(citizen._id)}
                </Text>
                <Tooltip
                  label={
                    copiedId
                      ? t("citizenDetails.copied")
                      : t("citizenDetails.copyId")
                  }
                  hasArrow
                  placement="top">
                  <IconButton
                    size="xs"
                    variant="ghost"
                    colorScheme={copiedId ? "success" : "gray"}
                    icon={
                      copiedId ? (
                        <LuCircleCheck size={12} />
                      ) : (
                        <LuCopy size={12} />
                      )
                    }
                    aria-label={t("citizenDetails.copyId")}
                    onClick={handleCopyId}
                  />
                </Tooltip>
              </HStack>
            </FormControl>

            <DetailField
              icon={LuClock}
              label={t("citizenDetails.detailCreatedAt")}
              value={
                citizen.createdAt
                  ? formatNumeric(new Date(citizen.createdAt))
                  : "—"
              }
            />
            <DetailField
              icon={LuClock}
              label={t("citizenDetails.detailUpdatedAt")}
              value={
                citizen.updatedAt
                  ? formatNumeric(new Date(citizen.updatedAt))
                  : "—"
              }
            />
          </SimpleGrid>
        </Card>
      </Box>

      <Box
        rounded="md"
        borderWidth="1px"
        borderColor="error.800"
        bg="bg-card"
        p={{ base: 4, md: 5 }}>
        <HStack spacing={2.5} mb={1}>
          <Flex
            align="center"
            justify="center"
            w={8}
            h={8}
            rounded="sm"
            bg="error.500"
            color="white"
            flexShrink={0}>
            <Icon as={LuTriangleAlert} boxSize={4} />
          </Flex>
          <Heading
            size="xs"
            color="error.600"
            _dark={{ color: "error.300" }}
            fontWeight="bold">
            {t("citizenDetails.dangerZone")}
          </Heading>
        </HStack>
        <Text fontSize="xs" color="text-muted" mb={4} mt={1}>
          {t("citizenDetails.dangerZoneHint")}
        </Text>
        <Flex justify="flex-end">
          <Tooltip
            label={!canDelete ? t("citizenDetails.deleteRestricted") : ""}
            isDisabled={canDelete}
            hasArrow>
            <Button
              size="sm"
              variant="solid"
              bg="error.500"
              color="white"
              leftIcon={<LuTrash2 size={14} />}
              onClick={onOpen}
              isDisabled={!canDelete}
              rounded="md"
              _hover={{ bg: "error.400" }}
              _active={{ bg: "error.600" }}>
              {t("citizenDetails.delete")}
            </Button>
          </Tooltip>
        </Flex>
      </Box>

      <DeleteCitizenDialog
        isOpen={isOpen}
        onClose={onClose}
        citizen={citizen}
        fullName={fullName}
        avatarUrl={avatarUrl}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        isRTL={isRTL}
      />
    </Box>
  );
}
