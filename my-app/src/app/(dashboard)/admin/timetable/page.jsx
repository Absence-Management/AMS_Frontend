"use client";

import { useEffect, useState } from "react";
import { TimetableGrid } from "@/components/timetable/TimetableGrid";
import { getTimetable } from "@/services/timetableService";
import { downloadPlanningCSV, downloadPlanningPDF } from "@/services/exportService";

  const DAY_OPTIONS = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi"];
  const SEMESTER_OPTIONS = ["S1", "S2"];

export default function TimetablePage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [total, setTotal] = useState(0);
  const [isExportingCSV, setIsExportingCSV] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [filters, setFilters] = useState({
    semester: "",
    day: "",
  });

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        setLoading(true);
        setError(false);
        const result = await getTimetable(filters);
        setRows(result.rows);
        setTotal(result.total);
      } catch (err) {
        setError(true);
        setRows([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      semester: "",
      day: "",
    });
  };

  const handleExportCSV = async () => {
    setIsExportingCSV(true);
    try {
      await downloadPlanningCSV(filters, "planning.csv");
    } catch (error) {
      console.error("Failed to export planning CSV", error);
      alert("Failed to export planning. Please try again.");
    } finally {
      setIsExportingCSV(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExportingPDF(true);
    try {
      await downloadPlanningPDF(filters, "planning.pdf");
    } catch (error) {
      console.error("Failed to export planning PDF", error);
      alert("Failed to export planning. Please try again.");
    } finally {
      setIsExportingPDF(false);
    }
  };

  return (
    <div className="main-page">
      <div className="main-header">
        <div className="main-header-text">
          <h2 className="main-title">Timetable</h2>
          <p className="main-subtitle">
            View imported sessions using the same timetable preview layout.
          </p>
        </div>

        <div className="flex gap-4">
          <button
            className="main-export-btn"
            onClick={handleExportCSV}
            disabled={isExportingCSV || isExportingPDF}
            style={{ opacity: isExportingCSV ? 0.7 : 1 }}
          >
            {isExportingCSV ? "Exporting..." : "Export CSV"}
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
          <button
            className="main-export-btn"
            onClick={handleExportPDF}
            disabled={isExportingCSV || isExportingPDF}
            style={{ opacity: isExportingPDF ? 0.7 : 1 }}
          >
            {isExportingPDF ? "Exporting..." : "Export PDF"}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points="14 2 14 8 20 8"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line
                x1="16"
                y1="13"
                x2="8"
                y2="13"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line
                x1="16"
                y1="17"
                x2="8"
                y2="17"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points="10 9 9 9 8 9"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="timetable-filter-bar">
        <select
          className="timetable-filter-select"
          value={filters.semester}
          onChange={(event) =>
            handleFilterChange("semester", event.target.value)
          }
        >
          <option value="">All semesters</option>
          {SEMESTER_OPTIONS.map((semester) => (
            <option key={semester} value={semester}>
              {semester}
            </option>
          ))}
        </select>

        <select
          className="timetable-filter-select"
          value={filters.day}
          onChange={(event) => handleFilterChange("day", event.target.value)}
        >
          <option value="">All days</option>
          {DAY_OPTIONS.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="timetable-filter-reset"
          onClick={handleResetFilters}
        >
          Reset
        </button>
      </div>

      {loading ? (
        <div className="timetable-page-state">Loading timetable...</div>
      ) : error ? (
        <div className="timetable-page-state" style={{ color: "#dc2626" }}>
          Failed to load timetable data. Please try again later.
        </div>
      ) : rows.length > 0 ? (
        <TimetableGrid
          rows={rows}
          title="Timetable overview"
          countLabel="sessions"
          totalCount={total}
          showHeader={false}
          showFilters={false}
        />
      ) : (
        <div className="timetable-page-state">
          No timetable data is available yet.
        </div>
      )}
    </div>
  );
}
