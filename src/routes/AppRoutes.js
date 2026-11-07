// src/routes/AppRoutes.jsx
import { lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Box } from "@chakra-ui/react";

import ProtectedRoute from "../auth/ProtectedRoute";
import PublicOnlyRoute from "../auth/PublicOnlyRoute";
import MainLayOut from "../layouts/MainLayOut";

const LoginPage = lazy(() => import("../pages/login/LogInPage.jsx"));
const HomePage = lazy(() => import("../pages/home/HomePage.jsx"));
const CitizensPage = lazy(() => import("../pages/citizens/CitizensPages.jsx"));
const AdminsPage = lazy(() => import("../pages/admin/AdminsPage.jsx"));
const AddAdminPage = lazy(() => import("../pages/adAdmin/AddAdminPage.jsx"));
const DashBoard = lazy(() => import("../pages/dashboard/DashBoard.jsx"));
const AddCitizenPage = lazy(
  () => import("../pages/addCitizen/AddCitizenPage.jsx"),
);
const LogOutPage = lazy(() => import("../pages/logOutPage/LogOutPage.jsx"));
const InstallAppPage = lazy(
  () => import("../pages/install/InstallAppPage.jsx"),
);

const AdminDetailsPage = lazy(
  () => import("../pages/adminDetails/adminDetails.jsx"),
);

const ProfilePage = lazy(() => import("../pages/Profile/ProfilePage.jsx"));

const NotFoundPage = lazy(
  () => import("../pages/NotFoundPage/NotFoundPage.jsx"),
);

const Placeholder = ({ title }) => <Box p={4}>{title}</Box>;

const PageTransition = ({ children }) => {
  const location = useLocation();
  return (
    <Box
      key={location.pathname}
      w="100%"
      paddingBottom={4}
      animation="fadeIn 0.2s ease-in-out"
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

const ProtectedPage = ({ roles, children }) => (
  <ProtectedRoute roles={roles}>
    <PageTransition>{children}</PageTransition>
  </ProtectedRoute>
);

const PublicPage = ({ children }) => (
  <PublicOnlyRoute>
    <PageTransition>{children}</PageTransition>
  </PublicOnlyRoute>
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicPage>
            <LoginPage />
          </PublicPage>
        }
      />

      <Route element={<MainLayOut />}>
        <Route
          path="/"
          element={
            <ProtectedPage>
              <DashBoard />
            </ProtectedPage>
          }
        />

        <Route
          path="/home"
          element={
            <ProtectedPage>
              <HomePage />
            </ProtectedPage>
          }
        />

        <Route
          path="/citizens"
          element={
            <ProtectedPage roles={["super", "admin"]}>
              <CitizensPage />
            </ProtectedPage>
          }
        />

        <Route
          path="/citizens/create"
          element={
            <ProtectedPage roles={["super", "admin"]}>
              <AddCitizenPage />
            </ProtectedPage>
          }
        />

        <Route
          path="/admins"
          element={
            <ProtectedPage roles={["super"]}>
              <AdminsPage />
            </ProtectedPage>
          }
        />

        <Route
          path="/add/admin"
          element={
            <ProtectedPage roles={["super"]}>
              <AddAdminPage />
            </ProtectedPage>
          }
        />

        <Route
          path="/admins/create"
          element={
            <ProtectedPage roles={["super"]}>
              <Placeholder title="Add Admin" />
            </ProtectedPage>
          }
        />

        <Route
          path="/logout"
          element={
            <ProtectedPage>
              <LogOutPage />
            </ProtectedPage>
          }
        />

        <Route
          path="/install"
          element={
            <ProtectedPage>
              <InstallAppPage />
            </ProtectedPage>
          }
        />

        <Route
          path="/admin/details/:target_id"
          element={
            <ProtectedPage>
              <AdminDetailsPage />
            </ProtectedPage>
          }
        />

        <Route
          path="/profile/:admin_id"
          element={
            <ProtectedPage>
              <ProfilePage />
            </ProtectedPage>
          }
        />

        <Route
          path="*"
          element={
            <PageTransition>
              <NotFoundPage />
            </PageTransition>
          }
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
