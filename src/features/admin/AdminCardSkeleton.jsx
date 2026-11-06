import {
  Flex,
  HStack,
  Skeleton,
  SkeletonCircle,
  VStack,
} from "@chakra-ui/react";

export default function AdminCardSkeleton() {
  return (
    <Flex
      align="center"
      gap={{ base: 2, md: 4 }}
      px={{ base: 3, md: 4 }}
      py={3}
      bg="bg-card"
      borderWidth="1px"
      borderColor="border-color"
      rounded="xl"
      w="full">
      <SkeletonCircle size="10" />
      <VStack align="start" spacing={1} flex="1" minW={0}>
        <Skeleton height="14px" width="40%" />
        <Skeleton height="12px" width="60%" />
      </VStack>
      <Skeleton height="20px" width="60px" rounded="md" />
      <Skeleton height="24px" width="60px" rounded="md" />
      <HStack spacing={1}>
        <SkeletonCircle size="7" />
        <SkeletonCircle size="7" />
        <SkeletonCircle size="7" />
      </HStack>
    </Flex>
  );
}
