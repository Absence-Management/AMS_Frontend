"use client";

import Image from "next/image";

export function GoogleOAuthButton() {
  const handleGoogleLogin = () => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL;
    const googleAuthUrl = `${apiBase}/v1/auth/google`;
    window.location.assign(googleAuthUrl);
  };

  return (
    <button onClick={handleGoogleLogin} className="btn-google">
      <Image width={24} height={24} src="/google.svg" alt="Google" />
      <span>Sign in with Google Auth</span>
    </button>
  );
}
