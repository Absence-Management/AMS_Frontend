// ============================================
// AMS — ESI Sidi Bel Abbès
// tableShared.jsx — Shared table atoms
// ============================================

export function IconGroup() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="6" cy="5.5" r="2.2" stroke="#4a5567" strokeWidth="1.2" />
      <path
        d="M2 13c0-2.2 1.8-4 4-4s4 1.8 4 4"
        stroke="#4a5567"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="11.5" cy="5.5" r="1.8" stroke="#4a5567" strokeWidth="1.2" />
      <path
        d="M13.5 13c0-1.8-1-3.2-2-3.6"
        stroke="#4a5567"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconSearch() {
  return (
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
}

export function FilterIcon() {
  return (
    <svg width="13" height="12" viewBox="0 0 13 12" fill="none">
      <path
        d="M0.600128 1.53331C0.600128 1.20661 0.600128 1.04326 0.663708 0.918481C0.719634 0.80872 0.808873 0.719481 0.918634 0.663555C1.04342 0.599976 1.20676 0.599976 1.53346 0.599976H11.3335C11.6602 0.599976 11.8235 0.599976 11.9483 0.663555C12.0581 0.719481 12.1473 0.80872 12.2032 0.918481C12.2668 1.04326 12.2668 1.20661 12.2668 1.53331V1.92379C12.2668 2.08059 12.2668 2.15899 12.2476 2.23189C12.2307 2.29649 12.2027 2.3577 12.165 2.41284C12.1225 2.47506 12.0632 2.52641 11.9447 2.6291L8.21386 5.86252C8.09537 5.96521 8.03612 6.01656 7.99358 6.07878C7.95588 6.13392 7.92793 6.19513 7.91096 6.25973C7.8918 6.33263 7.8918 6.41103 7.8918 6.56783V9.61736C7.8918 9.73144 7.8918 9.78848 7.8734 9.83779C7.85714 9.88137 7.8307 9.92042 7.79628 9.9517C7.75732 9.9871 7.70436 10.0083 7.59844 10.0506L5.61511 10.844C5.40071 10.9297 5.29351 10.9726 5.20745 10.9547C5.1322 10.9391 5.06616 10.8944 5.02369 10.8303C4.97513 10.7571 4.97513 10.6416 4.97513 10.4107V6.56783C4.97513 6.41103 4.97513 6.33263 4.95597 6.25973C4.93899 6.19513 4.91104 6.13392 4.87334 6.07878C4.8308 6.01656 4.77155 5.96521 4.65306 5.86252L0.922193 2.6291C0.803702 2.52641 0.744457 2.47506 0.701915 2.41284C0.664216 2.3577 0.636267 2.29649 0.619288 2.23189C0.600128 2.15899 0.600128 2.08059 0.600128 1.92379V1.53331Z"
        stroke="#030712"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SortIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M5 3v8M5 11l-2-2M5 11l2-2M9 11V3M9 3l-2 2M9 3l2 2"
        stroke="#111827"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconDots() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <circle cx="6" cy="2" r="1" fill="#6b7280" />
      <circle cx="6" cy="6" r="1" fill="#6b7280" />
      <circle cx="6" cy="10" r="1" fill="#6b7280" />
    </svg>
  );
}

// ─── Avatar ──────────────────────────────────────────────────────────────────

export function Avatar({ name, fallback = "?", color = "#e2e8f0" }) {
  const initials = (name || fallback)
    .split(" ")
    .map((n) => n?.[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-semibold text-gray-600 shrink-0"
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}

// ─── StatusBadge ─────────────────────────────────────────────────────────────
// Figma exact colors from design inspection

const STATUS_STYLES = {
  // Account statuses
  active: {
    bg: "#e8f8ef",
    color: "#069855",
    border: "#ccebd9",
    label: "Active",
  },
  disabled: {
    bg: "#fff1f1",
    color: "#b42318",
    border: "#f0d3d3",
    label: "Disabled",
  },
  // Absence statuses
  safe: { bg: "#e7f6ef", color: "#069855", border: "#c3ebd8", label: "Safe" },
  warning: {
    bg: "#ffeded",
    color: "#d62525",
    border: "#fbbfbf",
    label: "Warning",
  },
  excluded: {
    bg: "#ececec",
    color: "#111827",
    border: "#d4d4d4",
    label: "Exclu",
  },
};

export function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] ?? {
    bg: "#f1f5f9",
    color: "#64748b",
    border: "#e2e8f0",
    label: status ?? "—",
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2px 8px",
        height: 24,
        borderRadius: 4,
        background: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        fontFamily: "Inter, sans-serif",
        fontWeight: 400,
        fontSize: 12,
        letterSpacing: "-0.24px",
        whiteSpace: "nowrap",
      }}
    >
      {style.label}
    </span>
  );
}

// ─── YearBadge ───────────────────────────────────────────────────────────────

export function YearBadge({ value, className = "", style }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border border-[#dbe3ff] bg-[#eef3ff] px-2 py-0.5 text-[14px] font-medium text-[#143888] ${className}`.trim()}
      style={style}
    >
      {value || "—"}
    </span>
  );
}
