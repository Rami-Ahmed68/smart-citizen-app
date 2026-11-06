// src/auth/AuthContext.jsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { setAccessToken, setUnauthorizedHandler } from "../api/axios";
import { authAPI } from "../api/auth";

const AuthContext = createContext(null);
const ADMIN_KEY = "smart-citizen-admin";
const REFRESH_INTERVAL_MS = 14 * 60 * 1000;

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
  const [isLoading, setIsLoading] = useState(true);

  const bootstrappedRef = useRef(false);

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

  const clearSession = useCallback(() => {
    setAccessToken(null);
    saveAdmin(null);
  }, [saveAdmin]);

  const refreshSession = useCallback(async () => {
    try {
      const data = await authAPI.refresh();

      if (data?.accessToken) setAccessToken(data.accessToken);
      if (data?.admin) saveAdmin(data.admin);
      return data?.admin ?? null;
    } catch (err) {
      clearSession();
      throw err;
    }
  }, [saveAdmin, clearSession]);

  useEffect(() => {
    setUnauthorizedHandler(clearSession);
    return () => setUnauthorizedHandler(null);
  }, [clearSession]);

  useEffect(() => {
    if (bootstrappedRef.current) return;
    bootstrappedRef.current = true;

    const bootstrap = async () => {
      try {
        const data = await authAPI.refresh();

        if (data?.accessToken) setAccessToken(data.accessToken);
        if (data?.admin) saveAdmin(data.admin);
        else clearSession();
      } catch {
        clearSession();
      } finally {
        setIsLoading(false);
      }
    };

    bootstrap();
  }, [saveAdmin, clearSession]);

  useEffect(() => {
    if (!admin || isLoading) return;

    const id = setInterval(() => {
      refreshSession().catch(() => {});
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(id);
  }, [admin, isLoading, refreshSession]);

  const value = useMemo(
    () => ({
      admin,
      isAuthenticated: !!admin,
      isLoading,

      login,
      clearSession,
      refreshSession,

      hasRole: (role) => admin?.role === role,
      hasAnyRole: (roles = []) => !!admin && roles.includes(admin.role),
      hasPermission: (p) => !!admin?.permissions?.includes(p),
      hasAnyPermission: (perms = []) =>
        !!admin && perms.some((p) => admin.permissions.includes(p)),
      hasAllPermissions: (perms = []) =>
        !!admin && perms.every((p) => admin.permissions.includes(p)),
    }),
    [admin, isLoading, login, clearSession, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export default AuthContext;
