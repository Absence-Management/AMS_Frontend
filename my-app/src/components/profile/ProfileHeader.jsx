"use client";

import Link from "next/link";

export default function ProfileHeader({ breadcrumbs, subtitle, onEdit }) {
  return (
    <div className="flex justify-between items-start">
      <div className="main-header-text">
        <h2 className="main-title text-[#4A5567]">
          {breadcrumbs.map((b, i) => (
            <span key={i}>
              {b.href ? (
                <Link href={b.href} className="text-[#4A5567] no-underline hover:underline">
                  {b.label}
                </Link>
              ) : (
                <span className="main-title text-[#143888]">{b.label}</span>
              )}
              {i < breadcrumbs.length - 1 && " > "}
            </span>
          ))}
        </h2>
        <p className="main-subtitle">{subtitle}</p>
      </div>

      <button
        onClick={onEdit}
        className="flex items-center gap-[6px] px-[14px] py-[6px] bg-[#F8FAFF] border border-black/10 rounded-[8px] text-[14px] text-[#143888] cursor-pointer hover:bg-[#EEF4FF] transition-colors"
      >
        Edit
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9.45854 2.90639L10.2762 2.0887C10.7278 1.6371 11.46 1.6371 11.9116 2.0887C12.3632 2.5403 12.3632 3.27249 11.9116 3.72409L11.0939 4.54178M9.45854 2.90639L6.40546 5.95948C5.7957 6.56924 5.49081 6.87412 5.28321 7.24565C5.0756 7.61717 4.86673 8.49445 4.66699 9.33333C5.50588 9.1336 6.38315 8.92472 6.75468 8.71712C7.1262 8.50951 7.43108 8.20463 8.04084 7.59487L11.0939 4.54178M9.45854 2.90639L11.0939 4.54178" stroke="#143888" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12.25 7C12.25 9.47487 12.25 10.7123 11.4812 11.4812C10.7123 12.25 9.47487 12.25 7 12.25C4.52513 12.25 3.28769 12.25 2.51884 11.4812C1.75 10.7123 1.75 9.47487 1.75 7C1.75 4.52513 1.75 3.28769 2.51884 2.51884C3.28769 1.75 4.52513 1.75 7 1.75" stroke="#143888" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}
