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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <p>Signing you in…</p>
    </div>
  );
}
