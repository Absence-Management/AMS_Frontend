// ============================================
// AMS — ESI Sidi Bel Abbès
// components/dashboard/ThresholdAlerts.jsx
// ============================================

import React from "react";

// ── Avatar ────────────────────────────────────────────────────────────────────
function Avatar({ initials, color }) {
  return (
    <div
      style={{ background: color }}
      className="size-8 rounded-full flex items-center justify-center text-white text-[0.75rem] font-medium shrink-0"
    >
      {initials}
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-2 text-center px-6 py-8">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#d1d5db" strokeWidth="1.5" />
        <path d="M12 8v4" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="15.5" r="0.75" fill="#d1d5db" />
      </svg>
      <p className="text-[0.8125rem] text-[#9ca3af]">No alerts at this time</p>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
/**
 * Props (API shape):
 *   total   number   – total alert count shown in header badge
 *   alerts  array    – [{ student_id, full_name, initials, module, absences, threshold, avatar_color }]
 *   loading bool     – dims while fetching
 */
export default function ThresholdAlerts({ total = 0, alerts = [], loading = false }) {
  return (
    <div
      className="bg-white border border-[#e3e8ef] rounded-[0.625rem] flex flex-col h-full font-inter overflow-hidden"
      style={{ opacity: loading ? 0.5 : 1, transition: "opacity 0.2s" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#e3e8ef] bg-white">
        <h2 className="text-[0.9375rem] font-medium text-[#030712] font-poppins">
          Threshold alerts
        </h2>
        <span className="text-[0.75rem] font-medium text-[#d62525] bg-[#fef2f2] px-2 py-1 rounded-[0.5rem]">
          {total}
        </span>
      </div>

      {/* List */}
      <div className="flex flex-col p-2 flex-grow overflow-y-auto">
        {alerts.length === 0 && !loading ? (
          <EmptyState />
        ) : (
          alerts.map((alert) => {
            const statusColor =
              alert.avatar_color === "#E53935" ? "text-[#d62525]" : "text-[#d97706]";

            return (
              <div
                key={`${alert.student_id}-${alert.module}`}
                className="flex items-center justify-between p-3 border-b border-[#e3e8ef] last:border-b-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar initials={alert.initials} color={alert.avatar_color} />
                  <div className="min-w-0">
                    <h4 className="text-[0.875rem] font-medium text-[#030712] mb-0.5 truncate">
                      {alert.full_name}
                    </h4>
                    <p className="text-[0.75rem] text-[#4a5567] truncate">{alert.module}</p>
                  </div>
                </div>
                <div className={`text-[0.875rem] font-bold shrink-0 ml-3 ${statusColor}`}>
                  {alert.absences}/{alert.threshold}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
