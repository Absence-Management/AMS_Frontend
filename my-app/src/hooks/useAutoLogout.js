// ============================================
// AMS — ESI Sidi Bel Abbès
// hooks/useAutoLogout.js
// Logs out user after 30min of inactivity
// ============================================

"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/authStore";
import { logout } from "@/services/authService";
import { TOKEN } from "@/lib/constants";

export function useAutoLogout() {
  const { isAuthenticated, clearAuth } = useAuthStore();
  const timerRef = useRef(null);

  useEffect(() => {
    // Only run when user is logged in
    if (!isAuthenticated) return;

    // ── Reset Timer ───────────────────────────
    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(async () => {
        // 30 minutes of inactivity → logout
        try {
          await logout();
        } catch (err) {
          // Even if logout API fails, clear the store
        } finally {
          clearAuth();
          window.location.href = "/login";
        }
      }, TOKEN.INACTIVITY_LIMIT); // 30 minutes
    };

    // ── Listen to User Activity ───────────────
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    // Start the timer immediately on mount
    resetTimer();

    // ── Cleanup ───────────────────────────────
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [isAuthenticated, clearAuth]);
}