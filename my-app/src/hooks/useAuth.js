// ============================================
// AMS — ESI Sidi Bel Abbès
// hooks/useAuth.js
// Rehydrates store on page refresh + auto token refresh
// ============================================

"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { getMe } from "@/services/authService";
import { TOKEN } from "@/lib/constants";

export function useAuth() {
  const { setUser, clearAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // ── Rehydrate store on page refresh ──────
    // Cookie is still valid → get current user from backend
    const rehydrate = async () => {
      try {
        const user = await getMe();
        setUser(user);
      } catch (err) {
        // Cookie expired or invalid → clear store
        clearAuth();
      }
    };

    rehydrate();
  }, [setUser, clearAuth]);

  useEffect(() => {
    // ── Auto refresh token every 14 minutes ──
    // Only when user is authenticated
    if (!isAuthenticated) return;

    const interval = setInterval(async () => {
      try {
        await import("@/services/authService").then(({ refreshToken }) =>
          refreshToken()
        );
      } catch (err) {
        // Refresh failed → force logout
        clearAuth();
        window.location.href = "/login";
      }
    }, TOKEN.REFRESH_INTERVAL); // 14 minutes

    return () => clearInterval(interval); // cleanup on unmount
  }, [isAuthenticated, clearAuth]);
}