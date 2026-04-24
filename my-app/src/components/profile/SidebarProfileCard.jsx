"use client";

export default function SidebarProfileCard({ 
  name, 
  subtext, 
  email, 
  idLabel, 
  idValue, 
  avatarUrl, 
  initials,
  onEditAvatar 
}) {
  return (
    <div className="box-border flex flex-col items-center p-5 gap-5 w-[210px] shrink-0 bg-white border border-black/10 rounded-[8px]">
      {/* Avatar */}
      <div className="relative w-[106px] h-[106px]">
        <div className="w-[106px] h-[106px] rounded-full bg-[linear-gradient(135deg,#c3d4f5_0%,#94b4ee_100%)] flex items-center justify-center overflow-hidden">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-[36px] font-bold text-[#143888]">
              {initials}
            </span>
          )}
        </div>

        <button 
          onClick={onEditAvatar}
          className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[linear-gradient(180deg,#3264D2_0%,#143888_100%)] flex items-center justify-center cursor-pointer border-2 border-white p-0 hover:opacity-90 transition-opacity"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
          >
            <path
              d="M9.45854 2.90639L10.2762 2.0887C10.7278 1.6371 11.46 1.6371 11.9116 2.0887C12.3632 2.5403 12.3632 3.27249 11.9116 3.72409L11.0939 4.54178M9.45854 2.90639L6.40546 5.95948C5.7957 6.56924 5.49081 6.87412 5.28321 7.24565C5.0756 7.61717 4.86673 8.49445 4.66699 9.33333C5.50588 9.1336 6.38315 8.92472 6.75468 8.71712C7.1262 8.50951 7.43108 8.20463 8.04084 7.59487L11.0939 4.54178M9.45854 2.90639L11.0939 4.54178"
              stroke="white"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12.25 7C12.25 9.47487 12.25 10.7123 11.4812 11.4812C10.7123 12.25 9.47487 12.25 7 12.25C4.52513 12.25 3.28769 12.25 2.51884 11.4812C1.75 10.7123 1.75 9.47487 1.75 7C1.75 4.52513 1.75 3.28769 2.51884 2.51884C3.28769 1.75 4.52513 1.75 7 1.75"
              stroke="white"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-5 w-full items-start">
        <div className="flex flex-col gap-2 w-full text-center">
          <span className="text-[18px] font-bold text-black break-words">
            {name}
          </span>
          <span className="text-[12px] text-black/40">{subtext}</span>
          <span className="text-[12px] text-black/40 break-all">{email}</span>
        </div>
        <div className="w-full text-center">
          <span className="text-[12px] text-black/40">
            {idLabel} : {idValue || "—"}
          </span>
        </div>
      </div>
    </div>
  );
}
