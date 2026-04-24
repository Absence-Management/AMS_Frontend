"use client";

import { useState, useEffect, useRef } from "react";

export default function ProfileDropdownCard({ 
  label, 
  value, 
  options, 
  onSave, 
  icon 
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const ref = useRef(null);
  
  const cfg = options.find((o) => o.value === value) || options[0];

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleSelect(option) {
    setOpen(false);
    setSaving(true);
    await onSave(option.value);
    setSaving(false);
  }

  return (
    <div
      ref={ref}
      className="box-border flex flex-col items-start p-3 gap-[6px] flex-1 bg-white border border-black/10 rounded-[10px] relative min-w-0"
    >
      <div className="flex items-center gap-1.5 w-full">
        {icon || (
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
          >
            <circle cx="7" cy="7" r="6" stroke="#999999" strokeDasharray="4 4" />
          </svg>
        )}

        <span className="text-[14px] text-[#999999] flex-1">{label}</span>
        <button
          onClick={() => setOpen((o) => !o)}
          className="bg-transparent border-0 p-0 cursor-pointer flex"
          title={`Edit ${label.toLowerCase()}`}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
          >
            <path
              d="M9.45854 2.90639L10.2762 2.0887C10.7278 1.6371 11.46 1.6371 11.9116 2.0887C12.3632 2.5403 12.3632 3.27249 11.9116 3.72409L11.0939 4.54178M9.45854 2.90639L6.40546 5.95948C5.7957 6.56924 5.49081 6.87412 5.28321 7.24565C5.0756 7.61717 4.86673 8.49445 4.66699 9.33333C5.50588 9.1336 6.38315 8.92472 6.75468 8.71712C7.1262 8.50951 7.43108 8.20463 8.04084 7.59487L11.0939 4.54178M9.45854 2.90639L11.0939 4.54178"
              stroke="#999999"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12.25 7C12.25 9.47487 12.25 10.7123 11.4812 11.4812C10.7123 12.25 9.47487 12.25 7 12.25C4.52513 12.25 3.28769 12.25 2.51884 11.4812C1.75 10.7123 1.75 9.47487 1.75 7C1.75 4.52513 1.75 3.28769 2.51884 2.51884C3.28769 1.75 4.52513 1.75 7 1.75"
              stroke="#999999"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <span className="text-[16px] font-medium" style={{ color: cfg.color }}>
        {saving ? "Saving…" : cfg.label}
      </span>

      {open && (
        <div className="absolute top-full right-0 z-50 bg-white border border-black/10 rounded-[8px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] min-w-[140px] mt-1 overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt)}
              className="block w-full text-left px-[14px] py-2 border-0 bg-transparent text-[13px] font-medium cursor-pointer"
              style={{ color: opt.color }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f8faff")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
