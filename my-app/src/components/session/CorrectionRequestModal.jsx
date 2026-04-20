"use client";

import React, { useState } from "react";
import { isWithinFreeWindow } from "@/lib/correctionUtils";

export default function CorrectionRequestModal({ isOpen, onClose, student, session }) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !student || !session) return null;

  // Assuming session.endTime exists or we derive it
  // For mock purpose, we'll assume it's valid if within 15 mins of "now" for some sessions
  const freeWindow = isWithinFreeWindow(session.endTime || new Date());

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // In a real app: await submitCorrection(student.id, reason, freeWindow);
    console.log("Submitting correction", { studentId: student.id, reason, freeWindow });
    
    // Simulate API delay
    setTimeout(() => {
      setSubmitting(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-[#e3e8ef] animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-[#f1f5f9] flex items-center justify-between">
          <h3 className="text-[1.125rem] font-bold text-[#030712]">Request Correction</h3>
          <button onClick={onClose} className="text-[#64748b] hover:text-[#030712] transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-4">
            <p className="text-[0.8125rem] text-[#64748b] font-medium uppercase tracking-wider mb-1">Student</p>
            <p className="text-[1rem] font-bold text-[#030712]">{student.name}</p>
            <p className="text-[0.875rem] text-[#64748b] font-medium">{student.studentId} · {student.email}</p>
          </div>

          <div className="flex items-center gap-2">
            {freeWindow ? (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ecfdf5] text-[#065f46] text-[0.75rem] font-bold ring-1 ring-[#059669]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse"></span>
                Free Window — Auto Approval
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#fffbeb] text-[#92400e] text-[0.75rem] font-bold ring-1 ring-[#d97706]/20">
                Requires Admin Approval
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[0.875rem] font-bold text-[#030712]">Reason for change</label>
            <textarea
              required={!freeWindow}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={freeWindow ? "Optional comment..." : "Explain why you are correcting this absence..."}
              className="min-h-[100px] p-3 rounded-lg border border-[#e2e8f0] focus:ring-2 focus:ring-[#143888] focus:border-[#143888] outline-none text-[0.875rem] transition-all"
            />
          </div>

          <div className="flex items-center gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-[#e2e8f0] text-[0.875rem] font-bold text-[#64748b] hover:bg-[#f8fafc] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2.5 rounded-lg bg-[#143888] text-white text-[0.875rem] font-bold hover:bg-[#0f2d6e] shadow-sm hover:shadow-md disabled:opacity-50 transition-all"
            >
              {submitting ? "Sending..." : "Submit request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
