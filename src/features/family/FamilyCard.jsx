import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Skeleton,
  SkeletonText,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import {
  LuBaby,
  LuExternalLink,
  LuLayers,
  LuTrash2,
  LuUserCheck,
} from "react-icons/lu";
import { formatNumeric } from "../../utils/date";

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

export function getObjectIdString(value) {
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

function isPopulatedPerson(value) {
  if (!value || typeof value !== "object") return false;
  return !!(value.first_name || value.last_name);
}

function getPersonData(value) {
  if (!value) return null;
  if (isPopulatedPerson(value)) return value;
  return null;
}

function getPersonId(value) {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (isPopulatedPerson(value)) return getObjectIdString(value._id);
  return getObjectIdString(value);
}

function PersonRow({ person, label, fallbackText, icon, onNavigate, t }) {
  const data = getPersonData(person);
  const id = getPersonId(person);
  const fullName = data
    ? `${data.first_name || ""} ${data.last_name || ""}`.trim() || "—"
    : "";
  const avatar = data ? buildCitizenAvatarUrl(data.photo) : undefined;

  return (
    <HStack spacing={2} align="center">
      <Icon as={icon} boxSize={3.5} color="syria.wheat.dark" flexShrink={0} />
      <Text fontSize="xs" color="text-muted" fontWeight="semibold" minW="55px">
        {label}
      </Text>
      {data ? (
        <>
          <Avatar
            size="xs"
            name={fullName}
            src={avatar}
            bg="syria.green.mid"
            color="white"
            borderWidth="1px"
            borderColor="syria.wheat.mid"
            flexShrink={0}
          />
          <Text
            fontSize="sm"
            fontWeight="medium"
            color="text-primary"
            flex="1"
            noOfLines={1}>
            {fullName}
          </Text>
          {onNavigate && id && (
            <Tooltip label={t("families.card.viewCitizen")} hasArrow>
              <IconButton
                size="xs"
                variant="ghost"
                colorScheme="success"
                icon={<LuExternalLink size={10} />}
                aria-label={t("families.card.viewCitizen")}
                onClick={() => onNavigate(id)}
              />
            </Tooltip>
          )}
        </>
      ) : (
        <Text fontSize="xs" color="text-muted" fontStyle="italic" flex="1">
          {fallbackText}
        </Text>
      )}
    </HStack>
  );
}

export function FamilyCard({
  family,
  canDelete,
  onView,
  onDelete,
  onNavigate,
  t,
}) {
  const familyId = getObjectIdString(family?._id);
  const father = family?.father;
  const mother = family?.mother;
  const childrenCount = Array.isArray(family?.children_ids)
    ? family.children_ids.length
    : 0;

  return (
    <Box
      bg="bg-card"
      borderWidth="1px"
      borderColor="border-color"
      rounded="md"
      overflow="hidden"
      transition="all 0.2s ease"
      _hover={{ borderColor: "syria.green.mid", shadow: "md" }}>
      <Flex
        bg="bg-input"
        px={3}
        py={2}
        borderBottomWidth="1px"
        borderColor="border-color"
        align="center"
        gap={2}>
        <Icon as={LuLayers} boxSize={3.5} color="syria.wheat.dark" />
        <Badge
          fontFamily="mono"
          colorScheme="green"
          fontSize="2xs"
          px={2}
          flexShrink={0}>
          #{familyId?.slice(-8) || "—"}
        </Badge>
        <Text fontSize="2xs" color="text-muted" flex="1" noOfLines={1}>
          {family.createdAt ? formatNumeric(new Date(family.createdAt)) : "—"}
        </Text>
      </Flex>

      <VStack align="stretch" spacing={2.5} p={3}>
        <PersonRow
          person={father}
          label={t("families.card.father")}
          fallbackText={t("families.card.noFather")}
          icon={LuUserCheck}
          onNavigate={onNavigate}
          t={t}
        />
        <PersonRow
          person={mother}
          label={t("families.card.mother")}
          fallbackText={t("families.card.noMother")}
          icon={LuUserCheck}
          onNavigate={onNavigate}
          t={t}
        />

        <HStack spacing={2} align="center">
          <Icon as={LuBaby} boxSize={3.5} color="syria.wheat.dark" />
          <Text
            fontSize="xs"
            color="text-muted"
            fontWeight="semibold"
            minW="55px">
            {t("families.card.children")}
          </Text>
          <Badge
            colorScheme={childrenCount > 0 ? "green" : "gray"}
            fontSize="2xs"
            rounded="sm"
            px={2}>
            {childrenCount}
          </Badge>
          {childrenCount === 0 && (
            <Text fontSize="xs" color="text-muted" fontStyle="italic">
              {t("families.card.noChildren")}
            </Text>
          )}
        </HStack>
      </VStack>

      <HStack
        spacing={2}
        p={2}
        borderTopWidth="1px"
        borderColor="border-color"
        bg="bg-input"
        justify="space-between">
        <Button
          size="xs"
          colorScheme="success"
          variant="outline"
          leftIcon={<LuExternalLink size={10} />}
          onClick={() => onView(familyId)}
          isDisabled={!familyId}>
          {t("families.card.view")}
        </Button>
        {canDelete && (
          <Tooltip label={t("families.card.delete")} hasArrow>
            <IconButton
              size="xs"
              variant="ghost"
              colorScheme="error"
              icon={<LuTrash2 size={12} />}
              aria-label={t("families.card.delete")}
              onClick={() => onDelete(family)}
              isDisabled={!familyId}
            />
          </Tooltip>
        )}
      </HStack>
    </Box>
  );
}

export function FamilyCardSkeleton() {
  return (
    <Box
      bg="bg-card"
      borderWidth="1px"
      borderColor="border-color"
      rounded="md"
      overflow="hidden">
      <Box
        bg="bg-input"
        px={3}
        py={2}
        borderBottomWidth="1px"
        borderColor="border-color">
        <Skeleton height="14px" width="100px" rounded="sm" />
      </Box>
      <VStack align="stretch" spacing={2.5} p={3}>
        {[1, 2, 3].map((i) => (
          <HStack key={i} spacing={2}>
            <Skeleton height="20px" width="20px" rounded="full" />
            <Skeleton height="12px" flex="1" rounded="sm" />
          </HStack>
        ))}
      </VStack>
      <Box p={2} borderTopWidth="1px" borderColor="border-color" bg="bg-input">
        <SkeletonText noOfLines={1} spacing={1} />
      </Box>
    </Box>
  );
}
