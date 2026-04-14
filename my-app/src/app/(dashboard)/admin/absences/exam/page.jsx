"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";
import DataTable from "@/components/shared/DataTable";
import useDashboardTable from "@/hooks/useDashboardTable";

// ── Mock data ─────────────────────────────────────────────────────────────────

const BAR_DATA = [
  { level: "1CP", rate: 54 },
  { level: "2CP", rate: 65 },
  { level: "1CS", rate: 38 },
  { level: "2CS", rate: 12 },
  { level: "3CS", rate: 48 },
];

const LEVELS = ["All", "1CP", "2CP", "1CS", "2CS", "3CS"];

const TABLE_DATA = [
  { id:  1, subject: "Algorithms",        date: "21 - 03 - 2026", class: "1CP", absence: "10/128" },
  { id:  2, subject: "Algorithms",        date: "21 - 03 - 2026", class: "1CP", absence: "12/128" },
  { id:  3, subject: "Algorithms",        date: "22 - 03 - 2026", class: "1CP", absence: "8/128"  },
  { id:  4, subject: "Mathematics",       date: "22 - 03 - 2026", class: "1CP", absence: "15/128" },
  { id:  5, subject: "Mathematics",       date: "23 - 03 - 2026", class: "1CP", absence: "11/128" },
  { id:  6, subject: "Physics",           date: "23 - 03 - 2026", class: "1CP", absence: "9/128"  },
  { id:  7, subject: "Physics",           date: "24 - 03 - 2026", class: "1CP", absence: "7/128"  },
  { id:  8, subject: "English",           date: "24 - 03 - 2026", class: "1CP", absence: "5/128"  },
  { id:  9, subject: "Algorithms",        date: "21 - 03 - 2026", class: "2CP", absence: "18/132" },
  { id: 10, subject: "Algorithms",        date: "21 - 03 - 2026", class: "2CP", absence: "20/132" },
  { id: 11, subject: "Mathematics",       date: "22 - 03 - 2026", class: "2CP", absence: "14/132" },
  { id: 12, subject: "Mathematics",       date: "22 - 03 - 2026", class: "2CP", absence: "16/132" },
  { id: 13, subject: "Data Structures",   date: "23 - 03 - 2026", class: "2CP", absence: "22/132" },
  { id: 14, subject: "Data Structures",   date: "23 - 03 - 2026", class: "2CP", absence: "19/132" },
  { id: 15, subject: "Physics",           date: "24 - 03 - 2026", class: "2CP", absence: "10/132" },
  { id: 16, subject: "English",           date: "24 - 03 - 2026", class: "2CP", absence: "6/132"  },
  { id: 17, subject: "Operating Systems", date: "21 - 03 - 2026", class: "1CS", absence: "13/140" },
  { id: 18, subject: "Operating Systems", date: "21 - 03 - 2026", class: "1CS", absence: "15/140" },
  { id: 19, subject: "Databases",         date: "22 - 03 - 2026", class: "1CS", absence: "9/140"  },
  { id: 20, subject: "Databases",         date: "22 - 03 - 2026", class: "1CS", absence: "11/140" },
  { id: 21, subject: "Networks",          date: "23 - 03 - 2026", class: "1CS", absence: "7/140"  },
  { id: 22, subject: "Networks",          date: "23 - 03 - 2026", class: "1CS", absence: "8/140"  },
  { id: 23, subject: "Algorithms",        date: "24 - 03 - 2026", class: "1CS", absence: "5/140"  },
  { id: 24, subject: "English",           date: "24 - 03 - 2026", class: "1CS", absence: "4/140"  },
  { id: 25, subject: "AI Fundamentals",   date: "21 - 03 - 2026", class: "2CS", absence: "3/120"  },
  { id: 26, subject: "AI Fundamentals",   date: "21 - 03 - 2026", class: "2CS", absence: "4/120"  },
  { id: 27, subject: "Databases",         date: "22 - 03 - 2026", class: "2CS", absence: "6/120"  },
  { id: 28, subject: "Databases",         date: "22 - 03 - 2026", class: "2CS", absence: "5/120"  },
  { id: 29, subject: "Software Eng.",     date: "23 - 03 - 2026", class: "2CS", absence: "8/120"  },
  { id: 30, subject: "Software Eng.",     date: "23 - 03 - 2026", class: "2CS", absence: "7/120"  },
  { id: 31, subject: "Networks",          date: "24 - 03 - 2026", class: "2CS", absence: "4/120"  },
  { id: 32, subject: "English",           date: "24 - 03 - 2026", class: "2CS", absence: "2/120"  },
  { id: 33, subject: "Machine Learning",  date: "21 - 03 - 2026", class: "3CS", absence: "14/115" },
  { id: 34, subject: "Machine Learning",  date: "21 - 03 - 2026", class: "3CS", absence: "16/115" },
  { id: 35, subject: "Distributed Sys.", date: "22 - 03 - 2026", class: "3CS", absence: "11/115" },
  { id: 36, subject: "Distributed Sys.", date: "22 - 03 - 2026", class: "3CS", absence: "13/115" },
  { id: 37, subject: "Security",          date: "23 - 03 - 2026", class: "3CS", absence: "9/115"  },
  { id: 38, subject: "Security",          date: "23 - 03 - 2026", class: "3CS", absence: "10/115" },
  { id: 39, subject: "Compiler Design",   date: "24 - 03 - 2026", class: "3CS", absence: "7/115"  },
  { id: 40, subject: "English",           date: "24 - 03 - 2026", class: "3CS", absence: "3/115"  },
];

const ABSENCE_RATE = 6.966;

// ── Table columns ─────────────────────────────────────────────────────────────
const COLUMNS = ["Subject", "Date Examen", "Class", "Absence", "Action"];

// ── Gauge chart ───────────────────────────────────────────────────────────────
function AbsenceGauge({ rate }) {
  const pct        = Math.min(Math.max(rate / 100, 0), 1);
  const R          = 65;
  const cx         = 90;
  const cy         = 95;
  const START_DEG  = 135;   // 7 o'clock
  const SWEEP_DEG  = 270;   // 3/4 of a circle

  const toRad = (d) => (d * Math.PI) / 180;

  const startX = cx + R * Math.cos(toRad(START_DEG));
  const startY = cy + R * Math.sin(toRad(START_DEG));
  const endX   = cx + R * Math.cos(toRad(START_DEG + SWEEP_DEG));
  const endY   = cy + R * Math.sin(toRad(START_DEG + SWEEP_DEG));

  const fillDeg  = START_DEG + pct * SWEEP_DEG;
  const fillX    = cx + R * Math.cos(toRad(fillDeg));
  const fillY    = cy + R * Math.sin(toRad(fillDeg));

  const fillLarge = pct * SWEEP_DEG > 180 ? 1 : 0;

  const needleLen  = 50;
  const needleTipX = cx + needleLen * Math.cos(toRad(fillDeg));
  const needleTipY = cy + needleLen * Math.sin(toRad(fillDeg));

  return (
    <svg width="200" height="180" viewBox="0 0 180 170" fill="none">
      {/* Background track (full 270°) */}
      <path
        d={`M ${startX} ${startY} A ${R} ${R} 0 1 1 ${endX} ${endY}`}
        fill="none"
        stroke="#E8F0FE"
        strokeWidth="14"
        strokeLinecap="round"
      />
      {/* Green filled arc */}
      {pct > 0 && (
        <path
          d={`M ${startX} ${startY} A ${R} ${R} 0 ${fillLarge} 1 ${fillX} ${fillY}`}
          fill="none"
          stroke="#27AF5D"
          strokeWidth="14"
          strokeLinecap="round"
        />
      )}
      {/* Needle */}
      <line
        x1={cx} y1={cy}
        x2={needleTipX} y2={needleTipY}
        stroke="#27AF5D"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Center hub */}
      <circle cx={cx} cy={cy} r="8" fill="#27AF5D" />
      <circle cx={cx} cy={cy} r="4" fill="#fff" />
    </svg>
  );
}

// ── Custom Y-axis tick ────────────────────────────────────────────────────────
function YTick({ x, y, payload }) {
  return (
    <text x={x} y={y} dy={4} textAnchor="end" fontSize={12} fill="#000">
      {payload.value}%
    </text>
  );
}

// ── Dots action button ────────────────────────────────────────────────────────
function DotsBtn() {
  return (
    <button className="admin-data-table__action-btn" title="More options">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <circle cx="6" cy="2"  r="1" fill="#4A5567" />
        <circle cx="6" cy="6"  r="1" fill="#4A5567" />
        <circle cx="6" cy="10" r="1" fill="#4A5567" />
      </svg>
    </button>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ExamAbsencesPage() {
  const [activeLevel, setActiveLevel] = useState("All");

  // Filter table data by active level
  const filteredData =
    activeLevel === "All"
      ? TABLE_DATA
      : TABLE_DATA.filter((r) => r.class === activeLevel);

  // ── Table state via shared hook ───────────────────────────────────────────
  const {
    searchQuery,
    handleSearch,
    page,
    setPage,
    pagedItems,
    totalCount,
  } = useDashboardTable({
    items: filteredData,
    searchFields: ["subject", "class"],
    pageSize: 7,
  });

  // ── Render rows ───────────────────────────────────────────────────────────
  const rows = pagedItems.map((row) => (
    <div key={row.id} className="exam-abs__table-row">
      <span className="admin-data-table__text-cell">{row.subject}</span>
      <span className="admin-data-table__text-cell">{row.date}</span>
      <span className="admin-data-table__text-cell">{row.class}</span>
      <span className="admin-data-table__text-cell">{row.absence}</span>
      <div className="admin-data-table__cell--action">
        <DotsBtn />
      </div>
    </div>
  ));

  return (
    <div className="main-page attendance-page" style={{ gap: 40 }}>

      {/* ── Header ── */}
      <div className="main-header">
        <div className="main-header-text">
          <h2 className="main-title">Exam Absences</h2>
          <p className="main-subtitle">
            Monitor student absences during examinations
          </p>
        </div>

        <div className="exam-abs__header-right">
          {/* Level filter tabs */}
          <div className="exam-abs__level-tabs">
            {LEVELS.map((lvl) => (
              <button
                key={lvl}
                type="button"
                className={`exam-abs__level-tab${
                  activeLevel === lvl ? " exam-abs__level-tab--active" : ""
                }`}
                onClick={() => setActiveLevel(lvl)}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Schedule exams button */}
          <button className="exam-abs__schedule-btn">
            Schedule exams
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2"  y="1"  width="12" height="13" rx="1.5" stroke="white" strokeWidth="1.2" />
              <line x1="5"  y1="1"  x2="5"  y2="4"  stroke="white" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="11" y1="1"  x2="11" y2="4"  stroke="white" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="2"  y1="6.5" x2="14" y2="6.5" stroke="white" strokeWidth="1.2" />
              <line x1="5.5"  y1="9.5"  x2="5.5"  y2="9.5"  stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="8"    y1="9.5"  x2="8"    y2="9.5"  stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="10.5" y1="9.5"  x2="10.5" y2="9.5"  stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="5.5"  y1="12"   x2="5.5"  y2="12"   stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="8"    y1="12"   x2="8"    y2="12"   stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Charts row ── */}
      <div className="exam-charts-grid ">

        {/* Bar chart card */}
        <div className="chart-card exam-abs__bar-card">
          <div className="chart-header">
            <span className="chart-title">Absences by Subject</span>
            <span className="chart-year">
              2026
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <rect x="3"  y="4"  width="18" height="18" rx="2" stroke="#6F6F6F" strokeWidth="1.5" />
                <line x1="3"  y1="9"  x2="21" y2="9"  stroke="#6F6F6F" strokeWidth="1.5" />
                <line x1="8"  y1="2"  x2="8"  y2="6"  stroke="#6F6F6F" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="16" y1="2"  x2="16" y2="6"  stroke="#6F6F6F" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={BAR_DATA} barCategoryGap="28%" barGap={2}>
              <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#F1F1F1" />
              <XAxis dataKey="level" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <YAxis
                domain={[0, 80]}
                ticks={[0, 20, 40, 60, 80]}
                tick={<YTick />}
                axisLine={false}
                tickLine={false}
                width={32}
              />
              <Bar dataKey="rate" radius={[8, 8, 8, 8]} background={{ radius: [8, 8, 8, 8], fill: "#F7F7F7" }}>
                {BAR_DATA.map((entry) => (
                  <Cell
                    key={entry.level}
                    fill={
                      activeLevel === "All" || activeLevel === entry.level
                        ? "#143888"
                        : "#D0D9F0"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Absence rate card */}
        <div className="chart-card exam-abs__rate-card">
          <div className="chart-header">
            <span className="chart-title exam-abs__rate-title">
              Absence Rate this session
            </span>
            <span className="exam-abs__rate-pct">{ABSENCE_RATE.toFixed(3)} %</span>
          </div>
          <div className="exam-abs__gauge-container">
            <AbsenceGauge rate={ABSENCE_RATE} />
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <DataTable
        title="Absences from exams"
        count={totalCount}
        showHead
        showColumnHeaders
        columns={COLUMNS}
        headerClass="exam-abs__table-header"
        searchQuery={searchQuery}
        onSearch={handleSearch}
        showSearch={true}
        placeholder="Search by subject or class…"
        showDefaultTools={false}
        emptyMessage="No exam absences found."
        // pagination
        rowLabel="students"
        page={page}
        pageSize={7}
        totalCount={totalCount}
        onPageChange={setPage}
      >
        {rows}
      </DataTable>

    </div>
  );
}