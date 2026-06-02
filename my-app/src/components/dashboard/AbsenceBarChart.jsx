// ============================================
// AMS — ESI Sidi Bel Abbès
// components/dashboard/AbsenceBarChart.jsx
// ============================================

"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// ── Calendar icon ─────────────────────────────────────────────────────────────
const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="1" y="2.5" width="12" height="10.5" rx="1.5" stroke="#6f6f6f" strokeWidth="1.2"/>
    <path d="M1 6h12" stroke="#6f6f6f" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M4 1v3M10 1v3" stroke="#6f6f6f" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

// ── Custom tooltip ────────────────────────────────────────────────────────────
/**
 * labelKey: when set, the tooltip title is taken from payload[0].payload[labelKey]
 * instead of the X-axis tick value ("label").
 */
const CustomTooltip = ({ active, payload, label, labelKey }) => {
  if (!active || !payload?.length) return null;
  const title = labelKey ? (payload[0]?.payload?.[labelKey] ?? label) : label;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{title}</p>
      <p className="chart-tooltip-value">{payload[0].value.toFixed(1)}%</p>
    </div>
  );
};

// ── Component ─────────────────────────────────────────────────────────────────
/**
 * Props:
 *   data          { [key]: string|number }[]  – chart data
 *   selectedYear  number                      – controlled year for the selector
 *   onYearChange  (year: number) => void      – called when user picks a different year
 *   title         string                      – chart title
 *   xKey          string                      – key for X-axis (default "level")
 *   yKey          string                      – key for Y-axis (default "absences")
 *   labelKey      string|null                 – key whose value is shown as tooltip title instead of the x-axis tick
 *   typeKey       string|null                 – when set, bars whose entry[typeKey] === "justified" get a green colour
 *   loading       bool                        – dims chart while fetching
 */
export function AbsenceBarChart({
  data = [],
  selectedYear,
  onYearChange,
  title = "Absences",
  xKey = "level",
  yKey = "absences",
  labelKey = null,
  typeKey = null,
  loading = false,
}) {
  const [open, setOpen] = useState(false);
  const CURRENT_YEAR = new Date().getFullYear();
  // Offer the last 5 academic ending-years (e.g. 2022 → 2026)
  const YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i);
  const displayYear = selectedYear ?? CURRENT_YEAR;

  const handleSelect = (y) => {
    setOpen(false);
    if (onYearChange && y !== displayYear) onYearChange(y);
  };

  return (
    <div className="chart-card h-full">

      {/* Header */}
      <div className="chart-header">
        <h3 className="chart-title">{title}</h3>

        {/* Year selector */}
        <div style={{ position: "relative" }}>
          <button
            id="bar-chart-year-btn"
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
      <div
        className="flex-grow min-h-0"
        style={{ opacity: loading ? 0.45 : 1, transition: "opacity 0.2s" }}
      >
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={data}
            margin={{ top: 8, right: 0, left: -10, bottom: 0 }}
            barCategoryGap="26%"
          >
            <CartesianGrid
              vertical={false}
              stroke="#f0f0f0"
              strokeDasharray=""
            />
            <XAxis
              dataKey={xKey}
              axisLine={false}
              tickLine={false}
              tick={{ fontFamily: "Inter, sans-serif", fontSize: 12, fill: "#000" }}
            />
            <YAxis
              tickFormatter={(v) => `${v}%`}
              axisLine={false}
              tickLine={false}
              tick={{ fontFamily: "Inter, sans-serif", fontSize: 12, fill: "#000" }}
              domain={[0, 80]}
              ticks={[0, 20, 40, 60, 80]}
            />
            <Tooltip content={<CustomTooltip labelKey={labelKey} />} cursor={false} />
            <Bar dataKey={yKey} radius={[8, 8, 8, 8]} background={{ fill: "#f7f7f7", radius: 8 }}>
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={typeKey && entry[typeKey] === "justified" ? "#22c55e" : "#143888"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}