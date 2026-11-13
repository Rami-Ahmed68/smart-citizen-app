// src/api/dashboard.api.js
import api from "./axios";
import { ENDPOINTS } from "./endpoints";

export const dashboardAPI = {
  getStats: async () => {
    const { data } = await api.get(ENDPOINTS.dashboard.stats);
    return data;
  },
};

export default dashboardAPI;