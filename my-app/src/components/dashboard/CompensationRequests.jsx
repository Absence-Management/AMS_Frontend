"use client";

import { useState, useEffect, useCallback } from "react";
import {
  fetchCompensationRequests,
  approveCompensationRequest,
  rejectCompensationRequest,
} from "@/services/compensationService";

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconMapPin() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconArrowRight() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function IconRefresh() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_STYLES = {
  PENDING:  { bg: "#fff8ed", color: "#c07c1a", ring: "#f0b84020" },
  APPROVED: { bg: "#ecfdf5", color: "#15803d", ring: "#16a34a20" },
  REJECTED: { bg: "#fef2f2", color: "#dc2626", ring: "#dc262620" },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[String(status).toUpperCase()] || STATUS_STYLES.PENDING;
  return (
    <span style={{
      background: s.bg,
      color: s.color,
      border: `1px solid ${s.ring}`,
      borderRadius: 20,
      padding: "1px 8px",
      fontSize: "0.6875rem",
      fontWeight: 700,
      letterSpacing: "0.02em",
      textTransform: "capitalize",
      whiteSpace: "nowrap",
    }}>
      {String(status).toLowerCase()}
    </span>
  );
}

// ─── Request card ─────────────────────────────────────────────────────────────

function RequestCard({ req, onApprove, onReject }) {
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const isPending = String(req.status).toUpperCase() === "PENDING";

  const handleApprove = async () => {
    setApproving(true);
    try { await onApprove(req.id); } finally { setApproving(false); }
  };

  const handleReject = async () => {
    setRejecting(true);
    try { await onReject(req.id); } finally { setRejecting(false); }
  };

  return (
    <>

      <div style={{
        display: "flex", flexDirection: "column", gap: 10,
        padding: "12px 14px", background: "#fff",
        border: "1px solid #f1f5f9", borderRadius: 10,
        marginBottom: 10, transition: "border-color .15s",
      }}
        onMouseEnter={e => e.currentTarget.style.borderColor = "#e2e8f0"}
        onMouseLeave={e => e.currentTarget.style.borderColor = "#f1f5f9"}
      >
        {/* Row 1 — name + status */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
          <div>
            <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 700, color: "#030712", lineHeight: 1.3 }}>
              {req.studentName || req.student_matricule || "—"}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
              <IconUser />
              <span style={{ fontSize: "0.7375rem", color: "#64748b", fontWeight: 600 }}>
                {req.studentGroup || "—"}
              </span>
              <IconArrowRight />
              <span style={{ fontSize: "0.7375rem", color: "#143888", fontWeight: 700 }}>
                {req.targetGroup || "—"}
              </span>
            </div>
          </div>
          <StatusBadge status={req.status} />
        </div>

        {/* Row 2 — time + room */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {req.time && (
            <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#64748b", fontSize: "0.75rem" }}>
              <IconClock /> {req.time}
            </span>
          )}
          {req.room && (
            <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#64748b", fontSize: "0.75rem" }}>
              <IconMapPin /> {req.room}
            </span>
          )}
          {req.subject && (
            <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{req.subject}</span>
          )}
        </div>

        {/* Row 3 — reason (if present) */}
        {req.reason && (
          <p style={{ margin: 0, fontSize: "0.75rem", color: "#475569", fontStyle: "italic", lineHeight: 1.4 }}>
            "{req.reason}"
          </p>
        )}

        {/* Row 4 — rejection reason (if rejected) */}
        {req.rejection_reason && (
          <p style={{ margin: 0, fontSize: "0.75rem", color: "#dc2626", lineHeight: 1.4 }}>
            Rejected: {req.rejection_reason}
          </p>
        )}

        {/* Row 5 — actions (only for pending) */}
        {isPending && (
          <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
            <button
              onClick={handleReject}
              disabled={approving || rejecting}
              style={{
                flex: 1, padding: "6px 10px", borderRadius: 8,
                border: "1px solid #e2e8f0", background: rejecting ? "#f1f5f9" : "#f8fafc",
                color: "#374151", fontWeight: 700, fontSize: "0.75rem",
                cursor: "pointer", transition: "background .15s",
                opacity: rejecting ? 0.5 : 1,
              }}
            >
              {rejecting ? "…" : "Reject"}
            </button>
            <button
              onClick={handleApprove}
              disabled={approving || rejecting}
              style={{
                flex: 1, padding: "6px 10px", borderRadius: 8,
                border: "1px solid #143888", background: approving ? "#5b7fd1" : "#143888",
                color: "#fff", fontWeight: 700, fontSize: "0.75rem",
                cursor: "pointer", transition: "background .15s",
              }}
            >
              {approving ? "…" : "Approve"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Filter tabs ──────────────────────────────────────────────────────────────

const FILTERS = ["ALL", "PENDING", "APPROVED", "REJECTED"];

function FilterTab({ label, active, count, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "3px 10px", borderRadius: 20,
        border: active ? "1px solid #143888" : "1px solid #e2e8f0",
        background: active ? "#143888" : "transparent",
        color: active ? "#fff" : "#64748b",
        fontSize: "0.6875rem", fontWeight: 700, cursor: "pointer",
        transition: "all .15s",
        display: "flex", alignItems: "center", gap: 4,
      }}
    >
      {label}
      {count != null && (
        <span style={{
          background: active ? "rgba(255,255,255,0.25)" : "#f1f5f9",
          color: active ? "#fff" : "#374151",
          borderRadius: 20, padding: "0 5px", fontSize: "0.625rem", fontWeight: 800,
        }}>{count}</span>
      )}
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CompensationRequests({ sessionId }) {
  const [requests, setRequests] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("ALL");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page: 1, page_size: 50 };
      if (sessionId) params.session_id = sessionId;
      if (filter !== "ALL") params.status = filter;

      const result = await fetchCompensationRequests(params);
      const list = Array.isArray(result) ? result : (result?.data ?? []);
      setRequests(list);
      setTotal(result?.total ?? list.length);
    } catch (err) {
      setError("Failed to load requests");
    } finally {
      setLoading(false);
    }
  }, [sessionId, filter]);

  useEffect(() => { load(); }, [load]);

  const handleApprove = async (id) => {
    await approveCompensationRequest(id);
    // Optimistic: flip status locally, then re-fetch
    setRequests(prev =>
      prev.map(r => r.id === id ? { ...r, status: "APPROVED", approved_at: new Date().toISOString() } : r)
    );
  };

  const handleReject = async (id) => {
    await rejectCompensationRequest(id);
    setRequests(prev =>
      prev.map(r => r.id === id ? { ...r, status: "REJECTED", rejected_at: new Date().toISOString() } : r)
    );
  };

  // Count by status
  const counts = requests.reduce((acc, r) => {
    const k = String(r.status).toUpperCase();
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});

  const pendingCount = counts["PENDING"] || 0;

  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e3e8ef",
      borderRadius: 12,
      display: "flex",
      flexDirection: "column",
      height: "100%",
      overflow: "hidden",
      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 16px 12px", borderBottom: "1px solid #f1f5f9",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: "0.9375rem", fontWeight: 700, color: "#030712" }}>
            Compensation Requests
          </h2>
          {pendingCount > 0 && (
            <span style={{
              background: "#fff3ed", color: "#c07c1a", border: "1px solid #f0b84020",
              borderRadius: 20, padding: "1px 7px", fontSize: "0.6875rem", fontWeight: 800,
            }}>
              {pendingCount} pending
            </span>
          )}
        </div>
        <button
          onClick={load}
          disabled={loading}
          title="Refresh"
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: "#94a3b8", padding: 4, borderRadius: 6,
            opacity: loading ? 0.5 : 1, transition: "color .15s",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "#143888"}
          onMouseLeave={e => e.currentTarget.style.color = "#94a3b8"}
        >
          <IconRefresh />
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 6, padding: "10px 16px 6px", flexWrap: "wrap" }}>
        {FILTERS.map(f => (
          <FilterTab
            key={f}
            label={f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
            active={filter === f}
            count={f === "ALL" ? requests.length : counts[f]}
            onClick={() => setFilter(f)}
          />
        ))}
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 12px 12px" }}>
        {loading && (
          <div style={{ textAlign: "center", padding: "28px 0", color: "#94a3b8", fontSize: "0.8125rem" }}>
            Loading…
          </div>
        )}
        {error && !loading && (
          <div style={{ textAlign: "center", padding: "20px 0", color: "#dc2626", fontSize: "0.8125rem" }}>
            {error}
          </div>
        )}
        {!loading && !error && requests.length === 0 && (
          <div style={{ textAlign: "center", padding: "32px 0", color: "#94a3b8" }}>
            <div style={{ fontSize: "1.75rem", marginBottom: 6 }}>📭</div>
            <p style={{ margin: 0, fontSize: "0.8125rem", fontWeight: 600 }}>No requests</p>
            <p style={{ margin: "4px 0 0", fontSize: "0.75rem" }}>
              {filter !== "ALL" ? "Try changing the filter" : "No compensation requests for this session"}
            </p>
          </div>
        )}
        {!loading && requests.map((req) => (
          <RequestCard
            key={req.id}
            req={req}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        ))}
      </div>

      {/* Footer */}
      {total > 0 && (
        <div style={{
          padding: "8px 16px", borderTop: "1px solid #f1f5f9",
          fontSize: "0.75rem", color: "#94a3b8", textAlign: "right",
        }}>
          {requests.length} of {total} requests
        </div>
      )}
    </div>
  );
}
