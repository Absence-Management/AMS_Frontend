"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { getTeacherProfile } from "@/services/teacherService";
import { patchTeacher } from "@/services/accountsService";

// Shared Components
import ProfileHeader from "@/components/profile/ProfileHeader";
import SidebarProfileCard from "@/components/profile/SidebarProfileCard";
import DonutContainer from "@/components/profile/DonutContainer";
import ProfileDropdownCard from "@/components/profile/ProfileDropdownCard";
import StatCard from "@/components/profile/StatCard";

// Teacher-specific Components
import TeacherDonut from "@/components/teacher/TeacherDonut";
import ClassCard from "@/components/teacher/ClassCard";

const ROLE_OPTIONS = [
  { value: "TEACHER", label: "Teacher", color: "#4A5567" },
  { value: "ADMIN", label: "Admin", color: "#143888" },
];

const COLOR_PALETTE = [
  "#62B2FD",
  "#9BDFC4",
  "#F99BAB",
  "#FFB44F",
  "#9F97F7",
  "#143888",
  "#D64545",
  "#22c55e",
  "#a78bfa",
  "#fb923c",
  "#06b6d4",
  "#84cc16",
];

export default function TeacherProfilePage() {
  const { id: matricule } = useParams();
  const searchParams = useSearchParams();
  const fromAdmins = searchParams.get("from") === "administrators";

  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [role, setRole] = useState("TEACHER");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getTeacherProfile(matricule);
        setTeacher(data);
        setRole(data?.role || "TEACHER");
      } catch (err) {
        setError("Failed to load teacher profile.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (matricule) load();
  }, [matricule]);

  async function handleRoleSave(newRole) {
    try {
      await patchTeacher(matricule, { role: newRole });
      setRole(newRole);
    } catch (err) {
      console.error("Error updating role:", err);
    }
  }

  if (loading) {
    return (
      <div className="main-page">
        <div className="p-6 text-[14px] text-[#4a5567]">
          Loading teacher profile…
        </div>
      </div>
    );
  }

  if (error || !teacher) {
    return (
      <div className="main-page">
        <div className="error-message">{error || "Teacher not found."}</div>
      </div>
    );
  }

  const fullName = `${teacher.nom || teacher.last_name || ""} ${
    teacher.prenom || teacher.first_name || ""
  }`.trim();

  const initials = fullName
    .split(" ")
    .map((n) => n[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Build legend items from attendance_by_group with auto-assigned colors
  const legendItems = (teacher.attendance_by_group || []).map((item, i) => ({
    key: `${item.niveau} - ${item.subject || ""} - ${item.group || ""}`,
    color: COLOR_PALETTE[i % COLOR_PALETTE.length],
    pct: item.attendance_rate ?? 0,
  }));

  const subjects = teacher.subjects || [];

  return (
    <div className="main-page flex flex-col gap-6">
      <ProfileHeader
        breadcrumbs={[
          {
            label: fromAdmins ? "Administrators" : "Teachers",
            href: fromAdmins ? "/admin/administrators" : "/admin/teachers",
          },
          { label: fromAdmins ? "Administrator Profile" : "Teacher Profile" },
        ]}
        subtitle={
          fromAdmins
            ? "View and manage Administrators"
            : "View and manage Teachers"
        }
        onEdit={() => console.log("Edit staff")}
      />

      <div className="flex flex-row gap-6.25 items-stretch">
        <div className="flex flex-col gap-4">
          <SidebarProfileCard
            name={fullName}
            subtext={`Teacher | ${teacher.departement || teacher.specialization || "—"}`}
            email={teacher.email || "—"}
            idLabel="Matricule"
            idValue={teacher.matricule || teacher.employee_id}
            initials={initials}
            avatarUrl={teacher.avatar_url}
          />
          <div className="box-border flex flex-col p-3 gap-2 bg-white border border-black/10 rounded-[8px]">
            <div className="flex items-center gap-2 text-[12px] text-[#4a5567]">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 4.5l5 3 5-3M2 4.5v6a1 1 0 001 1h8a1 1 0 001-1v-6M2 4.5l5-3 5 3" stroke="#999999" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{teacher.phone || "—"}</span>
            </div>
            <div className="flex items-center gap-2 text-[12px] text-[#4a5567]">
              <div className={`w-2 h-2 rounded-full ${teacher.is_active ? "bg-[#22c55e]" : "bg-[#D64545]"}`} />
              <span>{teacher.is_active ? "Active" : "Disabled"}</span>
            </div>
          </div>
        </div>

        <DonutContainer title="Students absences">
          <TeacherDonut
            data={legendItems}
            centerLabel={teacher.overall_attendance_rate ?? 0}
            centerSub="attendance"
          />

          <div className="flex flex-col gap-1.75 flex-1">
            {legendItems.length === 0 ? (
              <span className="text-[12px] text-[#b0b0b0]">
                No attendance data yet.
              </span>
            ) : (
              legendItems.map((item) => (
                <div
                  key={item.key}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center gap-1">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: item.color }}
                    />
                    <span className="text-[10px] text-[#8C97A7]">
                      {item.key}
                    </span>
                  </div>
                  <span className="text-[12px] font-semibold text-[#2A2E33]">
                    {item.pct}%
                  </span>
                </div>
              ))
            )}
          </div>
        </DonutContainer>

        <div className="flex flex-col justify-between gap-6.25 w-51.75 shrink-0">
          <StatCard
            label="Total Subjects"
            value={teacher.total_subjects ?? 0}
            icon={
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M4 2h6M4 4h6M4 6h3" stroke="#999999" strokeWidth="1.2" strokeLinecap="round"/>
                <rect x="2" y="1" width="10" height="12" rx="1" stroke="#999999" strokeWidth="1.2"/>
              </svg>
            }
          />

          <StatCard
            label="Total Groups"
            value={teacher.total_groups ?? 0}
            icon={
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 5.5l2 2 4-4" stroke="#999999" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="7" cy="7" r="6" stroke="#999999" strokeWidth="1.2"/>
              </svg>
            }
          />

          <StatCard
            label="Total Sessions"
            value={teacher.total_sessions ?? 0}
            icon={
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="#999999" strokeWidth="1.2"/>
                <path d="M7 4v3l2 2" stroke="#999999" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            }
          />

          <StatCard
            label="Total Absences"
            value={teacher.total_absences ?? 0}
            icon={
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="#999999" strokeWidth="1.2" strokeDasharray="3 3"/>
                <path d="M4.5 4.5l5 5M9.5 4.5l-5 5" stroke="#999999" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            }
          />

          <ProfileDropdownCard
            label="Role"
            value={role}
            options={ROLE_OPTIONS}
            onSave={handleRoleSave}
            icon={
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7.09349 6.34079C7.03516 6.33496 6.96516 6.33496 6.90099 6.34079C5.51266 6.29413 4.41016 5.15663 4.41016 3.75663C4.41016 2.32746 5.56516 1.16663 7.00016 1.16663C8.42932 1.16663 9.59016 2.32746 9.59016 3.75663C9.58432 5.15663 8.48182 6.29413 7.09349 6.34079Z" stroke="#999999" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4.17691 8.49337C2.76525 9.43837 2.76525 10.9784 4.17691 11.9175C5.78108 12.9909 8.41191 12.9909 10.0161 11.9175C11.4277 10.9725 11.4277 9.43254 10.0161 8.49337C8.41775 7.42587 5.78691 7.42587 4.17691 8.49337Z" stroke="#999999" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-[14px] font-semibold text-black m-0">
          Classes &amp; groups
        </h3>
        {subjects.length === 0 ? (
          <p className="text-[13px] text-[#b0b0b0]">No classes assigned yet.</p>
        ) : (
          <div className="flex flex-row gap-6.25 flex-wrap">
            {subjects.map((cls) => (
              <ClassCard
                key={`${cls.subject_name}-${cls.niveau}`}
                subject={cls.subject_name}
                year={cls.niveau}
                groups={cls.groups}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
