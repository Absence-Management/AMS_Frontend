// import api from "./api";
// import { API_ENDPOINTS } from "@/lib/constants";

/**
 * MOCK DATA for initial development
 */
const MOCK_STUDENTS_LIST = [
  {
    id: 1,
    name: "Bouhafs Rim",
    email: "r.bouhafs@esi-sba.dz",
    matricule: "202334652314",
    is_absent: true,
    avatar_color: "#e2e8f0",
  },
  {
    id: 2,
    name: "Ilyes Brahmi",
    email: "i.brahmi@esi-sba.dz",
    matricule: "202334652320",
    is_absent: false,
    avatar_color: "#dbeafe",
  },
  {
    id: 3,
    name: "Trari Foued",
    email: "f.trari@esi-sba.dz",
    matricule: "202334652321",
    is_absent: false,
    avatar_color: "#fbecd1",
  },
  {
    id: 4,
    name: "Khelifi Sara",
    email: "s.khelifi@esi-sba.dz",
    matricule: "202334652322",
    is_absent: false,
    avatar_color: "#f5d0fe",
  },
  {
    id: 5,
    name: "Cherif Malik",
    email: "m.cherif@esi-sba.dz",
    matricule: "202334652323",
    is_absent: false,
    avatar_color: "#e2e8f0",
  },
];

/**
 * Toggles a student's absence for a session.
 * MOCK implementation: Always succeeds after 500ms.
 */
export async function toggleAbsence(sessionId, studentId, isAbsent, absenceId = null) {
  console.log(`[MOCK API] toggleAbsence: sess=${sessionId}, stud=${studentId}, absent=${isAbsent}, id=${absenceId}`);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: absenceId || Math.floor(Math.random() * 10000),
        session_id: sessionId,
        student_id: studentId,
        is_absent: isAbsent,
      });
    }, 500);
  });
}

/**
 * Fetches the list of students for a session.
 * MOCK implementation: Returns static list after 800ms.
 */
export async function getSessionStudents(sessionId) {
  console.log(`[MOCK API] getSessionStudents: sess=${sessionId}`);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_STUDENTS_LIST);
    }, 800);
  });
}
