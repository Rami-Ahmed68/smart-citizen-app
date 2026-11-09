// src/pages/family/FamilyDetailsPage.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  Flex,
  HStack,
  Heading,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Skeleton,
  SkeletonText,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import {
  LuArrowLeft,
  LuArrowRight,
  LuCheck,
  LuDownload,
  LuExternalLink,
  LuPencil,
  LuTrash2,
  LuUser,
  LuX,
} from "react-icons/lu";
import { useTranslation } from "react-i18next";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useAuth } from "../../auth/AuthContext";
import { familiesAPI } from "../../api/families.api";
import { citizensAPI } from "../../api/citizens.api";
import { useAppToast } from "../../components/common/AppToast";
import { formatNumeric } from "../../utils/date";
import { getObjectIdString } from "../../features/family/FamilyCard";
import syriaLogo from "../../assets/new_syrian_logo.png";

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

function isValidObjectId(id) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

function isPopulated(value) {
  if (!value || typeof value !== "object") return false;
  return !!(value.first_name || value.last_name);
}

function getPersonData(value) {
  if (!value) return null;
  if (isPopulated(value)) return value;
  return null;
}

function getPersonId(value) {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (isPopulated(value)) return getObjectIdString(value._id);
  return getObjectIdString(value);
}

function SectionHeader({ icon, title, actions }) {
  return (
    <Flex
      align="center"
      gap={2.5}
      mb={4}
      pb={3}
      borderBottomWidth="1px"
      borderColor="border-color">
      <Icon as={icon} boxSize={4} color="syria.green.mid" />
      <Heading size="xs" color="text-primary" fontWeight="bold" flex="1">
        {title}
      </Heading>
      {actions}
    </Flex>
  );
}

function PersonAvatar({ person, onNavigate, t }) {
  const fullName = person
    ? `${person.first_name || ""} ${person.last_name || ""}`.trim()
    : "";
  const avatar = buildCitizenAvatarUrl(person?.photo);
  const pid = getPersonId(person);

  if (!pid) {
    return (
      <Avatar
        size="sm"
        name={fullName || "?"}
        src={avatar}
        bg="syria.green.mid"
        color="white"
        borderWidth="1px"
        borderColor="syria.wheat.mid"
      />
    );
  }

  return (
    <Tooltip label={t("familyDetails.viewProfile")} hasArrow>
      <Avatar
        size="sm"
        name={fullName || "?"}
        src={avatar}
        bg="syria.green.mid"
        color="white"
        borderWidth="1px"
        borderColor="syria.wheat.mid"
        cursor="pointer"
        transition="all 0.15s ease"
        _hover={{
          transform: "scale(1.1)",
          borderColor: "syria.wheat.dark",
          shadow: "md",
        }}
        onClick={(e) => {
          e.stopPropagation();
          onNavigate(pid);
        }}
      />
    </Tooltip>
  );
}

function MemberRow({ person, role, isEditing, onRemove, onView, t }) {
  const roleLabel = t(`familyDetails.roles.${role}`);
  const roleColor = role === "father" || role === "son" ? "info" : "red";
  const personData = getPersonData(person);
  const personId = getPersonId(person);

  if (!personData) {
    return (
      <Tr bg="bg-input">
        <Td>
          <Badge colorScheme={roleColor} fontSize="2xs" rounded="sm" px={2}>
            {roleLabel}
          </Badge>
        </Td>
        <Td colSpan={5}>
          <Text fontSize="sm" fontStyle="italic" color="text-muted">
            {t("familyDetails.noData")}
          </Text>
        </Td>
      </Tr>
    );
  }

  const fullName =
    `${personData.first_name || ""} ${personData.last_name || ""}`.trim() ||
    "—";
  const age = calculateAge(personData.birth_date);
  const genderLabel =
    personData.gender === "male"
      ? t("familyDetails.genderMale")
      : personData.gender === "female"
        ? t("familyDetails.genderFemale")
        : "—";

  return (
    <Tr
      _hover={{ bg: "bg-input" }}
      transition="background 0.15s ease"
      cursor={personId ? "pointer" : "default"}
      onClick={() => personId && onView(personId)}>
      <Td>
        <Badge colorScheme={roleColor} fontSize="2xs" rounded="sm" px={2}>
          {roleLabel}
        </Badge>
      </Td>
      <Td>
        <HStack spacing={2.5}>
          <PersonAvatar person={personData} onNavigate={onView} t={t} />
          <VStack align="start" spacing={0} minW={0}>
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color="text-primary"
              noOfLines={1}>
              {fullName}
            </Text>
            {personId && (
              <Text
                fontSize="2xs"
                color="text-muted"
                fontFamily="mono"
                dir="ltr">
                #{personId.slice(-8)}
              </Text>
            )}
          </VStack>
        </HStack>
      </Td>
      <Td display={{ base: "none", sm: "table-cell" }}>
        <Text fontSize="sm" color="text-primary">
          {genderLabel}
        </Text>
      </Td>
      <Td display={{ base: "none", md: "table-cell" }}>
        <Text fontSize="sm" color="text-primary">
          {age !== null ? `${age} ${t("familyDetails.ageYears")}` : "—"}
        </Text>
      </Td>
      <Td display={{ base: "none", lg: "table-cell" }}>
        <Text fontSize="sm" color="text-primary">
          {personData.birth_date
            ? formatNumeric(new Date(personData.birth_date))
            : "—"}
        </Text>
      </Td>
      <Td>
        <HStack spacing={1} justify="flex-end">
          {personId && (
            <Tooltip label={t("familyDetails.viewProfile")} hasArrow>
              <IconButton
                size="xs"
                variant="ghost"
                colorScheme="success"
                icon={<LuExternalLink size={12} />}
                aria-label={t("familyDetails.viewProfile")}
                onClick={(e) => {
                  e.stopPropagation();
                  onView(personId);
                }}
              />
            </Tooltip>
          )}
          {isEditing && (
            <Tooltip label={t("familyDetails.remove")} hasArrow>
              <IconButton
                size="xs"
                variant="ghost"
                colorScheme="error"
                icon={<LuX size={12} />}
                aria-label={t("familyDetails.remove")}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
              />
            </Tooltip>
          )}
        </HStack>
      </Td>
    </Tr>
  );
}

function AddMemberRow({ label, value, onChange, onSubmit, isSubmitting, t }) {
  return (
    <Tr bg="bg-input">
      <Td colSpan={6}>
        <Flex
          align="center"
          gap={2.5}
          direction={{ base: "column", sm: "row" }}>
          <Badge colorScheme="green" fontSize="2xs" rounded="sm" px={2}>
            {label}
          </Badge>
          <InputGroup size="sm" flex="1" w={{ base: "full", sm: "auto" }}>
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onSubmit();
                }
              }}
              placeholder={t("familyDetails.addPlaceholder")}
              rounded="sm"
              bg="bg-card"
              borderColor="border-color"
              fontFamily="mono"
              fontSize="xs"
              dir="ltr"
              maxLength={24}
              _hover={{ borderColor: "syria.green.light" }}
              _focus={{ borderColor: "syria.green.mid", boxShadow: "none" }}
            />
            <InputRightElement width="auto" pe={1}>
              <Button
                size="xs"
                colorScheme="success"
                leftIcon={<LuCheck size={10} />}
                onClick={onSubmit}
                isLoading={isSubmitting}
                loadingText=""
                h="24px">
                {t("familyDetails.add")}
              </Button>
            </InputRightElement>
          </InputGroup>
        </Flex>
      </Td>
    </Tr>
  );
}

function PdfTemplate({
  pdfRef,
  family,
  familyId,
  fatherData,
  motherData,
  childrenData,
  t,
  isRTL,
}) {
  const allMembers = [];

  if (fatherData) {
    allMembers.push({
      role: t("familyDetails.roles.father"),
      name: `${fatherData.first_name || ""} ${fatherData.last_name || ""}`.trim(),
      gender:
        fatherData.gender === "male"
          ? t("familyDetails.genderMale")
          : t("familyDetails.genderFemale"),
      age: calculateAge(fatherData.birth_date),
      birthDate: fatherData.birth_date,
      id: getPersonId(fatherData),
    });
  }

  if (motherData) {
    allMembers.push({
      role: t("familyDetails.roles.mother"),
      name: `${motherData.first_name || ""} ${motherData.last_name || ""}`.trim(),
      gender:
        motherData.gender === "male"
          ? t("familyDetails.genderMale")
          : t("familyDetails.genderFemale"),
      age: calculateAge(motherData.birth_date),
      birthDate: motherData.birth_date,
      id: getPersonId(motherData),
    });
  }

  childrenData.forEach((child) => {
    const cData = getPersonData(child) || child;
    const isFemale = cData.gender === "female";
    allMembers.push({
      role: isFemale
        ? t("familyDetails.roles.daughter")
        : t("familyDetails.roles.son"),
      name: `${cData.first_name || ""} ${cData.last_name || ""}`.trim(),
      gender: isFemale
        ? t("familyDetails.genderFemale")
        : t("familyDetails.genderMale"),
      age: calculateAge(cData.birth_date),
      birthDate: cData.birth_date,
      id: getPersonId(cData),
    });
  });

  const rtlCell = {
    padding: "10px 12px",
    borderBottom: "1px solid #e0e0e0",
    verticalAlign: "middle",
  };

  const rtlText = (content, extraStyle = {}) => (
    <span
      dir={isRTL ? "rtl" : "ltr"}
      style={{
        display: "inline-block",
        direction: isRTL ? "rtl" : "ltr",
        unicodeBidi: "isolate",
        textAlign: isRTL ? "right" : "left",
        width: "100%",
        ...extraStyle,
      }}>
      {content}
    </span>
  );

const headerText = (content) => (
  <span
    dir={isRTL ? "rtl" : "ltr"}
    style={{
      display: "inline-block",
      direction: isRTL ? "rtl" : "ltr",
      textAlign: isRTL ? "right" : "left",
      width: "100%",
      fontSize: "11px",
      fontWeight: "600",
      color: "#ffffff",
    }}>
    {content}
  </span>
);

  return (
    <Box
      ref={pdfRef}
      position="fixed"
      top="-10000px"
      left="-10000px"
      bg="#ffffff"
      color="#1a1a1a"
      p="40px"
      w="900px"
      style={{
        fontFamily: "'Segoe UI', Tahoma, Arial, sans-serif",
      }}>
      <Box
        mb="24px"
        pb="20px"
        borderBottom="3px double #054239"
        textAlign="center">
        <img
          src={syriaLogo}
          alt="Syrian Arab Republic"
          crossOrigin="anonymous"
          style={{
            width: "72px",
            height: "72px",
            objectFit: "contain",
            display: "block",
            margin: "0 auto 10px",
          }}
        />
        <div
          dir="rtl"
          style={{
            direction: "rtl",
            unicodeBidi: "isolate",
            textAlign: "center",
            fontSize: "18px",
            fontWeight: "bold",
            color: "#054239",
            marginBottom: "2px",
          }}>
          {t("familyDetails.export.republicNameAr")}
        </div>
        <div
          dir="ltr"
          style={{
            direction: "ltr",
            unicodeBidi: "isolate",
            textAlign: "center",
            fontSize: "10px",
            color: "#666",
            letterSpacing: "0.15em",
            marginBottom: "14px",
          }}>
          {t("familyDetails.export.republicNameEn")}
        </div>
        <div
          dir={isRTL ? "rtl" : "ltr"}
          style={{
            direction: isRTL ? "rtl" : "ltr",
            unicodeBidi: "isolate",
            textAlign: "center",
            fontSize: "16px",
            fontWeight: "bold",
            color: "#054239",
          }}>
          {t("familyDetails.export.documentTitle")}
        </div>
      </Box>

      <div
        dir={isRTL ? "rtl" : "ltr"}
        style={{
          direction: isRTL ? "rtl" : "ltr",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "20px",
          paddingBottom: "16px",
          borderBottom: "1px solid #d0d0d0",
        }}>
        <div style={{ textAlign: isRTL ? "right" : "left" }}>
          <div
            dir={isRTL ? "rtl" : "ltr"}
            style={{
              fontSize: "10px",
              color: "#666",
              marginBottom: "2px",
              direction: isRTL ? "rtl" : "ltr",
              unicodeBidi: "isolate",
            }}>
            {t("familyDetails.detailId")}
          </div>
          <div
            dir="ltr"
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              fontFamily: "monospace",
              color: "#054239",
              direction: "ltr",
              unicodeBidi: "isolate",
            }}>
            {familyId}
          </div>
        </div>
        <div style={{ textAlign: isRTL ? "left" : "right" }}>
          <div
            dir={isRTL ? "rtl" : "ltr"}
            style={{
              fontSize: "10px",
              color: "#666",
              marginBottom: "2px",
              direction: isRTL ? "rtl" : "ltr",
              unicodeBidi: "isolate",
            }}>
            {t("familyDetails.detailCreatedAt")}
          </div>
          <div
            dir={isRTL ? "rtl" : "ltr"}
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              color: "#054239",
              direction: isRTL ? "rtl" : "ltr",
              unicodeBidi: "isolate",
            }}>
            {family.createdAt ? formatNumeric(new Date(family.createdAt)) : "—"}
          </div>
        </div>
      </div>

      <table
        dir={isRTL ? "rtl" : "ltr"}
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "12px",
          border: "1px solid #d0d0d0",
          direction: isRTL ? "rtl" : "ltr",
          tableLayout: "fixed",
        }}>
        <thead>
          <tr style={{ backgroundColor: "#054239", color: "#ffffff" }}>
            <th
              dir={isRTL ? "rtl" : "ltr"}
              style={{
                ...rtlCell,
                borderBottom: "2px solid #002623",
                width: "10%",
                backgroundColor: "#054239",
              }}>
              {headerText(t("familyDetails.columns.role"))}
            </th>
            <th
              dir={isRTL ? "rtl" : "ltr"}
              style={{
                ...rtlCell,
                borderBottom: "2px solid #002623",
                width: "22%",
                backgroundColor: "#054239",
              }}>
              {headerText(t("familyDetails.columns.name"))}
            </th>
            <th
              dir={isRTL ? "rtl" : "ltr"}
              style={{
                ...rtlCell,
                borderBottom: "2px solid #002623",
                width: "10%",
                backgroundColor: "#054239",
              }}>
              {headerText(t("familyDetails.columns.gender"))}
            </th>
            <th
              dir={isRTL ? "rtl" : "ltr"}
              style={{
                ...rtlCell,
                borderBottom: "2px solid #002623",
                width: "8%",
                backgroundColor: "#054239",
              }}>
              {headerText(t("familyDetails.columns.age"))}
            </th>
            <th
              dir={isRTL ? "rtl" : "ltr"}
              style={{
                ...rtlCell,
                borderBottom: "2px solid #002623",
                width: "15%",
                backgroundColor: "#054239",
              }}>
              {headerText(t("familyDetails.columns.birthDate"))}
            </th>
            <th
              dir="ltr"
              style={{
                ...rtlCell,
                borderBottom: "2px solid #002623",
                width: "35%",
                backgroundColor: "#054239",
                textAlign: "left",
              }}>
              {headerText("ID")}
            </th>
          </tr>
        </thead>
        <tbody>
          {allMembers.map((member, idx) => (
            <tr
              key={idx}
              style={{
                backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f9f9f9",
                borderBottom: "1px solid #e0e0e0",
              }}>
              <td dir={isRTL ? "rtl" : "ltr"} style={rtlCell}>
                {rtlText(member.role, {
                  fontSize: "11px",
                  fontWeight: "600",
                  color:
                    member.role === t("familyDetails.roles.father") ||
                    member.role === t("familyDetails.roles.son")
                      ? "#1d4ed8"
                      : "#991b1b",
                })}
              </td>
              <td dir={isRTL ? "rtl" : "ltr"} style={rtlCell}>
                {rtlText(member.name, {
                  fontSize: "12px",
                  fontWeight: "500",
                  color: "#1a1a1a",
                })}
              </td>
              <td dir={isRTL ? "rtl" : "ltr"} style={rtlCell}>
                {rtlText(member.gender, {
                  fontSize: "11px",
                  color: "#333",
                })}
              </td>
              <td dir={isRTL ? "rtl" : "ltr"} style={rtlCell}>
                {rtlText(member.age !== null ? `${member.age}` : "—", {
                  fontSize: "11px",
                  color: "#333",
                })}
              </td>
              <td dir={isRTL ? "rtl" : "ltr"} style={rtlCell}>
                {rtlText(
                  member.birthDate
                    ? formatNumeric(new Date(member.birthDate))
                    : "—",
                  {
                    fontSize: "11px",
                    color: "#333",
                  },
                )}
              </td>
              <td dir="ltr" style={rtlCell}>
                <span
                  dir="ltr"
                  style={{
                    display: "inline-block",
                    direction: "ltr",
                    unicodeBidi: "isolate",
                    textAlign: "left",
                    width: "100%",
                    fontSize: "9px",
                    fontFamily: "Consolas, Monaco, monospace",
                    color: "#333",
                    letterSpacing: "0.02em",
                    wordBreak: "break-all",
                  }}>
                  {member.id || "—"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        dir={isRTL ? "rtl" : "ltr"}
        style={{
          direction: isRTL ? "rtl" : "ltr",
          marginTop: "24px",
          paddingTop: "12px",
          borderTop: "1px solid #d0d0d0",
          display: "flex",
          justifyContent: "space-between",
          fontSize: "10px",
          color: "#666",
        }}>
        <span
          dir={isRTL ? "rtl" : "ltr"}
          style={{
            direction: isRTL ? "rtl" : "ltr",
            unicodeBidi: "isolate",
          }}>
          {t("familyDetails.export.generatedOn")}: {formatNumeric(new Date())}
        </span>
        <span
          dir={isRTL ? "rtl" : "ltr"}
          style={{
            direction: isRTL ? "rtl" : "ltr",
            unicodeBidi: "isolate",
          }}>
          {t("familyDetails.export.registryFooter")}
        </span>
      </div>
    </Box>
  );
}

function PageSkeleton() {
  return (
    <Box w="full" py={1}>
      <Skeleton height="28px" width="120px" rounded="sm" mb={4} />
      <Box
        bg="bg-card"
        borderWidth="1px"
        borderColor="border-color"
        rounded="md"
        p={5}
        mb={4}>
        <SkeletonText noOfLines={2} spacing={3} />
      </Box>
      <Box
        bg="bg-card"
        borderWidth="1px"
        borderColor="border-color"
        rounded="md"
        p={5}>
        <SkeletonText noOfLines={8} spacing={3} />
      </Box>
    </Box>
  );
}

export default function FamilyDetailsPage() {
  const { target_id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { admin: currentAdmin } = useAuth();
  const appToast = useAppToast();

  const isRTL = i18n.language === "ar";
  const isSuper = currentAdmin?.role === "super";
  const canUpdate = isSuper || currentAdmin?.permissions?.includes("update");
  const canDelete = isSuper || currentAdmin?.permissions?.includes("delete");

  const [family, setFamily] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [editFatherId, setEditFatherId] = useState(null);
  const [editMotherId, setEditMotherId] = useState(null);
  const [editChildrenIds, setEditChildrenIds] = useState([]);
  const [newPersonData, setNewPersonData] = useState({});

  const [newFatherInput, setNewFatherInput] = useState("");
  const [newMotherInput, setNewMotherInput] = useState("");
  const [newChildInput, setNewChildInput] = useState("");
  const [fetchingId, setFetchingId] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelDeleteRef = useRef();
  const pdfRef = useRef();

  const appToastRef = useRef(appToast);
  appToastRef.current = appToast;
  const tRef = useRef(t);
  tRef.current = t;
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      try {
        const data = await familiesAPI.getById(target_id);
        if (cancelled) return;
        setFamily(data);
      } catch (err) {
        if (cancelled) return;
        appToastRef.current.error(err, tRef.current("familyDetails.loadError"));
        navigateRef.current("/family", { replace: true });
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [target_id]);

  const goToCitizen = (id) => {
    if (id) navigate(`/citizen/details/${id}`);
  };

  const goBack = () => {
    navigate("/family");
  };

  const startEdit = () => {
    const fId = getPersonId(family.father);
    const mId = getPersonId(family.mother);
    const cIds = Array.isArray(family.children_ids)
      ? family.children_ids.map((c) => getPersonId(c)).filter(Boolean)
      : [];

    setEditFatherId(fId);
    setEditMotherId(mId);
    setEditChildrenIds(cIds);
    setNewPersonData({});
    setNewFatherInput("");
    setNewMotherInput("");
    setNewChildInput("");
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setNewFatherInput("");
    setNewMotherInput("");
    setNewChildInput("");
    setNewPersonData({});
  };

  const saveEdit = async () => {
    if (!editFatherId && !editMotherId) {
      appToastRef.current.error(
        null,
        tRef.current("familyDetails.errors.cannotRemoveBothParents"),
      );
      return;
    }

    setIsSaving(true);
    try {
      await familiesAPI.update(target_id, {
        father: editFatherId || null,
        mother: editMotherId || null,
        children_ids: editChildrenIds,
      });
      appToastRef.current.success(tRef.current("familyDetails.saveSuccess"));
      setIsEditing(false);
      const updated = await familiesAPI.getById(target_id);
      setFamily(updated);
    } catch (err) {
      appToastRef.current.error(err, tRef.current("familyDetails.saveError"));
    } finally {
      setIsSaving(false);
    }
  };

  const fetchPerson = async (id) => {
    if (family.father && getPersonId(family.father) === id) {
      return getPersonData(family.father);
    }
    if (family.mother && getPersonId(family.mother) === id) {
      return getPersonData(family.mother);
    }
    if (Array.isArray(family.children_ids)) {
      for (const c of family.children_ids) {
        if (getPersonId(c) === id) return getPersonData(c) || c;
      }
    }
    if (newPersonData[id]) return newPersonData[id];

    try {
      const citizen = await citizensAPI.getById(id);
      setNewPersonData((prev) => ({ ...prev, [id]: citizen }));
      return citizen;
    } catch {
      return null;
    }
  };

  const handleAddFather = async () => {
    const id = newFatherInput.trim();
    if (!isValidObjectId(id)) {
      appToastRef.current.error(
        null,
        tRef.current("familyDetails.errors.invalidId"),
      );
      return;
    }
    if (id === editMotherId) {
      appToastRef.current.error(
        null,
        tRef.current("familyDetails.errors.sameForBothParents"),
      );
      return;
    }
    if (editChildrenIds.includes(id)) {
      appToastRef.current.error(
        null,
        tRef.current("familyDetails.errors.cannotBeBothParentAndChild"),
      );
      return;
    }

    setFetchingId("father");
    const person = await fetchPerson(id);
    setFetchingId(null);

    if (!person) {
      appToastRef.current.error(
        null,
        tRef.current("familyDetails.errors.citizenNotFound"),
      );
      return;
    }

    setEditFatherId(id);
    setNewFatherInput("");
  };

  const handleAddMother = async () => {
    const id = newMotherInput.trim();
    if (!isValidObjectId(id)) {
      appToastRef.current.error(
        null,
        tRef.current("familyDetails.errors.invalidId"),
      );
      return;
    }
    if (id === editFatherId) {
      appToastRef.current.error(
        null,
        tRef.current("familyDetails.errors.sameForBothParents"),
      );
      return;
    }
    if (editChildrenIds.includes(id)) {
      appToastRef.current.error(
        null,
        tRef.current("familyDetails.errors.cannotBeBothParentAndChild"),
      );
      return;
    }

    setFetchingId("mother");
    const person = await fetchPerson(id);
    setFetchingId(null);

    if (!person) {
      appToastRef.current.error(
        null,
        tRef.current("familyDetails.errors.citizenNotFound"),
      );
      return;
    }

    setEditMotherId(id);
    setNewMotherInput("");
  };

  const handleAddChild = async () => {
    const id = newChildInput.trim();
    if (!isValidObjectId(id)) {
      appToastRef.current.error(
        null,
        tRef.current("familyDetails.errors.invalidId"),
      );
      return;
    }
    if (editChildrenIds.includes(id)) {
      appToastRef.current.error(
        null,
        tRef.current("familyDetails.errors.alreadyInFamily"),
      );
      return;
    }
    if (id === editFatherId || id === editMotherId) {
      appToastRef.current.error(
        null,
        tRef.current("familyDetails.errors.cannotBeBothParentAndChild"),
      );
      return;
    }

    setFetchingId("child");
    const person = await fetchPerson(id);
    setFetchingId(null);

    if (!person) {
      appToastRef.current.error(
        null,
        tRef.current("familyDetails.errors.citizenNotFound"),
      );
      return;
    }

    setEditChildrenIds((prev) => [...prev, id]);
    setNewChildInput("");
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await familiesAPI.remove(target_id);
      appToastRef.current.success(tRef.current("familyDetails.deleteSuccess"));
      onClose();
      navigate("/family", { replace: true });
    } catch (err) {
      appToastRef.current.error(err, tRef.current("familyDetails.deleteError"));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportPDF = async () => {
    if (!pdfRef.current || isExporting) return;
    setIsExporting(true);
    try {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
      await new Promise((resolve) => setTimeout(resolve, 200));

      const canvas = await html2canvas(pdfRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
        windowWidth: pdfRef.current.scrollWidth,
        windowHeight: pdfRef.current.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const contentWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * contentWidth) / canvas.width;
      const maxContentHeight = pageHeight - margin * 2;

      if (imgHeight <= maxContentHeight) {
        pdf.addImage(imgData, "PNG", margin, margin, contentWidth, imgHeight);
      } else {
        let remainingHeight = imgHeight;
        let currentY = margin;
        let imgOffsetY = 0;
        const scaleRatio = canvas.width / contentWidth;

        while (remainingHeight > 0) {
          const availableHeight = pageHeight - margin - currentY;
          const portionHeight = Math.min(availableHeight, remainingHeight);
          const sourceY = imgOffsetY * scaleRatio;
          const sourceHeight = portionHeight * scaleRatio;

          const portionCanvas = document.createElement("canvas");
          portionCanvas.width = canvas.width;
          portionCanvas.height = Math.ceil(sourceHeight);
          const ctx = portionCanvas.getContext("2d");
          ctx.drawImage(
            canvas,
            0,
            sourceY,
            canvas.width,
            sourceHeight,
            0,
            0,
            portionCanvas.width,
            portionCanvas.height,
          );

          const portionImg = portionCanvas.toDataURL("image/png");
          pdf.addImage(
            portionImg,
            "PNG",
            margin,
            currentY,
            contentWidth,
            portionHeight,
          );

          remainingHeight -= portionHeight;
          imgOffsetY += portionHeight;

          if (remainingHeight > 0) {
            pdf.addPage();
            currentY = margin;
          }
        }
      }

      const date = new Date().toISOString().split("T")[0];
      const shortId = getObjectIdString(family._id).slice(-8);
      pdf.save(`family-${shortId}-${date}.pdf`);
      appToastRef.current.success(tRef.current("familyDetails.export.success"));
    } catch (err) {
      console.error("PDF export error:", err);
      appToastRef.current.error(
        err,
        tRef.current("familyDetails.export.error"),
      );
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) return <PageSkeleton />;
  if (!family) return null;

  const familyId = getObjectIdString(family._id);
  const backIcon = isRTL ? LuArrowRight : LuArrowLeft;

  const fatherData = isEditing
    ? editFatherId
      ? newPersonData[editFatherId] ||
        (getPersonId(family.father) === editFatherId
          ? getPersonData(family.father)
          : null)
      : null
    : getPersonData(family.father);

  const motherData = isEditing
    ? editMotherId
      ? newPersonData[editMotherId] ||
        (getPersonId(family.mother) === editMotherId
          ? getPersonData(family.mother)
          : null)
      : null
    : getPersonData(family.mother);

  const childrenData = isEditing
    ? editChildrenIds.map((id) => {
        const existing = (family.children_ids || []).find(
          (c) => getPersonId(c) === id,
        );
        return (
          newPersonData[id] ||
          (existing ? getPersonData(existing) || existing : { _id: id })
        );
      })
    : (family.children_ids || [])
        .map((c) => getPersonData(c) || c)
        .filter(Boolean);

  return (
    <Box w="full" py={1} dir={isRTL ? "rtl" : "ltr"}>
      <Button
        size="sm"
        variant="ghost"
        colorScheme="gray"
        leftIcon={<Icon as={backIcon} boxSize={4} />}
        onClick={goBack}
        mb={4}>
        {t("familyDetails.backToList")}
      </Button>

      <Box
        bg="bg-card"
        borderWidth="1px"
        borderColor="border-color"
        rounded="md"
        p={{ base: 4, md: 5 }}
        mb={4}>
        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <VStack align="start" spacing={1.5} minW={0}>
            <Heading size="md" color="text-primary" fontWeight="bold">
              {t("familyDetails.pageTitle")}
            </Heading>
            <HStack spacing={3} wrap="wrap" fontSize="xs" color="text-muted">
              <Badge
                fontFamily="mono"
                colorScheme="green"
                fontSize="2xs"
                px={2}
                rounded="sm">
                #{familyId?.slice(-8) || "—"}
              </Badge>
              {family.createdAt && (
                <Text>
                  {t("familyDetails.detailCreatedAt")}:{" "}
                  {formatNumeric(new Date(family.createdAt))}
                </Text>
              )}
            </HStack>
          </VStack>

          <HStack spacing={2} wrap="wrap">
            {!isEditing ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="gray"
                  leftIcon={<LuDownload size={14} />}
                  onClick={handleExportPDF}
                  isLoading={isExporting}
                  loadingText={t("familyDetails.export.exporting")}
                  rounded="md">
                  {t("familyDetails.export.button")}
                </Button>
                {canUpdate && (
                  <Button
                    size="sm"
                    colorScheme="success"
                    leftIcon={<LuPencil size={14} />}
                    onClick={startEdit}
                    rounded="md">
                    {t("familyDetails.editFamily")}
                  </Button>
                )}
                {canDelete && (
                  <Button
                    size="sm"
                    variant="outline"
                    colorScheme="error"
                    leftIcon={<LuTrash2 size={14} />}
                    onClick={onOpen}
                    rounded="md">
                    {t("familyDetails.deleteFamily")}
                  </Button>
                )}
                {!canUpdate && !canDelete && (
                  <Badge
                    colorScheme="gray"
                    variant="subtle"
                    fontSize="2xs"
                    rounded="sm"
                    px={2}
                    py={0.5}
                    textTransform="none">
                    {t("familyDetails.readOnly")}
                  </Badge>
                )}
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="gray"
                  leftIcon={<LuX size={14} />}
                  onClick={cancelEdit}
                  isDisabled={isSaving}
                  rounded="md">
                  {t("familyDetails.cancel")}
                </Button>
                <Button
                  size="sm"
                  colorScheme="success"
                  leftIcon={<LuCheck size={14} />}
                  onClick={saveEdit}
                  isLoading={isSaving}
                  loadingText={t("familyDetails.saving")}
                  rounded="md">
                  {t("familyDetails.save")}
                </Button>
              </>
            )}
          </HStack>
        </Flex>
      </Box>

      <Box
        bg="bg-card"
        borderWidth="1px"
        borderColor="border-color"
        rounded="md"
        overflow="hidden">
        <Box px={{ base: 4, md: 5 }} pt={4}>
          <SectionHeader
            icon={LuUser}
            title={t("familyDetails.membersTable")}
            actions={
              <Badge colorScheme="green" fontSize="2xs" rounded="sm" px={2}>
                {(fatherData ? 1 : 0) +
                  (motherData ? 1 : 0) +
                  childrenData.length}
              </Badge>
            }
          />
        </Box>

        <TableContainer>
          <Table variant="simple" size="sm" sx={{ tableLayout: "fixed" }}>
            <Thead bg="bg-input">
              <Tr>
                <Th
                  fontSize="xs"
                  color="text-muted"
                  py={3}
                  w="12%"
                  textAlign={isRTL ? "right" : "left"}>
                  {t("familyDetails.columns.role")}
                </Th>
                <Th
                  fontSize="xs"
                  color="text-muted"
                  py={3}
                  w="auto"
                  textAlign={isRTL ? "right" : "left"}>
                  {t("familyDetails.columns.name")}
                </Th>
                <Th
                  fontSize="xs"
                  color="text-muted"
                  py={3}
                  w="12%"
                  display={{ base: "none", sm: "table-cell" }}
                  textAlign={isRTL ? "right" : "left"}>
                  {t("familyDetails.columns.gender")}
                </Th>
                <Th
                  fontSize="xs"
                  color="text-muted"
                  py={3}
                  w="10%"
                  display={{ base: "none", md: "table-cell" }}
                  textAlign={isRTL ? "right" : "left"}>
                  {t("familyDetails.columns.age")}
                </Th>
                <Th
                  fontSize="xs"
                  color="text-muted"
                  py={3}
                  w="18%"
                  display={{ base: "none", lg: "table-cell" }}
                  textAlign={isRTL ? "right" : "left"}>
                  {t("familyDetails.columns.birthDate")}
                </Th>
                <Th
                  fontSize="xs"
                  color="text-muted"
                  py={3}
                  textAlign="end"
                  w="15%">
                  {t("familyDetails.columns.actions")}
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {fatherData ? (
                <MemberRow
                  person={fatherData}
                  role="father"
                  isEditing={isEditing}
                  onRemove={() => setEditFatherId(null)}
                  onView={goToCitizen}
                  t={t}
                />
              ) : isEditing && !editFatherId ? (
                <AddMemberRow
                  label={t("familyDetails.roles.father")}
                  value={newFatherInput}
                  onChange={setNewFatherInput}
                  onSubmit={handleAddFather}
                  isSubmitting={fetchingId === "father"}
                  t={t}
                />
              ) : (
                <MemberRow
                  person={null}
                  role="father"
                  isEditing={false}
                  onRemove={() => {}}
                  onView={goToCitizen}
                  t={t}
                />
              )}

              {motherData ? (
                <MemberRow
                  person={motherData}
                  role="mother"
                  isEditing={isEditing}
                  onRemove={() => setEditMotherId(null)}
                  onView={goToCitizen}
                  t={t}
                />
              ) : isEditing && !editMotherId ? (
                <AddMemberRow
                  label={t("familyDetails.roles.mother")}
                  value={newMotherInput}
                  onChange={setNewMotherInput}
                  onSubmit={handleAddMother}
                  isSubmitting={fetchingId === "mother"}
                  t={t}
                />
              ) : (
                <MemberRow
                  person={null}
                  role="mother"
                  isEditing={false}
                  onRemove={() => {}}
                  onView={goToCitizen}
                  t={t}
                />
              )}

              {childrenData.map((child, idx) => {
                const cid = getPersonId(child) || editChildrenIds[idx];
                const childGender = child?.gender;
                const childRole = childGender === "female" ? "daughter" : "son";
                return (
                  <MemberRow
                    key={cid || idx}
                    person={child}
                    role={childRole}
                    isEditing={isEditing}
                    onRemove={() =>
                      setEditChildrenIds((prev) =>
                        prev.filter((id) => id !== cid),
                      )
                    }
                    onView={goToCitizen}
                    t={t}
                  />
                );
              })}

              {isEditing && (
                <AddMemberRow
                  label={t("familyDetails.addChild")}
                  value={newChildInput}
                  onChange={setNewChildInput}
                  onSubmit={handleAddChild}
                  isSubmitting={fetchingId === "child"}
                  t={t}
                />
              )}

              {!isEditing && childrenData.length === 0 && (
                <Tr>
                  <Td colSpan={6} textAlign="center" py={8}>
                    <Text fontSize="sm" color="text-muted" fontStyle="italic">
                      {t("familyDetails.noChildren")}
                    </Text>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      <Box
        bg="bg-card"
        borderWidth="1px"
        borderColor="border-color"
        rounded="md"
        p={{ base: 4, md: 5 }}
        mt={4}>
        <SectionHeader
          icon={LuUser}
          title={t("familyDetails.sections.audit")}
        />
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={4}>
          <Box>
            <Text
              fontSize="2xs"
              fontWeight="semibold"
              color="text-muted"
              mb={1}
              textTransform="uppercase">
              {t("familyDetails.detailId")}
            </Text>
            <Text
              fontSize="sm"
              fontWeight="medium"
              color="text-primary"
              fontFamily="mono"
              wordBreak="break-all">
              {familyId}
            </Text>
          </Box>
          <Box>
            <Text
              fontSize="2xs"
              fontWeight="semibold"
              color="text-muted"
              mb={1}
              textTransform="uppercase">
              {t("familyDetails.detailUpdatedAt")}
            </Text>
            <Text fontSize="sm" color="text-primary">
              {family.updatedAt
                ? formatNumeric(new Date(family.updatedAt))
                : "—"}
            </Text>
          </Box>
          {family.added_by && (
            <Box>
              <Text
                fontSize="2xs"
                fontWeight="semibold"
                color="text-muted"
                mb={1}
                textTransform="uppercase">
                {t("familyDetails.detailAddedBy")}
              </Text>
              <Text
                fontSize="sm"
                color="text-primary"
                fontFamily="mono"
                wordBreak="break-all">
                {getObjectIdString(family.added_by)}
              </Text>
            </Box>
          )}
        </SimpleGrid>
      </Box>

      <PdfTemplate
        pdfRef={pdfRef}
        family={family}
        familyId={familyId}
        fatherData={fatherData}
        motherData={motherData}
        childrenData={childrenData}
        t={t}
        isRTL={isRTL}
      />

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelDeleteRef}
        onClose={onClose}
        isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="md" fontWeight="bold">
              {t("familyDetails.delete.title")}
            </AlertDialogHeader>
            <AlertDialogBody fontSize="sm">
              {t("familyDetails.delete.body")}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelDeleteRef} onClick={onClose} size="sm">
                {t("familyDetails.delete.cancel")}
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDeleteConfirm}
                isLoading={isDeleting}
                size="sm"
                ml={3}>
                {isDeleting
                  ? t("familyDetails.delete.deleting")
                  : t("familyDetails.delete.confirm")}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
