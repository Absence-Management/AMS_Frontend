"use client";

import { useState, useEffect, useCallback } from "react";
import AdminJustificationsTable from "@/components/dashboard/AdminJustificationsTable";
import { fetchJustifications, bulkApproveJustifications, bulkRejectJustifications, approveJustification } from "@/services/justificationService";

export default function JustificationPage() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(7);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchJustifications({
        page,
        page_size: pageSize,
        search: search || undefined,
        status: status || undefined,
      });
      setData(res?.data || []);
      setTotal(res?.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, status]);

  const handleApproveAll = async () => {
    setIsApproving(true);
    try {
      // Empty array/omitted ids implies approve all pending justifications
      await bulkApproveJustifications();
      await loadData();
    } catch (err) {
      console.error("Failed to bulk approve", err);
    } finally {
      setIsApproving(false);
    }
  };

  const handleRejectAll = async () => {
    const reason = window.prompt("Reason for rejecting all (optional):");
    if (reason === null) return; // User cancelled the prompt
    
    setIsRejecting(true);
    try {
      await bulkRejectJustifications([], reason.trim());
      await loadData();
    } catch (err) {
      console.error("Failed to bulk reject", err);
    } finally {
      setIsRejecting(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveJustification(id);
      await loadData();
    } catch (err) {
      console.error("Failed to approve", err);
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt("Reason for rejecting (optional):");
    if (reason === null) return; // User cancelled

    try {
      await rejectJustification(id, reason.trim());
      await loadData();
    } catch (err) {
      console.error("Failed to reject", err);
    }
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="main-page">
      {/* ── Header row ── */}
      <div className="main-header">
        <div className="main-header-text">
          <h2 className="main-title">Justification</h2>
          <p className="main-subtitle">View ESI attendance statistics</p>
        </div>
        <div className="justifications-actions">
          <button 
            className="justifications-action-btn justifications-action-btn--reject"
            onClick={handleRejectAll}
            disabled={isRejecting}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
            >
              <path
                d="M8.60001 0.600098L0.600006 8.6001M0.600006 0.600098L8.60001 8.6001"
                stroke="#D62525"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Reject all
          </button>
          <button 
            className="justifications-action-btn justifications-action-btn--approve"
            onClick={handleApproveAll}
            disabled={isApproving}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="9"
              viewBox="0 0 12 9"
              fill="none"
            >
              <path
                d="M11.2667 0.600098L3.93334 7.93343L0.600006 4.6001"
                stroke="#069855"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Approve all
          </button>
        </div>
      </div>

      <AdminJustificationsTable
        justifications={data}
        totalCount={total}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        searchQuery={search}
        onSearch={setSearch}
        loading={loading}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
