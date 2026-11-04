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
import api, {
  setAccessToken,
  setUnauthorizedHandler,
  getErrorMessage,
} from "../api/axios";

const AuthContext = createContext(null);

// ⚠️ للتطوير فقط — احذف أو اطفئ عند ربط الـ Backend الحقيقي
const USE_MOCK = true;

const fake_admin = {
  first_name: "أحمد",
  last_name: "محمد",
  email: "admin@test.com",
  avatar: null,
  role: "super",
  permissions: [
    "citizens.read",
    "citizens.create",
    "citizens.update",
    "citizens.delete",
    "admins.read",
    "admins.create",
  ],
};

const AUTH_EVENT_KEY = "smart-citizen-app-auth";
const AUTH_CHANNEL_NAME = "smart-citizen-app-auth-channel";

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const bootstrappedRef = useRef(false);
  const channelRef = useRef(null);

  const applySession = useCallback((data) => {
    const token = data?.accessToken;
    // ✅ استخدم بيانات الخادم إن وُجدت، وإلا استخدم mock (إن مفعّل)
    const adminData = data?.admin ?? (USE_MOCK ? fake_admin : null);

    if (token) setAccessToken(token);
    if (adminData) setAdmin(adminData);
    setError(null);

    return adminData; // ← أعد البيانات المُطبَّقة (للاستخدام في login)
  }, []);

  const clearSession = useCallback(() => {
    setAccessToken(null);
    setAdmin(null);
    setError(null);
  }, []);

  const login = useCallback(
    async (email, password) => {
      setError(null);
      try {
        const { data } = await api.post("/auth/login", { email, password });
        const applied = applySession(data); // ← يستخدم نفس البيانات

        if (channelRef.current) {
          channelRef.current.postMessage({ type: "login" });
        }

        return applied; // ← متسق مع الـ state
      } catch (err) {
        const message = getErrorMessage(err, "فشل تسجيل الدخول");
        setError(message);
        throw err;
      }
    },
    [applySession],
  );

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[auth] logout request failed:", err?.message);
      }
    } finally {
      clearSession();
      if (channelRef.current) {
        channelRef.current.postMessage({ type: "logout" });
      }
    }
  }, [clearSession]);

  const refreshSession = useCallback(async () => {
    try {
      const { data } = await api.post("/auth/refresh");
      return applySession(data); // ← متسق
    } catch (err) {
      clearSession();
      throw err;
    }
  }, [applySession, clearSession]);

  // ... (باقي useEffect كما هي، لا تغيير)

  useEffect(() => {
    if (bootstrappedRef.current) return;
    bootstrappedRef.current = true;

    const bootstrap = async () => {
      try {
        const { data } = await api.post("/auth/refresh");
        applySession(data);
      } catch {
        clearSession();
      } finally {
        setIsLoading(false);
      }
    };

    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => clearSession());
    return () => setUnauthorizedHandler(null);
  }, [clearSession]);

  useEffect(() => {
    if (typeof BroadcastChannel !== "undefined") {
      const channel = new BroadcastChannel(AUTH_CHANNEL_NAME);
      channelRef.current = channel;

      channel.onmessage = (event) => {
        const type = event?.data?.type;
        if (type === "logout") clearSession();
        else if (type === "login") {
          api.post("/auth/refresh").then(
            ({ data }) => applySession(data),
            () => clearSession(),
          );
        }
      };

      return () => {
        channel.close();
        channelRef.current = null;
      };
    }

    const handleStorage = (event) => {
      if (event.key !== AUTH_EVENT_KEY || !event.newValue) return;
      try {
        const payload = JSON.parse(event.newValue);
        if (payload.type === "logout") clearSession();
        else if (payload.type === "login") {
          api.post("/auth/refresh").then(
            ({ data }) => applySession(data),
            () => clearSession(),
          );
        }
      } catch {}
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [applySession, clearSession]);

  // ✅ أضف helpers للصلاحيات
  const hasPermission = useCallback(
    (permission) => !!admin?.permissions?.includes(permission),
    [admin],
  );

  const hasAnyPermission = useCallback(
    (permissions = []) =>
      Array.isArray(permissions) &&
      permissions.some((p) => admin?.permissions?.includes(p)),
    [admin],
  );

  const hasAllPermissions = useCallback(
    (permissions = []) =>
      Array.isArray(permissions) &&
      permissions.every((p) => admin?.permissions?.includes(p)),
    [admin],
  );

  const value = useMemo(
    () => ({
      admin,
      isAuthenticated: !!admin,
      isLoading,
      error,

      login,
      logout,
      refreshSession,

      // أدوار
      hasRole: (role) => admin?.role === role,
      hasAnyRole: (roles = []) =>
        !!admin && Array.isArray(roles) && roles.includes(admin.role),

      // صلاحيات
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
    }),
    [
      admin,
      isLoading,
      error,
      login,
      logout,
      refreshSession,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export default AuthContext;
