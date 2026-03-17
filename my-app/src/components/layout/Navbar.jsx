// ============================================
// AMS — ESI Sidi Bel Abbès
// components/layout/Navbar.jsx
// ============================================

"use client";

import { useAuthStore } from "@/store/authStore";
import { ROLES } from "@/lib/constants";
import Image from "next/image";

// ── Icons ─────────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="8" cy="8" r="5.5" stroke="#6b7280" strokeWidth="1.5" />
    <path
      d="M12.5 12.5L16 16"
      stroke="#6b7280"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const NotificationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M10 2.5A5.5 5.5 0 0 0 4.5 8v3L3 12.5h14L15.5 11V8A5.5 5.5 0 0 0 10 2.5Z"
      stroke="#16151c"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M8 12.5v.5a2 2 0 0 0 4 0v-.5" stroke="#16151c" strokeWidth="1.5" />
  </svg>
);

// ── Component ─────────────────────────────────────────────────────────────────
export function Navbar() {
  const { user, role } = useAuthStore();
  // console.log("[Navbar] user:", user); // Removed after confirming display

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
    <header className="navbar">
      {/* ── Left: Search + Notification ── */}
      <div className="navbar-left">
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

        <button className="navbar-notification" aria-label="Notifications">
          <NotificationIcon />
        </button>
      </div>

      {/* ── Right: User info + Avatar ── */}
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
          <Image
            src="/profile.png"
            width={64}
            height={64}
            alt={fullName || "Profile"}
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
          <span style={{ display: "none" }}>{initials}</span>
        </div>
      </div>
    </header>
  );
}
