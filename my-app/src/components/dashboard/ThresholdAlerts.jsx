import React from "react";

function Avatar({ initials, bgColor }) {
  return (
    <div
      className={`size-8 rounded-full flex items-center justify-center text-white text-[0.75rem] font-medium shrink-0 ${bgColor}`}
    >
      {initials}
    </div>
  );
}

export default function ThresholdAlerts({ alerts }) {
  return (
    <div className="bg-white border border-[#e3e8ef] rounded-[0.625rem] flex flex-col h-full font-inter overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#e3e8ef] bg-white">
        <h2 className="text-[0.9375rem] font-medium text-[#030712] font-poppins">Threshold alerts</h2>
        <span className="text-[0.75rem] font-medium text-[#d62525] bg-[#fef2f2] px-2 py-1 rounded-[0.5rem]">
          {alerts.length}
        </span>
      </div>

      <div className="flex flex-col p-2 flex-grow overflow-y-auto">
        {alerts.map((alert, i) => {
          const isOverLimit = alert.count >= alert.limit;
          const statusColor = isOverLimit ? "text-[#d62525]" : "text-[#d97706]";
          const avatarBg = isOverLimit ? "bg-[#d62525]" : "bg-[#d97706]";

          return (
            <div key={i} className="flex items-center justify-between p-3 border-b border-[#e3e8ef] last:border-b-0">
              <div className="flex items-center gap-3">
                <Avatar initials={alert.initials} bgColor={avatarBg} />
                <div>
                  <h4 className="text-[0.875rem] font-medium text-[#030712] mb-0.5">{alert.name}</h4>
                  <p className="text-[0.75rem] text-[#4a5567]">{alert.subject}</p>
                </div>
              </div>
              <div className={`text-[0.875rem] font-bold ${statusColor}`}>
                {alert.count}/{alert.limit}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
