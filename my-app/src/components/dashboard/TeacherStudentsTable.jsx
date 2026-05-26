"use client";

import DataTable from "@/components/shared/DataTable";
import useDashboardTable from "@/hooks/useDashboardTable";
import {
  Avatar,
  IconDots,
} from "@/components/shared/TableShared";
import { useEffect, useRef, useState } from "react";

const COLUMNS = [
  "Name",
  "Matricule",
  "Present",
  "Absent",
  "Rate",
  "Action",
];
const PAGE_SIZE = 10;

function StudentActions({ student, onViewHistory }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const hasHistory = Boolean(student.matricule);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex" ref={menuRef}>
      <button
        type="button"
        className="admin-data-table__action-btn"
        onClick={() => setIsOpen((current) => !current)}
        aria-label={`Actions for ${student.name}`}
      >
        <IconDots />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-[#e3e8ef] shadow-lg rounded-lg py-1 z-100 flex flex-col items-start overflow-hidden">
          <button
            type="button"
            className="w-full text-left px-3 py-2 text-[13px] font-medium text-gray-700 hover:bg-[#f8faff] hover:text-[#143888] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!hasHistory}
            onClick={() => {
              if (!hasHistory) return;
              setIsOpen(false);
              onViewHistory?.(student);
            }}
          >
            See history
          </button>
        </div>
      )}
    </div>
  );
}

function StudentRow({ student, onViewHistory }) {
  return (
    <div className="admin-data-table__row teacher-students-table__row">
      <div className="admin-data-table__cell admin-data-table__cell--name">
        <div className="admin-data-table__name-wrap">
          <Avatar name={student.name} fallback="Student" />
          <div className="admin-data-table__name-info">
            <p className="admin-data-table__name">{student.name}</p>
            <p className="admin-data-table__email">{student.email || "—"}</p>
          </div>
        </div>
      </div>

      <div className="admin-data-table__cell admin-data-table__text-cell">
        {student.matricule || student.studentId || "—"}
      </div>

      <div className="admin-data-table__cell admin-data-table__text-cell">
        {student.sessionsPresent} / {student.totalSessions}
      </div>

      <div className="admin-data-table__cell admin-data-table__text-cell">
        {student.sessionsAbsent}
      </div>

      <div className="admin-data-table__cell admin-data-table__text-cell">
        {student.attendanceRate}%
      </div>

      <div className="admin-data-table__cell admin-data-table__cell--action">
        <StudentActions student={student} onViewHistory={onViewHistory} />
      </div>
    </div>
  );
}

function normalizeStudent(raw) {
  const firstName = raw.prenom ?? raw.first_name ?? "";
  const lastName = raw.nom ?? raw.last_name ?? "";
  const level = raw.level || "";
  const program = raw.program || "";
  const year =
    raw.year ??
    (level && program && !level.endsWith(program)
      ? `${level}${program}`
      : level || program);

  return {
    id: raw.student_id ?? raw.id ?? raw.matricule,
    name: `${lastName} ${firstName}`.trim(),
    email: raw.email || "",
    studentId: raw.student_id,
    matricule: raw.matricule,
    year,
    group: raw.group ?? raw.group_name,
    program: raw.program,
    totalSessions: raw.total_sessions ?? 0,
    sessionsPresent: raw.sessions_present ?? 0,
    sessionsAbsent: raw.sessions_absent ?? raw.absence_count ?? 0,
    attendanceRate: raw.attendance_rate ?? 0,
  };
}

export default function TeacherStudentsTable({ students = [], onViewHistory }) {
  // Hook handles filtering directly via filterFn
  const {
    searchQuery,
    handleSearch,
    page,
    setPage,
    normalizedItems: normalizedStudents,
    pagedItems: pagedStudents,
    totalCount,
  } = useDashboardTable({
    items: students,
    normalizeItem: normalizeStudent,
    searchFields: ["name", "email", "studentId", "matricule", "group", "year"],
    pageSize: PAGE_SIZE,
  });

  return (
    <DataTable
      title="All Enrolled Students"
      count={normalizedStudents.length}
      searchQuery={searchQuery}
      onSearch={handleSearch}
      placeholder="Search name, id, year, group..."
      columns={COLUMNS}
      tableClass="teacher-students-table"
      headerClass="admin-data-table__header-row teacher-students-table__header-row"
      footerClass="admin-students-table__footer"
      emptyMessage="No students found."
      rowLabel="students"
      page={page}
      pageSize={PAGE_SIZE}
      totalCount={totalCount}
      onPageChange={setPage}
      showDefaultTools={false}
    >
      {pagedStudents.map((student) => (
        <StudentRow
          key={student.id}
          student={student}
          onViewHistory={onViewHistory}
        />
      ))}
    </DataTable>
  );
}
