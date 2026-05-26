import api from "@/services/api";

/**
 * Fetches students for the admin attendance list page.
 * Endpoint: GET /api/v1/students
 * Supports: search, filter, sort, pagination
 *
 * @param {Object} params - Query params: q, niveau, groupe, status, sort_by, sort_order, page, page_size
 * @returns {Promise<Object>} { total, students: [...] }
 */
export async function getAdminAttendanceStudents(params = {}) {
  const response = await api.get("/v1/students", { params });
  return response.data;
}
