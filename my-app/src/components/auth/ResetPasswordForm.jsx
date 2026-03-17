// ============================================
// AMS — ESI Sidi Bel Abbès
// components/auth/ResetPasswordForm.jsx
// ============================================

"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { resetPasswordConfirm } from "@/services/authService";
import Image from "next/image";
import { Modal } from "@/components/shared/Modal";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  if (!token) {
    return (
      <div className="invalid-link-card">
        <h2>Invalid Link</h2>
        <p>This password reset link is invalid or has expired.</p>
        <a href="/forgot-password">Request a new link</a>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      await resetPasswordConfirm(token, password, confirm);
      setShowModal(true);
    } catch (err) {
      const detail = err.response?.data?.detail;

      if (Array.isArray(detail)) {
        setError(detail[0]?.msg || "Something went wrong. Please try again.");
      } else if (typeof detail === "string") {
        setError(detail);
      } else {
        setError(
          "This link has expired or is invalid. Please request a new one.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

 

  
    return (
  <div className="login-form px-20">
    <a href="/login" className="auth-back">
      <Image src="/arrow-narrow-left.svg" alt="Back" width={32} height={40} />
    </a>

    <div className="mb-8">
      <h2 className="auth-title">Reset Password</h2>
      <p className="auth-subtitle">
        Please enter your new password. Make sure it&apos;s at least 8
        characters long and matches the confirmation field.
      </p>
    </div>

    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          placeholder="New Password"
          className="mb-8"
        />
      </div>

      <div className="form-group">
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          disabled={loading}
          placeholder="Confirm password"
          className="mb-8"
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? "Resetting..." : "Reset Password"}
      </button>
    </form>

    {/* ✅ CORRECT PLACE */}
    {showModal && (
      <Modal
        title="You have successfully changed your password"
        message=""
        buttonText="Back to log in page"
        iconSrc="/molalIcon.svg"
        href="/login"
        onClose={() => {
          setShowModal(false);
          router.push("/login");
        }}
      />
    )}
  </div>
);
  
}
