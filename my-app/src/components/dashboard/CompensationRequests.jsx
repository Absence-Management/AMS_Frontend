import React from "react";

// --- Modern Icons ---

function IconMapPin() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export default function CompensationRequests({ requests }) {
  return (
    <div className="bg-white border border-[#e3e8ef] rounded-[12px] flex flex-col h-full font-inter overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#f1f5f9] bg-white">
        <h2 className="text-[0.9375rem] font-bold text-[#030712] font-poppins">Compensation requests</h2>
        <span className="text-[0.6875rem] font-bold text-[#143888] bg-[#f0f4ff] px-2 py-0.5 rounded-full ring-1 ring-[#143888]/10">
          {requests.length}
        </span>
      </div>

      <div className="flex flex-col p-3 flex-grow overflow-y-auto">
        {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-[0.875rem] text-[#64748b]">No pending requests</p>
          </div>
        ) : (
          requests.map((req, i) => (
            <div key={i} className="flex flex-col gap-3 p-4 bg-white border border-[#f1f5f9] rounded-[10px] mb-3 last:mb-0 hover:border-[#e2e8f0] transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col">
                  <h4 className="text-[0.875rem] font-bold text-[#030712] truncate max-w-[180px]">
                    {req.studentName}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[0.75rem] font-semibold text-[#64748b]">{req.studentGroup}</span>
                    <IconArrowRight className="text-[#94a3b8]" />
                    <span className="text-[0.75rem] font-bold text-[#143888]">{req.targetGroup}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end shrink-0">
                  <div className="flex items-center gap-1 text-[#64748b]">
                    <IconClock />
                    <span className="text-[0.75rem] font-medium">{req.time}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-[#64748b]">
                <IconMapPin className="shrink-0" />
                <span className="text-[0.75rem] truncate">{req.room} · {req.date}</span>
              </div>

              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() => console.log("Reject", req.id)}
                  className="flex-1 px-3 py-1.5 rounded-[8px] text-[0.75rem] font-bold text-[#64748b] bg-[#f8fafc] border border-[#e2e8f0] hover:bg-[#f1f5f9] hover:text-[#0f172a] transition-all"
                >
                  Reject
                </button>
                <button
                  onClick={() => console.log("Approve", req.id)}
                  className="flex-1 px-3 py-1.5 rounded-[8px] text-[0.75rem] font-bold text-white bg-[#143888] border border-[#143888] hover:bg-[#0f2d6e] shadow-sm hover:shadow transition-all"
                >
                  Approve
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

