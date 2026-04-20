"use client";

// ============================================
// AMS — ESI Sidi Bel Abbès
// SessionStudentsTable.jsx
// ============================================

import { useMemo, useState } from "react";
import { Avatar, IconDots, IconSearch, IconGroup } from "@/components/shared/TableShared";
import SyncStatusBadge from "./SyncStatusBadge";

function IconPlus() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function ToggleCell({ checked, onToggle }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onToggle}
      className={`relative inline-flex h-[22px] w-[42px] items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? "bg-[#143888]" : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? "translate-x-[22px]" : "translate-x-[2px]"
        }`}
      />
    </button>
  );
}

function IconEdit() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function StudentRow({ student, onTogglePresent, onCorrection }) {
  return (
    <div className="flex h-16 items-center border-b border-[#e3e8ef] last:border-b-0 hover:bg-[#fcfdfe] transition-colors">
      <div className="flex h-full items-center px-4 w-65 shrink-0">
        <div className="flex gap-2 items-center">
          <Avatar name={student.name} fallback="Student" color={student.avatarColor} size={11} />
          <div className="flex flex-col">
            <span className="text-[16px] text-[#030712] font-medium leading-5 tracking-[-0.24px]">
              {student.name}
            </span>
            <span className="text-[12px] text-[#64748b] leading-normal tracking-[0.66px]">
              {student.email}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 h-full items-center pl-4 pr-6 min-w-0">
        <span className="text-[14px] text-[#030712] font-mono tracking-tighter">
          {student.studentId}
        </span>
      </div>

      <div className="flex flex-1 h-full items-center pl-4 pr-6 min-w-0">
        <ToggleCell
          checked={student.present}
          onToggle={() => onTogglePresent(student.id)}
        />
      </div>

      <div className="flex flex-1 h-full items-center pl-4 pr-6 min-w-0">
        <SyncStatusBadge status={student.syncStatus} />
      </div>

      <div className="flex h-full items-center pl-4 pr-6 w-17 shrink-0 justify-end gap-2">
        <button 
          onClick={() => onCorrection(student)}
          title="Request Correction"
          className="border border-[#e3e8ef] rounded size-8 flex items-center justify-center text-[#64748b] hover:bg-[#143888] hover:text-white hover:border-[#143888] transition-all"
        >
          <IconEdit />
        </button>
      </div>
    </div>
  );
}

export default function SessionStudentsTable({ session, students, onToggleStudent, onOpenCorrection }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return students;
    return students.filter((s) =>
      [s.name, s.email, String(s.studentId ?? "")]
        .some((v) => v.toLowerCase().includes(query)),
    );
  }, [students, searchQuery]);

  return (
    <div className="border border-[#e3e8ef] rounded-xl overflow-hidden shadow-sm bg-white">
      {/* ── Toolbar ── */}
      <div className="bg-[#f8fafc] border-b border-[#e2e8f0] flex items-center justify-between px-5 py-4">
        <div className="flex gap-2.5 items-center">
          <div className="bg-white border border-[#e2e8f0] rounded-lg size-10 flex items-center justify-center text-[#143888] shadow-sm">
            <IconGroup />
          </div>
          <div className="flex flex-col">
            <span className="text-[0.75rem] text-[#64748b] font-bold uppercase tracking-wider">Group</span>
            <span className="text-[1rem] font-bold text-[#030712]">
              {session.groupNumber} (TD)
            </span>
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <div className="bg-white border border-[#e2e8f0] rounded-lg flex gap-3 items-center px-4 py-2 w-72 focus-within:ring-2 focus-within:ring-[#143888]/20 focus-within:border-[#143888] transition-all shadow-sm">
            <IconSearch className="text-[#94a3b8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or matricule..."
              className="w-full bg-transparent text-[0.875rem] text-[#111827] placeholder:text-[#94a3b8] outline-none"
            />
          </div>

          <button className="bg-white border border-[#e2e8f0] rounded-lg h-10 flex gap-2 items-center px-4 text-[0.875rem] font-bold text-[#1e293b] hover:bg-[#f1f5f9] transition-all shadow-sm">
            Add Group <IconPlus />
          </button>

          <button className="bg-white border border-[#e2e8f0] rounded-lg h-10 flex gap-2 items-center px-4 text-[0.875rem] font-bold text-[#1e293b] hover:bg-[#f1f5f9] transition-all shadow-sm">
            Add Student <IconPlus />
          </button>
        </div>
      </div>

      {/* ── Column headers ── */}
      <div className="bg-[#f8fafc] border-b border-[#e2e8f0] flex h-11 items-center">
        {["Name", "Student ID", "Status", "Sync", "Correction"].map((col, i) => (
          <div
            key={col}
            className={`flex h-full items-center px-4 ${
              i === 0 ? "w-65 shrink-0" : i === 4 ? "w-17 shrink-0 justify-end pr-6" : "flex-1 min-w-0"
            }`}
          >
            <span className="text-[0.75rem] text-[#64748b] font-bold uppercase tracking-widest">
              {col}
            </span>
          </div>
        ))}
      </div>

      {/* ── Rows ── */}
      <div className="divide-y divide-[#f1f5f9]">
        {filteredStudents.map((student) => (
          <StudentRow
            key={student.id}
            student={student}
            onTogglePresent={onToggleStudent}
            onCorrection={onOpenCorrection}
          />
        ))}
      </div>

      {!filteredStudents.length && (
        <div className="py-20 flex flex-col items-center justify-center text-[#64748b] gap-2">
          <IconSearch className="size-8 text-[#cbd5e1]" />
          <p className="text-[0.875rem] font-medium">No students matched your search</p>
        </div>
      )}
    </div>
  );
}