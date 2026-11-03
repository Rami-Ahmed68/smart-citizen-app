// src/auth/ProtectedRoute.jsx
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { Center, Spinner, VStack, Text } from "@chakra-ui/react";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, isLoading, hasAnyRole } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <Center h="100vh" bg="bg-body">
        <VStack spacing={4}>
          <Spinner size="xl" color="brand.500" thickness="4px" />
          <Text color="text-secondary">جارٍ التحقق من الجلسة…</Text>
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
