"use client";

const GRADE_ROWS = [
  { semester: "1CP", avg: "15.33", min: "15.18", max: "15.55" },
  { semester: "2CP", avg: "14.30", min: "12.26", max: "16.67" },
  { semester: "1CS", avg: null, min: null, max: null },
];

export default function GradesSection({ grades }) {
  const rows = grades && grades.length > 0 ? grades : GRADE_ROWS;
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      background: "#FFFFFF",
      border: "1px solid rgba(0,0,0,0.1)",
      borderRadius: 8,
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: "12px 16px",
        borderBottom: "1px solid #E3E8EF",
        borderRadius: "8px 8px 0 0",
      }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#000", lineHeight: "17px" }}>
          Student&apos;s Grades
        </span>
      </div>

      {/* Body */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        padding: "11px 16px",
        gap: 15,
        borderRadius: 8,
      }}>
        {rows.map((row, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {/* Separator before every row except the first */}
            {i > 0 && (
              <div style={{ border: "1px solid rgba(0,0,0,0.1)", marginBottom: 7 }} />
            )}

            {/* Label + average */}
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: "rgba(0,0,0,0.7)", lineHeight: "100%" }}>
                {row.semester} :
              </span>
              <span style={{ fontSize: 14, fontWeight: 500, color: "rgba(0,0,0,0.7)", lineHeight: "100%" }}>
                {row.avg ?? "—"}
              </span>
            </div>

           
            {(row.min || row.max) && (
              <div style={{ display: "flex", flexDirection: "row", alignItems: "baseline", gap: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 400, color: "rgba(0,0,0,0.4)", lineHeight: "100%" }}>
                  {row.min}
                </span>
                <span style={{ fontSize: 12, fontWeight: 400, color: "rgba(0,0,0,0.4)", lineHeight: "100%" }}>
                  -
                </span>
                <span style={{ fontSize: 12, fontWeight: 400, color: "rgba(0,0,0,0.4)", lineHeight: "100%" }}>
                  {row.max}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
