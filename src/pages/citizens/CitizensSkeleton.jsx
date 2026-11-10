// src/pages/citizen/CitizensSkeleton.jsx
import {
  Box,
  HStack,
  Skeleton,
  SkeletonCircle,
  Stack,
  VStack,
} from "@chakra-ui/react";

function CitizenCardSkeleton() {
  return (
    <Box
      bg="bg-card"
      borderWidth="1px"
      borderColor="border-color"
      rounded="md"
      p={4}>
      <HStack spacing={3}>
        <SkeletonCircle size="10" flexShrink={0} />
        <VStack align="start" spacing={2} flex="1" minW={0}>
          <Skeleton height="14px" width="180px" rounded="sm" />
          <Skeleton height="10px" width="120px" rounded="sm" />
        </VStack>
        <Skeleton height="20px" width="60px" rounded="sm" flexShrink={0} />
      </HStack>
    </Box>
  );
}

export default function CitizensSkeleton({ cardCount = 5 }) {
  return (
    <Stack spacing={3}>
      {Array.from({ length: cardCount }).map((_, i) => (
        <CitizenCardSkeleton key={i} />
      ))}
    </Stack>
  );
}
