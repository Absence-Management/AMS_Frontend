"use client";

import { API_ENDPOINTS } from "@/lib/constants";
import Image from "next/image";

export function GoogleOAuthButton() {
  const handleGoogleLogin = async () => {
    try {
      const res = await fetch(`/api${API_ENDPOINTS.GOOGLE_AUTH}`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`OAuth init failed: ${res.status}`);
      }

      const data = await res.json();
      const authorizationUrl = data?.authorization_url;

      if (!authorizationUrl) {
        throw new Error("Missing authorization_url");
      }

      window.location.assign(authorizationUrl);
    } catch (error) {
      console.error("Google OAuth initiation failed:", error);
      alert("Failed to start Google login. Please try again.");
    }
  };

  return (
    <button onClick={handleGoogleLogin} className="btn-google">
      <Image width={24} height={24} src="/google.svg" alt="Google" />
      <span>Sign in with Google Auth</span>
    </button>
  );
}
