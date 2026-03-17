// ============================================
// AMS — ESI Sidi Bel Abbès
// components/layout/RoleGuard.jsx
// Client-side role check — wraps protected content
// ============================================

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { ROLES } from "@/lib/constants";

export function RoleGuard({ children, allowedRoles }) {
  const router = useRouter();
  const { role, isAuthenticated, isAuthLoading } = useAuthStore();

  useEffect(() => {
    if (isAuthLoading) return;
    console.log(
      "[RoleGuard] isAuthenticated:",
      isAuthenticated,
      "role:",
      role,
      "allowedRoles:",
      allowedRoles,
    );
    // Not logged in → redirect to login
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Logged in but wrong role → redirect to their own dashboard
    if (!allowedRoles.includes(role)) {
      if (role === ROLES.ADMIN) {
        router.push("/admin");
      } else if (role === ROLES.TEACHER) {
        router.push("/teacher");
      } else {
        router.push("/login");
      }
    }
  }, [isAuthenticated, role, allowedRoles, router, isAuthLoading]);

  // While checking auth → show nothing
  if (isAuthLoading || !isAuthenticated || !allowedRoles.includes(role)) {
    return null;
  }

  return children;
}
