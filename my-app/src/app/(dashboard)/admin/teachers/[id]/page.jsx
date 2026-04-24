"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { getTeacherById, patchTeacher } from "@/services/accountsService";

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
  { value: "Teacher", label: "Teacher", color: "#4A5567" },
  { value: "Chef department", label: "Chef department", color: "#FFB44F" },
  { value: "Admin", label: "Admin", color: "#143888" },
  { value: "Super Admin", label: "Super Admin", color: "#D64545" },
];

const LEGEND_ITEMS = [
  { key: "1CP - Algo - G3", color: "#62B2FD", pct: 13 },
  { key: "2CP - LOW - G2", color: "#9BDFC4", pct: 3 },
  { key: "1CS - SEC - G2", color: "#F99BAB", pct: 12 },
  { key: "2CP - LOW - G3", color: "#FFB44F", pct: 25 },
  { key: "2CP - LOW - G1", color: "#9F97F7", pct: 85 },
  { key: "2CP - LOW - G4", color: "#143888", pct: 13 },
  { key: "1CS - Sys - G5", color: "#D64545", pct: 44 },
];

const mockClasses = [
  { subject: "ALGO", year: "1CP", groups: ["Cours", "G1", "G2", "G3", "G4"] },
  { subject: "LOW", year: "2CP", groups: ["G1", "G4", "G5", "G7", "G8"] },
  { subject: "SYS", year: "1CS", groups: ["G1", "G2", "G5", "G6", "G8"] },
];

export default function TeacherProfilePage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const fromAdmins = searchParams.get("from") === "administrators";

  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [role, setRole] = useState("Teacher");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getTeacherById(id);
        setTeacher(data);
        setRole(data?.specialization || "Teacher");
      } catch (err) {
        setError("Failed to load teacher profile.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  async function handleRoleSave(newRole) {
    try {
      await patchTeacher(id, { specialization: newRole });
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

  const fullName = `${teacher.first_name || ""} ${teacher.last_name || ""}`.trim();
  const initials = fullName.split(" ").map(n => n[0] || "").join("").slice(0, 2).toUpperCase();

  return (
    <div className="main-page flex flex-col gap-6">
      <ProfileHeader
        breadcrumbs={[
          { 
            label: fromAdmins ? "Administrators" : "Teachers", 
            href: fromAdmins ? "/admin/administrators" : "/admin/teachers" 
          },
          { label: fromAdmins ? "Administrator Profile" : "Teacher Profile" },
        ]}
        subtitle={fromAdmins ? "View and manage Administrators" : "View and manage Teachers"}
        onEdit={() => console.log("Edit staff")}
      />

      <div className="flex flex-row gap-[25px] items-stretch">
        <SidebarProfileCard
          name={fullName}
          subtext={role}
          email={teacher.email}
          idLabel="Matricule"
          idValue={teacher.employee_id || teacher.student_id}
          initials={initials}
          avatarUrl={teacher.avatar_url}
        />

        <DonutContainer title="Students absences">
          <TeacherDonut data={LEGEND_ITEMS} />
          <div className="flex flex-col gap-[7px] flex-1">
            {LEGEND_ITEMS.map((item) => (
              <div key={item.key} className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
                  <span className="text-[10px] text-[#8C97A7]">{item.key}</span>
                </div>
                <span className="text-[12px] font-semibold text-[#2A2E33]">{item.pct}%</span>
              </div>
            ))}
          </div>
        </DonutContainer>

        <div className="flex flex-col justify-between gap-[25px] w-[207px] shrink-0">
          <StatCard
            label="Total Subject"
            value={mockClasses.length}
            icon={(
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M4 2h6M4 4h6M4 6h3" stroke="#999999" strokeWidth="1.2" strokeLinecap="round"/>
                <rect x="2" y="1" width="10" height="12" rx="1" stroke="#999999" strokeWidth="1.2"/>
              </svg>
            )}
          />

          <StatCard
            label="Total Groups"
            value={mockClasses.reduce((sum, c) => sum + (c.groups?.length || 0), 0)}
            icon={(
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 5.5l2 2 4-4" stroke="#999999" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="7" cy="7" r="6" stroke="#999999" strokeWidth="1.2"/>
              </svg>
            )}
          />

          <ProfileDropdownCard
            label="Role"
            value={role}
            options={ROLE_OPTIONS}
            onSave={handleRoleSave}
            icon={(
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7.09349 6.34079C7.03516 6.33496 6.96516 6.33496 6.90099 6.34079C5.51266 6.29413 4.41016 5.15663 4.41016 3.75663C4.41016 2.32746 5.56516 1.16663 7.00016 1.16663C8.42932 1.16663 9.59016 2.32746 9.59016 3.75663C9.58432 5.15663 8.48182 6.29413 7.09349 6.34079Z" stroke="#999999" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4.17691 8.49337C2.76525 9.43837 2.76525 10.9784 4.17691 11.9175C5.78108 12.9909 8.41191 12.9909 10.0161 11.9175C11.4277 10.9725 11.4277 9.43254 10.0161 8.49337C8.41775 7.42587 5.78691 7.42587 4.17691 8.49337Z" stroke="#999999" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            )}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-[14px] font-semibold text-black m-0">Classes &amp; groups</h3>
        <div className="flex flex-row gap-[25px] flex-wrap">
          {mockClasses.map((cls) => (
            <ClassCard key={cls.subject} subject={cls.subject} year={cls.year} groups={cls.groups} />
          ))}
        </div>
      </div>
    </div>
  );
}
