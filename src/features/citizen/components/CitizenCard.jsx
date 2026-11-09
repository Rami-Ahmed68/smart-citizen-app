// src/features/citizen/CitizenCard.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Badge,
  Box,
  Collapse,
  Divider,
  Flex,
  HStack,
  Icon,
  IconButton,
  SimpleGrid,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import {
  LuMail,
  LuPhone,
  LuCalendar,
  LuChevronDown,
  LuClock,
  LuActivity,
  LuMapPin,
  LuUser,
  LuShield,
  LuHeart,
  LuGlobe,
  LuBookOpen,
  LuUsers,
  LuLink,
} from "react-icons/lu";
import { useTranslation } from "react-i18next";
import { formatNumeric } from "../../../utils/date";
import {
  getGenderLabel,
  getMaritalStatusLabel,
  getCitizenshipTypeLabel,
  getNationalityLabel,
  getReligionLabel,
  getLocationLabel,
} from "../../../utils/citizenLabels";

const RAW_API_URL = process.env.REACT_APP_API_URL || "";
const RAW_CITIZEN_AVATAR_PATH =
  process.env.REACT_APP_CITIZEN_AVATAR_PATH || "/uploads/citizens";

const API_URL = RAW_API_URL.replace(/\/+$/, "");
const CITIZEN_AVATAR_PATH = RAW_CITIZEN_AVATAR_PATH.replace(/^\/+|\/+$/g, "");

const MAX_SPOUSES = { male: 4, female: 1 };

function buildCitizenAvatarUrl(filename) {
  if (!filename || typeof filename !== "string") return undefined;
  if (/^https?:\/\//i.test(filename)) return filename;
  if (!API_URL) return undefined;

  const cleanFile = filename.replace(/^\/+/, "");

  return CITIZEN_AVATAR_PATH
    ? `${API_URL}/${CITIZEN_AVATAR_PATH}/${cleanFile}`
    : `${API_URL}/${cleanFile}`;
}

function getFullName(citizen) {
  const parts = [citizen?.first_name, citizen?.last_name].filter(Boolean);
  return parts.length ? parts.join(" ") : "—";
}

function InfoCell({ icon, label, value, dir }) {
  return (
    <HStack spacing={2} align="start" minW={0}>
      <Flex
        align="center"
        justify="center"
        w={6}
        h={6}
        rounded="md"
        bg="bg-input"
        flexShrink={0}
        mt={0.5}>
        <Icon as={icon} boxSize={3} color="text-muted" />
      </Flex>
      <VStack align="start" spacing={0} minW={0} flex="1">
        <Text
          fontSize="2xs"
          color="text-muted"
          textTransform="uppercase"
          letterSpacing="0.05em"
          fontWeight="semibold">
          {label}
        </Text>
        <Text
          fontSize="xs"
          color="text-primary"
          fontWeight="medium"
          noOfLines={2}
          dir={dir}
          wordBreak="break-word">
          {value || "—"}
        </Text>
      </VStack>
    </HStack>
  );
}

export default function CitizenCard({ citizen }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const fullName = getFullName(citizen);
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
  const nationalityLabel = getNationalityLabel(
    citizen?.original_nationality,
    citizen?.gender,
    t,
  );
  const religionLabel = getReligionLabel(citizen?.religion, t);
  const locationLabel = getLocationLabel(citizen?.location, t);
  const avatarUrl = buildCitizenAvatarUrl(citizen?.photo);

  const ownFamilies = Array.isArray(citizen?.own_family_ids)
    ? citizen.own_family_ids
    : [];

  const marriagesCount = ownFamilies.length;
  const maxMarriages = MAX_SPOUSES[citizen?.gender] ?? 1;

  const childrenCount = ownFamilies.reduce(
    (sum, family) =>
      sum +
      (Array.isArray(family?.children_ids) ? family.children_ids.length : 0),
    0,
  );

  const parentsFamily =
    citizen?.parents_family_id && typeof citizen.parents_family_id === "object"
      ? citizen.parents_family_id
      : null;
  const hasFather = !!parentsFamily?.father;
  const hasMother = !!parentsFamily?.mother;

  const maritalBadgeColor =
    citizen?.marital_status === "Married"
      ? "green"
      : citizen?.marital_status === "Divorced" ||
          citizen?.marital_status === "Widowed"
        ? "orange"
        : "gray";

  const handleGoToProfile = () => {
    if (citizen?._id) navigate(`/citizen/details/${citizen._id}`);
  };

  return (
    <Box
      bg="bg-card"
      borderWidth="1px"
      borderColor={isExpanded ? "syria.green.light" : "border-color"}
      rounded="md"
      w="full"
      shadow={isExpanded ? "sm" : "none"}
      overflow="hidden"
      sx={{
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
        willChange: "box-shadow, border-color",
      }}>
      <Flex
        align="center"
        gap={{ base: 2, md: 3 }}
        px={{ base: 3, md: 4 }}
        py={2.5}>
        <HStack spacing={{ base: 2, md: 3 }} align="center" flex="1" minW={0}>
          <Box flexShrink={0}>
            <Avatar
              size="md"
              name={fullName}
              src={avatarUrl}
              bg="syria.green.mid"
              color="white"
              borderRadius="md"
              onClick={handleGoToProfile}
              cursor="pointer"
            />
          </Box>

          <VStack align="start" spacing={0} minW={0} flex="1">
            <Text
              onClick={handleGoToProfile}
              cursor="pointer"
              fontWeight="semibold"
              fontSize="sm"
              color="text-primary"
              noOfLines={1}
              _hover={{ color: "text-primary" }}>
              {fullName}
            </Text>
            <HStack spacing={1} minW={0}>
              <Icon
                as={LuPhone}
                boxSize={3}
                color="text-muted"
                flexShrink={0}
              />
              <Text fontSize="xs" color="text-muted" noOfLines={1} dir="ltr">
                {citizen?.phone_number || "—"}
              </Text>
            </HStack>
          </VStack>
        </HStack>

        <HStack
          spacing={1.5}
          display={{ base: "none", lg: "flex" }}
          fontSize="xs"
          color="text-secondary"
          minW="130px">
          <Icon as={LuMapPin} boxSize={3.5} color="text-muted" />
          <Text noOfLines={1}>{locationLabel}</Text>
        </HStack>

        <Divider
          orientation="vertical"
          h="6"
          borderColor="border-color"
          display={{ base: "none", lg: "block" }}
        />

        <HStack
          spacing={1.5}
          display={{ base: "none", xl: "flex" }}
          fontSize="xs"
          color="text-secondary"
          minW="110px">
          <Icon as={LuActivity} boxSize={3.5} color="text-muted" />
          <Text noOfLines={1}>{genderLabel}</Text>
        </HStack>

        <Divider
          orientation="vertical"
          h="6"
          borderColor="border-color"
          display={{ base: "none", xl: "block" }}
        />

        <Badge
          colorScheme={maritalBadgeColor}
          variant="subtle"
          fontSize="2xs"
          rounded="md"
          px={2}
          py={0.5}
          textTransform="none"
          flexShrink={0}
          display={{ base: "none", md: "inline-flex" }}>
          {maritalLabel}
        </Badge>

        <Tooltip
          label={
            isExpanded ? t("citizens.collapseRow") : t("citizens.expandRow")
          }
          placement="top">
          <IconButton
            size="xs"
            variant="ghost"
            icon={<LuChevronDown size={16} />}
            aria-label={
              isExpanded ? t("citizens.collapseRow") : t("citizens.expandRow")
            }
            aria-expanded={isExpanded}
            onClick={() => setIsExpanded((p) => !p)}
            flexShrink={0}
            color="text-muted"
            transform={isExpanded ? "rotate(180deg)" : "rotate(0deg)"}
            sx={{
              transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </Tooltip>
      </Flex>

      <Collapse in={isExpanded} animateOpacity unmountOnExit>
        <Divider borderColor="border-color" />
        <Box px={{ base: 3, md: 4 }} py={3}>
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={3}>
            <InfoCell
              icon={LuCalendar}
              label={t("citizens.detailBirthDate")}
              value={
                citizen?.birth_date
                  ? formatNumeric(new Date(citizen.birth_date))
                  : "—"
              }
              dir="ltr"
            />
            <InfoCell
              icon={LuActivity}
              label={t("citizens.detailGender")}
              value={genderLabel}
            />
            <InfoCell
              icon={LuHeart}
              label={t("citizens.detailMaritalStatus")}
              value={maritalLabel}
            />
            <InfoCell
              icon={LuBookOpen}
              label={t("citizens.detailReligion")}
              value={religionLabel}
            />
            <InfoCell
              icon={LuMapPin}
              label={t("citizens.detailLocation")}
              value={locationLabel}
            />
            <InfoCell
              icon={LuGlobe}
              label={t("citizens.detailOriginalNationality")}
              value={nationalityLabel}
            />
            <InfoCell
              icon={LuShield}
              label={t("citizens.detailCitizenshipType")}
              value={citizenshipLabel}
            />
            <InfoCell
              icon={LuMail}
              label={t("citizens.detailEmail")}
              value={citizen?.email}
              dir="ltr"
            />
            <InfoCell
              icon={LuPhone}
              label={t("citizens.detailPhone")}
              value={citizen?.phone_number}
              dir="ltr"
            />
            <InfoCell
              icon={LuLink}
              label={t("citizens.detailFather")}
              value={hasFather ? t("citizens.linked") : t("citizens.notLinked")}
            />
            <InfoCell
              icon={LuLink}
              label={t("citizens.detailMother")}
              value={hasMother ? t("citizens.linked") : t("citizens.notLinked")}
            />
            <InfoCell
              icon={LuUser}
              label={t("citizens.detailMarriages")}
              value={
                marriagesCount > 0
                  ? `${marriagesCount}/${maxMarriages}`
                  : t("citizens.noSpouse")
              }
              dir="ltr"
            />
            <InfoCell
              icon={LuUsers}
              label={t("citizens.detailChildren")}
              value={
                childrenCount > 0
                  ? `${childrenCount} ${t("citizens.childrenCount")}`
                  : t("citizens.noChildren")
              }
            />
            <InfoCell
              icon={LuClock}
              label={t("citizens.detailCreatedAt")}
              value={
                citizen?.createdAt
                  ? formatNumeric(new Date(citizen.createdAt))
                  : "—"
              }
              dir="ltr"
            />
            <InfoCell
              icon={LuClock}
              label={t("citizens.detailUpdatedAt")}
              value={
                citizen?.updatedAt
                  ? formatNumeric(new Date(citizen.updatedAt))
                  : "—"
              }
              dir="ltr"
            />
          </SimpleGrid>
        </Box>
      </Collapse>
    </Box>
  );
}
