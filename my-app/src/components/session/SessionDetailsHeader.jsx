"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import QRCode from "react-qr-code";
import { getSessionQRNonce } from "@/services/attendanceService";

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M5 8l2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconQr() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M9 9h2M13 9v2M11 11h2v2M9 13h2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconFace() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M2 5V3.5A1.5 1.5 0 013.5 2H5M11 2h1.5A1.5 1.5 0 0114 3.5V5M14 11v1.5A1.5 1.5 0 0112.5 14H11M5 14H3.5A1.5 1.5 0 012 12.5V11"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="6" cy="7" r="1" fill="currentColor" />
      <circle cx="10" cy="7" r="1" fill="currentColor" />
      <path
        d="M5.5 10.5c.6.8 1.3 1 2.5 1s1.9-.2 2.5-1"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconClose() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// ─── Countdown ring ───────────────────────────────────────────────────────────
// Draws an SVG arc that shrinks from full → empty as `secondsLeft` decreases.

const RING_RADIUS = 18;
const RING_CIRC = 2 * Math.PI * RING_RADIUS; // ≈ 113.1

function CountdownRing({ secondsLeft, totalSeconds = 30 }) {
  const fraction = Math.max(0, secondsLeft / totalSeconds);
  const dashoffset = RING_CIRC * (1 - fraction);
  const isUrgent = secondsLeft <= 8;

  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 48, height: 48 }}>
      <svg width="48" height="48" style={{ transform: "rotate(-90deg)" }}>
        {/* Track */}
        <circle cx="24" cy="24" r={RING_RADIUS} fill="none" stroke="#e3e8ef" strokeWidth="3" />
        {/* Progress */}
        <circle
          cx="24"
          cy="24"
          r={RING_RADIUS}
          fill="none"
          stroke={isUrgent ? "#ef4444" : "#143888"}
          strokeWidth="3"
          strokeDasharray={RING_CIRC}
          strokeDashoffset={dashoffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.9s linear, stroke 0.3s" }}
        />
      </svg>
      <span
        style={{
          position: "absolute",
          fontSize: 13,
          fontWeight: 600,
          color: isUrgent ? "#ef4444" : "#143888",
          lineHeight: 1,
        }}
      >
        {secondsLeft}
      </span>
    </div>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MODES = [
  { key: "manual", label: "Manual", Icon: IconCheck },
  { key: "qr", label: "QR Code", Icon: IconQr },
  { key: "facial", label: "Facial", Icon: IconFace },
];

/** How often (ms) the frontend asks for a fresh nonce. Must be < 30 s. */
const REFRESH_INTERVAL_MS = 25_000;

// ─── Component ────────────────────────────────────────────────────────────────

export default function SessionDetailsHeader({ session, onQrClose }) {
  const [activeMode, setActiveMode] = useState("manual");
  const [isQrOpen, setIsQrOpen] = useState(false);

  // Nonce state
  const [qrPayload, setQrPayload] = useState(null); // { session_id, nonce }
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshTimerRef = useRef(null);
  const countdownTimerRef = useRef(null);

  const sessionLabel = [session.title, session.group].filter(Boolean).join(" ");

  // ── Fetch nonce ────────────────────────────────────────────────────────────
  const fetchNonce = useCallback(async () => {
    if (!session?.id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getSessionQRNonce(session.id);
      // data = { session_id, nonce, expires_at, ttl_seconds }
      setQrPayload({ session_id: data.session_id, nonce: data.nonce });
      // Prefer backend-reported TTL, cap at 30 s
      const ttl = Math.min(data.ttl_seconds ?? 30, 30);
      setSecondsLeft(ttl);
    } catch (err) {
      console.error("Failed to fetch QR nonce:", err);
      setError("Could not load QR code. Please try refreshing.");
    } finally {
      setIsLoading(false);
    }
  }, [session?.id]);

  // ── Start / stop polling when modal opens / closes ────────────────────────
  useEffect(() => {
    if (!isQrOpen) {
      clearInterval(refreshTimerRef.current);
      clearInterval(countdownTimerRef.current);
      setQrPayload(null);
      setSecondsLeft(30);
      return;
    }

    // Immediate first fetch
    fetchNonce();

    // Auto-refresh nonce every 25 s
    refreshTimerRef.current = setInterval(fetchNonce, REFRESH_INTERVAL_MS);

    // Countdown tick every 1 s
    countdownTimerRef.current = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1_000);

    return () => {
      clearInterval(refreshTimerRef.current);
      clearInterval(countdownTimerRef.current);
    };
  }, [isQrOpen, fetchNonce]);

  // Reset countdown whenever a fresh nonce arrives (fetchNonce sets secondsLeft)
  // (already done inside fetchNonce via setSecondsLeft)

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleModeClick = (modeKey) => {
    setActiveMode(modeKey);
    if (modeKey === "qr") setIsQrOpen(true);
  };

  const handleManualRefresh = () => {
    clearInterval(countdownTimerRef.current);
    fetchNonce().then(() => {
      countdownTimerRef.current = setInterval(() => {
        setSecondsLeft((s) => Math.max(0, s - 1));
      }, 1_000);
    });
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="main-header">
      <div className="main-header-text">
        <h2 className="main-title">{sessionLabel}</h2>
        <p className="main-subtitle">
          {new Date().toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="flex gap-3 items-center">
        {MODES.map(({ key, label, Icon }) => {
          const isActive = activeMode === key;
          return (
            <button
              key={key}
              onClick={() => handleModeClick(key)}
              className={`flex gap-1.5 h-9 items-center justify-center px-3 text-[14px] tracking-[0.14px] rounded-lg ${
                isActive
                  ? "bg-[#f8faff] border border-[#143888] text-[#143888]"
                  : "bg-white border border-[#e3e8ef] text-black/20"
              }`}
            >
              <Icon />
              {label}
            </button>
          );
        })}
      </div>

      {/* ── QR Modal ─────────────────────────────────────────────────────── */}
      {isQrOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md"
          onClick={() => {
            setIsQrOpen(false);
            if (onQrClose) onQrClose();
          }}
        >
          <div
            className="relative w-full max-w-xs rounded-xl border border-[#e3e8ef] bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              type="button"
              onClick={() => {
                setIsQrOpen(false);
                if (onQrClose) onQrClose();
              }}
              className="absolute right-4 top-4 text-[#6b7280] hover:text-[#143888]"
              aria-label="Close QR modal"
            >
              <IconClose />
            </button>

            {/* Heading */}
            <h3 className="text-2xl font-semibold text-[#101828] leading-tight">
              QR Code Attendance
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-[#6b7280]">
              Students scan this with their mobile app to mark themselves present.
            </p>

            {/* QR area */}
            <div className="mt-5 flex justify-center">
              <div className="rounded-xl border border-dashed border-[#b7c3ea] p-4 text-[#6f84be]">
                {isLoading && !qrPayload ? (
                  <div
                    style={{
                      width: 200,
                      height: 200,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#6b7280",
                      fontSize: 14,
                    }}
                  >
                    Generating code…
                  </div>
                ) : error ? (
                  <div
                    style={{
                      width: 200,
                      height: 200,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ef4444",
                      fontSize: 13,
                      textAlign: "center",
                      padding: "0 12px",
                    }}
                  >
                    {error}
                  </div>
                ) : qrPayload ? (
                  <QRCode
                    value={JSON.stringify(qrPayload)}
                    size={200}
                    level="H"
                    fgColor="#143888"
                  />
                ) : null}
              </div>
            </div>

            {/* Countdown + status */}
            <div className="mt-4 flex items-center justify-between px-1">
              <p className="text-sm text-[#6b7280]">
                {error
                  ? "Failed to load nonce"
                  : isLoading
                  ? "Refreshing…"
                  : "Code refreshes automatically"}
              </p>
              {!error && <CountdownRing secondsLeft={secondsLeft} totalSeconds={30} />}
            </div>

            {/* Manual refresh */}
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={handleManualRefresh}
                disabled={isLoading}
                className="h-10 rounded-lg border border-[#d7deea] bg-white px-4 text-sm text-[#475467] hover:bg-[#f8faff] disabled:opacity-50"
              >
                {isLoading ? "Refreshing…" : "Refresh now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
