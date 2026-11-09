// src/api/families.api.js
import api from "./axios";
import { ENDPOINTS } from "./endpoints";

export const familiesAPI = {
  getAll: async (params = {}) => {
    const { data } = await api.get(ENDPOINTS.families.all, { params });
    return data;
  },

  getById: async (target_id) => {
    const { data } = await api.get(ENDPOINTS.families.one, {
      params: { target_id },
    });
    const payload = data?.data ?? data;
    return payload?.family ?? payload;
  },

  getByCitizen: async (citizen_id, relation) => {
    const params = { citizen_id };
    if (relation) params.relation = relation;
    const { data } = await api.get(ENDPOINTS.families.all, { params });
    return data;
  },

  create: async (payload) => {
    const { data } = await api.post(ENDPOINTS.families.create, payload);
    return data;
  },

  update: async (id, payload) => {
    const { data } = await api.put(ENDPOINTS.families.update, {
      target_id: id,
      ...payload,
    });
    return data;
  },

  remove: async (id) => {
    const { data } = await api.delete(ENDPOINTS.families.remove, {
      data: { target_id: id },
    });
    return data;
  },
};

export default familiesAPI;
