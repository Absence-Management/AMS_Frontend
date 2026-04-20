// ============================================
// AMS — ESI Sidi Bel Abbès
// constants.js — Global Constants
// Web Version : Admin & Teacher only
// ============================================

// ----------------------------
// APP CONFIG
// ----------------------------
export const CONFIG = {
  API_URL: "/api", // ← was process.env.NEXT_PUBLIC_API_URL
};
// ----------------------------
// USER ROLES — must match backend exactly
// ----------------------------
export const ROLES = {
  ADMIN: "admin",
  TEACHER: "teacher",
  STUDENT: "student",
};

// ----------------------------
// ACCOUNT STATUSES
// ----------------------------
export const STATUSES = {
  ACTIVE: "active",
  DISABLED: "disabled",
};

// ----------------------------
// CSV SCHEMAS (US-16)
// ----------------------------
export const CSV_SCHEMAS = {
  students: [
    "matricule",
    "nom",
    "prenom",
    "filiere",
    "niveau",
    "groupe",
    "email",
  ],
  teachers: ["id_enseignant", "nom", "prenom", "email", "grade", "departement"],
  timetable: [
    "year",
    "section",
    "speciality",
    "semester",
    "day",
    "time_start",
    "time_end",
    "type",
    "subject",
    "teacher",
    "room",
    "group",
  ],
};

// ----------------------------
// JWT TOKEN CONFIG
// ----------------------------
export const TOKEN = {
  ACCESS_EXPIRY: 15 * 60 * 1000, // 15 minutes in ms
  REFRESH_EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  REFRESH_INTERVAL: 14 * 60 * 1000, // refresh every 14 min
  INACTIVITY_LIMIT: 30 * 60 * 1000, // auto logout after 30 min
};

// ----------------------------
// ROLE-BASED REDIRECT ROUTES
// ----------------------------
export const ROLE_ROUTES = {
  [ROLES.ADMIN]: "/admin",
  [ROLES.TEACHER]: "/teacher",
};

// ----------------------------
// SESSION & ATTENDANCE
// ----------------------------
export const SESSION_STATUS = {
  SCHEDULED: "scheduled",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELED: "canceled",
};

export const SESSION_TYPE = {
  COURSE: "Course",
  TD: "TD",
  LAB: "Lab",
  EXAM: "Exam",
};

export const SYNC_STATUS = {
  SYNCED: "synced",
  PENDING: "pending",
  FAILED: "failed",
};

export const ABSENCE_SOURCE = {
  TEACHER: "teacher",
  SYSTEM: "system",
  ADMIN: "admin",
};

export const API_ENDPOINTS = {
  LOGIN: "/v1/auth/login",
  LOGOUT: "/v1/auth/logout",
  REFRESH_TOKEN: "/v1/auth/refresh",
  RESET_PASSWORD: "/v1/auth/reset-password",
  RESET_PASSWORD_CONFIRM: "/v1/auth/reset-password/confirm",
  CHANGE_PASSWORD: "/v1/auth/change-password",
  ME: "/v1/auth/me",
  GOOGLE_AUTH: "/v1/auth/google",
  STUDENTS: "/v1/accounts/students/",
  TEACHERS: "/v1/accounts/teachers/",
  ADMINS: "/v1/accounts/admins/",
  ACCOUNTS: "/v1/accounts/",
  USER_ME: "/v1/accounts/me",
  IMPORT_STUDENTS: "/v1/import/students",
  IMPORT_TEACHERS: "/v1/import/teachers",
  IMPORT_TIMETABLE: "/v1/import/planning",
  IMPORT_EXPORT_HISTORY: "/v1/import-export/history",
  EXPORT_ABSENCES: "/v1/export/absences",
  MY_SCHEDULE: "/v1/planning/my-schedule",
};
