"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { ROLE_ROUTES } from "@/lib/constants";
import { getMe } from "@/services/authService";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("access_token") || params.has("refresh_token")) {
      window.history.replaceState({}, document.title, "/auth/callback");
    }

    getMe()
      .then((user) => {
        setAuth(user);
        router.replace(ROLE_ROUTES[user.role] ?? "/login");
      })
      .catch(() => router.replace("/login?error=google_auth_failed"));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="auth-callback-page">
      <div className="auth-callback-card" role="status" aria-live="polite">
        <div className="auth-callback-spinner" aria-hidden="true" />
        <h1 className="auth-callback-title">Signing you in...</h1>
        <p className="auth-callback-subtitle">
          Please wait while we finish your Google sign-in.
        </p>
      </div>
    </div>
  );
}
