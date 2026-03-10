// ============================================
// AMS — ESI Sidi Bel Abbès
// services/userService.js — Users API Calls
// ============================================

import api from "@/services/api";
import { API_ENDPOINTS } from "@/lib/constants";

// ── Get All Users ─────────────────────────────
export const getAllUsers = async () => {
  const response = await api.get(API_ENDPOINTS.USERS);
  return response.data; // [{ id, first_name, last_name, email, role, is_active }]
};

// ── Get User Me ───────────────────────────────
export const getUserMe = async () => {
  const response = await api.get(API_ENDPOINTS.USER_ME);
  return response.data; // { id, first_name, last_name, email, role }
};

// ── Create User ───────────────────────────────
// userData: { email, password, first_name, last_name, role }
export const createUser = async (userData) => {
  const response = await api.post(API_ENDPOINTS.USERS, userData);
  return response.data;
};

// ── Update User ───────────────────────────────
// userData: { email, first_name, last_name, role }
export const updateUser = async (id, userData) => {
  const response = await api.put(`${API_ENDPOINTS.USERS}${id}/`, userData);
  return response.data;
};

// ── Disable User ──────────────────────────────
// Disables the user account — does not delete
export const disableUser = async (id) => {
  const response = await api.patch(API_ENDPOINTS.DISABLE_USER(id));
  return response.data;
};

// ── Assign Role ───────────────────────────────
// role: "ADMIN" | "TEACHER"
export const assignRole = async (id, role) => {
  const response = await api.patch(API_ENDPOINTS.ASSIGN_ROLE(id), { role });
  return response.data;
};