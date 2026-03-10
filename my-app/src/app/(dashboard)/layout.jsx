// app/(dashboard)/layout.jsx
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useAutoLogout } from "@/hooks/useAutoLogout";

export default function DashboardLayout({ children }) {
  useAuth();          // rehydrate store + refresh token
  useAutoLogout();    // 30min inactivity timer

  return (
    <div className="dashboard-layout">
      {children}
    </div>
  );
}