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

// Subject color palette (extend as needed)
const SUBJECT_COLORS = [
  { bg: "#dbeafe", text: "#1e40af", border: "#bfdbfe" },
  { bg: "#dcfce7", text: "#166534", border: "#bbf7d0" },
  { bg: "#fef9c3", text: "#854d0e", border: "#fde68a" },
  { bg: "#ede9fe", text: "#5b21b6", border: "#ddd6fe" },
  { bg: "#fce7f3", text: "#9d174d", border: "#fbcfe8" },
  { bg: "#fee2e2", text: "#991b1b", border: "#fecaca" },
  { bg: "#cffafe", text: "#0e7490", border: "#a5f3fc" },
  { bg: "#fef3c7", text: "#92400e", border: "#fde68a" },
  { bg: "#e0e7ff", text: "#3730a3", border: "#c7d2fe" },
  { bg: "#f1f5f9", text: "#334155", border: "#e2e8f0" },
];
const SUBJECT_FALLBACK = { bg: "#f3f4f6", text: "#374151", border: "#e5e7eb" };

// Build subject-to-color mapping
function getSubjectColorMap(rows) {
  const subjects = [...new Set(rows.map((row) => row.subject).filter(Boolean))];
  const map = {};
  subjects.forEach((subject, i) => {
    map[subject] = SUBJECT_COLORS[i % SUBJECT_COLORS.length];
  });
  return map;
}

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

function TimetableSessionChip({ session, subjectColorMap }) {
  const colors = subjectColorMap?.[session.subject] ?? SUBJECT_FALLBACK;
  const label = session.group
    ? `${session.type} · ${session.group}`
    : session.type;

  // Support both old 'teacher' and new 'teachers' array
  let teacherNames = "";
  if (Array.isArray(session.teachers) && session.teachers.length > 0) {
    teacherNames = session.teachers
      .map((t) =>
        `${t.first_name ? t.first_name + " " : ""}${t.last_name || ""}`.trim(),
      )
      .join(" / ");
  } else if (session.teacher) {
    teacherNames = session.teacher;
  }

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
      <div>{session.year}</div>
      <div style={{ fontWeight: 600, color: colors.text, fontSize: 11 }}>
        {session.subject}
      </div>
      <div style={{ color: colors.text, opacity: 0.85 }}>{label}</div>
      <div style={{ color: colors.text, opacity: 0.7 }}>
        {teacherNames}
        {session.room ? ` · ${session.room}` : ""}
      </div>
    </div>
  );
}

export function TimetableGrid({
  rows,
  title = "Timetable",
  countLabel = "sessions",
  totalCount,
  showHeader = true,
}) {
  const grid = useMemo(() => buildTimetableGrid(rows), [rows]);
  const subjectColorMap = useMemo(() => getSubjectColorMap(rows), [rows]);

  return (
    <div>
      {showHeader ? (
        <div className="timetable-preview-header">
          <div>
            <h3 className="timetable-preview-title">{title}</h3>
            <p className="timetable-preview-count">
              {rows.length} {countLabel} ·{" "}
              {typeof totalCount === "number" ? totalCount : rows.length} total
              rows
            </p>
          </div>
        </div>
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
                            subjectColorMap={subjectColorMap}
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
        {Object.entries(subjectColorMap).map(([subject, colors]) => (
          <span
            key={subject}
            className="timetable-legend-item"
            style={{
              background: colors.bg,
              color: colors.text,
              border: `1px solid ${colors.border}`,
            }}
          >
            {subject}
          </span>
        ))}
      </div>
    </div>
  );
}
