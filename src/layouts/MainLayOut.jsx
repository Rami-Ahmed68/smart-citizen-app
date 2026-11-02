import { useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import NavBar from "../components/common/NavBar";
import SidBar from "../components/common/SidBar";

export default function MainLayOut({ children, role = "user" }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Flex direction="column" h="100vh" bg="bg-body">
      <Box
        as="header"
        h="60px"
        flexShrink={0}
        bg="nav-bar"
        backdropFilter="blur(8px)"
        px={3}
        display="flex"
        alignItems="center"
        borderBottomWidth="1px"
        borderColor="border-color">
        <NavBar onMenuClick={() => setSidebarOpen(true)} />
      </Box>

      <Flex flex="1" overflow="hidden">
        <SidBar
          role={role}
          open={isSidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <Box as="main" flex="1" overflowY="auto" p={{ base: 4, md: 6 }}>
          {children}
        </Box>
      </Flex>
    </Flex>
  );
}
