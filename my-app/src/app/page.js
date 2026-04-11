"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { ROLE_ROUTES } from "@/lib/constants";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, role, isAuthLoading } = useAuthStore();

  useEffect(() => {
    if (isAuthLoading) return; // wait until rehydration finishes

    if (!isAuthenticated) {
      router.replace("/login");
    } else {
      router.replace(ROLE_ROUTES[role] ?? "/login");
    }
  }, [isAuthenticated, role, router, isAuthLoading]);

  return null;
}