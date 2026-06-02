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
    const response = await api.get("/v1/dashboard/stats");
    return response.data;
  },

  /**
   * Returns absence rate per study level for the bar chart.
   * @param {number} [year] - Academic year ending year (e.g. 2026 → 2025–2026).
   * @returns {{ year: number, data: { level: string, rate: number }[] }}
   */
  getAbsencesByLevel: async (year) => {
    const params = year ? { year } : {};
    const response = await api.get("/v1/dashboard/absences-by-level", { params });
    return response.data;
  },

  /**
   * Returns monthly absence counts for the line chart.
   * Months are in academic-year order (Sep → Aug).
   * @param {number} [year] - Academic year ending year (e.g. 2026 → 2025–2026).
   * @returns {{ year: number, data: { month: string, absences: number }[] }}
   */
  getMonthlyTrends: async (year) => {
    const params = year ? { year } : {};
    const response = await api.get("/v1/dashboard/monthly-trends", { params });
    return response.data;
  },

  /**
   * Returns the 2 teacher dashboard stat cards.
   * Auth: Teacher only (JWT).
   * @returns {{ students_at_risk: number, avg_absence_rate: number }}
   */
  getTeacherStats: async () => {
    const response = await api.get("/v1/teacher/dashboard/stats");
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
    const response = await api.get("/v1/teacher/dashboard/module-absence-rates", { params });
    return response.data;
  },

  /**
   * Returns students at or near the absence threshold for the teacher's modules.
   * Sorted by absence count descending.
   * Auth: Teacher only (JWT).
   * @returns {{ total: number, alerts: { student_id, full_name, initials, module, absences, threshold, avatar_color }[] }}
   */
  getTeacherThresholdAlerts: async () => {
    const response = await api.get("/v1/teacher/dashboard/threshold-alerts");
    return response.data;
  },
};
