// src/api/axios.js
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

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

const REFRESH_URL = "/auth/refresh";

let isRefreshing = false;
let pendingQueue = [];

const processQueue = (error, newToken = null) => {
  pendingQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
    } else {
      if (newToken && config?.headers) {
        config.headers.Authorization = `Bearer ${newToken}`;
      }
      resolve();
    }
  });
  pendingQueue = [];
};

const shouldSkipRefresh = (config) => {
  if (!config) return true;
  if (config._retry) return true;

  const url = config.url || "";
  return (
    url.includes(REFRESH_URL) ||
    url.includes("/auth/login") ||
    url.includes("/auth/logout") ||
    url.includes("/auth/register")
  );
};

api.interceptors.response.use(
  (response) => {
    devLog(
      `← ${response.status} ${response.config.method?.toUpperCase()} ${
        response.config.url
      }`,
    );
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status !== 401 || shouldSkipRefresh(originalRequest)) {
      devError(
        `← ${status || "NETWORK"} ${originalRequest?.method?.toUpperCase()} ${
          originalRequest?.url
        }`,
        error.response?.data || error.message,
      );
      return Promise.reject(error);
    }

    if (isRefreshing) {
      devLog("401 → queued (refresh in progress)");
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject, config: originalRequest });
      }).then(() => api(originalRequest));
    }

    originalRequest._retry = true;
    isRefreshing = true;
    devLog("401 → refreshing token…");

    try {
      const { data } = await axios.post(
        `${BASE_URL}${REFRESH_URL}`,
        {},
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        },
      );

      const newToken = data?.accessToken;
      if (!newToken) {
        throw new Error("Refresh succeeded but no accessToken in response");
      }

      setAccessToken(newToken);
      devLog("refresh OK → retrying queued requests");

      processQueue(null, newToken);

      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      devError("refresh FAILED → clearing session", refreshError.message);
      processQueue(refreshError, null);
      setAccessToken(null);

      if (onUnauthorized) {
        try {
          onUnauthorized(refreshError);
        } catch (e) {
          devError("onUnauthorized handler threw:", e);
        }
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export const getErrorMessage = (error, fallback = "حدث خطأ غير متوقع") => {
  if (!error) return fallback;

  const data = error.response?.data;
  if (!data) {
    if (error.code === "ECONNABORTED") return "انتهت مهلة الطلب";
    if (!error.response) return "تعذر الاتصال بالخادم";
    return error.message || fallback;
  }

  if (typeof data === "string") return data;
  if (data.message) return data.message;
  if (data.error) return data.error;
  if (Array.isArray(data.errors) && data.errors.length) {
    return data.errors
      .map((e) => (typeof e === "string" ? e : e.message))
      .join(", ");
  }
  if (
    typeof data === "object" &&
    data.errors &&
    typeof data.errors === "object"
  ) {
    const first = Object.values(data.errors)[0];
    if (Array.isArray(first)) return first[0];
    if (typeof first === "string") return first;
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
