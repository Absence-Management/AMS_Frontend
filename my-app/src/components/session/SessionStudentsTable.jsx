"use client";

// ============================================
// AMS — ESI Sidi Bel Abbès
// SessionStudentsTable.jsx
// ============================================

import { useMemo, useState } from "react";
import { Avatar, IconSearch, IconGroup } from "@/components/shared/TableShared";

function IconPlus() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 3v10M3 8h10"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
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
      className={`relative inline-flex h-5.5 w-10.5 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? "bg-[#143888]" : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? "translate-x-5.5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function StudentRow({ student, onTogglePresent }) {
  return (
    <div className="flex h-16 items-center border-b border-[#e3e8ef] last:border-b-0 hover:bg-[#fcfdfe] transition-colors">
      {/* Name column */}
      <div className="flex h-full items-center px-5 w-1/2 shrink-0">
        <div className="flex gap-3 items-center">
          <Avatar
            name={student.name}
            fallback="Student"
            color={student.avatarColor}
            size={11}
          />
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

      {/* Student ID column */}
      <div className="flex flex-1 h-full items-center px-10 min-w-0">
        <span className="text-[14px] text-[#030712] font-mono tracking-tighter">
          {student.studentId}
        </span>
      </div>

      {/* Status column */}
      <div className="flex flex-1 h-full items-center ps-16 min-w-0 justify-center">
        <ToggleCell
          checked={student.present}
          onToggle={() => onTogglePresent(student.id)}
        />
      </div>
    </div>
  );
}

export default function SessionStudentsTable({
  session,
  students,
  onToggleStudent,
  onAddStudent,
  onAddGroup,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddStudentInput, setShowAddStudentInput] = useState(false);
  const [newMatricule, setNewMatricule] = useState("");
  const [showAddGroupInput, setShowAddGroupInput] = useState(false);
  const [newGroup, setNewGroup] = useState("");

  const handleAddSubmit = async () => {
    if (!newMatricule.trim() || !onAddStudent) return;
    try {
      await onAddStudent(newMatricule);
      setShowAddStudentInput(false);
      setNewMatricule("");
    } catch (err) {
      alert(
        err?.response?.data?.detail?.[0]?.msg ||
          err?.response?.data?.detail ||
          "Failed to add student. Verify matricule is correct.",
      );
    }
  };

  const handleAddGroupSubmit = async () => {
    if (!newGroup.trim() || !onAddGroup) return;
    try {
      await onAddGroup(newGroup.toUpperCase());
      setShowAddGroupInput(false);
      setNewGroup("");
    } catch (err) {
      alert(
        err?.response?.data?.detail?.[0]?.msg ||
          err?.response?.data?.detail ||
          "Failed to add group. Verify group name is correct.",
      );
    }
  };

  const filteredStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return students;
    return students.filter((s) =>
      [s.name, s.email, String(s.studentId ?? "")].some((v) =>
        v.toLowerCase().includes(query),
      ),
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
            <span className="text-[0.75rem] text-[#64748b] font-bold uppercase tracking-wider">
              Group
            </span>
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

          {showAddGroupInput ? (
            <div className="bg-white border border-[#e2e8f0] rounded-lg h-10 flex gap-2 items-center px-3 shadow-sm focus-within:border-[#143888] focus-within:ring-1 focus-within:ring-[#143888] transition-all">
              <input
                type="text"
                placeholder="Group Name (e.g. G2)"
                value={newGroup}
                onChange={(e) => setNewGroup(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddGroupSubmit();
                }}
                className="w-36 bg-transparent text-[0.875rem] text-[#111827] outline-none placeholder:text-[#94a3b8]"
                autoFocus
              />
              <button
                onClick={handleAddGroupSubmit}
                className="text-[#143888] font-bold text-[0.875rem] hover:opacity-80"
              >
                Add
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => {
                  setShowAddGroupInput(false);
                  setNewGroup("");
                }}
                className="text-gray-400 font-bold text-[0.875rem] hover:text-gray-600"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAddGroupInput(true)}
              className="bg-white border border-[#e2e8f0] rounded-lg h-10 flex gap-2 items-center px-4 text-[0.875rem] font-bold text-[#1e293b] hover:bg-[#f1f5f9] transition-all shadow-sm"
            >
              Add Group <IconPlus />
            </button>
          )}

          {showAddStudentInput ? (
            <div className="bg-white border border-[#e2e8f0] rounded-lg h-10 flex gap-2 items-center px-3 shadow-sm focus-within:border-[#143888] focus-within:ring-1 focus-within:ring-[#143888] transition-all">
              <input
                type="text"
                placeholder="Matricule..."
                value={newMatricule}
                onChange={(e) => setNewMatricule(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddSubmit();
                }}
                className="w-28 bg-transparent text-[0.875rem] text-[#111827] outline-none placeholder:text-[#94a3b8]"
                autoFocus
              />
              <button
                onClick={handleAddSubmit}
                className="text-[#143888] font-bold text-[0.875rem] hover:opacity-80"
              >
                Add
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => {
                  setShowAddStudentInput(false);
                  setNewMatricule("");
                }}
                className="text-gray-400 font-bold text-[0.875rem] hover:text-gray-600"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAddStudentInput(true)}
              className="bg-white border border-[#e2e8f0] rounded-lg h-10 flex gap-2 items-center px-4 text-[0.875rem] font-bold text-[#1e293b] hover:bg-[#f1f5f9] transition-all shadow-sm"
            >
              Add Student <IconPlus />
            </button>
          )}
        </div>
      </div>

      {/* ── Column headers ── */}
      <div className="bg-[#f8fafc] border-b border-[#e2e8f0] flex h-11 items-center">
        <div className="flex h-full items-center px-5 w-1/2 shrink-0">
          <span className="text-[0.75rem] text-[#64748b] font-bold uppercase tracking-widest">
            Name
          </span>
        </div>
        <div className="flex flex-1 h-full items-center px-10 min-w-0">
          <span className="text-[0.75rem] text-[#64748b] font-bold uppercase tracking-widest">
            Student ID
          </span>
        </div>
        <div className="flex flex-1 h-full items-center ps-16 min-w-0 justify-center">
          <span className="text-[0.75rem] text-[#64748b] font-bold uppercase tracking-widest">
            Status
          </span>
        </div>
      </div>

      {/* ── Rows ── */}
      <div className="divide-y divide-[#f1f5f9]">
        {filteredStudents.map((student) => (
          <StudentRow
            key={student.id}
            student={student}
            onTogglePresent={onToggleStudent}
          />
        ))}
      </div>

      {!filteredStudents.length && (
        <div className="py-20 flex flex-col items-center justify-center text-[#64748b] gap-2">
          <IconSearch className="size-8 text-[#cbd5e1]" />
          <p className="text-[0.875rem] font-medium">
            No students matched your search
          </p>
        </div>
      )}
    </div>
  );
}
