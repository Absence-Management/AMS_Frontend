import React from "react";

// --- Better Icons (Modern Lucide-like style) ---

function IconChart() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconMapPin() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconCheckCircle() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#069855]">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function IconXCircle() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#d62525]">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}

export default function SessionDetailsStats({
  session,
  presentCount,
  absentCount,
  absenceRate,
  liveSummary = null, // New prop for polled data
}) {
  const secondGroupNumber = !isNaN(Number(session.groupNumber))
    ? Number(session.groupNumber) + 1
    : session.groupNumber;

  // Use live data if available, otherwise fallback to local calculation
  const displayPresent = liveSummary ? liveSummary.present : presentCount;
  const displayAbsent = liveSummary ? liveSummary.absent : absentCount;
  const displayPending = liveSummary ? liveSummary.pending : 0;
  const displayRate = liveSummary 
    ? ((liveSummary.absent / (liveSummary.total || 1)) * 100).toFixed(1) 
    : absenceRate;

  return (
    <div className="flex gap-6 h-full items-stretch">
      {/* 1. Absence Rate Card */}
      <div className="bg-white border border-[#e3e8ef] rounded-[12px] p-5 flex-[1.4] flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-200 relative overflow-hidden">
        {/* Live Indicator */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#f0fdf4] border border-[#dcfce7]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22c55e]"></span>
          </span>
          <span className="text-[0.625rem] font-bold text-[#166534] uppercase tracking-wider">Live</span>
        </div>

        <div className="flex items-center justify-between mb-4 mt-1">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#f0f4ff] rounded-[8px] text-[#143888]">
              <IconChart />
            </div>
            <span className="text-[0.9375rem] font-semibold text-[#030712]">Attendance Rate</span>
          </div>
          <span className="text-[1.25rem] font-bold text-[#143888] pr-12">{displayRate}%</span>
        </div>

        <div className="flex items-center justify-between mt-2 pt-4 border-t border-[#f1f5f9]">
          <div className="flex items-center gap-2.5">
            <IconCheckCircle />
            <div className="flex flex-col">
              <span className="text-[1rem] font-bold text-[#069855] leading-none">{displayPresent}</span>
              <span className="text-[0.6875rem] text-[#64748b] font-medium uppercase tracking-wider">Present</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <IconXCircle />
            <div className="flex flex-col">
              <span className="text-[1rem] font-bold text-[#d62525] leading-none">{displayAbsent}</span>
              <span className="text-[0.6875rem] text-[#64748b] font-medium uppercase tracking-wider">Absent</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 border-l border-[#f1f5f9] pl-4">
            <div className="flex flex-col">
              <span className="text-[1rem] font-bold text-[#64748b] leading-none">{displayPending}</span>
              <span className="text-[0.6875rem] text-[#64748b] font-medium uppercase tracking-wider text-center">Pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Session Info Card */}
      <div className="bg-white border border-[#e3e8ef] rounded-[12px] p-5 flex-[1.6] flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="bg-[#143888] text-white text-[0.6875rem] font-bold px-2 py-0.5 rounded-[4px] uppercase ring-1 ring-white/20">
              {session.type}
            </span>
            <h3 className="text-[1.0625rem] font-bold text-[#030712]">{session.title}</h3>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-y-5 gap-x-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-[8px] text-[#64748b] shadow-sm">
              <IconUsers />
            </div>
            <div className="flex flex-col">
              <span className="text-[0.75rem] text-[#64748b] font-bold uppercase tracking-tight">Group N°</span>
              <span className="text-[0.875rem] font-bold text-[#030712]">
                {session.groupNumber} & {secondGroupNumber}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-[8px] text-[#64748b] shadow-sm">
              <IconClock />
            </div>
            <div className="flex flex-col">
              <span className="text-[0.75rem] text-[#64748b] font-bold uppercase tracking-tight">Timing</span>
              <span className="text-[0.875rem] font-bold text-[#030712]">{session.time}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 col-span-2">
            <div className="p-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-[8px] text-[#64748b] shadow-sm">
              <IconMapPin />
            </div>
            <div className="flex flex-col">
              <span className="text-[0.75rem] text-[#64748b] font-bold uppercase tracking-tight">Location</span>
              <span className="text-[0.875rem] font-bold text-[#030712]">{session.room}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

