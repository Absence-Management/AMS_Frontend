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

const TABLE_DATA = [
  { id: 1, subject: "Algorithms",   date: "21 - 03 - 2026", class: "1CP", absence: "10/126" },
  { id: 2, subject: "Algorithms",   date: "21 - 03 - 2026", class: "1CP", absence: "10/126" },
  { id: 3, subject: "Algorithms",   date: "21 - 03 - 2026", class: "1CP", absence: "10/126" },
  { id: 4, subject: "Algorithms",   date: "21 - 03 - 2026", class: "1CP", absence: "10/126" },
  { id: 5, subject: "Algorithms",   date: "21 - 03 - 2026", class: "1CP", absence: "10/126" },
  { id: 6, subject: "Algorithms",   date: "21 - 03 - 2026", class: "1CP", absence: "10/126" },
];

const ABSENCE_RATE = 30;

// ── Table columns ─────────────────────────────────────────────────────────────
const COLUMNS = ["Subject", "Date Examen", "Class", "Absence", "Action"];

// ── Gauge chart ───────────────────────────────────────────────────────────────
function AbsenceGauge({ rate }) {
  const pct      = Math.min(rate / 100, 1);
  const R        = 90;
  const cx       = 110;
  const cy       = 110;
  const arcAngle = Math.PI - pct * Math.PI;

  const bgX1       = cx - R;
  const bgX2       = cx + R;
  const fillX2     = cx + R * Math.cos(arcAngle);
  const fillY2     = cy - R * Math.sin(arcAngle);
  const needleTipX = cx + 70 * Math.cos(arcAngle);
  const needleTipY = cy - 70 * Math.sin(arcAngle);

  return (
    <svg width="180" height="180" viewBox="10 10 220 130" fill="none">
      <path
        d={`M ${bgX1} ${cy} A ${R} ${R} 0 0 1 ${bgX2} ${cy}`}
        fill="none" stroke="#e8f0fe" strokeWidth="20" strokeLinecap="round"
      />
      <path
        d={`M ${bgX1} ${cy} A ${R} ${R} 0 0 1 ${fillX2} ${fillY2}`}
        fill="none" stroke="#27AF5D" strokeWidth="20" strokeLinecap="round"
      />
      <line x1={cx} y1={cy} x2={needleTipX} y2={needleTipY}
        stroke="#27AF5D" strokeWidth="3.5" strokeLinecap="round" />
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

  // ── Table state via shared hook ───────────────────────────────────────────
  const {
    searchQuery,
    handleSearch,
    page,
    setPage,
    pagedItems,
    totalCount,
  } = useDashboardTable({
    items: TABLE_DATA,
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

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>


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
      <div className="charts-grid">

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

          <ResponsiveContainer width="100%" height={240}>
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
          </div>
          <div className="exam-abs__gauge-container">
            <span className="exam-abs__rate-value">{ABSENCE_RATE} %</span>
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