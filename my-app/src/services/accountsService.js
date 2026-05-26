import { API_ENDPOINTS } from "@/lib/constants";
import api from "@/services/api";

// Admins

export function getAllAdmins() {
  return api.get(API_ENDPOINTS.ADMINS).then((r) => r.data);
}

export function createAdmin(data) {
  return api.post(API_ENDPOINTS.ADMINS, data).then((r) => r.data);
}

export function getAdminProfile(accountId) {
  return api
    .get(`${API_ENDPOINTS.ADMIN_BY_ID}/${accountId}`)
    .then((r) => r.data);
}

export function patchAdmin(accountId, data) {
  return api
    .patch(`${API_ENDPOINTS.ADMIN_BY_ID}/${accountId}`, data)
    .then((r) => r.data);
}

// Teachers

export function getAllTeachers() {
  return api.get(API_ENDPOINTS.TEACHERS).then((r) => r.data);
}

export async function fetchTeachers() {
  try {
    const response = await api.get(API_ENDPOINTS.TEACHERS);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch teachers:", error);
    throw error;
  }
}

// Fetch students with absence counts from the new API
export async function fetchStudentsWithAbsenceCounts(params = {}) {
  // Remove page and page_size if present
  const { page, page_size, ...filteredParams } = params;
  const response = await api.get("/v1/students", { params: filteredParams });
  console.log("/v1/students API response:", response.data);
  // API returns an array directly
  return response.data;
}

export function updateAdmin(accountId, data) {
  return api
    .patch(`${API_ENDPOINTS.ADMIN_BY_ID}/${accountId}`, data)
    .then((res) => res.data);
}

function createCrudService(basePath) {
  const url = (id) => `${basePath.replace(/\/$/, "")}/${id}`;
  return {
    getAll: () => api.get(basePath).then((r) => r.data),
    getById: (id) => api.get(url(id)).then((r) => r.data),
    create: (data) => api.post(basePath, data).then((r) => r.data),
    update: (id, data) => api.patch(url(id), data).then((r) => r.data),
    delete: (id) => api.delete(url(id)).then((r) => r.data),
  };
}

export const studentsService = createCrudService(API_ENDPOINTS.STUDENTS);

// GET /api/v1/accounts/{account_id}
export const getAccountById = (accountId) =>
  api.get(`${API_ENDPOINTS.ACCOUNTS}${accountId}`).then((r) => r.data);

export const getStudentById = (id) =>
  api.get(`${API_ENDPOINTS.ACCOUNTS}${id}`).then((r) => r.data);
export const patchStudent = (id, data) =>
  api.patch(`${API_ENDPOINTS.ACCOUNTS}${id}`, data).then((r) => r.data);
export const updateStudentStatus = (id, status) =>
  api.patch(`/v1/students/${id}/status`, { status }).then((r) => r.data);

export const teachersService = createCrudService(API_ENDPOINTS.TEACHERS);
export const getTeacherById = (id) =>
  api.get(`${API_ENDPOINTS.ACCOUNTS}${id}`).then((r) => r.data);
export const patchTeacher = (id, data) =>
  api.patch(`${API_ENDPOINTS.ACCOUNTS}${id}`, data).then((r) => r.data);

export const getAdminById = (id) =>
  api.get(`${API_ENDPOINTS.ADMIN_BY_ID}/${id}`).then((r) => r.data);
