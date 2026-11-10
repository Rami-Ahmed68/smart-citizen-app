// src/features/family/FamilySkeleton.jsx
import {
  Box,
  Flex,
  HStack,
  SimpleGrid,
  Skeleton,
  SkeletonText,
  VStack,
} from "@chakra-ui/react";

export function FamilyCardSkeleton() {
  return (
    <Flex
      direction="column"
      h="full"
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
        borderColor="border-color"
        flexShrink={0}>
        <Skeleton height="14px" width="100px" rounded="sm" />
      </Box>
      <VStack align="stretch" spacing={2.5} p={3} flex="1">
        {[1, 2, 3].map((i) => (
          <HStack key={i} spacing={2}>
            <Skeleton height="20px" width="20px" rounded="full" />
            <Skeleton height="12px" flex="1" rounded="sm" />
          </HStack>
        ))}
      </VStack>
      <Box
        p={2}
        borderTopWidth="1px"
        borderColor="border-color"
        bg="bg-input"
        flexShrink={0}>
        <SkeletonText noOfLines={1} spacing={1} />
      </Box>
    </Flex>
  );
}

export default function FamiliesGridSkeleton({ count = 6 }) {
  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
      {Array.from({ length: count }).map((_, i) => (
        <FamilyCardSkeleton key={i} />
      ))}
    </SimpleGrid>
  );
}
