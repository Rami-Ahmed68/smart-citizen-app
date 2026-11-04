import api from "./axios";

export const authAPI = {
  login: async (email, password) => {
    const { data } = await api.post("/admin/auth/log-in", { email, password });
    const payload = data?.data ?? data;

    return {
      accessToken: payload?.access_token ?? payload?.accessToken ?? null,
      admin: payload?.admin ?? null,
    };
  },

  logout: async () => {
    await api.post("/admin/auth/logout");
  },
};
