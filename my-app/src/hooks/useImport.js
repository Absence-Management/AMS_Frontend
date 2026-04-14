// ============================================
// AMS — ESI Sidi Bel Abbès
// hooks/useImport.js
// Manages all state & handlers for the import page (US-10, US-11, US-16, US-17)
// ============================================

"use client";

import { useState, useRef, useCallback } from "react";
import { parseAndValidateCsv } from "@/lib/csvValidator";
import * as importService from "@/services/importService";

// Maps the selected import option index to the csvValidator schema key
const IMPORT_SCHEMA_BY_OPTION = {
  0: "students",
  1: "teachers",
  2: "timetable",
};

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Normalises highly variable backend import responses into a predictable shape.
 * Handles field-name differences across import types (students / teachers / timetable).
 */
function normalizeImportResult(payload, fallbackFileName) {
  if (!payload || typeof payload !== "object") {
    return {
      message: "",
      imported: 0,
      errors: 0,
      error_report: [],
      history_id: null,
      file_name: fallbackFileName || "uploaded_file.csv",
      date: new Date().toLocaleDateString("en-GB"),
    };
  }

  const errorReport = Array.isArray(payload.error_report)
    ? payload.error_report
    : Array.isArray(payload.errors_report)
      ? payload.errors_report
      : Array.isArray(payload.report)
        ? payload.report
        : Array.isArray(payload.errors)
          ? payload.errors
          : [];

  const resolveNumeric = (...values) => {
    for (const value of values) {
      if (typeof value === "number" && Number.isFinite(value)) return value;
      if (typeof value === "string" && value.trim() !== "") {
        const parsed = Number(value);
        if (Number.isFinite(parsed)) return parsed;
      }
    }
    return null;
  };

  const numericErrors = resolveNumeric(
    payload.error_count,
    payload.failed,
    Array.isArray(payload.errors) ? payload.errors.length : null,
    errorReport.length,
  );

  const created = resolveNumeric(payload.created, payload.inserted, 0) ?? 0;
  const updated = resolveNumeric(payload.updated, 0) ?? 0;
  const imported =
    resolveNumeric(
      payload.imported,
      payload.imported_count,
      payload.success,
      payload.processed,
    ) ?? created + updated;
  const errors = numericErrors ?? 0;

  return {
    ...payload,
    message: payload.message || payload.detail || "",
    imported,
    errors,
    created,
    updated,
    error_report: errorReport,
    history_id: payload.history_id || payload.historyId || null,
    file_name:
      payload.file_name ||
      payload.filename ||
      payload.file ||
      fallbackFileName ||
      "uploaded_file.csv",
    date: payload.date || new Date().toLocaleDateString("en-GB"),
  };
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useImport() {
  const [selectedOption, setSelectedOption] = useState(0);
  const [file, setFile] = useState(null);
  const [previewRows, setPreviewRows] = useState([]);
  const [parseErrors, setParseErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [criticalError, setCriticalError] = useState(false);

  const fileInputRef = useRef(null);

  // ── Helpers ────────────────────────────────────────────────────────────────

  const resetAll = useCallback(() => {
    setFile(null);
    setPreviewRows([]);
    setParseErrors([]);
    setError(null);
    setSuccess(false);
    setShowErrorModal(false);
    setCriticalError(false);
  }, []);

  // ── Option selection ───────────────────────────────────────────────────────

  const handleOptionChange = useCallback(
    (optionId) => {
      setSelectedOption(optionId);
      resetAll();
    },
    [resetAll],
  );

  // ── File selection & client-side CSV validation ────────────────────────────

  const handleFileChange = useCallback(
    async (e) => {
      const selectedFile = e.target.files[0];
      if (!selectedFile) return;

      setFile(selectedFile);
      setError(null);
      setSuccess(false);
      setShowErrorModal(false);
      setCriticalError(false);
      setParseErrors([]);

      try {
        const text = await selectedFile.text();
        const schemaKey = IMPORT_SCHEMA_BY_OPTION[selectedOption];

        if (!schemaKey) {
          setPreviewRows([]);
          setParseErrors(["Unsupported import type selected."]);
          return;
        }

        const { rows, errors } = parseAndValidateCsv(text, schemaKey);
        setParseErrors(errors);
        setPreviewRows(errors.length > 0 ? [] : rows);
      } catch {
        setParseErrors(["Failed to read file."]);
        setPreviewRows([]);
      }
    },
    [selectedOption],
  );

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // ── Submit & save ──────────────────────────────────────────────────────────

  const handleSubmit = useCallback(async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setSuccess(false);
    setShowErrorModal(false);
    setCriticalError(false);

    try {
      const result =
        selectedOption === 0
          ? await importService.importStudents(file)
          : selectedOption === 1
            ? await importService.importTeachers(file)
            : await importService.importTimetable(file);

      const normalizedResult = normalizeImportResult(result, file.name);
      setImportResult(normalizedResult);

      if (normalizedResult.errors > 0) {
        setSuccess(false);
        setCriticalError(false);
        setError(
          normalizedResult.message ||
            (normalizedResult.imported > 0
              ? `Imported ${normalizedResult.imported} rows with ${normalizedResult.errors} errors. Please review the error report.`
              : `Found ${normalizedResult.errors} errors. Please review the error report before retrying.`),
        );
        setShowErrorModal(true);
      } else {
        setSuccess(true);
        setCriticalError(false);
        setError(null);
      }

      setFile(null);
      setPreviewRows([]);
    } catch (err) {
      console.error("Import failed:", err);
      const status = err?.response?.status;
      const normalizedResult = normalizeImportResult(
        err.response?.data,
        file?.name,
      );
      const detail = err.response?.data?.detail;
      const hasErrorReport =
        normalizedResult.errors > 0 || normalizedResult.error_report.length > 0;
      const isSystemFailure = (!status || status >= 500) && !hasErrorReport;

      if (isSystemFailure) {
        setCriticalError(true);
        setImportResult(null);
        setShowErrorModal(false);
        setError(null);
        return;
      }

      if (
        normalizedResult.errors > 0 ||
        normalizedResult.error_report.length > 0
      ) {
        setCriticalError(false);
        setImportResult(normalizedResult);
        setError(
          normalizedResult.message ||
            (normalizedResult.imported > 0
              ? `Imported ${normalizedResult.imported} rows with ${normalizedResult.errors || normalizedResult.error_report.length} errors. Please review the error report.`
              : `Found ${normalizedResult.errors || normalizedResult.error_report.length} errors. Please review the error report.`),
        );
        setShowErrorModal(true);
      } else {
        setCriticalError(false);
        setError(
          normalizedResult.message ||
            (typeof detail === "string"
              ? detail
              : "Failed to import data. Please check the file format."),
        );
      }
    } finally {
      setLoading(false);
    }
  }, [file, selectedOption]);

  // ── Return ─────────────────────────────────────────────────────────────────

  return {
    // option
    selectedOption,
    handleOptionChange,
    // file
    file,
    fileInputRef,
    handleFileChange,
    handleUploadClick,
    // validation
    previewRows,
    parseErrors,
    // submit
    loading,
    handleSubmit,
    resetAll,
    // results
    success,
    setSuccess,
    importResult,
    error,
    showErrorModal,
    setShowErrorModal,
    criticalError,
  };
}
