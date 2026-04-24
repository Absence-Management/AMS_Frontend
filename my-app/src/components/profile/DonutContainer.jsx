"use client";

export default function DonutContainer({ title, children }) {
  return (
    <div className="flex flex-col flex-1 bg-white border border-black/10 rounded-[8px]">
      <div className="px-4 py-3 border-b border-[#E3E8EF] text-[14px] font-semibold text-black">
        {title}
      </div>
      <div className="flex flex-row items-center p-4 gap-[50px]">
        {children}
      </div>
    </div>
  );
}
