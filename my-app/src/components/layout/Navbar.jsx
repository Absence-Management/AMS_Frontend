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

const NotificationIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <path
      d="M21.164 15.3665C21.164 14.9523 20.8282 14.6165 20.414 14.6165C19.9998 14.6165 19.664 14.9523 19.664 15.3665H20.414H21.164ZM19.664 18.1415C19.664 18.5557 19.9998 18.8915 20.414 18.8915C20.8282 18.8915 21.164 18.5557 21.164 18.1415H20.414H19.664ZM14.3556 20.8665L13.7135 20.479L13.7123 20.4811L14.3556 20.8665ZM13.2973 22.6332L12.6539 22.2477L12.6529 22.2495L13.2973 22.6332ZM14.2973 25.3415L14.0601 26.053L14.0606 26.0532L14.2973 25.3415ZM26.5723 25.3415L26.809 26.0532L26.8095 26.053L26.5723 25.3415ZM27.5723 22.6332L28.2159 22.2481L28.2157 22.2477L27.5723 22.6332ZM26.514 20.8665L27.1574 20.4811L27.1561 20.479L26.514 20.8665ZM25.989 17.2165H26.739L26.739 17.2145L25.989 17.2165ZM20.414 15.3665H19.664V18.1415H20.414H21.164V15.3665H20.414ZM20.4306 11.6665V10.9165C16.9498 10.9165 14.1306 13.7356 14.1306 17.2165H14.8806H15.6306C15.6306 14.5641 17.7782 12.4165 20.4306 12.4165V11.6665ZM14.8806 17.2165H14.1306V18.9665H14.8806H15.6306V17.2165H14.8806ZM14.8806 18.9665H14.1306C14.1306 19.1616 14.0879 19.4459 14.0045 19.7484C13.921 20.0513 13.8125 20.3149 13.7135 20.479L14.3556 20.8665L14.9978 21.254C15.1904 20.9347 15.3445 20.5317 15.4505 20.1471C15.5567 19.7622 15.6306 19.338 15.6306 18.9665H14.8806ZM14.3556 20.8665L13.7123 20.4811L12.6539 22.2477L13.2973 22.6332L13.9407 23.0186L14.999 21.2519L14.3556 20.8665ZM13.2973 22.6332L12.6529 22.2495C12.2231 22.9712 12.1331 23.784 12.4 24.5066C12.6671 25.2296 13.264 25.7876 14.0601 26.053L14.2973 25.3415L14.5345 24.63C14.1306 24.4954 13.9025 24.2451 13.8071 23.9868C13.7116 23.7282 13.7215 23.3868 13.9417 23.0169L13.2973 22.6332ZM14.2973 25.3415L14.0606 26.0532C18.1976 27.4293 22.672 27.4293 26.809 26.0532L26.5723 25.3415L26.3356 24.6298C22.5059 25.9037 18.3637 25.9037 14.534 24.6298L14.2973 25.3415ZM26.5723 25.3415L26.8095 26.053C28.3921 25.5255 29.0689 23.6736 28.2159 22.2481L27.5723 22.6332L26.9287 23.0183C27.2924 23.626 27.0025 24.4075 26.3351 24.63L26.5723 25.3415ZM27.5723 22.6332L28.2157 22.2477L27.1574 20.4811L26.514 20.8665L25.8706 21.2519L26.9289 23.0186L27.5723 22.6332ZM26.514 20.8665L27.1561 20.479C27.0577 20.3159 26.9491 20.0508 26.8653 19.7458C26.7815 19.4412 26.739 19.1571 26.739 18.9665H25.989H25.239C25.239 19.3343 25.3131 19.7585 25.4189 20.1434C25.5247 20.528 25.6786 20.9338 25.8718 21.254L26.514 20.8665ZM25.989 18.9665H26.739V17.2165H25.989H25.239V18.9665H25.989ZM25.989 17.2165L26.739 17.2145C26.7295 13.7522 23.8953 10.9165 20.4306 10.9165V11.6665V12.4165C23.066 12.4165 25.2318 14.5808 25.239 17.2186L25.989 17.2165ZM23.189 25.6832H22.439C22.439 26.794 21.5248 27.7082 20.414 27.7082V28.4582V29.2082C22.3532 29.2082 23.939 27.6224 23.939 25.6832H23.189ZM20.414 28.4582V27.7082C19.8656 27.7082 19.3533 27.4785 18.986 27.1112L18.4556 27.6415L17.9253 28.1718C18.558 28.8045 19.4457 29.2082 20.414 29.2082V28.4582ZM18.4556 27.6415L18.986 27.1112C18.6186 26.7438 18.389 26.2316 18.389 25.6832H17.639H16.889C16.889 26.6514 17.2926 27.5392 17.9253 28.1718L18.4556 27.6415Z"
      fillOpacity="0.8"
      fill="#16151C"
    />
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
            width={48}
            height={48}
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
