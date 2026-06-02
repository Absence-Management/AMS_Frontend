"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import TeacherStudentsTable from "@/components/dashboard/TeacherStudentsTable";
import StudentHistoryModal from "@/components/dashboard/StudentHistoryModal";
import ExportAbsencesButton from "@/components/dashboard/ExportAbsencesButton";
import { getGroupStudents, getStudentHistory } from "@/services/teacherService";

function safeDecode(value) {
  try {
    return decodeURIComponent(value || "");
  } catch {
    return value || "";
  }
}

export default function GroupDetailsPage({ params }) {
  const resolvedParams = use(params);
  const rawGroupId = Array.isArray(resolvedParams?.groupId) ? resolvedParams.groupId[0] : resolvedParams?.groupId;
  
  const decodedGroupId = safeDecode(rawGroupId);
  const [yearSegment, ...groupSegments] = decodedGroupId.split("-");
  const year = yearSegment;
  const groupLabel = groupSegments.join("-");
  const [groupData, setGroupData] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [studentHistory, setStudentHistory] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadStudents() {
      if (!year || !groupLabel) {
        setLoading(false);
        setError("Invalid group selected.");
        return;
      }

      try {
        setLoading(true);
        setError("");
        const data = await getGroupStudents(groupLabel, year);
        if (!isMounted) return;

        setGroupData(data);
        setStudents(
          Array.isArray(data?.students)
            ? data.students.map((student) => ({
                ...student,
                year: data.year,
                group: data.group_name,
              }))
            : [],
        );
      } catch (err) {
        console.error("Failed to load group students:", err);
        if (isMounted) {
          setError("Failed to load students for this group.");
          setGroupData(null);
          setStudents([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadStudents();

    return () => {
      isMounted = false;
    };
  }, [year, groupLabel]);

  const totalStudents = groupData?.total_students ?? students.length;

  async function handleViewHistory(student) {
    if (!student?.matricule) return;

    setHistoryModalOpen(true);
    setStudentHistory(null);
    setHistoryError("");
    setHistoryLoading(true);

    try {
      const data = await getStudentHistory(groupLabel, student.matricule, year);
      setStudentHistory(data);
    } catch (err) {
      console.error("Failed to load student history:", err);
      setHistoryError("Failed to load attendance history for this student.");
    } finally {
      setHistoryLoading(false);
    }
  }

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
            Viewing {totalStudents} enrolled students
            {groupData?.total_sessions != null ? ` across ${groupData.total_sessions} sessions.` : "."}
          </p>
        </div>

        <ExportAbsencesButton />
      </div>

      <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
        {loading && null}
        {!loading && error && <div className="text-red-600 p-4 text-center">{error}</div>}
        {!loading && !error && (
          <TeacherStudentsTable
            students={students}
            onViewHistory={handleViewHistory}
          />
        )}
      </div>

      <StudentHistoryModal
        isOpen={historyModalOpen}
        history={studentHistory}
        loading={historyLoading}
        error={historyError}
        onClose={() => setHistoryModalOpen(false)}
      />
    </div>
  );
}
