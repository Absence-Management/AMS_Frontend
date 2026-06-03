import api from "@/services/api";
import { API_ENDPOINTS } from "@/lib/constants";

/**
 * Fetch compensation requests for sessions owned by the calling teacher.
 *
 * @param {Object} params
 * @param {"PENDING"|"APPROVED"|"REJECTED"|undefined} params.status
 * @param {string|undefined} params.session_id   UUID
 * @param {number} params.page
 * @param {number} params.page_size
 * @returns {Promise<{ data: Array, total: number }>}
 */
export async function fetchCompensationRequests(params = {}) {
  const response = await api.get(API_ENDPOINTS.COMPENSATION_REQUESTS, {
    params,
  });
  return response.data; // { data: [...], total: N }
}

/**
 * Approve a single compensation request.
 * @param {string} id — UUID of the request
 */
export async function approveCompensationRequest(id) {
  const response = await api.patch(
    `${API_ENDPOINTS.COMPENSATION_REQUESTS}/${id}/approve`,
  );
  return response.data;
}

/**
 * Reject a single compensation request.
 * @param {string} id — UUID of the request
 */
export async function rejectCompensationRequest(id) {
  const response = await api.patch(
    `${API_ENDPOINTS.COMPENSATION_REQUESTS}/${id}/reject`,
  );
  return response.data;
}
