// src/api/admins.api.js
import api from "./axios";
import { ENDPOINTS } from "./endpoints";

export const adminsAPI = {
  getAll: async (params = {}) => {
    const { data } = await api.get(ENDPOINTS.admins.list, { params });
    return data;
  },

  getById: async (id) => {
    const { data } = await api.get(ENDPOINTS.admins.byId(id));
    return data;
  },

  create: async (payload) => {
    const { data } = await api.post(ENDPOINTS.admins.create, payload);
    return data;
  },

  update: async (id, payload) => {
    const { data } = await api.patch(ENDPOINTS.admins.update(id), payload);
    return data;
  },

  remove: async (id) => {
    const { data } = await api.delete(ENDPOINTS.admins.remove(id));
    return data;
  },

  toggleStatus: async (id) => {
    const { data } = await api.patch(ENDPOINTS.admins.toggleStatus(id));
    return data;
  },

  updatePermissions: async (id, permissions) => {
    const { data } = await api.patch(
      ENDPOINTS.admins.updatePermissions(id),
      { permissions },
    );
    return data;
  },

  changePassword: async (id, payload) => {
    const { data } = await api.patch(
      ENDPOINTS.admins.changePassword(id),
      payload,
    );
    return data;
  },

  getMe: async () => {
    const { data } = await api.get(ENDPOINTS.admins.me);
    return data;
  },

  updateMe: async (payload) => {
    const { data } = await api.patch(ENDPOINTS.admins.me, payload);
    return data;
  },
};

export default adminsAPI;