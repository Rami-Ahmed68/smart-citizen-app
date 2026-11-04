// src/components/common/SidBar.jsx
import { NavLink } from "react-router-dom";
import {
  Box,
  Divider,
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
  LuUser,
  LuLogOut,
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
    profile: "الحساب الشخصي",
    logout: "تسجيل الخروج",
    brand: "المواطن الذكي",
  },
  en: {
    dashboard: "Dashboard",
    citizens: "Citizens",
    addCitizen: "Add Citizen",
    admins: "Admins",
    addAdmin: "Add Admin",
    installApp: "Install App",
    profile: "My Profile",
    logout: "Logout",
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
    role: ["super"],
  },
  {
    to: "/add/admin",
    labelKey: "addAdmin",
    icon: LuShield,
    permissions: ["admins.create"],
    role: ["super"],
  },
  {
    to: "/install",
    labelKey: "installApp",
    icon: LuDownload,
    permissions: [],
    role: ["super", "admin", "user"],
  },
];

function SidBarLinks({ onNavigate }) {
  const { admin } = useAuth();
  const { i18n } = useTranslation();

  const lang = i18n.language === "ar" ? "ar" : "en";
  const text = labels[lang];

  const userRole = admin?.role;
  const userPermissions = admin?.permissions || [];

  const visibleLinks = links.filter((link) => {
    if (userRole === "super") return true;

    const roleOk = !link.role?.length || link.role.includes(userRole);
    const permissionOk =
      !link.permissions?.length ||
      link.permissions.some((p) => userPermissions.includes(p));

    return roleOk && permissionOk;
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

function SidBarFooter({ onNavigate }) {
  const { i18n } = useTranslation();

  const lang = i18n.language === "ar" ? "ar" : "en";
  const text = labels[lang];

  return (
    <Stack spacing="1">
      <Divider borderColor="border-color" mb={2} />

      <NavLink to="/profile" end onClick={onNavigate}>
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
            <LuUser />
            {text.profile}
          </Box>
        )}
      </NavLink>

      <NavLink to="/logout" end onClick={onNavigate}>
        {({ isActive }) => (
          <Box
            display="flex"
            alignItems="center"
            gap="3"
            px="3"
            py="2"
            rounded="md"
            fontWeight={isActive ? "semibold" : "normal"}
            bg={isActive ? "red.500" : "transparent"}
            color={isActive ? "white" : "red.500"}
            _hover={{ bg: "red.50", _dark: { bg: "red.900" } }}>
            <LuLogOut />
            {text.logout}
          </Box>
        )}
      </NavLink>
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
      {/* ─── سايدبار الديسكتوب ─── */}
      <Box
        as="nav"
        display={{ base: "none", md: "flex" }}
        flexDirection="column"
        w="240px"
        p="4"
        bg="bg-sid-bar"
        borderEndWidth="1px"
        borderColor="border-color"
        flexShrink={0}
        h="100%">
        <Box flex="1" overflowY="auto">
          <SidBarLinks />
        </Box>
        <Box mt="auto" pt="4">
          <SidBarFooter />
        </Box>
      </Box>

      {/* ─── درج الجوال ─── */}
      <Drawer placement={placement} isOpen={open} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="bg-sid-bar">
          <DrawerCloseButton />
          <DrawerHeader>{text.brand}</DrawerHeader>
          <DrawerBody display="flex" flexDirection="column" pb={4}>
            <Box flex="1">
              <SidBarLinks onNavigate={onClose} />
            </Box>
            <Box mt="auto">
              <SidBarFooter onNavigate={onClose} />
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
