"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function TeacherDonut({ data = [], centerLabel, centerSub }) {
  const pctFromData = (() => {
    if (!Array.isArray(data) || data.length === 0) return null;
    const values = data
      .map((d) => Number(d?.pct))
      .filter((v) => Number.isFinite(v));
    if (values.length === 0) return null;

    // Prefer a straightforward average of group-level attendance rates.
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    return avg;
  })();

  const pct =
    typeof centerLabel === "number"
      ? centerLabel
      : typeof centerLabel === "string"
        ? Number(centerLabel.replace("%", ""))
        : pctFromData;

  const pctToShow = Number.isFinite(pct) ? pct : 0;

  return (
    <div className="relative w-[180px] h-[180px] shrink-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={86}
            dataKey="pct"
            startAngle={90}
            endAngle={-270}
            strokeWidth={0}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(v, n, p) => [`${p.payload.pct}%`, p.payload.key]}
            contentStyle={{ fontSize: 11, borderRadius: 6 }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center leading-[1.3]">
        <p className="text-[18px] font-bold text-[#222529] m-0">{pctToShow}%</p>
        <p className="text-[14px] font-medium text-[#8C97A7] m-0">
          {centerSub || "attendance"}
        </p>
      </div>
    </div>
  );
}
