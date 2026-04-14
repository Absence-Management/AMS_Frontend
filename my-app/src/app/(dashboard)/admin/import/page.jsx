"use client";

import { useState, useRef } from "react";
import { useImport } from "@/hooks/useImport";
import ImportButton from "@/components/dashboard/ImportButton";
import ImportErrorReportModal from "@/components/dashboard/ImportErrorReportModal";
import ExportAbsencesButton from "@/components/dashboard/ExportAbsencesButton";
import CriticalErrorNotification from "@/components/import/CriticalErrorNotification";
import DataTable from "@/components/shared/DataTable";
import { TimetableGrid } from "@/components/timetable/TimetableGrid";
import { Avatar, IconDots } from "@/components/shared/TableShared";

// ── Avatar color pool ────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  "#dbeafe",
  "#fce7f3",
  "#dcfce7",
  "#fef9c3",
  "#ede9fe",
  "#fee2e2",
  "#d1fae5",
  "#e0f2fe",
];
const avatarColor = (i) => AVATAR_COLORS[i % AVATAR_COLORS.length];

// ── Per-import-type config ───────────────────────────────────────────────────
const PREVIEW_CONFIG = {
  0: {
    label: "students",
    columns: [
      "Student",
      "Matricule",
      "Field",
      "Level",
      "Group",
      "Email",
      "Action",
    ],
    renderRow: (row, i) => (
      <div key={i} className="import-preview-table__row">
        <span className="admin-data-table__cell admin-data-table__cell--name">
          <div className="admin-data-table__name-wrap">
            <Avatar
              name={`${row.prenom ?? ""} ${row.nom ?? ""}`}
              color={avatarColor(i)}
            />
            <span className="admin-data-table__name">
              {row.prenom ?? "—"} {row.nom ?? "—"}
            </span>
          </div>
        </span>
        <span className="admin-data-table__cell admin-data-table__text-cell">
          {row.matricule ?? "—"}
        </span>
        <span className="admin-data-table__cell admin-data-table__text-cell">
          {row.filiere ?? "—"}
        </span>
        <span className="admin-data-table__cell admin-data-table__text-cell">
          {row.niveau ?? "—"}
        </span>
        <span className="admin-data-table__cell admin-data-table__text-cell">
          {row.groupe ?? "—"}
        </span>
        <span className="admin-data-table__cell admin-data-table__text-cell">
          {row.email ?? "—"}
        </span>
        <span className="admin-data-table__cell admin-data-table__cell--action">
          <button
            type="button"
            className="admin-data-table__action-btn"
            aria-label="Row actions"
          >
            <IconDots />
          </button>
        </span>
      </div>
    ),
  },
  1: {
    label: "teachers",
    columns: ["Teacher", "ID", "Email", "Grade", "Department", "Action"],
    renderRow: (row, i) => (
      <div key={i} className="import-preview-table__row">
        <span className="admin-data-table__cell admin-data-table__cell--name">
          <div className="admin-data-table__name-wrap">
            <Avatar
              name={`${row.prenom ?? ""} ${row.nom ?? ""}`}
              color={avatarColor(i)}
            />
            <span className="admin-data-table__name">
              {row.prenom ?? "—"} {row.nom ?? "—"}
            </span>
          </div>
        </span>
        <span className="admin-data-table__cell admin-data-table__text-cell">
          {row.id_enseignant ?? "—"}
        </span>
        <span className="admin-data-table__cell admin-data-table__text-cell">
          {row.email ?? "—"}
        </span>
        <span className="admin-data-table__cell admin-data-table__text-cell">
          {row.grade ?? "—"}
        </span>
        <span className="admin-data-table__cell admin-data-table__text-cell">
          {row.departement ?? "—"}
        </span>
        <span className="admin-data-table__cell admin-data-table__cell--action">
          <button
            type="button"
            className="admin-data-table__action-btn"
            aria-label="Row actions"
          >
            <IconDots />
          </button>
        </span>
      </div>
    ),
  },
  2: {
    label: "timetable",
    columns: [
      "Year",
      "Section / Speciality",
      "Semester",
      "Day",
      "Time",
      "Type",
      "Subject",
      "Teacher",
      "Room",
      "Group",
      "Action",
    ],
    renderRow: (row, i) => {
      const sectionOrSpeciality =
        row.speciality && row.speciality.trim()
          ? row.speciality.trim()
          : row.section && row.section.trim()
            ? `Section ${row.section.trim()}`
            : "—";

      const time =
        row.time_start && row.time_end
          ? `${row.time_start} – ${row.time_end}`
          : row.time_start || "—";

      const TYPE_COLORS = {
        Cours: { bg: "#dbeafe", color: "#1d4ed8" },
        TD: { bg: "#dcfce7", color: "#15803d" },
        TP: { bg: "#fef9c3", color: "#a16207" },
        "TD/TP": { bg: "#ede9fe", color: "#6d28d9" },
        "Cours/TP": { bg: "#e0f2fe", color: "#0369a1" },
        "Cours/TD/TP": { bg: "#fce7f3", color: "#be185d" },
      };
      const typeStyle = TYPE_COLORS[row.type] ?? {
        bg: "#f1f5f9",
        color: "#475569",
      };

      return (
        <div key={i} className="import-preview-table__row">
          <span className="admin-data-table__cell admin-data-table__text-cell">
            {row.year ?? "—"}
          </span>
          <span className="admin-data-table__cell admin-data-table__text-cell">
            {sectionOrSpeciality}
          </span>
          <span className="admin-data-table__cell admin-data-table__text-cell">
            {row.semester ?? "—"}
          </span>
          <span className="admin-data-table__cell admin-data-table__text-cell">
            {row.day ?? "—"}
          </span>
          <span className="admin-data-table__cell admin-data-table__text-cell">
            {time}
          </span>
          <span className="admin-data-table__cell admin-data-table__text-cell">
            <span
              style={{
                display: "inline-block",
                padding: "2px 8px",
                borderRadius: 4,
                fontSize: 12,
                fontWeight: 600,
                background: typeStyle.bg,
                color: typeStyle.color,
              }}
            >
              {row.type ?? "—"}
            </span>
          </span>
          <span className="admin-data-table__cell admin-data-table__text-cell">
            {row.subject ?? "—"}
          </span>
          <span className="admin-data-table__cell admin-data-table__text-cell">
            {row.teacher ?? "—"}
          </span>
          <span className="admin-data-table__cell admin-data-table__text-cell">
            {row.room ?? "—"}
          </span>
          <span className="admin-data-table__cell admin-data-table__text-cell">
            {row.group && row.group.trim() ? (
              row.group.trim()
            ) : (
              <span
                style={{ color: "#94a3b8", fontStyle: "italic", fontSize: 12 }}
              >
                All
              </span>
            )}
          </span>
          <span className="admin-data-table__cell admin-data-table__cell--action">
            <button
              type="button"
              className="admin-data-table__action-btn"
              aria-label="Row actions"
            >
              <IconDots />
            </button>
          </span>
        </div>
      );
    },
  },
};

// ── Preview table ────────────────────────────────────────────────────────────
const PAGE_SIZE = 7;

function PreviewTable({ rows, importType }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const config = PREVIEW_CONFIG[importType];
  if (!config || !rows.length) return null;

  const filtered = search
    ? rows.filter((r) =>
        Object.values(r).some((v) =>
          String(v).toLowerCase().includes(search.toLowerCase()),
        ),
      )
    : rows;

  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div style={{ marginTop: 24 }}>
      <DataTable
        title={`Preview — ${config.label}`}
        count={filtered.length}
        searchQuery={search}
        onSearch={(v) => {
          setSearch(v);
          setPage(1);
        }}
        placeholder={`Search ${config.label}…`}
        columns={config.columns}
        tableClass={`import-preview-table import-preview-table--${config.label}`}
        headerClass="import-preview-table__header-row"
        footerClass="import-preview-table__footer"
        emptyMessage={`No ${config.label} match your search.`}
        rowLabel={config.label}
        page={page}
        pageSize={PAGE_SIZE}
        totalCount={filtered.length}
        onPageChange={setPage}
      >
        {pageRows.map((row, i) =>
          config.renderRow(row, (page - 1) * PAGE_SIZE + i),
        )}
      </DataTable>
    </div>
  );
}

// ── Import type option cards config ──────────────────────────────────────────
const IMPORT_OPTIONS = [
  {
    id: 0,
    title: "List of students",
    description:
      "Import from Progres — CSV file with columns: matricule, nom, prenom, filiere, niveau, groupe, email",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: 1,
    title: "List of teachers",
    description:
      "Import from Progres — UTF-8 CSV (comma-delimited) with columns: id_enseignant, nom, prenom, email, grade, departement",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Session planning",
    description:
      "Import timetable — CSV with columns: year, section, speciality, semester, day, time_start, time_end, type, subject, teacher, room, group",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
];

// ── Page ─────────────────────────────────────────────────────────────────────
export default function ImportPage() {
  const {
    selectedOption,
    handleOptionChange,
    file,
    fileInputRef,
    handleFileChange,
    handleUploadClick,
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
  } = useImport();

  return (
    <div className="main-page">
      {/* ── Header ── */}
      <div className="main-header">
        <div className="main-header-text">
          <h2 className="main-title">Import / Export</h2>
          <p className="main-subtitle">
            Import the data from Progres (CSV) and export the absence reports.
          </p>
        </div>

        <ExportAbsencesButton />
      </div>

      <div className="import-container">
        {/* ── Type selector ── */}
        <div className="import-options-grid">
          {IMPORT_OPTIONS.map((opt) => (
            <ImportButton
              key={opt.id}
              icon={opt.icon}
              title={opt.title}
              description={opt.description}
              isSelected={selectedOption === opt.id}
              onClick={() => handleOptionChange(opt.id)}
            />
          ))}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".csv"
          style={{ display: "none" }}
        />

        {/* ── Upload / ready / success area ── */}
        {!file && !success ? (
          <div className="import-upload-area">
            <h3 className="import-upload-title">Upload a CSV file</h3>
            <p className="import-upload-subtitle">
              {selectedOption === 2
                ? "Select a UTF-8 .csv file — columns: year, section, speciality, semester, day, time_start, time_end, type, subject, teacher, room, group"
                : "Select a UTF-8 .csv file separated by commas (,)"}
            </p>
            <button className="import-upload-btn" onClick={handleUploadClick}>
              Upload
            </button>
          </div>
        ) : success ? (
          <div className="import-success-area">
            <h3 className="import-success-title">Imported successfully</h3>
            <p className="import-success-subtitle" style={{ color: "#10b981" }}>
              The data has been processed and saved.
            </p>
            <button
              className="import-upload-btn"
              onClick={() => setSuccess(false)}
            >
              Import another file
            </button>
            <div style={{ marginTop: 16, color: "#10b981", fontSize: 14 }}>
              Successfully imported <strong>{importResult?.imported}</strong>{" "}
              rows.
            </div>
          </div>
        ) : (
          <div className="import-success-area">
            <h3 className="import-success-title">Ready to import</h3>
            <p className="import-success-file">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              {file.name}
            </p>
            <button className="import-upload-btn" onClick={handleUploadClick}>
              Change file
            </button>
          </div>
        )}
      </div>

      {parseErrors.length > 0 && (
        <div className="error-message" style={{ marginTop: 16 }}>
          {parseErrors.map((message, index) => (
            <p key={index}>{message}</p>
          ))}
        </div>
      )}

      {/* ── CSV preview table ── */}
      {file && previewRows.length > 0 && selectedOption !== 2 && (
        <PreviewTable rows={previewRows} importType={selectedOption} />
      )}
      {file &&
        previewRows.length > 0 &&
        parseErrors.length === 0 &&
        selectedOption === 2 && (
          <div style={{ marginTop: 24 }}>
            <TimetableGrid rows={previewRows} title="Timetable preview" />
          </div>
        )}

      {/* ── Errors & modals ── */}
      {criticalError && <CriticalErrorNotification />}

      {error && !criticalError && (
        <div className="error-message" style={{ margin: "16px 0 0 0" }}>
          <p style={{ fontWeight: 600, marginBottom: 8 }}>{error}</p>
          {importResult?.error_report?.length > 0 && (
            <button
              className="import-upload-btn"
              style={{ marginTop: 2 }}
              onClick={() => setShowErrorModal(true)}
            >
              View error report
            </button>
          )}
        </div>
      )}

      <ImportErrorReportModal
        isOpen={showErrorModal}
        importResult={importResult}
        onClose={() => setShowErrorModal(false)}
      />

      {/* ── Footer actions ── */}
      <div className="import-footer">
        {file && parseErrors.length === 0 && (
          <>
            {selectedOption === 0 && (
              <p className="import-footer-text">
                When you submit, an automatic email is going to be sent to the
                student with their email and the password (their matricule) !
              </p>
            )}
            <div className="import-footer-actions">
              <button
                className="btn-cancel"
                onClick={resetAll}
                disabled={loading}
              >
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
          </>
        )}
      </div>
    </div>
  );
}
