"use client";

// ============================================
// AMS — ESI Sidi Bel Abbès
// AdminStudentsTable.jsx
// ============================================

import DataTable from "@/components/shared/DataTable";
import useDashboardTable from "@/hooks/useDashboardTable";
import {
  Avatar,
  StatusBadge,
  YearBadge,
  IconDots,
} from "@/components/shared/TableShared";

const COLUMNS = [
  "Name",
  "Student ID",
  "Year",
  "Group",
  "Absence",
  "Status",
  "Action",
];
const PAGE_SIZE = 10;

function StudentRow({ student, onEditStudent }) {
  const canEdit = Boolean(student?.id);

  return (
    <div className="admin-data-table__row admin-students-table__row">
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
        {student.studentId || "—"}
      </div>

      <div className="admin-data-table__cell">
        <YearBadge value={student.year} />
      </div>

      <div className="admin-data-table__cell admin-data-table__text-cell">
        {student.group || "—"}
      </div>

      <div className="admin-data-table__cell admin-data-table__text-cell">
        {student.absence}
      </div>

      <div className="admin-data-table__cell">
        <StatusBadge status={student.status} />
      </div>

      <div className="admin-data-table__cell admin-data-table__cell--action">
        <button
          type="button"
          className="admin-data-table__action-btn"
          onClick={() => onEditStudent?.(student)}
          aria-label={`Actions for ${student.name}`}
          title={canEdit ? "Edit student" : "Unavailable: missing student id"}
          disabled={!canEdit}
        >
          <IconDots />
        </button>
      </div>
    </div>
  );
}

function normalizeStudent(raw) {
  return {
    id: raw.id,
    name: `${raw.first_name || ""} ${raw.last_name || ""}`.trim(),
    email: raw.email || "",
    studentId: raw.student_id,
    year: `${raw.level}${raw.program}`,
    group: raw.group,
    program: raw.program,
    absence: raw.absence_count ?? 0,
    status: raw.is_active ? "active" : "disabled",
  };
}

export default function AdminStudentsTable({ students = [], onEditStudent }) {
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
    searchFields: ["name", "email", "studentId", "group", "year"],
    pageSize: PAGE_SIZE,
  });

  return (
    <DataTable
      title="Total Students"
      count={normalizedStudents.length}
      searchQuery={searchQuery}
      onSearch={handleSearch}
      placeholder="Search name, id, year, group..."
      columns={COLUMNS}
      tableClass="admin-students-table"
      headerClass="admin-data-table__header-row admin-students-table__header-row"
      footerClass="admin-students-table__footer"
      emptyMessage="No students found."
      rowLabel="students"
      page={page}
      pageSize={PAGE_SIZE}
      totalCount={totalCount}
      onPageChange={setPage}
    >
      {pagedStudents.map((student) => (
        <StudentRow
          key={student.id}
          student={student}
          onEditStudent={onEditStudent}
        />
      ))}
    </DataTable>
  );
}
