// ============================================
// AMS — ESI Sidi Bel Abbès
// components/shared/Modal.jsx
// ============================================
"use client";
import Image from "next/image";

export function Modal({
  title,
  message,
  subMessage,
  iconSrc,
  buttonText,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md">
      <div className="flex flex-col justify-around bg-white rounded-2xl shadow-lg border border-[#143888]/10 p-12 max-w-1/3 h-1/2 w-full mx-4 text-center">
        {/* Text */}
        <h2 className="text-3xl font-medium text-[#143888] mb-3 tracking-wide">
          {title}
        </h2>
        <p className="text-[#A4A1A1] font-light text-[16px] mb-2 leading-relaxed">
          {message}
        </p>
        {subMessage && (
          <p className="text-[#A4A1A1] font-light text-[14px] mb-8">
            {subMessage}
          </p>
        )}
        {/* Icon */}
        <div className="flex items-center justify-center mb-6">
          <Image src={iconSrc} alt="Check" width={172} height={172} />
        </div>
        {/* Button */}
        <button className="btn-primary" onClick={onClose}>
          {buttonText}
        </button>
      </div>
    </div>
  );
}
