"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getStudentById, updateStudentStatus } from "@/services/accountsService";

// Shared Components
import ProfileHeader from "@/components/profile/ProfileHeader";
import SidebarProfileCard from "@/components/profile/SidebarProfileCard";
import DonutContainer from "@/components/profile/DonutContainer";
import ProfileDropdownCard from "@/components/profile/ProfileDropdownCard";

// Student-specific Components
import AttendanceDonut from "@/components/student/AttendanceDonut";
import GradesSection from "@/components/student/GradesSection";
import StatCard from "@/components/profile/StatCard";

const STATUS_OPTIONS = [
  { value: "normal", label: "Normal", color: "#FFB44F" },
  { value: "exclu", label: "Exclu", color: "#111827" },
  { value: "bloque", label: "Bloqué", color: "#D64545" },
  { value: "abandonné", label: "Abandonné", color: "#8C97A7" },
];

const LEGEND_ITEMS = [
  { key: "ACSI", color: "#62B2FD" },
  { key: "LOW", color: "#9BDFC4" },
  { key: "SEC", color: "#F99BAB" },
  { key: "GP", color: "#FFB44F" },
  { key: "Network", color: "#9F97F7" },
  { key: "Architecture", color: "#143888" },
  { key: "Sys", color: "#D64545" },
  { key: "Eng", color: "#000000" },
];

function deriveStatus(raw) {
  if (!raw?.is_active) return "exclu";
  return raw?.status || "normal";
}

export default function StudentProfilePage() {
  const { id } = useParams();
  const router = useRouter();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("normal");

  // Build donut data from placeholder (real data needs absences-by-subject API)
  const chartData = LEGEND_ITEMS.map((item) => ({
    subject: item.key,
    color: item.color,
    value: 1, // equal segments placeholder
    attended: 0,
    total: 0,
  }));

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getStudentById(id);
        setStudent(data);
        setStatus(deriveStatus(data));
      } catch (err) {
        console.error("Error loading student:", err);
        setError("Failed to load student profile.");
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  async function handleStatusSave(newStatus) {
    try {
      await updateStudentStatus(id, newStatus);
      setStatus(newStatus);
    } catch (err) {
      console.error("Error updating status:", err);
    }
  }

  if (loading) {
    return (
      <div className="main-page">
        <div style={{ padding: 24, color: "#4a5567", fontSize: 14 }}>
          Loading student profile…
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="main-page">
        <div className="error-message p-6">{error || "Student not found."}</div>
      </div>
    );
  }

  const fullName = `${student.first_name || ""} ${student.last_name || ""}`.trim();
  const initials = fullName.split(" ").map(n => n[0] || "").join("").slice(0, 2).toUpperCase();

  return (
    <div className="main-page flex flex-col gap-6">
      <ProfileHeader
        breadcrumbs={[
          { label: "Students", href: "/admin/students" },
          { label: "Student Profile" },
        ]}
        subtitle="View and manage student profile and academic results"
        onEdit={() => console.log("Edit student")}
      />

      <div className="flex flex-row items-start gap-[25px]">
        {/* Left Column */}
        <div className="w-[210px] shrink-0 flex flex-col gap-4">
          <SidebarProfileCard
            name={fullName}
            subtext={student.group || "No Group"}
            email={student.email}
            idLabel="Matricule"
            idValue={student.student_id}
            initials={initials}
            avatarUrl={student.avatar_url}
          />
          
          <div className="flex justify-center pt-4">
            <Image
              src="/book.png"
              width={180}
              height={180}
              alt="Profile Illustration"
              priority
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-[25px] flex-1">
          {/* Top Stats Row */}
          <div className="flex flex-row gap-[25px] items-stretch">
            <StatCard 
              label="Total absences" 
              value={student.absence_count ?? student.absences ?? 0}
              icon="abs" 
            />

            <StatCard 
              label="Total justifications" 
              value={student.justification_count ?? 0}
              icon="jus"
            />

            <ProfileDropdownCard
              label="Status"
              value={status}
              options={STATUS_OPTIONS}
              onSave={handleStatusSave}
            />
          </div>

          <DonutContainer title="Student's Attendance">
            <AttendanceDonut data={chartData} />

            <div className="flex flex-row gap-[30px] flex-1">
              {/* Column 1 */}
              <div className="flex flex-col gap-[10px] flex-1">
                {LEGEND_ITEMS.slice(0, 4).map((item) => (
                  <div key={item.key} className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
                      <span style={{ fontSize: 10, color: "#8C97A7" }}>{item.key}</span>
                    </div>
                    <span className="text-[12px] font-semibold text-[#2A2E33]">—</span>
                  </div>
                ))}
              </div>
              {/* Column 2 */}
              <div className="flex flex-col gap-[10px] flex-1">
                {LEGEND_ITEMS.slice(4).map((item) => (
                  <div key={item.key} className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
                      <span style={{ fontSize: 10, color: "#8C97A7" }}>{item.key}</span>
                    </div>
                    <span className="text-[12px] font-semibold text-[#2A2E33]">—</span>
                  </div>
                ))}
              </div>
            </div>
          </DonutContainer>

          <GradesSection grades={student.grades} />
        </div>
      </div>
    </div>
  );
}
