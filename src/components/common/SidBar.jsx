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
  LuUser,
  LuLogOut,
  LuHouse,
} from "react-icons/lu";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../auth/AuthContext";

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
    permissions: ["read"],
    role: ["super", "admin"],
  },
  {
    to: "/citizens/create",
    labelKey: "addCitizen",
    icon: LuUserPlus,
    permissions: ["create"],
    role: ["super", "admin"],
  },
  {
    to: "/family",
    labelKey: "families",
    icon: LuHouse,
    permissions: ["read"],
    role: ["super", "admin"],
  },
  {
    to: "/admins",
    labelKey: "admins",
    icon: LuUserCog,
    permissions: ["read"],
    role: ["super"],
  },
  {
    to: "/add/admin",
    labelKey: "addAdmin",
    icon: LuShield,
    permissions: ["create"],
    role: ["super"],
  },
];

function NavItem({ to, label, icon: Icon, isLogout = false, onNavigate }) {
  return (
    <NavLink to={to} end onClick={onNavigate}>
      {({ isActive }) => (
        <Box
          display="flex"
          alignItems="center"
          gap="3"
          px="3"
          py="2"
          rounded="md"
          fontWeight={isActive ? "semibold" : "normal"}
          bg={isActive ? (isLogout ? "red.500" : "brand.500") : "transparent"}
          color={isActive ? "white" : isLogout ? "red.500" : "inherit"}
          _hover={{
            bg: isActive ? (isLogout ? "red.600" : "brand.600") : "bg-input",
          }}
          transition="background 0.15s ease">
          <Icon />
          {label}
        </Box>
      )}
    </NavLink>
  );
}

function SidBarLinks({ onNavigate }) {
  const { admin: currentAdmin } = useAuth();
  const { t } = useTranslation();

  const userRole = currentAdmin?.role;
  const userPermissions = currentAdmin?.permissions || [];

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
      {visibleLinks.map(({ to, labelKey, icon }) => (
        <NavItem
          key={to}
          to={to}
          label={t(`sidbar.${labelKey}`)}
          icon={icon}
          onNavigate={onNavigate}
        />
      ))}
    </Stack>
  );
}

function SidBarFooter({ onNavigate }) {
  const { admin: currentAdmin } = useAuth();
  const { t } = useTranslation();

  const profileTo = currentAdmin?._id
    ? `/profile/${currentAdmin._id}`
    : "/profile";

  return (
    <Stack spacing="1">
      <Divider borderColor="border-color" mb={2} />

      <NavItem
        to={profileTo}
        label={t("sidbar.profile")}
        icon={LuUser}
        onNavigate={onNavigate}
      />

      <NavItem
        to="/logout"
        label={t("sidbar.logout")}
        icon={LuLogOut}
        onNavigate={onNavigate}
        isLogout
      />
    </Stack>
  );
}

export default function SidBar({ open, onClose }) {
  const { t, i18n } = useTranslation();
  const placement = i18n.language === "ar" ? "right" : "left";

  return (
    <>
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

      <Drawer placement={placement} isOpen={open} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="bg-sid-bar">
          <DrawerCloseButton />
          <DrawerHeader>{t("sidbar.brand")}</DrawerHeader>
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
