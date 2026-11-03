// src/routes/AppRoutes.jsx
import { lazy, Suspense } from "react";
import { Routes, Route, useLocation, Outlet } from "react-router-dom";
import { Box, Center, Spinner } from "@chakra-ui/react";

import ProtectedRoute from "../auth/ProtectedRoute";
import PublicOnlyRoute from "../auth/PublicOnlyRoute";
import MainLayOut from "../layouts/MainLayOut";

const LoginPage = lazy(() => import("../pages/login/LogInPage.jsx"));
const HomePage = lazy(() => import("../pages/home/HomePage.jsx"));
const CitizensPage = lazy(() => import("../pages/citizens/CitizensPages.jsx"));
const AdminsPage = lazy(() => import("../pages/admin/AdminsPage.jsx"));
const NotFoundPage = lazy(
  () => import("../pages/NotFoundPage/NotFoundPage.jsx"),
);

const PageTransition = ({ children }) => {
  const location = useLocation();

  return (
    <Box
      key={location.pathname}
      w="100%"
      h="100%"
      paddingBottom={4}
      m="0%"
      animation="fadeIn 0.3s ease-in-out"
      sx={{
        "@keyframes fadeIn": {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      }}>
      {children}
    </Box>
  );
};

const PageLoader = () => (
  <Center h="60vh">
    <Spinner size="xl" color="brand.500" thickness="4px" />
  </Center>
);

const TransitionOutlet = () => (
  <PageTransition>
    <Outlet />
  </PageTransition>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayOut />}>
            <Route element={<TransitionOutlet />}>
              <Route index element={<HomePage />} />
              <Route path="citizens" element={<CitizensPage />} />

              <Route
                path="admins"
                element={
                  <ProtectedRoute roles={["super"]}>
                    <AdminsPage />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
