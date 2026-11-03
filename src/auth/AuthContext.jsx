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
    const adminData = data?.admin;

    if (token) setAccessToken(token);
    if (adminData) setAdmin(adminData);
    setError(null);
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
        applySession(data);

        if (channelRef.current) {
          channelRef.current.postMessage({ type: "login" });
        }

        return data.admin;
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
      applySession(data);
      return data.admin;
    } catch (err) {
      clearSession();
      throw err;
    }
  }, [applySession, clearSession]);

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
        setIsLoading(false); // ← دائمًا، بدون شرط cancelled
      }
    };

    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearSession();
    });

    return () => {
      setUnauthorizedHandler(null);
    };
  }, [clearSession]);

  useEffect(() => {
    if (typeof BroadcastChannel !== "undefined") {
      const channel = new BroadcastChannel(AUTH_CHANNEL_NAME);
      channelRef.current = channel;

      channel.onmessage = (event) => {
        const type = event?.data?.type;
        if (type === "logout") {
          clearSession();
        } else if (type === "login") {
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
        if (payload.type === "logout") {
          clearSession();
        } else if (payload.type === "login") {
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

  const value = useMemo(
    () => ({
      admin,
      isAuthenticated: !!admin,
      isLoading,
      error,

      login,
      logout,
      refreshSession,

      hasRole: (role) => admin?.role === role,
      hasAnyRole: (roles = []) =>
        !!admin && Array.isArray(roles) && roles.includes(admin.role),
    }),
    [admin, isLoading, error, login, logout, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}

export default AuthContext;
