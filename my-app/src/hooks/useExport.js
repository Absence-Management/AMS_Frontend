// ============================================
// AMS — ESI Sidi Bel Abbès
// hooks/useExport.js
// Manages filter state, preview table, and CSV download for US-14
// ============================================

"use client";

import { useState, useCallback } from "react";
import { previewAbsences, downloadAbsencesCSV } from "@/services/exportService";

const EMPTY_FILTERS = {
  filiere: "",
  code_module: "",
  date_from: "",
  date_to: "",
  matricule_etudiant: "",
};

const PAGE_SIZE = 10;

export function useExport() {
  // ── Preview table ─────────────────────────────────────────────────────────
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);
  // ── Filters ──────────────────────────────────────────────────────────────
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS);
    setRows([]);
    setTotal(0);
    setPage(1);
    setHasSearched(false);
  }, []);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPreview = useCallback(
    async (pageOverride) => {
      const targetPage = pageOverride ?? page;
      setLoading(true);
      setError("");
      try {
        const data = await previewAbsences(filters, targetPage, PAGE_SIZE);
        const items = Array.isArray(data?.items) ? data.items : [];
        setRows(items);
        setTotal(Number(data?.total ?? items.length));
        setPage(targetPage);
        setHasSearched(true);
      } catch (err) {
        console.error("[useExport] preview failed:", err);
        setError(
          "Failed to load absences. Please check your filters and try again.",
        );
        setRows([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [filters, page],
  );

  const handleSearch = useCallback(() => {
    fetchPreview(1);
  }, [fetchPreview]);

  const handlePageChange = useCallback(
    (newPage) => {
      fetchPreview(newPage);
    },
    [fetchPreview],
  );

  // ── CSV download ──────────────────────────────────────────────────────────
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    setDownloadError("");
    try {
      // Build a descriptive filename from active filters
      const parts = ["absences"];
      if (filters.filiere) parts.push(filters.filiere);
      if (filters.code_module) parts.push(filters.code_module);
      if (filters.date_from) parts.push(`from-${filters.date_from}`);
      if (filters.date_to) parts.push(`to-${filters.date_to}`);
      const filename = `${parts.join("_")}.csv`;

      await downloadAbsencesCSV(filters, filename);
      return true; // success — caller can close modal
    } catch (err) {
      console.error("[useExport] download failed:", err);
      setDownloadError("Failed to download CSV. Please try again.");
      return false; // failure — caller should keep modal open
    } finally {
      setDownloading(false);
    }
  }, [filters]);

  return {
    // filters
    filters,
    setFilter,
    resetFilters,
    // preview
    rows,
    total,
    page,
    pageSize: PAGE_SIZE,
    loading,
    error,
    hasSearched,
    handleSearch,
    handlePageChange,
    // download
    downloading,
    downloadError,
    handleDownload,
  };
}
