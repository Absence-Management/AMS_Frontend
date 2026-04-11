import { create } from "zustand";

const normalizeRole = (value) =>
  typeof value === "string" ? value.trim().toLowerCase() : null;

export const useAuthStore = create((set) => ({
  // ── State ──────────────────────────────
  user: null, // { id, first_name, last_name, email, role }
  role: null, // "ADMIN" | "TEACHER"
  isAuthenticated: false,

  isAuthLoading: true, // true until rehydration completes
  // ── Actions ────────────────────────────

  // Call this after successful login
  // token is handled by httpOnly cookie — never stored here
  setAuth: (data) =>
    set({
      user: data,
      role: normalizeRole(data?.role),
      isAuthenticated: true,
      isAuthLoading: false,
    }),

  // Call this to update user info only
  setUser: (data) =>
    set({
      user: { ...data },
      role: normalizeRole(data?.role),
    }),

  // Call this on logout
  clearAuth: () =>
    set({
      user: null,
      role: null,
      isAuthenticated: false,
      isAuthLoading: false,
    }),

  // Call this to set loading state
  setAuthLoading: (loading) => set({ isAuthLoading: loading }),
}));
