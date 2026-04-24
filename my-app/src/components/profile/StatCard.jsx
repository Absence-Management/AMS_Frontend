"use client";

const DEFAULT_ICONS = {
  abs: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="6" stroke="#999999" strokeDasharray="3 3" />
    </svg>
  ),
  jus: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 7l3 3 5-5" stroke="#999999" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

export default function StatCard({ label, value, icon }) {
  const iconElement = typeof icon === "string" ? DEFAULT_ICONS[icon] : icon;

  return (
    <div className="flex-1 box-border flex flex-col gap-[6px] p-3 bg-white border border-black/10 rounded-[10px] min-w-0">
      <div className="flex items-center gap-1.5 overflow-hidden">
        {iconElement}
        <span className="text-[14px] text-[#999999] truncate">{label}</span>
      </div>
      <span className="text-[16px] font-medium text-black">
        {value}
      </span>
    </div>
  );
}
