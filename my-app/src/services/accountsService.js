import api from "@/services/api";
import { API_ENDPOINTS } from "@/lib/constants";

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
export const teachersService = createCrudService(API_ENDPOINTS.TEACHERS);
