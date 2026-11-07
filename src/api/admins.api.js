// src/api/admins.api.js
import api from "./axios";
import { ENDPOINTS } from "./endpoints";

export const adminsAPI = {
  getAll: async (params = {}) => {
    const { data } = await api.get(ENDPOINTS.admins.all, { params });
    return data;
  },

  getById: async (target_id) => {
    const { data } = await api.get(ENDPOINTS.admins.one, {
      params: { target_id },
    });
    const payload = data?.data ?? data;
    return payload?.admin ?? payload;
  },

  create: async (payload) => {
    const { data } = await api.post(ENDPOINTS.admins.create, payload);
    return data;
  },

  update: async (id, payload) => {
    const { data } = await api.put(ENDPOINTS.admins.update_admin, {
      target_id: id,
      ...payload,
    });
    return data;
  },

  remove: async (id) => {
    const { data } = await api.delete(ENDPOINTS.admins.remove, {
      data: { target_id: id },
    });
    return data;
  },

  toggleStatus: async (id) => {
    const { data } = await api.put(ENDPOINTS.admins.toggleStatus, {
      target_id: id,
    });
    return data;
  },

  changePassword: async (id, payload) => {
    const { data } = await api.put(ENDPOINTS.admins.changePassword, {
      target_id: id,
      ...payload,
    });
    return data;
  },

  getMe: async () => {
    const { data } = await api.get(ENDPOINTS.admins.me);
    return data;
  },

  updateMe: async (payload) => {
    const { data } = await api.put(ENDPOINTS.admins.me, payload);
    return data;
  },
};

export default adminsAPI;
