// ============================================
// AMS — ESI Sidi Bel Abbès
// components/auth/ForgotPasswordForm.jsx
// ============================================

"use client";

import { useState } from "react";
import { forgotPassword } from "@/services/authService";

export function ForgotPasswordForm() {
  const [email,   setEmail]   = useState("");
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await forgotPassword(email);
      // Backend always returns 200 — never reveals if email exists
      setSuccess(true);
    } catch (err) {
      // Only real network/server errors reach here
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Success State ─────────────────────────
  if (success) {
    return (
      <div className="forgot-password-form">
        <div className="success-message">
          <h2>Email Sent ✅</h2>
          <p>
            If an account exists with this email, you will receive a
            password reset link valid for <strong>30 minutes</strong>.
          </p>
          <p>Please also check your spam folder.</p>
          <a href="/login">Back to Login</a>
        </div>
      </div>
    );
  }

  // ── Form State ────────────────────────────
  return (
    <div className="forgot-password-form">
      <h2>Forgot Password</h2>
      <p>
        Enter your institutional email to receive
        a password reset link.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            placeholder="you@esi-sba.dz"
          />
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <a href="/login">Back to Login</a>
    </div>
  );
}