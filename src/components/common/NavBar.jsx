import {
  Avatar,
  Badge,
  Button,
  Flex,
  Heading,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  IconButton,
  Box,
} from "@chakra-ui/react";
import { LuMenu, LuLogOut } from "react-icons/lu";
import ToggleTheme from "./ToggleTheme.jsx";
import ToggleLang from "./ToggleLang.jsx";

export default function Navbar({
  admin,
  onLogout,
  onMenuClick,
  lang,
  onToggleLang,
}) {
  const fullName = admin ? `${admin.first_name} ${admin.last_name}` : "";

  return (
    <Flex as="header" w="100%" align="center" justify="space-between">
      <HStack>
        <IconButton
          bg="icon-btn"
          icon={<LuMenu />}
          variant="ghost"
          aria-label="فتح القائمة"
          onClick={onMenuClick}
          display={{ base: "inline-flex", md: "none" }}
        />
        <Heading size="md" color="brand.500">
          Smart Citizen
        </Heading>
      </HStack>

      <HStack spacing="3">
        {onToggleLang && (
          <Button size="sm" variant="ghost" onClick={onToggleLang}>
            {lang === "ar" ? "EN" : "عربي"}
          </Button>
        )}

        {admin && (
          <Menu placement="bottom-end">
            <MenuButton
              as={Button}
              variant="ghost"
              h="auto"
              py="1"
              rightIcon={undefined}>
              <HStack spacing="2">
                <Avatar size="sm" name={fullName} src={admin.avatar} />
                <Text display={{ base: "none", md: "block" }}>{fullName}</Text>
                <Badge
                  display={{ base: "none", md: "inline-flex" }}
                  colorScheme={admin.role === "super" ? "purple" : "blue"}>
                  {admin.role}
                </Badge>
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem icon={<LuLogOut />} color="red.500" onClick={onLogout}>
                تسجيل الخروج
              </MenuItem>
            </MenuList>
          </Menu>
        )}
      </HStack>
      <Box display="flex" alignItems="center" gap={2}>
        <ToggleTheme />
        <ToggleLang />
      </Box>
    </Flex>
  );
}
