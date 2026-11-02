import { NavLink } from "react-router-dom";
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Stack,
} from "@chakra-ui/react";
import { LuLayoutDashboard, LuUsers, LuUserCog } from "react-icons/lu";

const links = [
  { to: "/", label: "Dashboard", icon: LuLayoutDashboard },
  { to: "/citizens", label: "Citizens", icon: LuUsers },
  { to: "/admins", label: "Admins", icon: LuUserCog },
];

function SidBarLinks({ role, onNavigate }) {
  const visibleLinks = links.filter(
    (link) => !link.roles || link.roles.includes(role),
  );

  return (
    <Stack spacing="1">
      {visibleLinks.map(({ to, label, icon: Icon }) => (
        <NavLink key={to} to={to} end onClick={onNavigate}>
          {({ isActive }) => (
            <Box
              display="flex"
              alignItems="center"
              gap="3"
              px="3"
              py="2"
              rounded="md"
              fontWeight={isActive ? "semibold" : "normal"}
              bg={isActive ? "brand.500" : "transparent"}
              color={isActive ? "white" : "inherit"}
              _hover={{ bg: isActive ? "brand.600" : "bg-hover" }}>
              <Icon />
              {label}
            </Box>
          )}
        </NavLink>
      ))}
    </Stack>
  );
}

export default function SidBar({ role, open, onClose }) {
  return (
    <>
      <Box
        as="nav"
        display={{ base: "none", md: "block" }}
        w="240px"
        p="4"
        bg="bg-sidbar"
        borderEndWidth="1px"
        borderColor="border-color"
        flexShrink={0}>
        <SidBarLinks role={role} />
      </Box>

      <Drawer placement="left" isOpen={open} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="bg-sidbar">
          <DrawerCloseButton />
          <DrawerHeader>SmartCitizen</DrawerHeader>
          <DrawerBody>
            <SidBarLinks role={role} onNavigate={onClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
