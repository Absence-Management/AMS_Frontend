// ============================================
// AMS — ESI Sidi Bel Abbès
// components/auth/ForgetPasswordForm.jsx
// ============================================

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { forgetPassword } from "@/services/authService";
import Image from "next/image";
import { Modal } from "@/components/shared/Modal";

export function ForgetPasswordForm() {
  const router = useRouter();

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

  return (
    <div className="login-form px-16">
      {/* Back button */}
      <a href="/login" className="auth-back">
        <Image
          src="/arrow-narrow-left.svg"
          alt="Back"
          width={32}
          height={40}
        />
      </a>

      {/* Header */}
      <div className="mb-8">
        <h2 className="auth-title">Reset Password</h2>
        <p className="auth-subtitle">
          Please enter your email. We will send you a link to reset your
          password.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-8">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading || success}
            placeholder="Your Email"
          />

          {error && <div className="error-message">{error}</div>}
        </div>

        <button
          type="submit"
          disabled={loading || success}
          className="btn-primary"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      {/* Helper text */}
      <div className="auth-helper mt-20">
        <p>
          For any assistance, please contact the administration via email:{" "}
          <span className="auth-helper-mail">
            administration@esi-sba.dz
          </span>.
        </p>
      </div>

      {/* ✅ SUCCESS MODAL */}
      {success && (
        <Modal
          title="Email Sent Successfully"
          message="If an account exists with this email, you will receive a password reset link valid for 30 minutes. Please also check your spam folder."
          buttonText="Back to Login"
          iconSrc="/molalIcon.svg"
          href="/login"
          onClose={() => {
            setSuccess(false);
            router.push("/login");
          }}
        />
      )}
    </div>
  );
}