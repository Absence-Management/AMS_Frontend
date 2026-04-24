"use client";
import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SessionDetailsHeader from "@/components/session/SessionDetailsHeader";
import SessionDetailsStats from "@/components/session/SessionDetailsStats";
import SessionStudentsTable from "@/components/session/SessionStudentsTable";
import CompensationRequests from "@/components/dashboard/CompensationRequests";
import CorrectionRequestModal from "@/components/session/CorrectionRequestModal";
import { SYNC_STATUS } from "@/lib/constants";
import { useAttendance } from "@/hooks/useAttendance";
import { useAttendanceSummary } from "@/hooks/useAttendanceSummary";



export default function SessionDetailsPage({ params }) {
  const resolvedParams = use(params);
  const sessionId = Array.isArray(resolvedParams?.id)
    ? resolvedParams.id[0]
    : resolvedParams?.id;
  
  const [session, setSession] = useState(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  useEffect(() => {
    if (!sessionId) return;

    async function resolveSession() {
      // Step 1: Try sessionStorage (set when navigating from the sessions list)
      const cached = sessionStorage.getItem(`session_${sessionId}`);
      if (cached) {
        try {
          const s = JSON.parse(cached);
          setSession(mapSession(s));
          setIsLoadingSession(false);
          return;
        } catch {
          console.warn("Failed to parse cached session, falling back to API");
        }
      }

      // Step 2: Fallback — fetch today's sessions list and find by ID
      // (handles direct URL access, browser refresh, shared links)
      try {
        const { default: api } = await import("@/services/api");
        const response = await api.get("/v1/sessions/today");
        let data = response.data;
        if (!Array.isArray(data)) {
          data = data.data || data.sessions || data.items || data.results || [];
        }
        const found = (Array.isArray(data) ? data : []).find(s => s.id === sessionId);
        if (found) {
          const mapped = {
            id: found.id,
            subject: found.module?.nom || found.module?.code || "Unknown Module",
            type: found.type || "Course",
            time_start: found.start_time?.slice(0, 5) || "",
            time_end: found.end_time?.slice(0, 5) || "",
            room: found.room?.code || found.room?.nom || "TBD",
            group: found.year && found.group ? `${found.year} - ${found.group}` : (found.group || ""),
            groupNumber: found.group ? found.group.replace(/\D/g, "") : "",
          };
          // Cache it for next time
          sessionStorage.setItem(`session_${sessionId}`, JSON.stringify(mapped));
          setSession(mapSession(mapped));
          setIsLoadingSession(false);
          return;
        }
      } catch (err) {
        console.error("Fallback session fetch failed:", err);
      }

      // Step 3: Last resort — render the page with a minimal stub so
      // the attendance table still loads (the hook only needs sessionId)
      setSession({
        id: sessionId,
        title: "Session",
        type: "",
        time: "",
        room: "",
        group: "",
        groupNumber: "",
      });
      setIsLoadingSession(false);
    }

    resolveSession();
  }, [sessionId]);

  /** Normalise a cached/mapped session object into the shape used by this page */
  function mapSession(s) {
    return {
      id: s.id,
      title: s.subject || s.title || "Unknown",
      type: s.type || "Course",
      time: s.time || (s.time_start && s.time_end ? `${s.time_start} — ${s.time_end}` : ""),
      room: s.room || "TBD",
      group: s.group || "",
      groupNumber: s.groupNumber || "",
    };
  }

  // Use the hook to fetch from API
  const { students, handleTogglePresent, saveAttendance, addStudent, addGroup } = useAttendance(sessionId);
  const { summary: liveSummary } = useAttendanceSummary(sessionId);
  const router = useRouter();

  // Correction Modal State
  const [selectedStudentForCorrection, setSelectedStudentForCorrection] = useState(null);
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleOpenCorrection = (student) => {
    setSelectedStudentForCorrection(student);
    setIsCorrectionModalOpen(true);
  };

  const handleSaveAndEnd = async () => {
    setSaving(true);
    try {
      const res = await saveAttendance();
      // Optional: Show success toast here if you implement a toast system 
      // alert(`Saved! Created: ${res.created}, Updated: ${res.updated}`);
      router.push("/teacher/sessions");
    } catch (e) {
      alert("Failed to save session attendance.");
    } finally {
      setSaving(false);
    }
  };

  const presentCount = students.filter((s) => s.present).length;
  const absentCount = students.length - presentCount;
  const pendingCount = students.filter((s) => s.syncStatus === "pending").length;
  const absenceRate = students.length > 0 ? ((absentCount / students.length) * 100).toFixed(1) : "0.0";

  if (isLoadingSession) {
    return (
      <div className="main-page flex items-center justify-center min-h-[500px]">
        <div className="text-[#64748b] font-medium text-[16px]">Loading session details...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="main-page">
        <h2 className="main-title">Session not found</h2>
        <p className="main-subtitle">
          No session exists for ID: {String(sessionId)}
        </p>
      </div>
    );
  }

  // Compensation API not yet provided
  const sessionRequests = [];

  return (
    <div className="main-page">
      <SessionDetailsHeader session={session} />
      <SessionDetailsStats
        session={session}
        presentCount={presentCount}
        absentCount={absentCount}
        pendingCount={pendingCount}
        absenceRate={absenceRate}
        liveSummary={liveSummary}
      />
      <div className="flex gap-6 items-stretch">
        <div className="flex-1">
          <SessionStudentsTable
            session={session}
            students={students}
            onToggleStudent={handleTogglePresent}
            onOpenCorrection={handleOpenCorrection}
            onAddStudent={addStudent}
            onAddGroup={addGroup}
          />
        </div>
        <div className="w-[380px] shrink-0">
          <CompensationRequests requests={sessionRequests} />
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button 
          disabled={saving} 
          onClick={handleSaveAndEnd} 
          className="bg-[#143888] border border-black/10 rounded-lg px-3.5 py-1.5 text-[14px] font-medium text-white hover:bg-[#0f2d6e] transition-colors shadow-sm disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save & End session"}
        </button>
      </div>

      {/* Correction Modal */}
      <CorrectionRequestModal
        isOpen={isCorrectionModalOpen}
        onClose={() => setIsCorrectionModalOpen(false)}
        student={selectedStudentForCorrection}
        session={session}
      />
    </div>
  );
}
