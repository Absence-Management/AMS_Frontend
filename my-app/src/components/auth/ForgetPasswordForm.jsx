// ============================================
// AMS — ESI Sidi Bel Abbès
// components/auth/ForgetPasswordForm.jsx
// ============================================

"use client";

import { useState } from "react";
import { forgetPassword } from "@/services/authService";
import Image from "next/image";

export function ForgetPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await forgetPassword(email);
      setSuccess(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="success-card">
        <h2>Email Sent ✅</h2>
        <p>
          If an account exists with this email, you will receive a password
          reset link valid for <strong>30 minutes</strong>.
        </p>
        <p>Please also check your spam folder.</p>
        <a href="/login">Back to Login</a>
      </div>
    );
  }

  return (
    <div className="login-form px-16">
      <a href="/login" className="auth-back">
        <Image
          src="/arrow-narrow-left.svg"
          alt="Back"
          width={32}
          height={40}
        />
      </a>

      <div className="mb-8">
        <h2 className="auth-title">Reset Password</h2>
        <p className="auth-subtitle">
          Please enter your email. We will send you a code to reset your
          password.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group mb-8">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            placeholder="Your Email"
          />
          {error && <div className="error-message">{error}</div>}
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <div className="auth-helper mt-20">
        <p>
          For any assistance, please contact the administration via email:{' '}
          <span className="auth-helper-mail">administration@esi-sba.dz</span>.
        </p>
      </div>
    </div>
  );
}