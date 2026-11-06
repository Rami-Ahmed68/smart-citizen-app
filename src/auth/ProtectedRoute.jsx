// src/auth/ProtectedRoute.jsx
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { Center, Spinner, VStack, Text, Box, Image } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useAuth } from "./AuthContext";
import logo from "../assets/new_syrian_logo.png";

export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, isLoading, hasAnyRole } = useAuth();
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const isRTL = i18n.language === "ar";

  if (isLoading) {
    return (
      <Center
        position="fixed"
        inset={0}
        zIndex={9999}
        bg="bg-body"
        w="100vw"
        h="100vh"
        px={4}
        dir={isRTL ? "rtl" : "ltr"}>
        <VStack
          spacing={8}
          sx={{
            animation: "fadeIn 0.4s ease-out",
            "@keyframes fadeIn": {
              from: { opacity: 0, transform: "translateY(10px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}>
          <Box
            w={28}
            h={28}
            rounded="3xl"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bgGradient="linear(to-br, syria.green.light, syria.green.mid)"
            shadow="2xl"
            p={4}
            _dark={{
              bgGradient: "linear(to-br, syria.green.mid, syria.green.light)",
            }}>
            <Image
              src={logo}
              alt={t("auth.emblemAlt")}
              w="100%"
              h="100%"
              objectFit="contain"
              filter="drop-shadow(0 3px 8px rgba(0,0,0,0.4))"
            />
          </Box>

          <VStack spacing={3}>
            <Text
              fontSize="3xl"
              fontWeight="bold"
              color="text-primary"
              letterSpacing="tight"
              textAlign="center">
              {t("auth.brandName")}
            </Text>
            <Spinner
              size="xl"
              color="syria.green.mid"
              thickness="4px"
              speed="0.7s"
              _dark={{ color: "syria.green.light" }}
            />
          </VStack>

          <VStack spacing={2}>
            <Text
              fontSize="md"
              fontWeight="medium"
              color="text-secondary"
              textAlign="center">
              {t("auth.checkingSession")}
            </Text>
            <Text fontSize="sm" color="text-muted" textAlign="center">
              {t("auth.checkingSessionHint")}
            </Text>
          </VStack>
        </VStack>
      </Center>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !hasAnyRole(roles)) {
    return <Navigate to="/" replace />;
  }

  if (children) return children;
  return <Outlet />;
}
