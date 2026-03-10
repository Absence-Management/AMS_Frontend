"use client";

import { API_ENDPOINTS } from "@/lib/constants";
import api from "@/services/api";

export function GoogleOAuthButton() {
  const handleGoogleLogin = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.GOOGLE_AUTH);
      // Redirect to backend — backend handles everything
      window.location.href = response.data.authorization_url;
    } catch (error) {
      console.error("Google OAuth initiation failed:", error);
      alert("Failed to initiate Google login. Please try again.");
    }
  };

  return (
    <button onClick={handleGoogleLogin} className="google-oauth-button">
      Se connecter avec Google
    </button>
  );
}
