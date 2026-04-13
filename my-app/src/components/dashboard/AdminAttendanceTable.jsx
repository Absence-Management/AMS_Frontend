"use client";

import DataTable from "@/components/shared/DataTable";
import useDashboardTable from "@/hooks/useDashboardTable";
import { IconDots, StatusBadge } from "@/components/shared/TableShared";

const COLUMNS = [
  "Name",
  "Student ID",
  "Year",
  "Group",
  "Absences",
  "Status",
  "Action",
];

const PAGE_SIZE = 7;

function AttendanceRow({ attendance }) {
  return (
    <div className="admin-data-table__row admin-students-table__row">
      <div className="admin-data-table__cell admin-data-table__cell--name">
        <div className="admin-data-table__name-wrap">
          <div className="admin-data-table__name-info">
            <p className="admin-data-table__name">{attendance.name}</p>
            <p className="admin-data-table__email">{attendance.email || "—"}</p>
          </div>
        </div>
      </div>

      <div className="admin-data-table__cell admin-data-table__text-cell">
        {attendance.studentId || "—"}
      </div>

      <div className="admin-data-table__cell admin-data-table__text-cell">
        {attendance.year || "—"}
      </div>

      <div className="admin-data-table__cell admin-data-table__text-cell">
        {attendance.group || "—"}
      </div>

      <div className="admin-data-table__cell admin-data-table__text-cell">
        {attendance.absences}
      </div>

      <div className="admin-data-table__cell">
        <StatusBadge status={attendance.status} />
      </div>

      <div className="admin-data-table__cell admin-data-table__cell--action">
        <button
          type="button"
          className="admin-data-table__action-btn"
          aria-label={`Actions for ${attendance.name}`}
        >
          <IconDots />
        </button>
      </div>
    </div>
  );
}

function normalizeStatus(rawStatus, absencesValue) {
  const normalized = String(rawStatus || "").toLowerCase();

  if (["safe", "warning", "excluded"].includes(normalized)) {
    return normalized;
  }

  const absences = Number(absencesValue ?? 0);
  if (!Number.isNaN(absences)) {
    if (absences >= 10) return "excluded";
    if (absences >= 5) return "warning";
  }

  return "safe";
}

function normalizeAttendance(raw, index) {
  const firstName = raw?.first_name || raw?.firstName || "";
  const lastName = raw?.last_name || raw?.lastName || "";
  const name =
    raw?.name || `${firstName} ${lastName}`.trim() || `Student ${index + 1}`;

  const absences = raw?.absences ?? raw?.absence ?? raw?.absence_count ?? 0;

  return {
    id: raw?.id || raw?.student_id || raw?.studentId || index,
    name,
    email: raw?.email || raw?.student_email || "",
    studentId: raw?.student_id || raw?.studentId || "",
    year: raw?.year || raw?.level || "",
    group: raw?.group || raw?.group_name || "",
    absences,
    status: normalizeStatus(raw?.status, absences),
  };
}

export default function AttendanceTable({ attendances = [] }) {
  const {
    searchQuery,
    handleSearch,
    page,
    setPage,
    normalizedItems: normalizedAttendances,
    pagedItems: pagedAttendances,
    totalCount,
  } = useDashboardTable({
    items: attendances,
    normalizeItem: normalizeAttendance,
    searchFields: ["name", "email", "studentId", "year", "group", "status"],
    pageSize: PAGE_SIZE,
  });

  return (
    <DataTable
      title="Total Attendances"
      count={normalizedAttendances.length}
      searchQuery={searchQuery}
      onSearch={handleSearch}
      placeholder="Search name, id, year, group..."
      columns={COLUMNS}
      tableClass="admin-students-table"
      headerClass="admin-data-table__header-row admin-students-table__header-row"
      footerClass="admin-students-table__footer"
      emptyMessage="No attendance records found."
      rowLabel="records"
      page={page}
      pageSize={PAGE_SIZE}
      totalCount={totalCount}
      onPageChange={setPage}
    >
      {pagedAttendances.map((attendance) => (
        <AttendanceRow key={attendance.id} attendance={attendance} />
      ))}
    </DataTable>
  );
}
