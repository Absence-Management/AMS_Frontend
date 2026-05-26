"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import api from "@/services/api";
import { updateStudentStatus } from "@/services/accountsService";

import ProfileHeader from "@/components/profile/ProfileHeader";
import SidebarProfileCard from "@/components/profile/SidebarProfileCard";
import DonutContainer from "@/components/profile/DonutContainer";
import ProfileDropdownCard from "@/components/profile/ProfileDropdownCard";
import AttendanceDonut from "@/components/student/AttendanceDonut";
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

// Returns cross-session presence that compensates a given absence (±7 days, same module)
function findCompensation(absence, crossPresences) {
  return (
    crossPresences.find(
      (cp) =>
        cp.module_name === absence.module_name &&
        Math.abs(new Date(cp.date) - new Date(absence.date)) <= 7 * 86400000,
    ) || null
  );
}

function computeAttendanceStats(absenceHistory) {
  const ownGroupRecords = absenceHistory.filter((r) => r.is_own_group);
  const crossPresences = absenceHistory.filter(
    (r) => !r.is_own_group && !r.is_absent,
  );

  const enriched = absenceHistory.map((record) => {
    if (!record.is_own_group || !record.is_absent)
      return { ...record, compensated_by: null };
    const compensated_by = findCompensation(record, crossPresences);
    return { ...record, compensated_by };
  });

  const effectiveSessions = ownGroupRecords.length;
  const effectiveAbsences = enriched.filter(
    (r) => r.is_own_group && r.is_absent && !r.compensated_by,
  ).length;
  const effectiveRate =
    effectiveSessions > 0
      ? Math.round(
          ((effectiveSessions - effectiveAbsences) / effectiveSessions) * 100,
        )
      : 0;

  return { enriched, effectiveSessions, effectiveAbsences, effectiveRate };
}

export default function StudentProfilePage() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("normal");
  const [absenceHistory, setAbsenceHistory] = useState([]);

  const { id: matricule } = useParams();

  useEffect(() => {
    console.log("[StudentProfilePage] student:", student);
    console.log("[StudentProfilePage] absenceHistory:", absenceHistory);
  }, [student, absenceHistory]);

  const chartData = LEGEND_ITEMS.map((item) => ({
    key: item.key,
    color: item.color,
    value: 1,
    attended: 0,
    total: 0,
  }));

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const { data } = await api.get(`/v1/students/${matricule}`);
        setStudent(data);
        setStatus(deriveStatus(data));
        setAbsenceHistory(data.absence_history || []);
      } catch (err) {
        console.error("Error loading student:", err);
        setError("Failed to load student profile.");
      } finally {
        setLoading(false);
      }
    }
    if (matricule) load();
  }, [matricule]);

  async function handleStatusSave(newStatus) {
    try {
      await updateStudentStatus(matricule, newStatus);
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

  const fullName = `${student.nom || ""} ${student.prenom || ""}`.trim();
  const initials = fullName
    .split(" ")
    .map((n) => n[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const { enriched, effectiveSessions, effectiveAbsences, effectiveRate } =
    computeAttendanceStats(absenceHistory);

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

      <div className="flex flex-row items-start gap-6.25">
        {/* Left Column */}
        <div className="w-52.5 shrink-0 flex flex-col gap-4">
          <SidebarProfileCard
            name={fullName}
            subtext={student.groupe || "No Group"}
            email={student.email}
            idLabel="Matricule"
            idValue={student.matricule}
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
        <div className="flex flex-col gap-6.25 flex-1">
          {/* Top Stats Row */}
          <div className="flex flex-row gap-[25px] items-stretch">
            <StatCard
              label="Total absences"
              value={effectiveAbsences}
              icon="abs"
            />
            <StatCard
              label="Total sessions"
              value={effectiveSessions}
              icon="jus"
            />
            <StatCard
              label="Attendance rate"
              value={`${effectiveRate}%`}
              icon="rate"
            />
            <ProfileDropdownCard
              label="Status"
              value={status}
              options={STATUS_OPTIONS}
              onSave={handleStatusSave}
            />
          </div>

          {/* Attendance Donut Chart */}
          <DonutContainer title="Student's Attendance">
            <AttendanceDonut data={chartData} />
            <div className="flex flex-row gap-[30px] flex-1">
              <div className="flex flex-col gap-[10px] flex-1">
                {LEGEND_ITEMS.slice(0, 4).map((item) => (
                  <div
                    key={item.key}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center gap-1">
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: item.color }}
                      />
                      <span style={{ fontSize: 10, color: "#8C97A7" }}>
                        {item.key}
                      </span>
                    </div>
                    <span className="text-[12px] font-semibold text-[#2A2E33]">
                      —
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-[10px] flex-1">
                {LEGEND_ITEMS.slice(4).map((item) => (
                  <div
                    key={item.key}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center gap-1">
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: item.color }}
                      />
                      <span style={{ fontSize: 10, color: "#8C97A7" }}>
                        {item.key}
                      </span>
                    </div>
                    <span className="text-[12px] font-semibold text-[#2A2E33]">
                      —
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </DonutContainer>

          {/* Absence History Table */}
          <div className="bg-white border border-black/10 rounded-xl p-5 mt-6">
            <h3 className="text-[16px] font-bold mb-4">
              Absence & Session History
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-[13px]">
                <thead>
                  <tr className="text-left text-[#64748b]">
                    <th className="px-2 py-1">Date</th>
                    <th className="px-2 py-1">Start</th>
                    <th className="px-2 py-1">End</th>
                    <th className="px-2 py-1">Module</th>
                    <th className="px-2 py-1">Teacher</th>
                    <th className="px-2 py-1">Session Group</th>
                    <th className="px-2 py-1">Own Group?</th>
                    <th className="px-2 py-1">Absent?</th>
                    <th className="px-2 py-1">Justification</th>
                  </tr>
                </thead>
                <tbody>
                  {enriched.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="text-center py-2 text-[#b0b0b0]"
                      >
                        No absences or sessions found.
                      </td>
                    </tr>
                  ) : (
                    enriched.map((a) => {
                      const isCrossSession = !a.is_own_group && !a.is_absent;
                      const isCompensatedAbsence =
                        a.is_own_group && a.is_absent && a.compensated_by;
                      const isUncompensatedAbsence =
                        a.is_own_group && a.is_absent && !a.compensated_by;

                      let rowBg = "";
                      if (isCrossSession) rowBg = "bg-[#eff6ff]";
                      else if (isCompensatedAbsence) rowBg = "bg-[#fff7ed]";

                      return (
                        <tr
                          key={a.absence_id}
                          className={`border-b border-[#f1f5f9] ${rowBg}`}
                        >
                          <td className="px-2 py-1">
                            {a.date ? a.date.slice(0, 10) : "—"}
                          </td>
                          <td className="px-2 py-1">{a.start_time || "—"}</td>
                          <td className="px-2 py-1">{a.end_time || "—"}</td>
                          <td className="px-2 py-1">{a.module_name || "—"}</td>
                          <td className="px-2 py-1">{a.teacher_name || "—"}</td>
                          <td className="px-2 py-1">
                            {isCrossSession ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-700">
                                {a.session_group} · Cross-session
                              </span>
                            ) : (
                              a.session_group || "—"
                            )}
                          </td>
                          <td
                            className="px-2 py-1 font-bold"
                            style={{
                              color: a.is_own_group ? "#2563eb" : "#64748b",
                            }}
                          >
                            {a.is_own_group ? "Yes" : "No"}
                          </td>
                          <td className="px-2 py-1">
                            {isUncompensatedAbsence && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 text-red-600">
                                Absent
                              </span>
                            )}
                            {isCompensatedAbsence && (
                              <span
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-orange-100 text-orange-600"
                                title={`Compensated by ${a.compensated_by.session_group} session on ${a.compensated_by.date?.slice(0, 10)}`}
                              >
                                Compensated &nbsp;✓
                              </span>
                            )}
                            {isCrossSession && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-100 text-green-600">
                                Present
                              </span>
                            )}
                            {a.is_own_group && !a.is_absent && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-100 text-green-600">
                                Present
                              </span>
                            )}
                          </td>
                          <td className="px-2 py-1">
                            {a.justification_status || "—"}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Legend */}
            <div className="flex flex-row gap-4 mt-4 text-[11px] text-[#64748b]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />{" "}
                Absent (uncompensated)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />{" "}
                Absent but compensated by cross-session
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />{" "}
                Attended another group's session
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
