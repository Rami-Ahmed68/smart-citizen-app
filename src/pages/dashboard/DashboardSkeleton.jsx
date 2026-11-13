// src/pages/dashboard/DashboardSkeleton.jsx
import {
  Box,
  Flex,
  HStack,
  SimpleGrid,
  Skeleton,
  VStack,
} from "@chakra-ui/react";

function QuickNavSkeleton() {
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
          <Skeleton height="12px" width="70%" rounded="sm" />
          <Skeleton height="8px" width="90%" rounded="sm" />
        </VStack>
      </HStack>
    </Box>
  );
}

function StatSkeleton() {
  return (
    <Box
      bg="bg-card"
      borderWidth="1px"
      borderColor="border-color"
      rounded="md"
      p={5}>
      <VStack align="start" spacing={3}>
        <HStack spacing={2} w="full">
          <Skeleton height="32px" width="32px" rounded="md" />
          <Skeleton height="10px" width="60%" rounded="sm" />
        </HStack>
        <Skeleton height="32px" width="50%" rounded="sm" />
        <Skeleton height="8px" width="80%" rounded="sm" />
      </VStack>
    </Box>
  );
}

function GovernorateSkeleton() {
  return (
    <Box
      bg="bg-card"
      borderWidth="1px"
      borderColor="border-color"
      rounded="md"
      p={3}>
      <VStack align="start" spacing={2}>
        <HStack spacing={1.5}>
          <Skeleton height="12px" width="12px" rounded="sm" />
          <Skeleton height="10px" width="60%" rounded="sm" />
        </HStack>
        <Skeleton height="22px" width="40%" rounded="sm" />
      </VStack>
    </Box>
  );
}

export default function DashboardSkeleton({ isRTL = false }) {
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
        <HStack spacing={3}>
          <Skeleton height="48px" width="48px" rounded="md" />
          <VStack align="start" spacing={2}>
            <Skeleton height="20px" width="180px" rounded="sm" />
            <Skeleton height="10px" width="260px" rounded="sm" />
          </VStack>
        </HStack>
      </Flex>

      <Skeleton height="14px" width="160px" rounded="sm" mb={3} />
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={3} mb={6}>
        {[1, 2, 3, 4].map((i) => (
          <QuickNavSkeleton key={i} />
        ))}
      </SimpleGrid>

      <Skeleton height="14px" width="140px" rounded="sm" mb={3} />
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={3} mb={6}>
        {[1, 2, 3, 4].map((i) => (
          <StatSkeleton key={i} />
        ))}
      </SimpleGrid>

      <Box
        bg="bg-card"
        borderWidth="1px"
        borderColor="border-color"
        rounded="md"
        p={4}>
        <HStack
          justify="space-between"
          mb={4}
          pb={3}
          borderBottomWidth="1px"
          borderColor="border-color">
          <HStack spacing={2}>
            <Skeleton height="16px" width="16px" rounded="sm" />
            <Skeleton height="14px" width="140px" rounded="sm" />
          </HStack>
          <Skeleton height="28px" width="180px" rounded="sm" />
        </HStack>
        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 7 }}
          spacing={3}>
          {Array.from({ length: 14 }).map((_, i) => (
            <GovernorateSkeleton key={i} />
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
}
