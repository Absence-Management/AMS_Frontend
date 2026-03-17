// ============================================
// AMS — ESI Sidi Bel Abbès
// components/auth/LoginForm.jsx
// ============================================

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { ROLE_ROUTES } from "@/lib/constants";
import { GoogleOAuthButton } from "@/components/auth/GoogleOAuthButton";

export function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(email, password);
      setAuth(data);
      router.push(ROLE_ROUTES[data.role]);
    } catch (err) {
      const status = err.response?.status;

      if (status === 401) {
        setError("Email ou mot de passe incorrect.");
      } else if (status === 403) {
        setError("Votre compte est désactivé. Contactez l'administrateur.");
      } else {
        setError("Une erreur est survenue. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form">
      <div>
        <h2 className="auth-title">Log in to your account</h2>
        <p className="auth-subtitle">
          enter your credentials to access your account now
        </p>
      </div>

      <div>
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="form-group mb-10">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="Your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="•••••••••••••"
            />
          </div>

          <div className="auth-row mb-8">
            <label className="auth-remember" htmlFor="remember-me">
              <input
                type="checkbox"
                id="remember-me"
                disabled={loading}
              />
              <span>Remember me</span>
            </label>
            <a className="auth-forgot" href="/forget-password">
              Forgot password?
            </a>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
      </div>

      <div className="auth-divider">
        <hr />
        <span>or</span>
        <hr />
      </div>

      <GoogleOAuthButton />

      <div className="auth-helper mt-20">
        <p>
          For any assistance, please contact the administration via email:{' '}
          <span className="auth-helper-mail">administration@esi-sba.dz</span>.
        </p>
      </div>
    </div>
  );
}