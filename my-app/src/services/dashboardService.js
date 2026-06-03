// ============================================
// AMS — ESI Sidi Bel Abbès
// services/dashboardService.js — Dashboard API Calls
// ============================================

import api from "@/services/api";

export const dashboardService = {
  /**
   * Returns the 4 admin dashboard stat cards.
   * @returns {{ total_students, absence_rate, students_at_warning, students_at_exclusion }}
   */
  getStats: async () => {
    // const response = await api.get("/v1/dashboard/stats", { skipGlobalLoader: true });
    // return response.data;
    return {
      total_students: 1250,
      absence_rate: 12.4,
      students_at_warning: 45,
      students_at_exclusion: 12
    };
  },

  /**
   * Returns absence rate per study level for the bar chart.
   * @param {number} [year] - Academic year ending year (e.g. 2026 → 2025–2026).
   * @returns {{ year: number, data: { level: string, rate: number }[] }}
   */
  getAbsencesByLevel: async (year) => {
    // const params = year ? { year } : {};
    // const response = await api.get("/v1/dashboard/absences-by-level", { params, skipGlobalLoader: true });
    // return response.data;
    return {
      year: year || 2026,
      data: [
        { level: "1CPI", rate: 5.2 },
        { level: "2CPI", rate: 8.4 },
        { level: "1CS", rate: 12.1 },
        { level: "2CS", rate: 15.3 },
        { level: "3CS", rate: 9.7 },
      ]
    };
  },

  /**
   * Returns monthly absence counts for the line chart.
   * Months are in academic-year order (Sep → Aug).
   * @param {number} [year] - Academic year ending year (e.g. 2026 → 2025–2026).
   * @returns {{ year: number, data: { month: string, absences: number }[] }}
   */
  getMonthlyTrends: async (year) => {
    // const params = year ? { year } : {};
    // const response = await api.get("/v1/dashboard/monthly-trends", { params, skipGlobalLoader: true });
    // return response.data;
    return {
      year: year || 2026,
      data: [
        { month: "Sep", absences: 150 },
        { month: "Oct", absences: 320 },
        { month: "Nov", absences: 410 },
        { month: "Dec", absences: 280 },
        { month: "Jan", absences: 520 },
        { month: "Feb", absences: 390 },
        { month: "Mar", absences: 460 },
        { month: "Apr", absences: 310 },
        { month: "May", absences: 220 },
      ]
    };
  },

  /**
   * Returns the 2 teacher dashboard stat cards.
   * Auth: Teacher only (JWT).
   * @returns {{ students_at_risk: number, avg_absence_rate: number }}
   */
  getTeacherStats: async () => {
    const response = await api.get("/v1/teacher/dashboard/stats", { skipGlobalLoader: true });
    return response.data;
  },

  /**
   * Returns absence rate per module for the teacher bar chart.
   * Auth: Teacher only (JWT).
   * @param {number} [year] - Academic year ending year (e.g. 2026 → 2025–2026).
   * @returns {{ year: number, data: { module: string, label: string, rate: number, type: string }[] }}
   */
  getTeacherModuleRates: async (year) => {
    const params = year ? { year } : {};
    const response = await api.get("/v1/teacher/dashboard/module-absence-rates", { params, skipGlobalLoader: true });
    return response.data;
  },

  /**
   * Returns students at or near the absence threshold for the teacher's modules.
   * Sorted by absence count descending.
   * Auth: Teacher only (JWT).
   * @returns {{ total: number, alerts: { student_id, full_name, initials, module, absences, threshold, avatar_color }[] }}
   */
  getTeacherThresholdAlerts: async () => {
    const response = await api.get("/v1/teacher/dashboard/threshold-alerts", { skipGlobalLoader: true });
    return response.data;
  },
};
