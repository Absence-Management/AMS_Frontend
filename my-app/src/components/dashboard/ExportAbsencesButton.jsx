"use client";

import { useState } from "react";
import { useExport } from "@/hooks/useExport";

export default function ExportAbsencesButton() {
  const [showModal, setShowModal] = useState(false);

  const {
    filters,
    setFilter,
    resetFilters,
    downloading,
    downloadError,
    handleDownload: downloadCSV,
    handleDownloadPDF: downloadPDF,
  } = useExport();

  const closeModal = () => setShowModal(false);

  const handleReset = () => resetFilters();

  const handleDownload = async () => {
    const success = await downloadCSV();
    if (success) closeModal();
  };

  const handleDownloadPDF = async () => {
    const success = await downloadPDF();
    if (success) closeModal();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) closeModal();
  };

  // Alias for template — hook exposes downloadError, button used `error`
  const error = downloadError;

  return (
    <>
      <button
        className="main-export-btn"
        type="button"
        onClick={() => setShowModal(true)}
      >
        Export data
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points="7 10 12 15 17 10"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="12"
            y1="15"
            x2="12"
            y2="3"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {showModal && (
        <div className="export-modal-backdrop" onClick={handleBackdropClick}>
          <div
            className="export-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="export-modal-title"
          >
            <div className="export-modal-header">
              <div>
                <h3 className="export-modal-title" id="export-modal-title">
                  Export absences
                </h3>
                <p className="export-modal-subtitle">
                  Apply filters then download as CSV. All filters are optional.
                </p>
              </div>
              <button
                className="export-modal-close"
                onClick={closeModal}
                aria-label="Close export modal"
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

            <div className="export-modal-body">
              <div className="export-modal-grid">
                <div className="export-modal-field">
                  <label className="export-modal-label" htmlFor="em-year">
                    Year
                  </label>
                  <input
                    id="em-year"
                    type="text"
                    className="export-modal-input"
                    placeholder="e.g. 2025"
                    value={filters.year}
                    onChange={(e) => setFilter("year", e.target.value)}
                  />
                </div>

                <div className="export-modal-field">
                  <label className="export-modal-label" htmlFor="em-semester">
                    Semester
                  </label>
                  <input
                    id="em-semester"
                    type="text"
                    className="export-modal-input"
                    placeholder="e.g. S1"
                    value={filters.semester}
                    onChange={(e) => setFilter("semester", e.target.value)}
                  />
                </div>

                <div className="export-modal-field export-modal-field--full">
                  <label className="export-modal-label" htmlFor="em-module">
                    Module
                  </label>
                  <input
                    id="em-module"
                    type="text"
                    className="export-modal-input"
                    placeholder="e.g. ALGO01"
                    value={filters.module}
                    onChange={(e) => setFilter("module", e.target.value)}
                  />
                </div>

                <div className="export-modal-field">
                  <label className="export-modal-label" htmlFor="em-group">
                    Group
                  </label>
                  <input
                    id="em-group"
                    type="text"
                    className="export-modal-input"
                    placeholder="e.g. 2"
                    value={filters.group}
                    onChange={(e) => setFilter("group", e.target.value)}
                  />
                </div>

                <div className="export-modal-field">
                  <label className="export-modal-label" htmlFor="em-month">
                    Month
                  </label>
                  <input
                    id="em-month"
                    type="number"
                    className="export-modal-input"
                    min={1}
                    max={12}
                    placeholder="1-12"
                    value={filters.month}
                    onChange={(e) => setFilter("month", e.target.value)}
                  />
                </div>

                <div className="export-modal-field">
                  <label className="export-modal-label" htmlFor="em-week">
                    Week
                  </label>
                  <input
                    id="em-week"
                    type="number"
                    className="export-modal-input"
                    min={1}
                    max={53}
                    placeholder="1-53"
                    value={filters.week}
                    onChange={(e) => setFilter("week", e.target.value)}
                  />
                </div>

                <div className="export-modal-field">
                  <label className="export-modal-label" htmlFor="em-day">
                    Day
                  </label>
                  <input
                    id="em-day"
                    type="date"
                    className="export-modal-input"
                    value={filters.day}
                    onChange={(e) => setFilter("day", e.target.value)}
                  />
                </div>

                <div className="export-modal-field">
                  <label className="export-modal-label" htmlFor="em-teacher">
                    Teacher ID
                  </label>
                  <input
                    id="em-teacher"
                    type="text"
                    className="export-modal-input"
                    placeholder="e.g. T-102"
                    value={filters.teacher_id}
                    onChange={(e) => setFilter("teacher_id", e.target.value)}
                  />
                </div>

                <div className="export-modal-field">
                  <label className="export-modal-label" htmlFor="em-student">
                    Student ID
                  </label>
                  <input
                    id="em-student"
                    type="text"
                    className="export-modal-input"
                    placeholder="e.g. 231234"
                    value={filters.student_id}
                    onChange={(e) => setFilter("student_id", e.target.value)}
                  />
                </div>
              </div>

              <div className="export-modal-info">
                <span className="export-modal-info-label">CSV columns:</span>
                <span className="export-modal-info-value">
                  Defined by the backend export response.
                </span>
              </div>

              {error && (
                <div className="error-message" style={{ marginTop: 12 }}>
                  {error}
                </div>
              )}
            </div>

            <div className="export-modal-footer">
              <button
                type="button"
                className="btn-cancel"
                onClick={handleReset}
                disabled={downloading}
              >
                Reset filters
              </button>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={closeModal}
                  disabled={downloading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-submit"
                  onClick={handleDownload}
                  disabled={downloading}
                >
                  {downloading ? (
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
                      Download CSV
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="btn-submit"
                  onClick={handleDownloadPDF}
                  disabled={downloading}
                >
                  {downloading ? (
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
                      Download PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
