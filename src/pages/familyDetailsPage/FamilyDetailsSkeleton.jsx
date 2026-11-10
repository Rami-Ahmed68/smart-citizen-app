import {
  Box,
  Flex,
  HStack,
  SimpleGrid,
  Skeleton,
  VStack,
} from "@chakra-ui/react";

export default function FamilyDetailsSkeleton({ isRTL = false }) {
  return (
    <Box w="full" py={1} dir={isRTL ? "rtl" : "ltr"}>
      <Box
        bg="bg-card"
        borderWidth="1px"
        borderColor="border-color"
        rounded="md"
        p={{ base: 4, md: 5 }}
        mb={4}>
        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <VStack align="start" spacing={2} flex="1" minW={0}>
            <Skeleton height="24px" width="180px" rounded="sm" />
            <HStack spacing={3}>
              <Skeleton height="22px" width="90px" rounded="sm" />
              <Skeleton height="14px" width="160px" rounded="sm" />
            </HStack>
          </VStack>
          <HStack spacing={2} wrap="wrap">
            <Skeleton height="32px" width="110px" rounded="md" />
            <Skeleton height="32px" width="100px" rounded="md" />
            <Skeleton height="32px" width="100px" rounded="md" />
          </HStack>
        </Flex>
      </Box>

      <Box
        bg="bg-card"
        borderWidth="1px"
        borderColor="border-color"
        rounded="md"
        overflow="hidden">
        <Box px={{ base: 4, md: 5 }} pt={4} pb={3}>
          <HStack spacing={2}>
            <Skeleton height="16px" width="16px" rounded="sm" />
            <Skeleton height="16px" width="140px" rounded="sm" />
          </HStack>
        </Box>
        <Box px={{ base: 4, md: 5 }} pb={4}>
          <VStack align="stretch" spacing={3}>
            <Skeleton height="40px" rounded="sm" />
            {[1, 2, 3, 4].map((i) => (
              <HStack key={i} spacing={3}>
                <Skeleton height="20px" width="60px" rounded="sm" />
                <Skeleton height="20px" width="32px" rounded="full" />
                <Skeleton height="16px" flex="1" rounded="sm" />
              </HStack>
            ))}
          </VStack>
        </Box>
      </Box>

      <Box
        bg="bg-card"
        borderWidth="1px"
        borderColor="border-color"
        rounded="md"
        p={{ base: 4, md: 5 }}
        mt={4}>
        <Box mb={4} pb={3} borderBottomWidth="1px" borderColor="border-color">
          <HStack spacing={2}>
            <Skeleton height="16px" width="16px" rounded="sm" />
            <Skeleton height="16px" width="120px" rounded="sm" />
          </HStack>
        </Box>
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={4}>
          {[1, 2, 3].map((i) => (
            <VStack key={i} align="stretch" spacing={2}>
              <Skeleton height="10px" width="80px" rounded="sm" />
              <Skeleton height="16px" width="70%" rounded="sm" />
            </VStack>
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
}
