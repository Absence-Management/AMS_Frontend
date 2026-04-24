"use client";

// ============================================
// AMS — ESI Sidi Bel Abbès
// AdminTeachersTable.jsx
// ============================================

import DataTable from "@/components/shared/DataTable";
import { Avatar, IconDots } from "@/components/shared/TableShared";
import useDashboardTable from "@/hooks/useDashboardTable";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const COLUMNS = ["Name", "Role", "Subjects", "Groups", "Action"];
const PAGE_SIZE = 8;

function TeacherActions({ teacher, onEdit }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();

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
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Actions for ${teacher.name}`}
      >
        <IconDots />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-[#e3e8ef] shadow-lg rounded-lg py-1 z-[100] flex flex-col items-start overflow-hidden">
          <button
            className="w-full text-left px-3 py-2 text-[13px] font-medium text-gray-700 hover:bg-[#f8faff] hover:text-[#143888] transition-colors flex items-center gap-2"
            onClick={() => {
              setIsOpen(false);
              router.push(`/admin/teachers/${teacher.id}`);
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            See Profile
          </button>
          <button
            className="w-full text-left px-3 py-2 text-[13px] font-medium text-gray-700 hover:bg-[#f8faff] hover:text-[#143888] transition-colors flex items-center gap-2"
            onClick={() => {
              setIsOpen(false);
              onEdit?.(teacher);
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Edit Teacher
          </button>
        </div>
      )}
    </div>
  );
}

function TeacherRow({ teacher, onEditTeacher }) {
  return (
    <div className="admin-data-table__row admin-teachers-table__row">
      <div className="admin-data-table__cell admin-data-table__cell--name">
        <div className="admin-data-table__name-wrap">
          <Avatar name={teacher.name} fallback="Teacher" />
          <div className="admin-data-table__name-info">
            <Link
              href={`/admin/teachers/${teacher.id}`}
              className="admin-data-table__name hover:text-[#143888] hover:underline"
            >
              {teacher.name}
            </Link>
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
        <TeacherActions teacher={teacher} onEdit={onEditTeacher} />
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
      footerClass="admin-data-table__footer"
      emptyMessage="No teachers found."
      rowLabel="teachers"
      page={page}
      pageSize={PAGE_SIZE}
      totalCount={totalCount}
      onPageChange={setPage}
      showDefaultTools={false}
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
