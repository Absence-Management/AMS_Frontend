"use client";

// ============================================
// AMS — ESI Sidi Bel Abbès
// AdminTeachersTable.jsx
// ============================================

import DataTable from "@/components/shared/DataTable";
import { Avatar, IconDots } from "@/components/shared/TableShared";
import useDashboardTable from "@/hooks/useDashboardTable";

const COLUMNS = ["Name", "Role", "Subjects", "Groups", "Action"];
const PAGE_SIZE = 8;

function TeacherRow({ teacher, onEditTeacher }) {
  const canEdit = Boolean(teacher?.id);

  return (
    <div className="admin-data-table__row admin-teachers-table__row">
      <div className="admin-data-table__cell admin-data-table__cell--name">
        <div className="admin-data-table__name-wrap">
          <Avatar name={teacher.name} fallback="Teacher" />
          <div className="admin-data-table__name-info">
            <p className="admin-data-table__name">{teacher.name}</p>
            <p className="admin-data-table__email">{teacher.email || "—"}</p>
          </div>
        </div>
      </div>

      <div className="admin-data-table__cell admin-data-table__text-cell">
        {teacher.role || "teacher"}
      </div>

      <div className="admin-data-table__cell admin-data-table__text-cell">
        {teacher.subject || "—"}
      </div>

      <div className="admin-data-table__cell admin-data-table__text-cell">
        {teacher.groups || "—"}
      </div>

      <div className="admin-data-table__cell admin-data-table__cell--action">
        <button
          type="button"
          className="admin-data-table__action-btn"
          onClick={() => onEditTeacher?.(teacher)}
          aria-label={`Actions for ${teacher.name}`}
          title={canEdit ? "Edit teacher" : "Unavailable: missing teacher id"}
          disabled={!canEdit}
        >
          <IconDots />
        </button>
      </div>
    </div>
  );
}

function normalizeTeacher(raw, index) {
  return {
    id: raw?.id || raw?.email || index,
    first_name: raw?.first_name || "",
    last_name: raw?.last_name || "",
    name:
      `${raw?.first_name || ""} ${raw?.last_name || ""}`.trim() ||
      raw?.email ||
      `Teacher ${index + 1}`,
    email: raw?.email || "",
    phone: raw?.phone || "",
    role: raw?.role || "teacher",
    group: raw?.group || "",
    is_active: raw?.is_active ?? true,
    student_id: raw?.student_id || "",
    program: raw?.program || "",
    level: raw?.level || "",
  };
}

export default function AdminTeachersTable({ teachers = [], onEditTeacher }) {
  const {
    searchQuery,
    handleSearch,
    page,
    setPage,
    normalizedItems: normalizedTeachers,
    pagedItems: pagedTeachers,
    totalCount,
  } = useDashboardTable({
    items: teachers,
    normalizeItem: normalizeTeacher,
    searchFields: ["name", "email", "role", "subject", "groups"],
    pageSize: PAGE_SIZE,
  });

  return (
    <DataTable
      title="Total Teachers"
      count={normalizedTeachers.length}
      searchQuery={searchQuery}
      onSearch={handleSearch}
      placeholder="Search name, role, subject, groups..."
      columns={COLUMNS}
      tableClass="admin-teachers-table"
      headerClass="admin-data-table__header-row admin-teachers-table__header-row"
      footerClass="admin-teachers-table__footer"
      emptyMessage="No teachers found."
      rowLabel="teachers"
      page={page}
      pageSize={PAGE_SIZE}
      totalCount={totalCount}
      onPageChange={setPage}
    >
      {pagedTeachers.map((teacher) => (
        <TeacherRow
          key={teacher.id}
          teacher={teacher}
          onEditTeacher={onEditTeacher}
        />
      ))}
    </DataTable>
  );
}
