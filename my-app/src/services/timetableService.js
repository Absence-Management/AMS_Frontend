import api from "@/services/api";
import { API_ENDPOINTS } from "@/lib/constants";

const extractRows = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.sessions)) return payload.sessions;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

const normalizeTeacherName = (teacher) => {
  if (!teacher) return "";
  if (typeof teacher === "string") return teacher;

  return [teacher.first_name, teacher.last_name].filter(Boolean).join(" ").trim();
};

const normalizeSession = (session) => ({
  ...session,
  teacher: normalizeTeacherName(session.teacher),
  section: session.section ?? "",
  speciality: session.speciality ?? "",
  group: session.group ?? "",
});

export const getTimetable = async ({ semester, day } = {}) => {
  try {
    const params = {};
    if (semester) params.semester = semester;
    if (day) params.day = day;

    const response = await api.get(API_ENDPOINTS.MY_SCHEDULE, { params });
    const rows = extractRows(response.data).map(normalizeSession);
    const total =
      typeof response.data?.total === "number" ? response.data.total : rows.length;

    return { rows, total, isFallback: false };
  } catch (error) {
    console.error("Failed to fetch timetable:", error);
    throw error;
  }
};
