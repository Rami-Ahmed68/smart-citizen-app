// src/auth/AuthContext.jsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { setAccessToken, setUnauthorizedHandler } from "../api/axios";

const AuthContext = createContext(null);
const ADMIN_KEY = "smart-citizen-admin";

const readStoredAdmin = () => {
  try {
    const raw = localStorage.getItem(ADMIN_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && Object.keys(parsed).length
      ? parsed
      : null;
  } catch {
    localStorage.removeItem(ADMIN_KEY);
    return null;
  }
};

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(readStoredAdmin);

  const saveAdmin = useCallback((adminData) => {
    const valid =
      adminData &&
      typeof adminData === "object" &&
      Object.keys(adminData).length
        ? adminData
        : null;

    if (valid) {
      localStorage.setItem(ADMIN_KEY, JSON.stringify(valid));
    } else {
      localStorage.removeItem(ADMIN_KEY);
    }
    setAdmin(valid);
    return valid;
  }, []);

  const login = useCallback(
    (data) => {
      if (data?.accessToken) setAccessToken(data.accessToken);
      return saveAdmin(data?.admin ?? null);
    },
    [saveAdmin],
  );
  const value = useMemo(
    () => ({
      admin,
      isAuthenticated: !!admin,
      isLoading: false,

      login,

      hasRole: (role) => admin?.role === role,
      hasAnyRole: (roles = []) => !!admin && roles.includes(admin.role),
      hasPermission: (p) => !!admin?.permissions?.includes(p),
      hasAnyPermission: (perms = []) =>
        !!admin && perms.some((p) => admin.permissions.includes(p)),
      hasAllPermissions: (perms = []) =>
        !!admin && perms.every((p) => admin.permissions.includes(p)),
    }),
    [admin, login],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export default AuthContext;
