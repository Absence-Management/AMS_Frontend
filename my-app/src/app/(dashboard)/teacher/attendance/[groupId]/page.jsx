"use client";

import { useMemo, use } from "react";
import Link from "next/link";
import TeacherStudentsTable from "@/components/dashboard/TeacherStudentsTable";
import ExportAbsencesButton from "@/components/dashboard/ExportAbsencesButton";
import { MOCK_STUDENTS } from "../page"; // Reusing the static data centrally stored in the index page

export default function GroupDetailsPage({ params }) {
  const resolvedParams = use(params);
  const rawGroupId = Array.isArray(resolvedParams?.groupId) ? resolvedParams.groupId[0] : resolvedParams?.groupId;
  
  // Safely parse the slug e.g. "CP1-1" -> year: "CP1", group: "1"
  const [yearSegment, ...groupSegments] = (rawGroupId || "").split("-");
  const year = yearSegment;
  const groupLabel = groupSegments.join("-");

  // Derive the filtered students cohort
  const filteredStudents = useMemo(() => {
    if (!year || !groupLabel) return [];
    
    return MOCK_STUDENTS.filter((s) => {
      const sYear = s.year || (s.level ? `${s.level}${s.program}` : "Unknown");
      const sGroup = String(s.group || "N/A");
      return sYear === year && sGroup === groupLabel;
    });
  }, [year, groupLabel]);

  return (
    <div className="main-page">
      <div className="main-header">
        <div className="main-header-text">
          <div className="flex items-center gap-3 mb-2">
            <Link 
              href="/teacher/attendance"
              className="flex items-center gap-1.5 text-[13px] font-medium text-[#4a5567] bg-white border border-[#e3e8ef] hover:bg-[#f8faff] hover:text-[#030712] px-2.5 py-1 rounded-[6px] transition-colors shadow-sm"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back
            </Link>
            <h2 className="main-title mb-0">{year} Group {groupLabel}</h2>
          </div>
          
          <p className="main-subtitle mt-0.5">
            Viewing {filteredStudents.length} enrolled students.
          </p>
        </div>

        <ExportAbsencesButton />
      </div>

      <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <TeacherStudentsTable students={filteredStudents} />
      </div>
    </div>
  );
}
