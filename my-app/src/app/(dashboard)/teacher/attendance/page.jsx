"use client";

import { useState, useEffect, useMemo } from "react";
import ExportAbsencesButton from "@/components/dashboard/ExportAbsencesButton";
import TeacherStudentsTable from "@/components/dashboard/TeacherStudentsTable";
import TeacherGroupsGrid from "@/components/dashboard/TeacherGroupsGrid";

// ── MOCK DATA ─────────────────────────────────────────────
export const MOCK_STUDENTS = [
  { id: 1, first_name: "Bouhafs", last_name: "Rim", email: "rim@esi-sba.dz", student_id: "20230001", level: "CP", program: "1", group: "1", absence_count: 4, is_active: true },
  { id: 2, first_name: "Trari", last_name: "Foued", email: "foued@esi-sba.dz", student_id: "20230015", level: "CP", program: "2", group: "2", absence_count: 1, is_active: true },
  { id: 3, first_name: "Hassani", last_name: "Youssef", email: "you@esi-sba.dz", student_id: "20220045", level: "CS", program: "1", group: "1", absence_count: 3, is_active: true },
  { id: 4, first_name: "Khelifi", last_name: "Sara", email: "sara@esi-sba.dz", student_id: "20220089", level: "CS", program: "2", group: "3", absence_count: 0, is_active: false },
  { id: 5, first_name: "Cherif", last_name: "Malik", email: "malik@esi-sba.dz", student_id: "20230101", level: "CP", program: "1", group: "1", absence_count: 2, is_active: true },
];

export default function TeacherAttendancePage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate network delay then load mock data
    const timer = setTimeout(() => {
      setStudents(MOCK_STUDENTS);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Compute unique groups from the students data
  const derivedGroups = useMemo(() => {
    if (!students || students.length === 0) return [];
    
    const groupMap = {};
    students.forEach((s) => {
      const year = s.year || (s.level ? `${s.level}${s.program}` : "Unknown");
      const groupStr = String(s.group || "N/A");
      const key = `${year}-${groupStr}`;
      
      if (!groupMap[key]) {
        groupMap[key] = { year, group: groupStr, studentCount: 0 };
      }
      groupMap[key].studentCount++;
    });
    
    return Object.values(groupMap).sort((a, b) => {
      if (a.year !== b.year) return a.year.localeCompare(b.year);
      return a.group.localeCompare(b.group);
    });
  }, [students]);

  return (
    <div className="main-page">
      <div className="main-header">
        <div className="main-header-text">
          <h2 className="main-title">My Groups</h2>
          <p className="main-subtitle">
            Select a group to view its enrolled students and attendance.
          </p>
        </div>

        <ExportAbsencesButton />
      </div>

      <div className="mt-6">
        {loading && <div className="text-[#4a5567] p-4 text-center">Loading your groups...</div>}
        
        {!loading && (
          <TeacherGroupsGrid groups={derivedGroups} />
        )}
      </div>
    </div>
  );
}
