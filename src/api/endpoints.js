// src/api/endpoints.js

export const ENDPOINTS = {
  // Authentication
  auth: {
    login: "/admin/auth/log-in",
    logout: "/admin/auth/log-out",
    refresh: "/admin/auth/refresh-token",
    forgotPassword: "/admin/auth/forgot-password",
    resetPassword: "/admin/auth/reset-password",
    changePassword: "/admin/auth/change-password",
  },

  // Admins
  admins: {
    all: "/admin/all",
    one: "/admin/one",
    create: "/admin/create",
    me: "/admin/me",

    update_admin: "/admin/update-admin-data",
    update_my: "/admin/update-my-data",

    remove: "/admin/delete",
    toggleStatus: "/admin/toggle-status",
    changeMyPassword: "/admin/change-my-password",
    changeAdminPassword: "/admin/change-admin-password",
  },

  // Citizens
  citizens: {
    all: "/citizen/all",
    one: "/citizen/one",
    create: "/citizen/create",
    update: "/citizen/update",
    remove: "/citizen/delete",
    toggleStatus: "/citizen/toggle-status",
  },

  // Families
  families: {
    all: "/family/all",
    one: "/family/one",
    create: "/family/create",
    update: "/family/update",
    remove: "/family/delete",
  },

  // Dashboard
  dashboard: {
    stats: "/dashboard/stats",
  },
};

export default ENDPOINTS;
