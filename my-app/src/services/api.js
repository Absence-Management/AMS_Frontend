// ============================================
// AMS — ESI Sidi Bel Abbès
// services/api.js — Axios Instance
// ============================================

import axios from "axios";
import { CONFIG, API_ENDPOINTS } from "@/lib/constants";
import { apiLoadingStart, apiLoadingStop } from "@/lib/loadingBus";

const api = axios.create({
  baseURL: "/api", // ← was CONFIG.API_URL or the env var
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// ── Response Interceptor ──────────────────────────────
// If backend returns 401 → try to refresh the token once
// If refresh fails → redirect to login

let isRefreshing = false;
let failedQueue = [];
api.interceptors.request.use((config) => {
  if (typeof document !== "undefined") {
    const csrfToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrf_token="))
      ?.split("=")[1];

    if (csrfToken) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }
  }

  if (typeof window !== "undefined") {
    config.metadata = { ...(config.metadata || {}), startedAt: Date.now() };
    if (!config.skipGlobalLoader) {
      apiLoadingStart();
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    if (typeof window !== "undefined" && !response.config?.skipGlobalLoader) apiLoadingStop();
    return response;
  },
  async (error) => {
    if (typeof window !== "undefined" && !error.config?.skipGlobalLoader) apiLoadingStop();
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url || "";
    const shouldSkipRefresh =
      requestUrl.includes(API_ENDPOINTS.LOGIN) ||
      requestUrl.includes(API_ENDPOINTS.RESET_PASSWORD) ||
      requestUrl.includes(API_ENDPOINTS.RESET_PASSWORD_CONFIRM);

    // If 401 and not already retried and not the refresh endpoint itself
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !requestUrl.includes(API_ENDPOINTS.REFRESH_TOKEN) &&
      !shouldSkipRefresh
    ) {
      if (isRefreshing) {
        // Queue requests while refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Ask backend to refresh — cookie is sent automatically
        await api.post(API_ENDPOINTS.REFRESH_TOKEN);
        processQueue(null);
        return api(originalRequest); // retry original request
      } catch (refreshError) {
        processQueue(refreshError);
        // Refresh failed → force logout → redirect to login
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

function processQueue(error) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
}

export default api;
