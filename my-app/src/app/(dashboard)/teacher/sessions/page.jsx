"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SessionCard from "@/components/session/SessionCard";
import RescheduleSession from "@/components/session/RescheduleSession";
import { getTimetable } from "@/services/timetableService";

function getCurrentSemester() {
  const month = new Date().getMonth() + 1;
  if (month >= 9 || month === 1) {
    return "S1";
  }
  if (month >= 2 && month <= 7) {
    return "S2";
  }
  return null; // or "S2" depending on your system
}

// Return current day in French with first letter uppercase
function getCurrentDay() {
  const daysFr = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ];
  const dayIdx = new Date().getDay();
  return daysFr[dayIdx];
}

export default function Page() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchSessions() {
      setLoading(true);
      setError(null);
      try {
        const semester = getCurrentSemester();
        const day = getCurrentDay();
        const result = await getTimetable({ semester, day });
        setSessions(Array.isArray(result.rows) ? result.rows : []);
      } catch (err) {
        setError("Failed to load sessions");
      } finally {
        setLoading(false);
      }
    }
    fetchSessions();
  }, []);

  const openRescheduleModal = (session) => {
    setRescheduleTarget(session);
  };

  const closeRescheduleModal = () => {
    setRescheduleTarget(null);
  };

  return (
    <div className="main-page">
      <div className="main-header">
        <div className="main-header-text">
          <h1 className="main-title">Today&apos;s Classes</h1>
          <p className="main-subtitle">
            {getCurrentDay()} — {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="sessions-page__grid">
        {loading && <div>Loading sessions...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {!loading && !error && sessions.length === 0 && (
          <div>No sessions found for today.</div>
        )}

        {sessions.map((s) => (
          <SessionCard
            key={s.id}
            id={s.id}
            title={s.subject}
            type={s.type}
            time={`${s.time_start} — ${s.time_end}`}
            room={s.room}
            group={s.group}
            groupNumber={s.groupNumber || ""}
            onStartSession={() => router.push(`/teacher/sessions/${s.id}`)}
            onReschedule={() => openRescheduleModal(s)}
            onCancel={() => console.log("Cancel", s.id)}
          />
        ))}
      </div>

      <RescheduleSession
        isOpen={Boolean(rescheduleTarget)}
        session={rescheduleTarget}
        onClose={closeRescheduleModal}
      />
    </div>
  );
}
