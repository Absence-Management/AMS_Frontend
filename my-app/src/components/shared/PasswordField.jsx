// ============================================
// AMS — ESI Sidi Bel Abbès
// components/shared/PasswordField.jsx
// Reusable password input with show/hide toggle.
// Used by: LoginForm, ResetPasswordForm, ChangePassword
// ============================================

"use client";

import { useState } from "react";

// ── Icons ─────────────────────────────────────────────────────────────────────

export function EyeOpenIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function EyeClosedIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

// ── PasswordField ─────────────────────────────────────────────────────────────

/**
 * A labelled password input with a show/hide toggle button.
 *
 * Props
 * ─────
 * id          string   — <input> id (also used for <label> htmlFor & autoComplete)
 * label       string   — visible label text (omit to render no label)
 * value       string   — controlled value
 * onChange    fn       — called with the new string value (not the event)
 * disabled    bool     — disables both input and toggle button
 * placeholder string   — input placeholder (default ••••••••••••)
 * className   string   — extra class applied to the outer wrapper div
 * inputClass  string   — extra class applied to the <input> element
 *
 * The component manages its own visible/hidden state internally,
 * so callers don't need to track it.
 */
export function PasswordField({
  id,
  label,
  value,
  onChange,
  disabled = false,
  placeholder = "••••••••••••",
  className = "",
  inputClass = "",
}) {
  const [visible, setVisible] = useState(false);

  // Derive a sensible autoComplete value from the field id
  const autoComplete = id === "current-password" ? "current-password" : "new-password";

  return (
    <div className={`password-field ${className}`.trim()}>
      {label && (
        <label htmlFor={id} className="password-field__label">
          {label}
        </label>
      )}

      <div className="password-field__wrapper">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          required
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`password-field__input ${inputClass}`.trim()}
        />

        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          disabled={disabled}
          className="password-field__toggle"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOpenIcon /> : <EyeClosedIcon />}
        </button>
      </div>
    </div>
  );
}
