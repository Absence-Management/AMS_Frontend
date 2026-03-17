// ============================================
// AMS — ESI Sidi Bel Abbès
// app/(dashboard)/layout.jsx
// ============================================

"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { useAutoLogout } from "@/hooks/useAutoLogout";
import { RoleGuard } from "@/components/layout/RoleGuard";

export default function DashboardLayout({ children }) {
  useAuth(); // rehydrate store + refresh token every 14min
  useAutoLogout(); // auto logout after 30min inactivity

  return (
    <RoleGuard allowedRoles={["admin", "teacher"]}>
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-main">
          <Navbar />
          <main className="dashboard-content">{children}</main>
        </div>
      </div>
    </RoleGuard>
  );
}
