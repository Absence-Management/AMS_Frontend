import api from "./api";

/**
 * Fetches the list of students with attendance state for a session.
 * Endpoint: GET /v1/sessions/{session_id}/attendance
 * Response shape: { session_id, total, records: [...] }
 */
export async function getSessionStudents(sessionId, q = null) {
  const params = q ? { q } : {};
  const response = await api.get(`/v1/sessions/${sessionId}/attendance`, { params });
  return response.data;
}

/**
 * Bulk updates attendance for a session.
 * Endpoint: PUT /v1/sessions/{session_id}/attendance
 * Payload: { records: [{ student_matricule, is_present, participation }] }
 */
export async function bulkUpdateAttendance(sessionId, attendanceData) {
  const response = await api.put(`/v1/sessions/${sessionId}/attendance`, attendanceData);
  return response.data;
}

/**
 * One-tap absence marking — UPSERT per student (US-19).
 * Endpoint: POST /v1/absences
 * First tap  → INSERT (is_absent=true)
 * Second tap → TOGGLE (present ↔ absent)
 */
export async function markAbsence({ sessionId, studentMatricule, isAbsent }) {
  const response = await api.post("/v1/absences", {
    session_id: sessionId,
    student_matricule: studentMatricule,
    is_absent: isAbsent,
    source: "PWA",
  });
  return response.data; // { created: bool }
}


/**
 * Adds a student directly to a session (Feature 2.2).
 */
export async function addStudentToSession(sessionId, matricule) {
  const response = await api.post(`/v1/sessions/${sessionId}/students`, { matricule });
  return response.data;
}

/**
 * Adds a group to a session (Feature 2.1).
 */
export async function addGroupToSession(sessionId, group_name) {
  const response = await api.post(`/v1/sessions/${sessionId}/groups`, { group_name });
  return response.data;
}

