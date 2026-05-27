import api from "@/services/api";
import { API_ENDPOINTS } from "@/lib/constants";

export async function fetchJustifications(params = {}) {
  try {
    const response = await api.get(API_ENDPOINTS.JUSTIFICATIONS, { params });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch justifications:", error);
    throw error;
  }
}

export async function approveJustification(id) {
  try {
    const response = await api.patch(`${API_ENDPOINTS.JUSTIFICATIONS}/${id}/approve`);
    return response.data;
  } catch (error) {
    console.error(`Failed to approve justification ${id}:`, error);
    throw error;
  }
}

export async function rejectJustification(id, reason = "") {
  try {
    const payload = reason ? { reason } : {};
    const response = await api.patch(`${API_ENDPOINTS.JUSTIFICATIONS}/${id}/reject`, payload);
    return response.data;
  } catch (error) {
    console.error(`Failed to reject justification ${id}:`, error);
    throw error;
  }
}

export async function bulkApproveJustifications(ids = []) {
  try {
    const payload = ids && ids.length > 0 ? { ids } : {};
    const response = await api.patch(`${API_ENDPOINTS.JUSTIFICATIONS}/approve-all`, payload);
    return response.data;
  } catch (error) {
    console.error("Failed to bulk approve justifications:", error);
    throw error;
  }
}

export async function bulkRejectJustifications(ids = [], reason = "") {
  try {
    const payload = {};
    if (ids && ids.length > 0) payload.ids = ids;
    if (reason) payload.reason = reason;
    
    const response = await api.patch(`${API_ENDPOINTS.JUSTIFICATIONS}/reject-all`, payload);
    return response.data;
  } catch (error) {
    console.error("Failed to bulk reject justifications:", error);
    throw error;
  }
}
