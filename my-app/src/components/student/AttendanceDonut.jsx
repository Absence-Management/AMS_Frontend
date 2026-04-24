"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function AttendanceDonut({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const pct =
    total > 0
      ? Math.round((data.reduce((s, d) => s + d.attended, 0) / total) * 100)
      : 0;

  return (
    <div
      style={{ position: "relative", width: 120, height: 120, flexShrink: 0 }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={38}
            outerRadius={56}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
            strokeWidth={0}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(v, n, p) => [
              `${p.payload.attended}/${p.payload.total}`,
              p.payload.subject,
            ]}
            contentStyle={{ fontSize: 11, borderRadius: 6 }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          lineHeight: 1.2,
        }}
      >
        <p
          style={{ fontSize: 14, fontWeight: 700, color: "#222529", margin: 0 }}
        >
          {pct}%
        </p>
        <p
          style={{ fontSize: 11, fontWeight: 500, color: "#8C97A7", margin: 0 }}
        >
          attendance
        </p>
      </div>
    </div>
  );
}
