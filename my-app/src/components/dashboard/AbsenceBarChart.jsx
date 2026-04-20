// ============================================
// AMS — ESI Sidi Bel Abbès
// components/dashboard/AbsenceBarChart.jsx
// ============================================

"use client";

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

// ── Default data (replace with real API data via props) ───────────────────────


// ── Calendar icon ─────────────────────────────────────────────────────────────
const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="1" y="2.5" width="12" height="10.5" rx="1.5" stroke="#6f6f6f" strokeWidth="1.2"/>
    <path d="M1 6h12" stroke="#6f6f6f" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M4 1v3M10 1v3" stroke="#6f6f6f" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

// ── Custom tooltip ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      <p className="chart-tooltip-value">{payload[0].value}%</p>
    </div>
  );
};

// ── Component ─────────────────────────────────────────────────────────────────
/**
 * Props:
 *   data   { [key]: string|number }[]  – chart data
 *   year   string | number             – year shown top-right
 *   title  string                      – chart title
 *   xKey   string                      – key for X-axis (default "level")
 *   yKey   string                      – key for Y-axis (default "absences")
 */
export function AbsenceBarChart({ 
  data = [], 
  year = 2026, 
  title = "Absences",
  xKey = "level",
  yKey = "absences"
}) {
  return (
    <div className="chart-card h-full">

      {/* Header */}
      <div className="chart-header">
        <h3 className="chart-title">{title}</h3>
        <div className="chart-year">
          <span>{year}</span>
          <CalendarIcon />
        </div>
      </div>

      {/* Chart */}
      <div className="flex-grow min-h-0">
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
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Bar dataKey={yKey} radius={[8, 8, 8, 8]} background={{ fill: "#f7f7f7", radius: 8 }}>
              {data.map((entry, index) => (
                <Cell key={index} fill="#143888" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}