// src/api/endpoints.js

export const ENDPOINTS = {
  // ═══════════════════════════════════════════
  // Authentication
  // ═══════════════════════════════════════════
  auth: {
    login: "/admin/auth/log-in",
    logout: "/admin/asuth/log-out",
    refresh: "/admin/auth/refresh",
    forgotPassword: "/admin/auth/forgot-password",
    resetPassword: "/admin/auth/reset-password",
    changePassword: "/admin/auth/change-password",
  },

  // ═══════════════════════════════════════════
  // Admins
  // ═══════════════════════════════════════════
  admins: {
    all: "/admin/all",
    one: "/admin/one",
    create: "/admin/create",
    me: "/admin/me",
  },

  // ═══════════════════════════════════════════
  // Citizens
  // ═══════════════════════════════════════════
  citizens: {
    base: "/citizen",
    list: "/citizen",
    create: "/citizen",
    byId: (id) => `/citizen/${id}`,
    update: (id) => `/citizen/${id}`,
    remove: (id) => `/citizen/${id}`,
    toggleStatus: (id) => `/citizen/${id}/status`,
    search: "/citizen/search",
  },

  // ═══════════════════════════════════════════
  // Dashboard
  // ═══════════════════════════════════════════
  dashboard: {
    stats: "/dashboard/stats",
    recentActivity: "/dashboard/activity",
    charts: "/dashboard/charts",
  },

  // ═══════════════════════════════════════════
  // Notifications
  // ═══════════════════════════════════════════
  notifications: {
    list: "/notifications",
    markAsRead: (id) => `/notifications/${id}/read`,
    markAllAsRead: "/notifications/read-all",
    remove: (id) => `/notifications/${id}`,
    unreadCount: "/notifications/unread-count",
  },

  // ═══════════════════════════════════════════
  // Files / Upload
  // ═══════════════════════════════════════════
  files: {
    upload: "/files/upload",
    uploadMultiple: "/files/upload-multiple",
    remove: (id) => `/files/${id}`,
  },
};

export default ENDPOINTS;
