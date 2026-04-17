import api from "./api";
import { API_ENDPOINTS } from "@/lib/constants";

/**
 * Fetch teacher's weekly planning (optionally filtered by semester and day)
 * @param {Object} params
 * @param {string} [params.semester] - S1 or S2
 * @param {string} [params.day] - Day of week (e.g., Monday)
 * @returns {Promise<Array>} List of sessions
 */
export async function getWeeklyPlanning({ semester, day } = {}) {
  const query = [];
  if (semester) query.push(`semester=${encodeURIComponent(semester)}`);
  if (day) query.push(`day=${encodeURIComponent(day)}`);
  const url = `${API_ENDPOINTS.MY_SCHEDULE}${query.length ? "?" + query.join("&") : ""}`;
  const { data } = await api.get(url);
  return data;
}
