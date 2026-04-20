"use client";

import { SYNC_STATUS } from "@/lib/constants";

function IconCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M2.5 7.5L5.5 10.5L11.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconHourglass() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M3.5 2v2.5L6 7l-2.5 2.5V12h8V9.5L9 7l2.5-2.5V2h-8zM2.5 2h9M2.5 12h9"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconX() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M3.5 3.5l7 7M10.5 3.5l-7 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function SyncStatusBadge({ status }) {
  if (status === SYNC_STATUS.SYNCED) {
    return (
      <div className="flex items-center gap-1.5 text-[12px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md w-fit">
        <IconCheck /> Synced
      </div>
    );
  }

  if (status === SYNC_STATUS.PENDING) {
    return (
      <div className="flex items-center gap-1.5 text-[12px] font-medium text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-md w-fit">
        <IconHourglass /> Pending
      </div>
    );
  }

  if (status === SYNC_STATUS.FAILED) {
    return (
      <div className="flex items-center gap-1.5 text-[12px] font-medium text-red-700 bg-red-50 border border-red-200/60 px-2 py-0.5 rounded-md w-fit">
        <IconX /> Failed
      </div>
    );
  }

  // Fallback (e.g., initial state before any action, or unknown)
  return (
    <div className="flex items-center gap-1.5 text-[12px] font-medium text-gray-500 bg-gray-50 border border-gray-200/60 px-2 py-0.5 rounded-md w-fit">
      <span className="size-1.5 rounded-full bg-gray-400" /> Unchanged
    </div>
  );
}
