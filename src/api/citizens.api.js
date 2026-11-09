// src/api/citizens.api.js
import api from "./axios";
import { ENDPOINTS } from "./endpoints";

export const citizensAPI = {
  getAll: async (params = {}) => {
    const { data } = await api.get(ENDPOINTS.citizens.all, { params });
    return data;
  },

  getById: async (target_id) => {
    const { data } = await api.get(ENDPOINTS.citizens.one, {
      params: { target_id },
    });
    const payload = data?.data ?? data;
    return payload?.citizen ?? payload;
  },

  create: async (payload) => {
    const { data } = await api.post(ENDPOINTS.citizens.create, payload);
    return data;
  },

  update: async (id, payload) => {
    const { data } = await api.put(ENDPOINTS.citizens.update, {
      target_id: id,
      ...payload,
    });
    return data;
  },

  remove: async (id) => {
    const { data } = await api.delete(ENDPOINTS.citizens.remove, {
      params: { target_id: id },
    });
    return data;
  },

  toggleStatus: async (id) => {
    const { data } = await api.put(ENDPOINTS.citizens.toggleStatus, {
      target_id: id,
    });
    return data;
  },
};

export default citizensAPI;
