# Sprint 3 — Relevé d'Absence en Temps Réel

> **ESI Sidi Bel Abbès** · AMS Frontend · PFA 2025–2026
> **Duration:** 2 weeks · **7 User Stories** · **31 Story Points**
> **Last update:** 20 Apr 2026

---

## Sprint Goal

Allow the Teacher to consult their daily session list, mark student absences in one tap with real-time visual sync feedback, request corrections within or outside the free window, and search students by name or matricule — while the Admin reviews late correction requests and the system maintains a live attendance summary per session.

---

## User Stories

| US-18 | Teacher | See the list of today's sessions to know which session to open for absence marking            | High     | 3      | Done   |
| US-19 | Teacher | Mark a student absent with one tap and see the absence instantly reflected in the session     | High     | 8      | Done   |
| US-20 | Teacher | See a visual sync indicator (✅ saved / ⏳ pending / ❌ error) for each absence action         | High     | 5      | Done   |
| US-22 | Teacher | Correct an absence within 15 min of session end without Admin approval (free correction window) | High   | 5      | Done   |
| US-23 | Admin   | Review and approve/reject late correction requests submitted by teachers                      | High     | 5      | To Do  |
| US-24 | Teacher | See a live count of present / absent / pending students updating in real time during a session | Medium  | 3      | Done   |
| US-26 | Teacher | Search a student by name or matricule inside a session's student list                        | Medium   | 2      | Done   |

---

## Screens / Routes

| Path                                          | Description                                               | US Coverage          | Status |
| --------------------------------------------- | --------------------------------------------------------- | -------------------- | ------ |
| `app/(dashboard)/teacher/sessions/page.jsx`   | Daily session list for the logged-in teacher             | US-18                | Done   |
| `app/(dashboard)/teacher/sessions/[id]/page.jsx` | Session detail: student list + one-tap absence marking | US-19, US-20, US-24, US-26 | Done   |
| `app/(dashboard)/admin/corrections/page.jsx`  | Admin queue of pending late correction requests          | US-23                | To Do  |

---

## Components Status

### Attendance — Teacher Flow

| Component                                               | US       | Description                                                                 | Status |
| ------------------------------------------------------- | -------- | --------------------------------------------------------------------------- | ------ |
| `components/attendance/SessionCard.jsx`                 | US-18    | Card displaying module name, room, time range, group, and session type      | To Do  |
| `components/attendance/SessionList.jsx`                 | US-18    | List wrapper for SessionCards, sorted by start_time                        | To Do  |
| `components/attendance/StudentAbsenceRow.jsx`           | US-19, US-20, US-26 | Single student row: photo, name, matricule, tap-to-toggle absent button + sync badge | To Do  |
| `components/attendance/SyncStatusBadge.jsx`             | US-20    | Icon-only badge: ✅ SYNCED / ⏳ PENDING / ❌ FAILED / ⚠️ CONFLICT           | To Do  |
| `components/attendance/AttendanceSummaryBanner.jsx`     | US-24    | Sticky top banner: Present N / Absent N / Pending N, live-refreshed        | Done   |
| `components/attendance/StudentSearchBar.jsx`            | US-26    | Controlled input filtering the student list by name or matricule            | To Do  |
| `components/attendance/CorrectionRequestModal.jsx`      | US-22    | Modal to submit a correction request with reason field; shows free-window badge if still within 15 min | Done   |

### Corrections — Admin Flow

| Component                                               | US       | Description                                                                 | Status |
| ------------------------------------------------------- | -------- | --------------------------------------------------------------------------- | ------ |
| `components/corrections/CorrectionQueueTable.jsx`       | US-23    | Paginated table of PENDING late corrections with teacher, student, session, reason | To Do  |
| `components/corrections/CorrectionReviewModal.jsx`      | US-23    | Modal: shows original/new value, reason, session context; Approve / Reject + mandatory comment | To Do  |

### Notes

- `StudentAbsenceRow` encapsulates tap logic, sync badge, and correction button in one unit — avoids prop-drilling.
- `SyncStatusBadge` is reusable across row and global save counter.
- `AttendanceSummaryBanner` is fed by `useAttendanceSummary` hook polling `/api/v1/sessions/:id/summary`.
- `CorrectionRequestModal` auto-detects free window by comparing `Date.now()` against `session.end_time + 15 min`.

---

## Logic / Services / Hooks Status

| File                                   | US Coverage             | Description                                                                 | Status      |
| -------------------------------------- | ----------------------- | --------------------------------------------------------------------------- | ----------- |
| `services/sessionService.js`           | US-18                   | `getTodaySessions()` → GET `/api/v1/sessions/today`                        | Done        |
| `services/attendanceService.js`        | US-19, US-22, US-23     | `markAbsent()`, `toggleAbsence()`, `submitCorrection()`, `reviewCorrection()` | Done        |
| `hooks/useSessionList.js`              | US-18                   | Fetches and exposes today's sessions; loading + error state                 | Done        |
| `hooks/useAttendance.js`               | US-19, US-20, US-22     | Core hook: student list, tap-toggle, optimistic UI, sync status per student, correction submission | Done        |
| `hooks/useAttendanceSummary.js`        | US-24                   | Polls `GET /api/v1/sessions/:id/summary` every 5 s; returns `{ present, absent, pending }` | Done        |
| `lib/constants.js`                     | US-18, US-19, US-22     | Add: `SESSION_STATUS`, `ABSENCE_SOURCE`, `SYNC_STATUS`, `CORRECTION_STATUS` enums | Done        |

---

## Backend Endpoints (frontend integration map)

| Endpoint                                       | Method   | US       | Description                                          | Status |
| ---------------------------------------------- | -------- | -------- | ---------------------------------------------------- | ------ |
| `GET /api/v1/sessions/today`                   | GET      | US-18    | Returns today's sessions for the authenticated teacher | To Do |
| `GET /api/v1/sessions/:id/students`            | GET      | US-19, US-26 | Full enrolled student list for the session         | To Do |
| `POST /api/v1/absences`                        | POST     | US-19    | Create absence record (is_absent=true)               | To Do |
| `PATCH /api/v1/absences/:id`                   | PATCH    | US-19    | Toggle absence (UPSERT strategy — re-tap marks present) | To Do |
| `GET /api/v1/sessions/:id/summary`             | GET      | US-24    | Returns `{ total, present, absent, pending }`        | To Do |
| `POST /api/v1/absences/:id/corrections`        | POST     | US-22    | Submit correction request with reason + `within_free_window` flag | To Do |
| `GET /api/v1/corrections`                      | GET      | US-23    | Admin: paginated PENDING correction queue            | To Do |
| `PATCH /api/v1/corrections/:id`                | PATCH    | US-23    | Admin: APPROVE or REJECT + mandatory comment         | To Do |

---

---

---

---

## Free Correction Window Logic (US-22 — Frontend)

```js
// lib/correctionUtils.js
export const isWithinFreeWindow = (sessionEndTime) => {
  const windowMs = 15 * 60 * 1000; // 15 minutes
  return Date.now() <= new Date(sessionEndTime).getTime() + windowMs;
};
```

- `CorrectionRequestModal` calls this util on open.
- If `true` → badge "Free window — no Admin approval needed" shown in green.
- If `false` → badge "Requires Admin approval" shown in amber; reason field becomes required.
- In both cases, the same `POST /api/v1/absences/:id/corrections` endpoint is called; the `within_free_window` boolean is sent in the payload so the backend can auto-approve or route to Admin queue.

---

## Blockers / Risks

- `GET /api/v1/sessions/today` must filter by authenticated teacher — depends on JWT claims being correctly scoped (Sprint 1 concern).
- `PATCH /api/v1/absences/:id` UPSERT strategy must be confirmed with backend team before `useAttendance` optimistic updates are finalized (US-19).
- `session.end_time` must be included in the session detail API response for free-window detection (US-22).

---

## Remaining Tasks

### Session List (US-18)

- [x] Create `app/(dashboard)/teacher/sessions/page.jsx`
- [x] Build `components/attendance/SessionCard.jsx` *(implemented as `SessionCard.jsx` in `session/`)*
- [x] Build `components/attendance/SessionList.jsx` *(handled inline in `sessions/page.jsx`)*
- [x] Create `services/sessionService.js` with `getTodaySessions()` *(handled by `timetableService.js`)*
- [x] Create `hooks/useSessionList.js` *(handled inline in `sessions/page.jsx`)*
- [x] Add `SESSION_STATUS` + `session_type_enum` to `lib/constants.js`

### Absence Marking (US-19, US-20, US-26)

- [x] Create `app/(dashboard)/teacher/sessions/[id]/page.jsx`
- [x] Build `components/attendance/StudentAbsenceRow.jsx` (tap toggle + sync badge) *(implemented inside `SessionStudentsTable.jsx`)*
- [x] Build `components/attendance/SyncStatusBadge.jsx` *(implemented as `SyncStatusBadge.jsx` in `session/`)*
- [x] Build `components/attendance/StudentSearchBar.jsx` *(implemented inside `SessionStudentsTable.jsx`)*
- [x] Create `services/attendanceService.js` (`markAbsent`, `toggleAbsence`)
- [x] Create `hooks/useAttendance.js` (optimistic UI + sync state per student)
- [x] Add `SYNC_STATUS` + `ABSENCE_SOURCE` to `lib/constants.js`
- [ ] Add `CORRECTION_STATUS` to `lib/constants.js`

### Live Summary (US-24)

- [x] Build `components/attendance/AttendanceSummaryBanner.jsx` *(implemented as `SessionDetailsStats.jsx`)*
- [x] Create `hooks/useAttendanceSummary.js` (polling every 5 s)

### Corrections (US-22, US-23)

- [x] Create `lib/correctionUtils.js` (`isWithinFreeWindow`)
- [x] Build `components/attendance/CorrectionRequestModal.jsx`
- [ ] Add `submitCorrection()` to `services/attendanceService.js`
- [ ] Create `app/(dashboard)/admin/corrections/page.jsx`
- [ ] Build `components/corrections/CorrectionQueueTable.jsx`
- [ ] Build `components/corrections/CorrectionReviewModal.jsx`
- [ ] Add `reviewCorrection()` to `services/attendanceService.js`
- [ ] Add `CORRECTION_STATUS` to `lib/constants.js`

### Testing / Verification

- [x] Verify session list shows only today's sessions for logged-in teacher *(using mock data)*
- [x] Verify one-tap toggle (absent → present → absent) with correct API calls *(mocked)*
- [x] Verify sync badge transitions: PENDING → SYNCED / FAILED *(mocked simulation)*
- [ ] Verify conflict badge appears on concurrent device edit
- [x] Verify free-window correction UI appears correctly
- [ ] Verify late correction appears in Admin queue
- [ ] Verify Admin approve/reject updates student's absence status
- [x] Verify summary banner live count matches state
- [x] Verify student search filters by name AND matricule

### Sprint Review Prep

- [ ] Code cleanup + PR reviews
- [ ] All branches merged to sprint branch
- [ ] Demo script: open session → mark 3 absences → confirm sync → request correction → admin approves
- [ ] Deploy to staging

---

## Definition of Done (DoD Check)

- [ ] Teacher sees today's session list scoped to their account (US-18)
- [ ] One-tap absence marking works with optimistic UI and server confirmation (US-19)
- [ ] Sync status badge reflects PENDING / SYNCED / FAILED in real time (US-20)
- [ ] Free-window correction submits without Admin approval; late correction enters Admin queue (US-22)
- [ ] Admin can approve or reject late corrections with mandatory comment (US-23)
- [ ] Live summary banner updates without page reload (US-24)
- [ ] Student search by name and matricule filters list in real time (US-26)
- [ ] No new feature regresses Sprint 2 import/export flows
- [ ] All PRs reviewed and merged to sprint branch
- [ ] Demo approved in Sprint Review with supervisors
- [ ] Deployed to staging

> Never push to `main` directly — open a PR and wait for lead developer approval.
