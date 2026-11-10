// src/pages/profile/ProfileSkeleton.jsx
import {
  Box,
  Flex,
  GridItem,
  HStack,
  SimpleGrid,
  Skeleton,
  SkeletonCircle,
  VStack,
} from "@chakra-ui/react";

function SectionSkeleton({ titleWidth = "140px", children }) {
  return (
    <Box
      bg="bg-card"
      borderWidth="1px"
      borderColor="border-color"
      rounded="md"
      overflow="hidden"
      h="100%"
      display="flex"
      flexDirection="column">
      <Flex
        align="center"
        gap={3}
        px={5}
        py={4}
        borderBottomWidth="1px"
        borderColor="border-color">
        <Skeleton height="40px" width="40px" rounded="md" flexShrink={0} />
        <VStack align="start" spacing={1.5} flex="1">
          <Skeleton height="8px" width="24px" rounded="sm" />
          <Skeleton height="14px" width={titleWidth} rounded="sm" />
        </VStack>
      </Flex>
      <Box p={{ base: 4, md: 5 }} flex="1">
        {children}
      </Box>
    </Box>
  );
}

function PersonalInfoBodySkeleton() {
  return (
    <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
      {[1, 2, 3, 4].map((i) => (
        <VStack key={i} align="stretch" spacing={2}>
          <Skeleton height="10px" width="90px" rounded="sm" />
          <Skeleton height="18px" width="70%" rounded="sm" />
        </VStack>
      ))}
      <Box gridColumn={{ base: "span 1", sm: "span 2" }}>
        <VStack align="stretch" spacing={2}>
          <Skeleton height="10px" width="70px" rounded="sm" />
          <Skeleton height="18px" width="50%" rounded="sm" />
        </VStack>
      </Box>
    </SimpleGrid>
  );
}

function InfoRowsBodySkeleton({ count = 6 }) {
  return (
    <VStack align="stretch" spacing={0}>
      {Array.from({ length: count }).map((_, i) => (
        <Flex
          key={i}
          align="center"
          gap={3}
          py={2.5}
          borderBottomWidth={i === count - 1 ? 0 : "1px"}
          borderColor="border-color">
          <Skeleton height="28px" width="28px" rounded="sm" flexShrink={0} />
          <Skeleton height="10px" flex="1" rounded="sm" />
          <Skeleton height="14px" width="100px" rounded="sm" />
        </Flex>
      ))}
    </VStack>
  );
}

function FormFieldsBodySkeleton({ count = 3 }) {
  return (
    <VStack align="stretch" spacing={3}>
      {Array.from({ length: count }).map((_, i) => (
        <VStack key={i} align="stretch" spacing={1.5}>
          <Skeleton height="10px" width="100px" rounded="sm" />
          <Skeleton height="32px" width="100%" rounded="sm" />
        </VStack>
      ))}
      <Skeleton height="32px" width="100%" rounded="md" mt={2} />
    </VStack>
  );
}

function PermissionsBodySkeleton({ count = 4 }) {
  return (
    <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
      {Array.from({ length: count }).map((_, i) => (
        <Flex
          key={i}
          p={3}
          rounded="sm"
          bg="bg-input"
          borderWidth="1px"
          borderColor="border-color"
          align="center"
          gap={2.5}>
          <Skeleton height="32px" width="32px" rounded="sm" flexShrink={0} />
          <Skeleton height="14px" width="80px" rounded="sm" />
        </Flex>
      ))}
    </SimpleGrid>
  );
}

function HeroSkeleton() {
  return (
    <Box
      bg="bg-card"
      borderWidth="1px"
      borderColor="border-color"
      rounded="md"
      overflow="hidden"
      shadow="md"
      mb={5}>
      <Box h="160px" bg="syria.green.mid" opacity={0.35} />
      <Flex justify="center" mt="-56px" position="relative" zIndex={2}>
        <SkeletonCircle
          size="128px"
          borderWidth="6px"
          borderColor="bg-card"
          shadow="2xl"
        />
      </Flex>
      <VStack spacing={3} px={6} pt={4} pb={6} align="center">
        <Skeleton height="24px" width="220px" rounded="sm" />
        <HStack spacing={2}>
          <Skeleton height="20px" width="80px" rounded="sm" />
          <Skeleton height="20px" width="70px" rounded="sm" />
        </HStack>
        <HStack spacing={2} pt={1}>
          <Skeleton height="26px" width="170px" rounded="md" />
          <Skeleton height="26px" width="130px" rounded="md" />
        </HStack>
      </VStack>
    </Box>
  );
}

function StatsSkeleton() {
  return (
    <SimpleGrid columns={{ base: 2, lg: 4 }} spacing={3} mb={5}>
      {[1, 2, 3, 4].map((i) => (
        <Box
          key={i}
          bg="bg-card"
          borderWidth="1px"
          borderColor="border-color"
          rounded="md"
          px={4}
          py={3}>
          <HStack spacing={3} align="center">
            <Skeleton height="36px" width="36px" rounded="sm" flexShrink={0} />
            <VStack align="start" spacing={1.5} flex="1" minW={0}>
              <Skeleton height="8px" width="60%" rounded="sm" />
              <Skeleton height="14px" width="80%" rounded="sm" />
            </VStack>
          </HStack>
        </Box>
      ))}
    </SimpleGrid>
  );
}

export default function ProfileSkeleton({ isRTL = false }) {
  return (
    <Box w="full" py={1} dir={isRTL ? "rtl" : "ltr"}>
      <HeroSkeleton />
      <StatsSkeleton />

      <SimpleGrid columns={{ base: 1, lg: 12 }} spacing={5}>
        <GridItem colSpan={{ base: 1, lg: 7 }}>
          <SectionSkeleton titleWidth="170px">
            <PersonalInfoBodySkeleton />
          </SectionSkeleton>
        </GridItem>

        <GridItem colSpan={{ base: 1, lg: 5 }}>
          <SectionSkeleton titleWidth="140px">
            <InfoRowsBodySkeleton count={6} />
          </SectionSkeleton>
        </GridItem>

        <GridItem colSpan={{ base: 1, lg: 5 }}>
          <SectionSkeleton titleWidth="130px">
            <FormFieldsBodySkeleton count={3} />
          </SectionSkeleton>
        </GridItem>

        <GridItem colSpan={{ base: 1, lg: 7 }}>
          <SectionSkeleton titleWidth="120px">
            <PermissionsBodySkeleton count={4} />
          </SectionSkeleton>
        </GridItem>
      </SimpleGrid>
    </Box>
  );
}
