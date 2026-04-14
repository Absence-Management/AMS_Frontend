"use client";

import { useCallback, useMemo, useState } from "react";

const TIMETABLE_DAYS = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi"];
const TIMETABLE_TIME_SLOTS = [
  "08:00-09:30",
  "09:30-11:00",
  "11:00-12:30",
  "14:00-15:30",
];
const TIMETABLE_SLOT_STARTS = ["08:00", "09:30", "11:00", "14:00"];

const SESSION_TYPE_COLORS = {
  Cours: { bg: "#dbeafe", text: "#1e40af", border: "#bfdbfe" },
  TD: { bg: "#dcfce7", text: "#166534", border: "#bbf7d0" },
  TP: { bg: "#fef9c3", text: "#854d0e", border: "#fde68a" },
  "TD/TP": { bg: "#ede9fe", text: "#5b21b6", border: "#ddd6fe" },
  "Cours/TD/TP": { bg: "#fce7f3", text: "#9d174d", border: "#fbcfe8" },
};

const TYPE_FALLBACK = { bg: "#f3f4f6", text: "#374151", border: "#e5e7eb" };

function buildTimetableGrid(rows) {
  const grid = {};

  TIMETABLE_DAYS.forEach((day) => {
    grid[day] = {};
    TIMETABLE_SLOT_STARTS.forEach((_, slotIndex) => {
      grid[day][slotIndex] = [];
    });
  });

  rows.forEach((row) => {
    const day = TIMETABLE_DAYS.find(
      (candidate) => candidate.toLowerCase() === row.day?.toLowerCase(),
    );
    if (!day) return;

    const slotIndex = TIMETABLE_SLOT_STARTS.findIndex(
      (slotStart) => slotStart === row.time_start,
    );
    if (slotIndex === -1) return;

    grid[day][slotIndex].push(row);
  });

  return grid;
}

function TimetableSessionChip({ session }) {
  const colors = SESSION_TYPE_COLORS[session.type] ?? TYPE_FALLBACK;
  const label = session.group
    ? `${session.type} · ${session.group}`
    : session.type;

  return (
    <div
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: 6,
        padding: "4px 7px",
        marginBottom: 4,
        fontSize: 11,
        lineHeight: 1.4,
      }}
    >
      <div>{ session.year}</div>
      <div style={{ fontWeight: 600, color: colors.text, fontSize: 11 }}>
        {session.subject}
      </div>
      <div style={{ color: colors.text, opacity: 0.85 }}>{label}</div>
      <div style={{ color: colors.text, opacity: 0.7 }}>
        {session.teacher}
        {session.room ? ` · ${session.room}` : ""}
      </div>
    </div>
  );
}

function TimetableFilterBar({ rows, filters, onChange }) {
  const years = [...new Set(rows.map((row) => row.year).filter(Boolean))].sort();
  const sections = [
    ...new Set(rows.map((row) => row.section).filter(Boolean)),
  ].sort();
  const specialities = [
    ...new Set(rows.map((row) => row.speciality).filter(Boolean)),
  ].sort();
  const semesters = [
    ...new Set(rows.map((row) => row.semester).filter(Boolean)),
  ].sort();

  const select = (key, values, placeholder) => (
    <select
      className="timetable-filter-select"
      value={filters[key]}
      onChange={(event) => onChange(key, event.target.value)}
    >
      <option value="">{placeholder}</option>
      {values.map((value) => (
        <option key={value} value={value}>
          {value}
        </option>
      ))}
    </select>
  );

  return (
    <div className="timetable-filter-bar">
      {select("year", years, "All years")}
      {select("section", sections, "All sections")}
      {select("speciality", specialities, "All specialities")}
      {select("semester", semesters, "All semesters")}
      <button
        type="button"
        className="timetable-filter-reset"
        onClick={() => onChange("__reset__", "")}
      >
        Reset
      </button>
    </div>
  );
}

export function TimetableGrid({
  rows,
  title = "Timetable",
  countLabel = "sessions",
  totalCount,
  showHeader = true,
  showFilters = true,
}) {
  const [filters, setFilters] = useState({
    year: "",
    section: "",
    speciality: "",
    semester: "",
  });

  const handleFilterChange = useCallback((key, value) => {
    if (key === "__reset__") {
      setFilters({ year: "", section: "", speciality: "", semester: "" });
      return;
    }

    setFilters((previous) => ({ ...previous, [key]: value }));
  }, []);

  const filteredRows = useMemo(
    () =>
      rows.filter((row) => {
        if (filters.year && row.year !== filters.year) return false;
        if (filters.section && row.section !== filters.section) return false;
        if (filters.speciality && row.speciality !== filters.speciality)
          return false;
        if (filters.semester && row.semester !== filters.semester) return false;
        return true;
      }),
    [filters, rows],
  );

  const grid = useMemo(() => buildTimetableGrid(filteredRows), [filteredRows]);

  return (
    <div>
      {showHeader ? (
        <div className="timetable-preview-header">
          <div>
            <h3 className="timetable-preview-title">{title}</h3>
            <p className="timetable-preview-count">
              {filteredRows.length} {countLabel} ·{" "}
              {typeof totalCount === "number" ? totalCount : rows.length} total rows
            </p>
          </div>
        </div>
      ) : null}

      {showFilters ? (
        <TimetableFilterBar
          rows={rows}
          filters={filters}
          onChange={handleFilterChange}
        />
      ) : null}

      <div className="timetable-grid-wrap">
        <table className="timetable-grid">
          <thead>
            <tr>
              <th className="timetable-th timetable-th--time">Time</th>
              {TIMETABLE_DAYS.map((day) => (
                <th key={day} className="timetable-th">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIMETABLE_SLOT_STARTS.map((_, slotIndex) => (
              <tr key={TIMETABLE_TIME_SLOTS[slotIndex]}>
                <td className="timetable-td timetable-td--time">
                  <span className="timetable-slot-label">
                    {TIMETABLE_TIME_SLOTS[slotIndex]}
                  </span>
                </td>

                {TIMETABLE_DAYS.map((day) => {
                  const sessions = grid[day]?.[slotIndex] ?? [];

                  return (
                    <td key={`${day}-${slotIndex}`} className="timetable-td">
                      {sessions.length > 0 ? (
                        sessions.map((session, index) => (
                          <TimetableSessionChip
                            key={`${day}-${slotIndex}-${index}`}
                            session={session}
                          />
                        ))
                      ) : (
                        <span className="timetable-empty-cell" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="timetable-legend">
        {Object.entries(SESSION_TYPE_COLORS).map(([type, colors]) => (
          <span
            key={type}
            className="timetable-legend-item"
            style={{
              background: colors.bg,
              color: colors.text,
              border: `1px solid ${colors.border}`,
            }}
          >
            {type}
          </span>
        ))}
      </div>
    </div>
  );
}
