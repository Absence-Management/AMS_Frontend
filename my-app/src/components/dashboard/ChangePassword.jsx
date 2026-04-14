"use client";

import { useState } from "react";
import { changePassword } from "@/services/authService";
import { PasswordField } from "@/components/shared/PasswordField";

function parseErrorMessage(err) {
  const detail = err?.response?.data?.detail;

  const normalizeText = (value) =>
    typeof value === "string" ? value.trim().toLowerCase() : "";

  const oauthOnlyMessage =
    "This account uses Google sign-in only. Password change is not available for this account.";

  if (Array.isArray(detail) && detail.length > 0) {
    const firstMsg = detail[0]?.msg;
    const normalizedFirstMsg = normalizeText(firstMsg);

    if (
      normalizedFirstMsg.includes("oauth") ||
      normalizedFirstMsg.includes("google") ||
      (normalizedFirstMsg.includes("password") &&
        normalizedFirstMsg.includes("not set"))
    ) {
      return oauthOnlyMessage;
    }

    return firstMsg || "Something went wrong. Please try again.";
  }

  if (typeof detail === "string" && detail.trim()) {
    const normalizedDetail = normalizeText(detail);

    if (
      normalizedDetail.includes("oauth") ||
      normalizedDetail.includes("google") ||
      (normalizedDetail.includes("password") &&
        normalizedDetail.includes("not set"))
    ) {
      return oauthOnlyMessage;
    }

    return detail;
  }

  const status = err?.response?.status;
  if (status === 400) return "Please check the entered passwords.";
  if (status === 401 || status === 403)
    return "You are not authorized. Please login again.";

  return "Unable to change password right now. Please try again.";
}

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit =
    currentPassword.trim().length > 0 &&
    newPassword.trim().length > 0 &&
    confirmPassword.trim().length > 0 &&
    !loading;

  const clearMessages = () => {
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from old password.");
      return;
    }

    setLoading(true);
    try {
      await changePassword(currentPassword, newPassword, confirmPassword);
      setSuccess("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(parseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="change-password">
      <div className="change-password__header">
        <h3 className="change-password__title">Change your password</h3>
      </div>

      <div className="change-password__body">
        <PasswordField
          id="current-password"
          label="Old password"
          value={currentPassword}
          onChange={(value) => {
            clearMessages();
            setCurrentPassword(value);
          }}
          disabled={loading}
          className="change-password__field"
          inputClass="change-password__input"
        />

        <PasswordField
          id="new-password"
          label="New password"
          value={newPassword}
          onChange={(value) => {
            clearMessages();
            setNewPassword(value);
          }}
          disabled={loading}
          className="change-password__field"
          inputClass="change-password__input"
        />

        <PasswordField
          id="confirm-password"
          label="Confirm new password"
          value={confirmPassword}
          onChange={(value) => {
            clearMessages();
            setConfirmPassword(value);
          }}
          disabled={loading}
          className="change-password__field"
          inputClass="change-password__input"
        />

        {error && <div className="change-password__error-box">{error}</div>}

        {success && (
          <div className="change-password__success-box">{success}</div>
        )}

        <div className="change-password__actions">
          <button
            type="submit"
            disabled={!canSubmit}
            className="change-password__submit-btn"
          >
            {loading ? "Updating..." : "Save password"}
          </button>
        </div>
      </div>
    </form>
  );
}
