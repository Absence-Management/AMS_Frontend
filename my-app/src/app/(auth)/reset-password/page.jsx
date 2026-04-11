// ============================================
// AMS — ESI Sidi Bel Abbès
// app/(auth)/reset-password/page.jsx
// ============================================

import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="login-form px-20">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
