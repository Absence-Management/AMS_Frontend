import { API_ENDPOINTS } from "@/lib/constants";
import api from "@/services/api";

export async function getTeacherProfile(matricule) {
  const response = await api.get(
    `${API_ENDPOINTS.TEACHER_BY_MATRICULE}/${encodeURIComponent(matricule)}`,
  );
  return response.data;
}

export async function getMyGroups() {
  const response = await api.get(API_ENDPOINTS.TEACHER_MY_GROUPS);
  return response.data;
}

export async function getGroupStudents(groupName, year) {
  const response = await api.get(
    `${API_ENDPOINTS.TEACHER_MY_GROUPS}/${encodeURIComponent(groupName)}/students`,
    { params: { year } },
  );
  return response.data;
}

export async function getStudentHistory(groupName, matricule, year) {
  const response = await api.get(
    `${API_ENDPOINTS.TEACHER_MY_GROUPS}/${encodeURIComponent(groupName)}/students/${encodeURIComponent(matricule)}/history`,
    { params: { year } },
  );
  return response.data;
}
