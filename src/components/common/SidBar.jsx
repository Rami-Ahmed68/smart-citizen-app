// src/components/common/SidBar.jsx
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
import {
  LuLayoutDashboard,
  LuUsers,
  LuUserPlus,
  LuUserCog,
  LuShield,
  LuDownload,
} from "react-icons/lu";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../auth/AuthContext";

const labels = {
  ar: {
    dashboard: "لوحة التحكم",
    citizens: "المواطنون",
    addCitizen: "إضافة مواطن",
    admins: "المسؤولون",
    addAdmin: "إضافة مسؤول",
    installApp: "تثبيت التطبيق",
    brand: "المواطن الذكي",
  },
  en: {
    dashboard: "Dashboard",
    citizens: "Citizens",
    addCitizen: "Add Citizen",
    admins: "Admins",
    addAdmin: "Add Admin",
    installApp: "Install App",
    brand: "Smart Citizen",
  },
};

const links = [
  {
    to: "/",
    labelKey: "dashboard",
    icon: LuLayoutDashboard,
    permissions: [],
    role: ["super"],
  },
  {
    to: "/citizens",
    labelKey: "citizens",
    icon: LuUsers,
    permissions: ["citizens.read"],
    role: ["super", "admin"],
  },
  {
    to: "/citizens/create",
    labelKey: "addCitizen",
    icon: LuUserPlus,
    permissions: ["citizens.create"],
    role: ["super", "admin"],
  },
  {
    to: "/admins",
    labelKey: "admins",
    icon: LuUserCog,
    permissions: ["admins.read"],
    role: ["super", "admin"],
  },
  {
    to: "/admins/create",
    labelKey: "addAdmin",
    icon: LuShield,
    permissions: ["admins.create"],
    role: ["super", "admin"],
  },
  {
    to: "/install",
    labelKey: "installApp",
    icon: LuDownload,
    permissions: [],
    role: ["super"],
  },
];

function SidBarLinks({ onNavigate }) {
  const { admin } = useAuth();
  const { i18n } = useTranslation();

  const lang = i18n.language === "ar" ? "ar" : "en";
  const text = labels[lang];
  const userPermissions = admin?.permissions || [];

  const visibleLinks = links.filter((link) => {
    if (!link.permissions || link.permissions.length === 0) return true;
    return link.permissions.some((p) => userPermissions.includes(p));
  });

  return (
    <Stack spacing="1">
      {visibleLinks.map(({ to, labelKey, icon: Icon }) => (
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
              {text[labelKey]}
            </Box>
          )}
        </NavLink>
      ))}
    </Stack>
  );
}

export default function SidBar({ open, onClose }) {
  const { i18n } = useTranslation();
  const lang = i18n.language === "ar" ? "ar" : "en";
  const text = labels[lang];
  const placement = i18n.language === "ar" ? "right" : "left";

  return (
    <>
      <Box
        as="nav"
        display={{ base: "none", md: "block" }}
        w="240px"
        p="4"
        bg="bg-sid-bar"
        borderEndWidth="1px"
        borderColor="border-color"
        flexShrink={0}>
        <SidBarLinks />
      </Box>

      <Drawer placement={placement} isOpen={open} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="bg-sid-bar">
          <DrawerCloseButton />
          <DrawerHeader>{text.brand}</DrawerHeader>
          <DrawerBody>
            <SidBarLinks onNavigate={onClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
