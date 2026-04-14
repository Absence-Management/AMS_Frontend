import AdminSallesTable from "@/components/dashboard/AdminSallesTable";
import { StatsCard } from "@/components/dashboard/StatsCard";

// ── Icons ────────────────────────────────────────────────────────────────────

function AmphiIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="13" width="20" height="9" rx="2" stroke="#059669" strokeWidth="1.6" />
      <path d="M5 13V9a7 7 0 0 1 14 0v4" stroke="#059669" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M9 13V11a3 3 0 0 1 6 0v2" stroke="#059669" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function RoomIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="#d97706" strokeWidth="1.6" />
      <path d="M9 3v18" stroke="#d97706" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M3 9h6" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M3 15h6" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CapacityIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="7" r="3.5" stroke="#2563eb" strokeWidth="1.6" />
      <path d="M2 20c0-3.314 3.134-6 7-6" stroke="#2563eb" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="17" cy="8" r="2.5" stroke="#2563eb" strokeWidth="1.5" />
      <path d="M14 20c0-2.761 2.239-5 5-5s5 2.239 5 5" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_SALLES = [
  { id: 1,  name: "Salle 101",   type: "Room",         department: "Sup",   capacity: 40  },
  { id: 2,  name: "Salle 102",   type: "Room",         department: "Sup",   capacity: 40  },
  { id: 3,  name: "Salle 103",   type: "Room",         department: "Sup",   capacity: 35  },
  { id: 4,  name: "Salle 201",   type: "Room",         department: "Prepa", capacity: 50  },
  { id: 5,  name: "Salle 202",   type: "Room",         department: "Prepa", capacity: 50  },
  { id: 6,  name: "Salle TP 1",  type: "Room",         department: "Sup",   capacity: 25  },
  { id: 7,  name: "Salle TP 2",  type: "Room",         department: "Sup",   capacity: 25  },
  { id: 8,  name: "Salle TP 3",  type: "Room",         department: "Prepa", capacity: 30  },
  { id: 9,  name: "Salle TP 4",  type: "Room",         department: "Prepa", capacity: 30  },
  { id: 10, name: "Salle TP 5",  type: "Room",         department: "Sup",   capacity: 20  },
  { id: 11, name: "Salle 301",   type: "Room",         department: "Sup",   capacity: 40  },
  { id: 12, name: "Salle 302",   type: "Room",         department: "Sup",   capacity: 40  },
  { id: 13, name: "Salle 401",   type: "Room",         department: "Prepa", capacity: 45  },
  { id: 14, name: "Salle 402",   type: "Room",         department: "Prepa", capacity: 45  },
  { id: 15, name: "Salle 501",   type: "Room",         department: "Sup",   capacity: 38  },
  { id: 16, name: "Salle 502",   type: "Room",         department: "Sup",   capacity: 38  },
  { id: 17, name: "Salle 601",   type: "Room",         department: "Prepa", capacity: 42  },
  { id: 18, name: "Salle 602",   type: "Room",         department: "Prepa", capacity: 42  },
  { id: 19, name: "Salle 701",   type: "Room",         department: "Sup",   capacity: 35  },
  { id: 20, name: "Salle 702",   type: "Room",         department: "Sup",   capacity: 35  },
  { id: 21, name: "Salle 801",   type: "Room",         department: "Prepa", capacity: 40  },
  { id: 22, name: "Salle 802",   type: "Room",         department: "Prepa", capacity: 40  },
  { id: 23, name: "Amphi A",     type: "Amphitheater", department: "Sup",   capacity: 200 },
  { id: 24, name: "Amphi B",     type: "Amphitheater", department: "Sup",   capacity: 180 },
  { id: 25, name: "Amphi C",     type: "Amphitheater", department: "Prepa", capacity: 300 },
  { id: 26, name: "Amphi D",     type: "Amphitheater", department: "Prepa", capacity: 250 },
  { id: 27, name: "Amphi E",     type: "Amphitheater", department: "Sup",   capacity: 150 },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SallesAmphisPage() {
  const totalAmphis = MOCK_SALLES.filter(
    (s) => s.type === "Amphitheater"
  ).length;
  const totalRooms = MOCK_SALLES.filter((s) => s.type === "Room").length;
  const totalCapacity = MOCK_SALLES.reduce((sum, s) => sum + s.capacity, 0);

  return (
    <div className="main-page">
      {/* ── Header ── */}
      <div className="main-header">
        <div className="main-header-text">
          <h2 className="main-title">Amphitheatres &amp; Salles</h2>
          <p className="main-subtitle">
            Manage classrooms, amphitheaters, and their capacity
          </p>
        </div>
        <button type="button" className="main-add-btn">
          Add a resource&nbsp;+
        </button>
      </div>

      {/* ── Stats cards ── */}
      <div className="stats-cards-grid">
        <StatsCard
          icon={<AmphiIcon />}
          iconBg="#ecfdf5"
          title="Total Amphitheaters"
          value={totalAmphis}
          label=""
        />
        <StatsCard
          icon={<RoomIcon />}
          iconBg="#fffbeb"
          title="Total Rooms"
          value={totalRooms}
          label=""
        />
        <StatsCard
          icon={<CapacityIcon />}
          iconBg="#eff6ff"
          title="Total Capacity"
          value={totalCapacity}
          label=""
        />
      </div>

      {/* ── Table ── */}
      <AdminSallesTable salles={MOCK_SALLES} />
    </div>
  );
}
