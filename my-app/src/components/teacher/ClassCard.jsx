"use client";

const YEAR_COLORS = {
  "1CP": { bg: "#EBEFFE", color: "#143888" },
  "2CP": { bg: "#E7F6EF", color: "#069855" },
  "1CS": { bg: "#EBE4FE", color: "#6B39F8" },
  "2CS": { bg: "#FFF3E0", color: "#FF9800" },
  "3CS": { bg: "#FCE4EC", color: "#E91E63" },
};

export default function ClassCard({ subject, year, groups = [] }) {
  const yearStyle = YEAR_COLORS[year] || { bg: "#f1f5f9", color: "#64748b" };
  return (
    <div className="box-border flex flex-col bg-white border border-black/10 rounded-[8px] flex-1 min-w-0">
      <div className="flex flex-row justify-between items-center px-4 py-[10px] bg-white">
        <span className="text-[12px] font-medium text-black">{subject}</span>
        <span
          className="px-2 py-[2px] rounded-[4px] text-[12px] font-normal"
          style={{ background: yearStyle.bg, color: yearStyle.color }}
        >
          {year}
        </span>
      </div>
      <div className="flex flex-row flex-wrap px-4 py-[10px] gap-[6px] border-t border-b border-black/10 ">
        {groups.map((g) => (
          <span
            key={g}
            className="px-2 py-0.5 border border-black/10 rounded-[60px] text-[12px] font-[Inter,sans-serif]"
          >
            {g}
          </span>
        ))}
      </div>

      <div className="px-2.5 py-4 ">
        <button className="flex items-center gap-1 px-2 border border-black/10 rounded bg-transparent cursor-pointer text-sm text-gray-950">
          See details
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.99967 4.43347C5.99967 4.43347 10.6252 4.07165 11.2766 4.72301C11.928 5.37437 11.5661 9.99992 11.5661 9.99992M10.9997 4.99992L4.33301 11.6666"
              stroke="#030712"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
