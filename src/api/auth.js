// src/api/auth.js
import api from "./axios";

const normalize = (data) => {
  const payload = data?.data ?? data;
  return {
    accessToken: payload?.access_token ?? payload?.accessToken ?? null,
    admin: payload?.admin ?? null,
  };
};

export const authAPI = {
  login: async (email, password) => {
    const { data } = await api.post("/admin/auth/log-in", {
      email,
      password,
    });
    return normalize(data);
  },

  refresh: async () => {
    const { data } = await api.post("/admin/auth/refresh-token");
    return normalize(data);
  },

  logout: async () => {
    await api.post("/admin/auth/log-out");
  },
};

export default authAPI;
