import { LoginForm } from "@/components/auth/LoginForm";
import { GoogleOAuthButton } from "@/components/auth/GoogleOAuthButton";

export default function LoginPage() {
  return (
    <div className="auth-stack">
      <LoginForm />
      <div className="auth-divider" aria-hidden="true">
        <span>or</span>
      </div>
      <GoogleOAuthButton />
    </div>
  );
}
