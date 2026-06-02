// ============================================
// AMS — ESI Sidi Bel Abbès
// components/dashboard/MonthlyTrendChart.jsx
// ============================================

"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ── Calendar icon ─────────────────────────────────────────────────────────────
const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="1" y="2.5" width="12" height="10.5" rx="1.5" stroke="#6f6f6f" strokeWidth="1.2"/>
    <path d="M1 6h12" stroke="#6f6f6f" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M4 1v3M10 1v3" stroke="#6f6f6f" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

// ── Custom dot ────────────────────────────────────────────────────────────────
const CustomDot = (props) => {
  const { cx, cy } = props;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={5}
      fill="#ffffff"
      stroke="#e0161a"
      strokeWidth={2}
    />
  );
};

// ── Custom tooltip ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      <p className="chart-tooltip-value" style={{ color: "#e0161a" }}>
        {payload[0].value} absences
      </p>
    </div>
  );
};

// ── Component ─────────────────────────────────────────────────────────────────
/**
 * Props:
 *   data          { month: string, absences: number }[]  – chart data
 *   selectedYear  number                                 – controlled year for selector
 *   onYearChange  (year: number) => void                 – fires when user picks a year
 *   loading       bool                                   – dims chart while fetching
 */
export function MonthlyTrendChart({
  data = [],
  selectedYear,
  onYearChange,
  loading = false,
}) {
  const [open, setOpen] = useState(false);
  const CURRENT_YEAR = new Date().getFullYear();
  const YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i);
  const displayYear = selectedYear ?? CURRENT_YEAR;

  const handleSelect = (y) => {
    setOpen(false);
    if (onYearChange && y !== displayYear) onYearChange(y);
  };

  // Dynamic Y-axis domain — round up to nearest 20 above max value
  const maxAbsences = data.length ? Math.max(...data.map((d) => d.absences)) : 80;
  const yMax = Math.ceil(Math.max(maxAbsences, 20) / 20) * 20;
  const yTicks = Array.from({ length: yMax / 20 + 1 }, (_, i) => i * 20);

  return (
    <div className="chart-card">

      {/* Header */}
      <div className="chart-header">
        <h3 className="chart-title">Monthly Absence Trends</h3>

        {/* Year selector */}
        <div style={{ position: "relative" }}>
          <button
            id="line-chart-year-btn"
            className="chart-year"
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={open}
            style={{ background: "none", border: "none", padding: 0, display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            <span>{displayYear - 1}–{displayYear}</span>
            <CalendarIcon />
            {/* Tiny chevron */}
            <svg
              width="8" height="5" viewBox="0 0 8 5" fill="none"
              style={{ marginLeft: 4, transition: "transform 0.15s", transform: open ? "rotate(180deg)" : "none" }}
            >
              <path d="M1 1l3 3 3-3" stroke="#6f6f6f" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {open && (
            <ul
              role="listbox"
              aria-label="Select academic year"
              style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                right: 0,
                zIndex: 50,
                minWidth: 100,
                margin: 0,
                padding: "4px 0",
                listStyle: "none",
                background: "#fff",
                border: "1px solid #e3e8ef",
                borderRadius: 8,
                boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
              }}
            >
              {YEAR_OPTIONS.map((y) => (
                <li
                  key={y}
                  role="option"
                  aria-selected={y === displayYear}
                  onClick={() => handleSelect(y)}
                  style={{
                    padding: "6px 14px",
                    fontSize: "0.75rem",
                    fontWeight: y === displayYear ? 600 : 400,
                    color: y === displayYear ? "#143888" : "#374151",
                    background: y === displayYear ? "#eaf0ff" : "transparent",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) => {
                    if (y !== displayYear) e.currentTarget.style.background = "#f5f7ff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = y === displayYear ? "#eaf0ff" : "transparent";
                  }}
                >
                  {y - 1}–{y}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Chart */}
      <div style={{ opacity: loading ? 0.45 : 1, transition: "opacity 0.2s" }}>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart
            data={data}
            margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
          >
            <CartesianGrid vertical={false} stroke="#f0f0f0" strokeDasharray="" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontFamily: "Inter, sans-serif", fontSize: 12, fill: "#000" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontFamily: "Inter, sans-serif", fontSize: 12, fill: "#000" }}
              domain={[0, yMax]}
              ticks={yTicks}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="absences"
              stroke="#e0161a"
              strokeWidth={2}
              dot={<CustomDot />}
              activeDot={{ r: 6, fill: "#e0161a", stroke: "#fff", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}