// src/api/axios.js
import axios from "axios";

const normalizeBaseUrl = (url) => {
  if (!url) return "http://localhost:8080/api";
  return url.replace(/\/+$/, "");
};

const BASE_URL = normalizeBaseUrl(process.env.REACT_APP_API_URL);

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  timeout: 20000,
});

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token || null;
};

export const getAccessToken = () => accessToken;

export const clearAccessToken = () => {
  accessToken = null;
};

let onUnauthorized = null;

export const setUnauthorizedHandler = (handler) => {
  onUnauthorized = typeof handler === "function" ? handler : null;
};

const isDev = process.env.NODE_ENV === "development";

const devLog = (...args) => {
  if (isDev) {
    console.log("%c[api]", "color:#0ea5e9;font-weight:bold", ...args);
  }
};

const devError = (...args) => {
  if (isDev) {
    console.error("%c[api:error]", "color:#ef4444;font-weight:bold", ...args);
  }
};

api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    devLog(
      `→ ${config.method?.toUpperCase()} ${config.baseURL || ""}${config.url}`,
      config.params || "",
    );

    return config;
  },
  (error) => {
    devError("Request error:", error);
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    devLog(
      `← ${response.status} ${response.config.method?.toUpperCase()} ${
        response.config.url
      }`,
    );

    devLog("📦 data:", response.data);

    return response;
  },
  (error) => {
    const status = error.response?.status;

    devError(
      `← ${status || "NETWORK"} ${error.config?.method?.toUpperCase()} ${
        error.config?.url
      }`,
      error.response?.data || error.message,
    );

    if (status === 401 && onUnauthorized) {
      try {
        onUnauthorized(error);
      } catch (e) {
        devError("onUnauthorized handler threw:", e);
      }
    }

    return Promise.reject(error);
  },
);

export const getErrorMessage = (error, fallback = "حدث خطأ غير متوقع") => {
  if (!error) return fallback;

  if (error.code === "ECONNABORTED") return "انتهت مهلة الطلب";
  if (error.code === "ERR_CANCELED") return "تم إلغاء الطلب";
  if (!error.response) {
    if (error.code === "ERR_NETWORK") return "تعذر الاتصال بالخادم";
    return error.message || fallback;
  }

  const data = error.response.data;
  if (!data) return error.message || fallback;
  if (typeof data === "string") return data;

  const currentLang = document.documentElement.lang || "ar";

  const pickLocalized = (value) => {
    if (typeof value === "string") return value;
    if (value && typeof value === "object") {
      return (
        value[currentLang] ||
        value.ar ||
        value.en ||
        Object.values(value)[0] ||
        null
      );
    }
    return null;
  };

  if (data.message) {
    const picked = pickLocalized(data.message);
    if (picked) return picked;
  }

  if (data.error) {
    const picked = pickLocalized(data.error);
    if (picked) return picked;
  }

  if (Array.isArray(data.errors) && data.errors.length) {
    return data.errors
      .map((e) => pickLocalized(e) || (typeof e === "string" ? e : e.message))
      .filter(Boolean)
      .join(", ");
  }

  if (
    typeof data === "object" &&
    data.errors &&
    typeof data.errors === "object"
  ) {
    const first = Object.values(data.errors)[0];
    if (Array.isArray(first)) return pickLocalized(first[0]) || fallback;
    const picked = pickLocalized(first);
    if (picked) return picked;
  }

  return fallback;
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  VALIDATION: 422,
  SERVER_ERROR: 500,
};

export { BASE_URL };
export default api;
