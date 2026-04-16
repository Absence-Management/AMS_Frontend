"use client";

import { useEffect, useState } from "react";
import { TimetableGrid } from "@/components/timetable/TimetableGrid";
import { getTimetable } from "@/services/timetableService";

  const DAY_OPTIONS = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi"];
  const SEMESTER_OPTIONS = ["S1", "S2"];

export default function TimetablePage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [total, setTotal] = useState(0);
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

  return (
    <div className="main-page">
      <div className="main-header">
        <div className="main-header-text">
          <h2 className="main-title">Timetable</h2>
          <p className="main-subtitle">
            View imported sessions using the same timetable preview layout.
          </p>
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
