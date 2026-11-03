// src/auth/PublicOnlyRoute.jsx
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { Center, Spinner } from "@chakra-ui/react";
import { useAuth } from "./AuthContext";

export default function PublicOnlyRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="brand.500" />
      </Center>
    );
  }

  if (isAuthenticated) {
    const from = location.state?.from?.pathname || "/";
    return <Navigate to={from} replace />;
  }

  if (children) return children;
  return <Outlet />;
}
