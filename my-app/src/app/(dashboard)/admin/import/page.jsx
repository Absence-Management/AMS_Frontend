"use client";

import { useState, useRef, useCallback } from "react";
import ImportButton from "@/components/dashboard/ImportButton";
import ImportErrorReportModal from "@/components/dashboard/ImportErrorReportModal";
import ExportAbsencesButton from "@/components/dashboard/ExportAbsencesButton";
import CriticalErrorNotification from "@/components/import/CriticalErrorNotification";
import DataTable from "@/components/shared/DataTable";
import { Avatar, IconDots } from "@/components/shared/TableShared";
import { parseAndValidateCsv } from "@/lib/csvValidator";
import * as importService from "@/services/importService";

const TIMETABLE_DAYS = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi"];
const TIMETABLE_TIME_SLOTS = [
  "08:00–09:30",
  "09:30–11:00",
  "11:00–12:30",
  "14:00–15:30",
];
const TIMETABLE_SLOT_STARTS = ["08:00", "09:30", "11:00", "14:00"];

const SESSION_TYPE_COLORS = {
  Cours: { bg: "#dbeafe", text: "#1e40af", border: "#bfdbfe" },
  TD: { bg: "#dcfce7", text: "#166534", border: "#bbf7d0" },
  TP: { bg: "#fef9c3", text: "#854d0e", border: "#fde68a" },
  "TD/TP": { bg: "#ede9fe", text: "#5b21b6", border: "#ddd6fe" },
  "Cours/TD/TP": { bg: "#fce7f3", text: "#9d174d", border: "#fbcfe8" },
};

const TYPE_FALLBACK = { bg: "#f3f4f6", text: "#374151", border: "#e5e7eb" };

const IMPORT_SCHEMA_BY_OPTION = {
  0: "students",
  1: "teachers",
  2: "timetable",
};

function buildTimetableGrid(rows) {
  const grid = {};
  TIMETABLE_DAYS.forEach((day) => {
    grid[day] = {};
    TIMETABLE_SLOT_STARTS.forEach((_, slotIndex) => {
      grid[day][slotIndex] = [];
    });
  });

  rows.forEach((row) => {
    const day = TIMETABLE_DAYS.find(
      (candidate) => candidate.toLowerCase() === row.day?.toLowerCase(),
    );
    if (!day) return;

    const slotIndex = TIMETABLE_SLOT_STARTS.findIndex(
      (slotStart) => slotStart === row.time_start,
    );
    if (slotIndex === -1) return;

    grid[day][slotIndex].push(row);
  });

  return grid;
}

function TimetableSessionChip({ session }) {
  const colors = SESSION_TYPE_COLORS[session.type] ?? TYPE_FALLBACK;
  const label = session.group
    ? `${session.type} · ${session.group}`
    : session.type;

  return (
    <div
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: 6,
        padding: "4px 7px",
        marginBottom: 4,
        fontSize: 11,
        lineHeight: 1.4,
      }}
    >
      <div style={{ fontWeight: 600, color: colors.text, fontSize: 11 }}>
        {session.subject}
      </div>
      <div style={{ color: colors.text, opacity: 0.85 }}>{label}</div>
      <div style={{ color: colors.text, opacity: 0.7 }}>
        {session.teacher}
        {session.room ? ` · ${session.room}` : ""}
      </div>
    </div>
  );
}

function TimetableFilterBar({ rows, filters, onChange }) {
  const years = [...new Set(rows.map((r) => r.year).filter(Boolean))].sort();
  const sections = [
    ...new Set(rows.map((r) => r.section).filter(Boolean)),
  ].sort();
  const specialities = [
    ...new Set(rows.map((r) => r.speciality).filter(Boolean)),
  ].sort();
  const semesters = [
    ...new Set(rows.map((r) => r.semester).filter(Boolean)),
  ].sort();

  const select = (key, values, placeholder) => (
    <select
      className="timetable-filter-select"
      value={filters[key]}
      onChange={(event) => onChange(key, event.target.value)}
    >
      <option value="">{placeholder}</option>
      {values.map((value) => (
        <option key={value} value={value}>
          {value}
        </option>
      ))}
    </select>
  );

  return (
    <div className="timetable-filter-bar">
      {select("year", years, "All years")}
      {select("section", sections, "All sections")}
      {select("speciality", specialities, "All specialities")}
      {select("semester", semesters, "All semesters")}
      <button
        className="timetable-filter-reset"
        onClick={() => onChange("__reset__", "")}
      >
        Reset
      </button>
    </div>
  );
}

function TimetablePreviewGrid({ rows }) {
  const [filters, setFilters] = useState({
    year: "",
    section: "",
    speciality: "",
    semester: "",
  });

  const handleFilterChange = useCallback((key, value) => {
    if (key === "__reset__") {
      setFilters({ year: "", section: "", speciality: "", semester: "" });
      return;
    }

    setFilters((previous) => ({ ...previous, [key]: value }));
  }, []);

  const filteredRows = rows.filter((row) => {
    if (filters.year && row.year !== filters.year) return false;
    if (filters.section && row.section !== filters.section) return false;
    if (filters.speciality && row.speciality !== filters.speciality)
      return false;
    if (filters.semester && row.semester !== filters.semester) return false;
    return true;
  });

  const grid = buildTimetableGrid(filteredRows);

  return (
    <div style={{ marginTop: 24 }}>
      <div className="timetable-preview-header">
        <div>
          <h3 className="timetable-preview-title">Timetable preview</h3>
          <p className="timetable-preview-count">
            {filteredRows.length} session{filteredRows.length !== 1 ? "s" : ""}{" "}
            · {rows.length} total rows
          </p>
        </div>
      </div>

      <TimetableFilterBar
        rows={rows}
        filters={filters}
        onChange={handleFilterChange}
      />

      <div className="timetable-grid-wrap">
        <table className="timetable-grid">
          <thead>
            <tr>
              <th className="timetable-th timetable-th--time">Time</th>
              {TIMETABLE_DAYS.map((day) => (
                <th key={day} className="timetable-th">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIMETABLE_SLOT_STARTS.map((_, slotIndex) => (
              <tr key={slotIndex}>
                <td className="timetable-td timetable-td--time">
                  <span className="timetable-slot-label">
                    {TIMETABLE_TIME_SLOTS[slotIndex]}
                  </span>
                </td>

                {TIMETABLE_DAYS.map((day) => {
                  const sessions = grid[day]?.[slotIndex] ?? [];
                  return (
                    <td key={day} className="timetable-td">
                      {sessions.length > 0 ? (
                        sessions.map((session, index) => (
                          <TimetableSessionChip key={index} session={session} />
                        ))
                      ) : (
                        <span className="timetable-empty-cell" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="timetable-legend">
        {Object.entries(SESSION_TYPE_COLORS).map(([type, colors]) => (
          <span
            key={type}
            className="timetable-legend-item"
            style={{
              background: colors.bg,
              color: colors.text,
              border: `1px solid ${colors.border}`,
            }}
          >
            {type}
          </span>
        ))}
      </div>
    </div>
  );
}

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

// ── Page ─────────────────────────────────────────────────────────────────────
export default function ImportPage() {
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

  const options = [
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

  // ── helpers ────────────────────────────────────────────────────────────────

  const resetAll = () => {
    setFile(null);
    setPreviewRows([]);
    setParseErrors([]);
    setError(null);
    setSuccess(false);
    setShowErrorModal(false);
    setCriticalError(false);
  };

  const handleFileChange = async (e) => {
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
  };

  const handleUploadClick = () => fileInputRef.current.click();

  const normalizeImportResult = (payload, fallbackFileName) => {
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
  };

  const handleSubmit = async () => {
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
  };

  // ── render ─────────────────────────────────────────────────────────────────

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
          {options.map((opt) => (
            <ImportButton
              key={opt.id}
              icon={opt.icon}
              title={opt.title}
              description={opt.description}
              isSelected={selectedOption === opt.id}
              onClick={() => {
                setSelectedOption(opt.id);
                resetAll();
              }}
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
        selectedOption === 2 && <TimetablePreviewGrid rows={previewRows} />}

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
