import { API_ENDPOINTS } from "@/lib/constants";
import api from "@/services/api";

// Admins

export function getAllAdmins() {
  return api.get(API_ENDPOINTS.ADMINS).then((r) => r.data);
}

export function createAdmin(data) {
  return api.post(API_ENDPOINTS.ADMINS, data).then((r) => r.data);
}

// Teachers

export function getAllTeachers() {
  return api.get(API_ENDPOINTS.TEACHERS).then((r) => r.data);
}
/**
 * Update an admin account by ID.
 * @param {string} accountId - The admin account ID.
 * @param {object} data - The fields to update.
 * @returns {Promise<object>} The updated admin data.
 */
export function updateAdmin(accountId, data) {
  return api
    .patch(`/api/v1/accounts/admins/${accountId}`, data)
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

export const adminsService = createCrudService(API_ENDPOINTS.ADMINS);
export const getAdminById = (id) => 
  api.get(`${API_ENDPOINTS.ACCOUNTS}${id}`).then((r) => r.data);
export const patchAdmin = (id, data) => 
  api.patch(`${API_ENDPOINTS.ACCOUNTS}${id}`, data).then((r) => r.data);
