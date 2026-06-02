// Decoupled event bus for the global loading indicator.
// Used by axios interceptors (services/api.js) and listened to by
// components/shared/LoadingProvider.jsx — no React coupling on this side.

export const API_LOADING_EVENT = "ams:api-loading";

export function apiLoadingStart() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(API_LOADING_EVENT, { detail: { active: true } }));
}

export function apiLoadingStop() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(API_LOADING_EVENT, { detail: { active: false } }));
}
