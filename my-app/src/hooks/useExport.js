// ============================================
// AMS — ESI Sidi Bel Abbès
// hooks/useExport.js
// Manages filter state, preview table, and CSV download for US-14
// ============================================

"use client";

import { useState, useCallback } from "react";
import {
  previewAbsences,
  downloadAbsencesCSV,
  downloadAbsencesPDF,
} from "@/services/exportService";

const EMPTY_FILTERS = {
  year: "",
  semester: "",
  month: "",
  week: "",
  day: "",
  module: "",
  group: "",
  teacher_id: "",
  student_id: "",
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
      if (filters.year) parts.push(`year-${filters.year}`);
      if (filters.semester) parts.push(`semester-${filters.semester}`);
      if (filters.month) parts.push(`month-${filters.month}`);
      if (filters.week) parts.push(`week-${filters.week}`);
      if (filters.day) parts.push(`day-${filters.day}`);
      if (filters.module) parts.push(`module-${filters.module}`);
      if (filters.group) parts.push(`group-${filters.group}`);
      if (filters.teacher_id) parts.push(`teacher-${filters.teacher_id}`);
      if (filters.student_id) parts.push(`student-${filters.student_id}`);
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

  const handleDownloadPDF = useCallback(async () => {
    setDownloading(true);
    setDownloadError("");
    try {
      // Build a descriptive filename from active filters
      const parts = ["absences"];
      if (filters.year) parts.push(`year-${filters.year}`);
      if (filters.semester) parts.push(`semester-${filters.semester}`);
      if (filters.month) parts.push(`month-${filters.month}`);
      if (filters.week) parts.push(`week-${filters.week}`);
      if (filters.day) parts.push(`day-${filters.day}`);
      if (filters.module) parts.push(`module-${filters.module}`);
      if (filters.group) parts.push(`group-${filters.group}`);
      if (filters.teacher_id) parts.push(`teacher-${filters.teacher_id}`);
      if (filters.student_id) parts.push(`student-${filters.student_id}`);
      const filename = `${parts.join("_")}.pdf`;

      await downloadAbsencesPDF(filters, filename);
      return true;
    } catch (err) {
      console.error("[useExport] PDF download failed:", err);
      setDownloadError("Failed to download PDF. Please try again.");
      return false;
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
    handleDownloadPDF,
  };
}
