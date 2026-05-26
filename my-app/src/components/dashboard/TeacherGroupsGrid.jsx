"use client";

import React from "react";
import Link from "next/link";

export default function TeacherGroupsGrid({ groups }) {
  if (!groups || groups.length === 0) {
    return (
      <div className="bg-white border border-[#e3e8ef] rounded-[10px] p-8 text-center">
        <p className="text-[#4a5567] text-[14px] font-medium">No groups found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {groups.map((item, idx) => {
        const groupName = item.group_name ?? item.group ?? "N/A";
        const studentCount = item.student_count ?? item.studentCount ?? 0;
        const subjects = Array.isArray(item.subjects) ? item.subjects : [];
        const totalSessions = item.total_sessions ?? item.totalSessions ?? 0;
        const totalAbsences = item.total_absences ?? item.totalAbsences ?? 0;
        const detailsSlug = encodeURIComponent(`${item.year || "Unknown"}-${groupName}`);

        return (
          <div
            key={`${item.year}-${groupName}-${idx}`}
            className="bg-white border border-[#e3e8ef] rounded-[10px] p-5 flex flex-col font-inter hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[12px] font-semibold tracking-wide text-[#143888] bg-[#eef2ff] px-2.5 py-1 rounded-[6px] uppercase">
                {item.year || "Unknown Year"}
              </span>
            </div>

            <div className="mb-5">
              <h3 className="text-[18px] font-semibold text-[#030712] font-poppins mb-1">
                Group {groupName}
              </h3>
              {subjects.length > 0 && (
                <p className="text-[12px] font-medium text-[#4a5567] mb-3">
                  {subjects.join(", ")}
                </p>
              )}
              <p className="text-[13px] font-medium text-[#4a5567] flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#898989]">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                {studentCount} Students
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-[12px] text-[#4a5567]">
                <span>{totalSessions} sessions</span>
                <span>{totalAbsences} absences</span>
              </div>
            </div>

            <Link
              href={`/teacher/attendance/${detailsSlug}`}
              className="w-full mt-auto py-2 bg-white border border-[#143888] text-[#143888] hover:bg-[#f8faff] rounded-[8px] text-[13px] font-medium transition-colors shadow-sm text-center inline-block"
            >
              View Details
            </Link>
          </div>
        );
      })}
    </div>
  );
}
