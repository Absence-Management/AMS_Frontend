"use client";

import { useEffect } from "react";

export default function ExportSelectionModal({
  isOpen,
  onClose,
  onExportCSV,
  onExportPDF,
  isExportingCSV,
  isExportingPDF,
  entityName = "data",
}) {
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const isDownloading = isExportingCSV || isExportingPDF;

  return (
    <div className="export-modal-backdrop" onClick={handleBackdropClick}>
      <div
        className="export-modal"
        role="dialog"
        aria-modal="true"
        style={{ maxWidth: 400 }}
      >
        <div className="export-modal-header">
          <div>
            <h3 className="export-modal-title">Export {entityName}</h3>
            <p className="export-modal-subtitle">
              Choose the format to download your {entityName}.
            </p>
          </div>
          <button
            className="export-modal-close"
            onClick={onClose}
            aria-label="Close export modal"
            disabled={isDownloading}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <line
                x1="18"
                y1="6"
                x2="6"
                y2="18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="6"
                y1="6"
                x2="18"
                y2="18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="export-modal-footer" style={{ justifyContent: "flex-end" }}>
          <div style={{ display: "flex", gap: 10, width: "100%" }}>
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={isDownloading}
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-submit"
              onClick={onExportCSV}
              disabled={isDownloading}
              style={{ flex: 1, justifyContent: "center" }}
            >
              {isExportingCSV ? (
                "Downloading…"
              ) : (
                <>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    style={{ marginRight: 6 }}
                  >
                    <path
                      d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <polyline
                      points="7 10 12 15 17 10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <line
                      x1="12"
                      y1="15"
                      x2="12"
                      y2="3"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  CSV
                </>
              )}
            </button>
            <button
              type="button"
              className="btn-submit"
              onClick={onExportPDF}
              disabled={isDownloading}
              style={{ flex: 1, justifyContent: "center" }}
            >
              {isExportingPDF ? (
                "Downloading…"
              ) : (
                <>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    style={{ marginRight: 6 }}
                  >
                    <path
                      d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <polyline
                      points="14 2 14 8 20 8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <line
                      x1="16"
                      y1="13"
                      x2="8"
                      y2="13"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <line
                      x1="16"
                      y1="17"
                      x2="8"
                      y2="17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <polyline
                      points="10 9 9 9 8 9"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  PDF
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
