"use client";

import ImportErrorReportModal from "@/components/dashboard/ImportErrorReportModal";
import CriticalErrorNotification from "@/components/import/CriticalErrorNotification";
import { useImport } from "@/hooks/useImport";

export default function AccountImportPanel({
  importType,
  entityLabel,
  helperText,
  onImported,
}) {
  const {
    file,
    fileInputRef,
    handleFileChange,
    previewRows,
    parseErrors,
    loading,
    handleSubmit,
    resetAll,
    success,
    setSuccess,
    importResult,
    error,
    showErrorModal,
    setShowErrorModal,
    criticalError,
  } = useImport(importType, onImported);

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv"
        style={{ display: "none" }}
      />

      <div className="import-container" style={{ marginTop: 8 }}>
        {!file && !success ? (
          <div className="import-upload-area">
            <h3 className="import-upload-title">Upload a CSV file</h3>
            <p className="import-upload-subtitle">
              Select a UTF-8 `.csv` file separated by commas (,)
            </p>
            <button
              className="import-upload-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload
            </button>
          </div>
        ) : success ? (
          <div className="import-success-area">
            <h3 className="import-success-title">Imported successfully</h3>
            <p className="import-success-subtitle" style={{ color: "#10b981" }}>
              {entityLabel} data has been processed and saved.
            </p>
            <button
              className="import-upload-btn"
              onClick={() => setSuccess(false)}
            >
              Import another file
            </button>
            <div style={{ marginTop: 16, color: "#10b981", fontSize: 14 }}>
              Successfully imported <strong>{importResult?.imported ?? 0}</strong>{" "}
              rows.
            </div>
          </div>
        ) : (
          <div className="import-success-area">
            <h3 className="import-success-title">Ready to import</h3>
            <p className="import-success-file">{file?.name}</p>
            <p className="import-upload-subtitle" style={{ marginBottom: 0 }}>
              {previewRows.length} validated row{previewRows.length === 1 ? "" : "s"}
            </p>
          </div>
        )}
      </div>

      {helperText ? <p className="import-footer-text">{helperText}</p> : null}

      {parseErrors.length > 0 && (
        <div className="error-message" style={{ marginTop: 16 }}>
          {parseErrors.map((message, index) => (
            <p key={index}>{message}</p>
          ))}
        </div>
      )}

      {criticalError ? <CriticalErrorNotification /> : null}

      {error && !criticalError ? (
        <div className="error-message" style={{ marginTop: 16 }}>
          <p style={{ fontWeight: 600, marginBottom: 8 }}>{error}</p>
          {importResult?.error_report?.length > 0 ? (
            <button
              className="import-upload-btn"
              style={{ marginTop: 2 }}
              onClick={() => setShowErrorModal(true)}
            >
              View error report
            </button>
          ) : null}
        </div>
      ) : null}

      <ImportErrorReportModal
        isOpen={showErrorModal}
        importResult={importResult}
        onClose={() => setShowErrorModal(false)}
      />

      {file && parseErrors.length === 0 ? (
        <div className="import-footer">
          <div className="import-footer-actions">
            <button className="btn-cancel" onClick={resetAll} disabled={loading}>
              Cancel
            </button>
            <button
              className="btn-submit"
              onClick={handleSubmit}
              disabled={!file || loading}
            >
              {loading ? "Processing..." : "Submit & save"}
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
