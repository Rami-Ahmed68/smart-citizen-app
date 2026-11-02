import { Lazy, suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Box } from "@chakra-ui/react";

import HomePage from "../pages/home/HomePage.jsx";
import CitizensPage from "../pages/citizens/CitizenPages.jsx";
import AdminsPage from "../pages/admin/AdminsPage.jsx";

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

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PageTransition>
            <HomePage />
          </PageTransition>
        }
      />
      <Route
        path="/citizens"
        element={
          <PageTransition>
            <CitizensPage />
          </PageTransition>
        }
      />
      <Route
        path="/admins"
        element={
          <PageTransition>
            <AdminsPage />
          </PageTransition>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
