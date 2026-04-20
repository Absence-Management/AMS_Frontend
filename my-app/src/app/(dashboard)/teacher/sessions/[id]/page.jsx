"use client";
import { use, useState } from "react";
import SessionDetailsHeader from "@/components/session/SessionDetailsHeader";
import SessionDetailsStats from "@/components/session/SessionDetailsStats";
import SessionStudentsTable from "@/components/session/SessionStudentsTable";
import CompensationRequests from "@/components/dashboard/CompensationRequests";
import CorrectionRequestModal from "@/components/session/CorrectionRequestModal";
import { SYNC_STATUS } from "@/lib/constants";
import { useAttendance } from "@/hooks/useAttendance";
import { useAttendanceSummary } from "@/hooks/useAttendanceSummary";

const MOCK_SESSIONS = [
  {
    id: 101,
    title: "Data Structures",
    type: "TD",
    time: "08:00 — 09:30",
    room: "Salle A2 — Sup",
    group: "CP1 — group",
    groupNumber: "3",
  },
  {
    id: 102,
    title: "Algorithms",
    type: "Course",
    time: "10:00 — 11:30",
    room: "Salle B1",
    group: "CP2 — group",
    groupNumber: "1",
  },
  {
    id: 103,
    title: "Database Systems",
    type: "Lab",
    time: "12:00 — 13:30",
    room: "Salle S3",
    group: "CS1 — group",
    groupNumber: "2",
  },
  {
    id: 104,
    title: "Operating Systems",
    type: "TD",
    time: "14:00 — 15:30",
    room: "Salle S4",
    group: "CS3 — group",
    groupNumber: "4",
  },
  {
    id: 105,
    title: "Computer Networks",
    type: "Course",
    time: "16:00 — 17:30",
    room: "Amphi E",
    group: "CS2 — group",
    groupNumber: "1",
  },
];

const MOCK_STUDENTS = [
  {
    id: 1,
    name: "Bouhafs Rim",
    email: "r.bouhafs@esi-sba.dz",
    studentId: "202334652314",
    present: false,
    syncStatus: SYNC_STATUS.SYNCED,
    avatarColor: "#e2e8f0",
  },
  {
    id: 2,
    name: "Ilyes Brahmi",
    email: "i.brahmi@esi-sba.dz",
    studentId: "202334652320",
    present: true,
    syncStatus: SYNC_STATUS.SYNCED,
    avatarColor: "#dbeafe",
  },
  {
    id: 3,
    name: "Trari Foued",
    email: "f.trari@esi-sba.dz",
    studentId: "202334652321",
    present: true,
    syncStatus: SYNC_STATUS.PENDING,
    avatarColor: "#fbecd1",
  },
  {
    id: 4,
    name: "Khelifi Sara",
    email: "s.khelifi@esi-sba.dz",
    studentId: "202334652322",
    present: true,
    syncStatus: SYNC_STATUS.FAILED,
    avatarColor: "#f5d0fe",
  },
  {
    id: 5,
    name: "Cherif Malik",
    email: "m.cherif@esi-sba.dz",
    studentId: "202334652323",
    present: true,
    syncStatus: null,
    avatarColor: "#e2e8f0",
  },
  {
    id: 6,
    name: "Bensalem Nadia",
    email: "n.bensalem@esi-sba.dz",
    studentId: "202334652324",
    present: true,
    syncStatus: SYNC_STATUS.SYNCED,
    avatarColor: "#fde68a",
  },
  {
    id: 7,
    name: "Hassani Youssef",
    email: "y.hassani@esi-sba.dz",
    studentId: "202334652325",
    present: true,
    syncStatus: SYNC_STATUS.PENDING,
    avatarColor: "#bfdbfe",
  },
  {
    id: 8,
    name: "Amrani Lila",
    email: "l.amrani@esi-sba.dz",
    studentId: "202334652326",
    present: true,
    syncStatus: SYNC_STATUS.SYNCED,
    avatarColor: "#fecaca",
  },
];

const MOCK_COMPENSATION_REQUESTS = [
  {
    id: 101,
    studentName: "Bouhafs Rim",
    studentGroup: "G3",
    targetGroup: "G6",
    module: "Data Structures TD",
    date: "Thu 23 Apr",
    time: "10:00",
    room: "Salle A2",
  },
  {
    id: 102,
    studentName: "Trari Foued",
    studentGroup: "G1",
    targetGroup: "G5",
    module: "Algorithms TD",
    date: "Wed 22 Apr",
    time: "14:00",
    room: "Salle B1",
  },
  {
    id: 103,
    studentName: "Brahmi Ilyes",
    studentGroup: "G6",
    targetGroup: "G3",
    module: "Data Structures TD",
    date: "Sun 19 Apr",
    time: "08:00",
    room: "Salle A2",
  },
  {
    id: 104,
    studentName: "Sara Khelifi",
    studentGroup: "G4",
    targetGroup: "G3",
    module: "Data Structures TD",
    date: "Sun 19 Apr",
    time: "08:00",
    room: "Salle A2",
  },
  {
    id: 105,
    studentName: "Malik Cherif",
    studentGroup: "G2",
    targetGroup: "G1",
    module: "Algorithms Course",
    date: "Sun 19 Apr",
    time: "10:00",
    room: "Salle B1",
  },
];

export default function SessionDetailsPage({ params }) {
  const resolvedParams = use(params);
  const sessionId = Array.isArray(resolvedParams?.id)
    ? resolvedParams.id[0]
    : resolvedParams?.id;
  const sessionIdNum = Number(sessionId);
  const session = MOCK_SESSIONS.find((s) => s.id === sessionIdNum) ?? null;

  // Use the hook with MOCK_STUDENTS as initial data so UI is populated immediately
  const { students, handleTogglePresent } = useAttendance(sessionIdNum, MOCK_STUDENTS);
  const { summary: liveSummary } = useAttendanceSummary(sessionIdNum);

  // Correction Modal State
  const [selectedStudentForCorrection, setSelectedStudentForCorrection] = useState(null);
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);

  const handleOpenCorrection = (student) => {
    setSelectedStudentForCorrection(student);
    setIsCorrectionModalOpen(true);
  };

  const presentCount = students.filter((student) => student.present).length;
  const absentCount = students.length - presentCount;
  const absenceRate = ((absentCount / students.length) * 100).toFixed(1);

  // Filter requests that target this specific session's group
  const sessionRequests = MOCK_COMPENSATION_REQUESTS.filter(
    (req) => req.targetGroup === `G${session.groupNumber}`
  );

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

  return (
    <div className="main-page">
      <SessionDetailsHeader session={session} />
      <SessionDetailsStats
        session={session}
        presentCount={presentCount}
        absentCount={absentCount}
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
          />
        </div>
        <div className="w-[380px] shrink-0">
          <CompensationRequests requests={sessionRequests} />
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button className="bg-[#143888] border border-black/10 rounded-lg px-3.5 py-1.5 text-[14px] font-medium text-white hover:bg-[#0f2d6e] transition-colors shadow-sm">
          Save &amp; End session
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
