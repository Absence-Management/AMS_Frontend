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
  FilterIcon,
  SortIcon,
} from "@/components/shared/TableShared";
import Link from "next/link";
import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

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

function StudentActions({ student, onEdit }) {
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
        aria-label={`Actions for ${student.name}`}
      >
        <IconDots />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-[#e3e8ef] shadow-lg rounded-lg py-1 z-[100] flex flex-col items-start overflow-hidden">
          <button
            className="w-full text-left px-3 py-2 text-[13px] font-medium text-gray-700 hover:bg-[#f8faff] hover:text-[#143888] transition-colors flex items-center gap-2"
            onClick={() => {
              setIsOpen(false);
              router.push(`/admin/students/${student.id}`);
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
              onEdit?.(student);
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
}

function StudentRow({ student, onEditStudent }) {
  return (
    <div className="admin-data-table__row admin-students-table__row">
      <div className="admin-data-table__cell admin-data-table__cell--name">
        <div className="admin-data-table__name-wrap">
          <Avatar name={student.name} fallback="Student" />
          <div className="admin-data-table__name-info">
            <Link
              href={`/admin/students/${student.id}`}
              className="admin-data-table__name hover:text-[#143888] hover:underline"
            >
              {student.name}
            </Link>
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
        <StudentActions student={student} onEdit={onEditStudent} />
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
  const [filterYear, setFilterYear] = useState("");
  const [filterGroup, setFilterGroup] = useState("");
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterOptions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filterFn = useMemo(() => {
    return (student) => {
      if (filterYear && student.year !== filterYear) return false;
      if (filterGroup && String(student.group) !== String(filterGroup)) return false;
      return true;
    };
  }, [filterYear, filterGroup]);

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
    filterFn,
  });

  const availableYears = useMemo(() => {
    return [...new Set(students.map(s => normalizeStudent(s).year))].filter(y => y && y !== "undefined").sort();
  }, [students]);

  const availableGroups = useMemo(() => {
    const matchingStudents = filterYear 
      ? students.filter(s => normalizeStudent(s).year === filterYear)
      : students;

    return [...new Set(matchingStudents.map(s => String(normalizeStudent(s).group)))]
      .filter(g => g !== "undefined" && g !== "null" && g !== "")
      .sort((a, b) => {
        const numA = parseInt(a, 10);
        const numB = parseInt(b, 10);
        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB;
        }
        return a.localeCompare(b);
      });
  }, [students, filterYear]);

  const extraTools = (
    <>
      <div className="relative flex items-center" ref={filterRef}>
        <button
          type="button"
          className="admin-data-table__control-btn relative"
          onClick={() => setShowFilterOptions(!showFilterOptions)}
        >
          <FilterIcon />
          Filter
          {(filterYear || filterGroup) && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-white"></span>
          )}
        </button>
        
        {showFilterOptions && (
          <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-[#e3e8ef] shadow-lg rounded-xl p-4 z-10 flex flex-col gap-4 text-left font-sans">
            <div>
              <label className="block text-[12px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Academic Year</label>
              <select
                className="w-full border border-gray-200 rounded-lg text-[14px] p-2 bg-gray-50 text-gray-800 outline-none focus:border-blue-500 focus:bg-white transition-colors cursor-pointer"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
              >
                <option value="">All Years</option>
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-[12px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Student Group</label>
              <select
                className="w-full border border-gray-200 rounded-lg text-[14px] p-2 bg-gray-50 text-gray-800 outline-none focus:border-blue-500 focus:bg-white transition-colors cursor-pointer"
                value={filterGroup}
                onChange={(e) => setFilterGroup(e.target.value)}
              >
                <option value="">All Groups</option>
                {availableGroups.map(group => (
                  <option key={group} value={group}>Group {group}</option>
                ))}
              </select>
            </div>
            
            {(filterYear || filterGroup) && (
              <button
                type="button"
                className="text-[13px] text-blue-600 font-medium text-right hover:text-blue-800 transition-colors mt-1"
                onClick={() => { setFilterYear(""); setFilterGroup(""); }}
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      <button
        type="button"
        className="admin-data-table__control-btn"
      >
        <SortIcon />
        Sort
      </button>
    </>
  );

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
      showDefaultTools={false}
      extraTools={extraTools}
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
