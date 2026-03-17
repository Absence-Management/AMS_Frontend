"use client";

import { API_ENDPOINTS } from "@/lib/constants";
import api from "@/services/api";
import Image from "next/image";

export function GoogleOAuthButton() {
  const handleGoogleLogin = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.GOOGLE_AUTH);
      window.location.href = response.data.authorization_url;
    } catch (error) {
      console.error("Google OAuth initiation failed:", error);
      alert("Failed to initiate Google login. Please try again.");
    }
  };

  return (
    <button onClick={handleGoogleLogin} className="btn-google">
      <Image
        width={24}
        height={24}
        src="/google.svg"
        alt="Google"
      />
      <span>Sign in with Google Auth</span>
    </button>
  );
}