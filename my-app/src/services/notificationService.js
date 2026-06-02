// ============================================
// AMS — ESI Sidi Bel Abbès
// services/notificationService.js — Notification API Calls
// ============================================

import api from "@/services/api";

// axios baseURL is '/api', rewrite proxies /api/v1/* → backend
// so paths here start with /v1/
const BASE = "/v1/notifications";

export const notificationService = {
  /**
   * Fetch paginated inbox (newest first)
   * @param {{ page?: number, page_size?: number, unread_only?: boolean }} params
   * @returns {{ total, page, page_size, data: Notification[] }}
   */
  getNotifications: async (params = {}) => {
    const { page = 1, page_size = 20, unread_only = false } = params;
    const response = await api.get(BASE, {
      params: { page, page_size, unread_only },
    });
    return response.data;
  },

  /**
   * Lightweight badge counter → returns the count number directly
   * @returns {number}
   */
  getUnreadCount: async () => {
    const response = await api.get(`${BASE}/unread-count`);
    return response.data.count;
  },

  /**
   * Mark a single notification as read
   * @param {string} notificationId — UUID
   * @returns {Notification}
   */
  markAsRead: async (notificationId) => {
    const response = await api.patch(`${BASE}/${notificationId}/read`);
    return response.data;
  },

  /**
   * Mark every unread notification for the current user as read
   */
  markAllAsRead: async () => {
    const response = await api.post(`${BASE}/read-all`);
    return response.data;
  },
};
