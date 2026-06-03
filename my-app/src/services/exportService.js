// Max rows to export in CSV (matches backend/export limit)
export const EXPORT_MAX_ROWS = 1000;
// ============================================
// AMS — ESI Sidi Bel Abbès
// services/exportService.js — Export API Calls
// ============================================

import api from "./api";
import { API_ENDPOINTS } from "@/lib/constants";

/**
 * Build clean query params — omits null/empty/undefined values so the
 * backend doesn't receive empty strings as filter values.
 */
function buildParams(filters = {}, extra = {}) {
  const params = {};
  const all = { ...filters, ...extra };
  for (const [key, value] of Object.entries(all)) {
    if (value !== null && value !== undefined && value !== "") {
      params[key] = value;
    }
  }
  return params;
}

/**
 * Preview absences as JSON for the table.
 * Uses the same endpoint but axios returns JSON rows for display.
 *
 * @param {object} filters  { filiere, code_module, date_from, date_to, matricule_etudiant }
 * @param {number} page
 * @param {number} pageSize
 * @returns {Promise<{ items: object[], total: number }>}
 */
export const previewAbsences = async (filters, page = 1, pageSize = 10) => {
  const response = await api.get(API_ENDPOINTS.EXPORT_ABSENCES, {
    params: buildParams(filters, { page, page_size: pageSize }),
    headers: { Accept: "application/json" },
  });
  return response.data; // { items: [...], total: N }
};

/**
 * Download absences as a CSV file.
 * Fetches the full result (page_size=1000) and triggers a browser download.
 *
 * @param {object} filters  { filiere, code_module, date_from, date_to, matricule_etudiant }
 * @param {string} filename  suggested filename (default: absences.csv)
 */
export const downloadAbsencesCSV = async (
  filters,
  filename = "absences.csv",
) => {
  const response = await api.get(API_ENDPOINTS.EXPORT_ABSENCES_CSV, {
    params: buildParams(filters),
    headers: { Accept: "text/csv" },
    responseType: "blob",
  });

  const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();

  // Cleanup
  link.remove();
  URL.revokeObjectURL(url);
};

/**
 * Download absences as a PDF file.
 *
 * @param {object} filters  { year, semester, month, week, day, module, group, teacher_id, student_id }
 * @param {string} filename  suggested filename (default: absences.pdf)
 */
export const downloadAbsencesPDF = async (
  filters,
  filename = "absences.pdf",
) => {
  const response = await api.get(API_ENDPOINTS.EXPORT_ABSENCES_PDF, {
    params: buildParams(filters),
    headers: { Accept: "application/pdf" },
    responseType: "blob",
  });

  const blob = new Blob([response.data], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();

  // Cleanup
  link.remove();
  URL.revokeObjectURL(url);
};

/**
 * Download students as a CSV file.
 *
 * @param {object} filters  { year, group, search }
 * @param {string} filename  suggested filename (default: students.csv)
 */
export const downloadStudentsCSV = async (
  filters = {},
  filename = "students.csv",
) => {
  const response = await api.get(`/v1/export/students/csv`, {
    params: buildParams(filters),
    headers: { Accept: "text/csv" },
    responseType: "blob",
  });

  const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();

  // Cleanup
  link.remove();
  URL.revokeObjectURL(url);
};

/**
 * Download students as a PDF file.
 *
 * @param {object} filters  { year, group, search }
 * @param {string} filename  suggested filename (default: students.pdf)
 */
export const downloadStudentsPDF = async (
  filters = {},
  filename = "students.pdf",
) => {
  const response = await api.get(`/v1/export/students/pdf`, {
    params: buildParams(filters),
    headers: { Accept: "application/pdf" },
    responseType: "blob",
  });

  const blob = new Blob([response.data], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();

  // Cleanup
  link.remove();
  URL.revokeObjectURL(url);
};

/**
 * Download teachers as a CSV file.
 *
 * @param {object} filters  { year, module, search }
 * @param {string} filename  suggested filename (default: teachers.csv)
 */
export const downloadTeachersCSV = async (
  filters = {},
  filename = "teachers.csv",
) => {
  const response = await api.get(`/v1/export/teachers/csv`, {
    params: buildParams(filters),
    headers: { Accept: "text/csv" },
    responseType: "blob",
  });

  const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();

  // Cleanup
  link.remove();
  URL.revokeObjectURL(url);
};

/**
 * Download teachers as a PDF file.
 *
 * @param {object} filters  { year, module, search }
 * @param {string} filename  suggested filename (default: teachers.pdf)
 */
export const downloadTeachersPDF = async (
  filters = {},
  filename = "teachers.pdf",
) => {
  const response = await api.get(`/v1/export/teachers/pdf`, {
    params: buildParams(filters),
    headers: { Accept: "application/pdf" },
    responseType: "blob",
  });

  const blob = new Blob([response.data], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();

  // Cleanup
  link.remove();
  URL.revokeObjectURL(url);
};

/**
 * Download planning as a CSV file.
 *
 * @param {object} filters  { year, semester, week, day, group, teacher_id, module }
 * @param {string} filename  suggested filename (default: planning.csv)
 */
export const downloadPlanningCSV = async (
  filters = {},
  filename = "planning.csv",
) => {
  const response = await api.get(`/v1/export/planning/csv`, {
    params: buildParams(filters),
    headers: { Accept: "text/csv" },
    responseType: "blob",
  });

  const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();

  // Cleanup
  link.remove();
  URL.revokeObjectURL(url);
};

/**
 * Download planning as a PDF file.
 *
 * @param {object} filters  { year, semester, week, day, group, teacher_id, module }
 * @param {string} filename  suggested filename (default: planning.pdf)
 */
export const downloadPlanningPDF = async (
  filters = {},
  filename = "planning.pdf",
) => {
  const response = await api.get(`/v1/export/planning/pdf`, {
    params: buildParams(filters),
    headers: { Accept: "application/pdf" },
    responseType: "blob",
  });

  const blob = new Blob([response.data], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();

  // Cleanup
  link.remove();
  URL.revokeObjectURL(url);
};
