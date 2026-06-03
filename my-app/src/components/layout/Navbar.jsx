// ============================================
// AMS — ESI Sidi Bel Abbès
// components/layout/Navbar.jsx
// ============================================

"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { ROLES } from "@/lib/constants";
import Image from "next/image";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";

// ── Icons ─────────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path
      d="M15.7501 15.7501L12.4951 12.4951"
      stroke="#6b7280"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.25 8.25C2.25 11.5615 4.93851 14.25 8.25 14.25C11.5615 14.25 14.25 11.5615 14.25 8.25C14.25 4.93851 11.5615 2.25 8.25 2.25C4.93851 2.25 2.25 4.93851 2.25 8.25V8.25"
      stroke="#6b7280"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ── Component ─────────────────────────────────────────────────────────────────
export function Navbar() {
  const { user, role } = useAuthStore();
  const [imgError, setImgError] = useState(false);
  // Derive initials for the avatar fallback
  const fullName = [user?.first_name, user?.last_name]
    .filter(Boolean)
    .join(" ");
  const initials = fullName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase();

  return (
    <header className="navbar flex items-center justify-between">
      {/* ── Left: Search ── */}
      <div className="navbar-left flex items-center">
        <div className="navbar-search">
          <span className="navbar-search-icon">
            <SearchIcon />
          </span>
          <input
            type="text"
            className="navbar-search-input"
            placeholder="Search anything..."
          />
        </div>
      </div>

      {/* ── Right: Notification + User info + Avatar ── */}
      <div className="flex items-center gap-4">
        <NotificationDropdown />
        <div className="navbar-user">
          <div className="navbar-user-info flex flex-col items-end">
            <span className="navbar-name font-medium text-gray-900">
              {fullName}
            </span>
            <span className="navbar-role text-xs text-gray-500 mt-0.5">
              {role === ROLES.ADMIN ? "Admin" : "Teacher"}
            </span>
          </div>
          <div className="navbar-avatar ml-2" aria-hidden="true">
            {!imgError ? (
              <Image
                src="/keskes-nabil-1.png"
                width={48}
                height={48}
                alt={fullName || "Profile photo"}
                className="h-full w-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="navbar-avatar-initials">{initials || "U"}</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
