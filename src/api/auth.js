import api from "./axios";
import { ENDPOINTS } from "./endpoints";

export const authAPI = {
  login: async (email, password) => {
    const { data } = await api.post(ENDPOINTS.auth.login, { email, password });
    const payload = data?.data ?? data;

    return {
      accessToken: payload?.access_token ?? payload?.accessToken ?? null,
      admin: payload?.admin ?? null,
    };
  },

  logout: async () => {
    await api.post(ENDPOINTS.auth.logout);
  },
};
