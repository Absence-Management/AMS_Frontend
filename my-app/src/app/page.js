"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { ROLE_ROUTES } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, role, isAuthLoading } = useAuthStore();
  useAuth();

  useEffect(() => {
    if (isAuthLoading) return; // wait until rehydration finishes

    if (!isAuthenticated) {
      router.replace("/login");
    } else {
      const normalizedRole = typeof role === "string" ? role.toLowerCase() : "";
      router.replace(ROLE_ROUTES[normalizedRole] ?? "/login");
    }
  }, [isAuthenticated, role, router, isAuthLoading]);

  return null;
}
