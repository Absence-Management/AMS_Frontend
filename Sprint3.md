# Sprint 3 — Relevé d'Absence en Temps Réel

> **ESI Sidi Bel Abbès** · AMS Frontend · PFA 2025–2026
> **Duration:** 2 weeks · **9 User Stories** · **42 Story Points**
> **Last update:** 16 Apr 2026

---

## Sprint Goal

Allow the Teacher to consult their daily session list, mark student absences in one tap with real-time visual sync feedback, request corrections within or outside the free window, and search students by name or matricule — while the Admin reviews late correction requests and the system maintains a live attendance summary per session.

---

## User Stories

| ID    | Role    | User Story                                                                                    | Priority | Points | Status |
| ----- | ------- | --------------------------------------------------------------------------------------------- | -------- | ------ | ------ |
| US-18 | Teacher | See the list of today's sessions to know which session to open for absence marking            | High     | 3      | To Do  |
| US-19 | Teacher | Mark a student absent with one tap and see the absence instantly reflected in the session     | High     | 8      | To Do  |
| US-20 | Teacher | See a visual sync indicator (✅ saved / ⏳ pending / ❌ error) for each absence action         | High     | 5      | To Do  |
| US-21 | Teacher | Continue marking absences when offline (PWA) and have them auto-sync on reconnect             | Medium   | 8      | To Do  |
| US-22 | Teacher | Correct an absence within 15 min of session end without Admin approval (free correction window) | High   | 5      | To Do  |
| US-23 | Admin   | Review and approve/reject late correction requests submitted by teachers                      | High     | 5      | To Do  |
| US-24 | Teacher | See a live count of present / absent / pending students updating in real time during a session | Medium  | 3      | To Do  |
| US-25 | Teacher | Use the absence marking interface on any modern browser without installing a native app (PWA) | Medium   | 3      | To Do  |
| US-26 | Teacher | Search a student by name or matricule inside a session's student list                        | Medium   | 2      | To Do  |

---

## Screens / Routes

| Path                                          | Description                                               | US Coverage          | Status |
| --------------------------------------------- | --------------------------------------------------------- | -------------------- | ------ |
| `app/(dashboard)/teacher/sessions/page.jsx`   | Daily session list for the logged-in teacher             | US-18                | To Do  |
| `app/(dashboard)/teacher/sessions/[id]/page.jsx` | Session detail: student list + one-tap absence marking | US-19, US-20, US-24, US-26 | To Do  |
| `app/(dashboard)/admin/corrections/page.jsx`  | Admin queue of pending late correction requests          | US-23                | To Do  |

> **PWA layer** (US-21, US-25): service worker registration and offline banner are application-level concerns, not new pages. Handled via `public/sw.js` + `lib/offlineQueue.js` + `OfflineBanner` component.

---

## Components Status

### Attendance — Teacher Flow

| Component                                               | US       | Description                                                                 | Status |
| ------------------------------------------------------- | -------- | --------------------------------------------------------------------------- | ------ |
| `components/attendance/SessionCard.jsx`                 | US-18    | Card displaying module name, room, time range, group, and session type      | To Do  |
| `components/attendance/SessionList.jsx`                 | US-18    | List wrapper for SessionCards, sorted by start_time                        | To Do  |
| `components/attendance/StudentAbsenceRow.jsx`           | US-19, US-20, US-26 | Single student row: photo, name, matricule, tap-to-toggle absent button + sync badge | To Do  |
| `components/attendance/SyncStatusBadge.jsx`             | US-20    | Icon-only badge: ✅ SYNCED / ⏳ PENDING / ❌ FAILED / ⚠️ CONFLICT           | To Do  |
| `components/attendance/AttendanceSummaryBanner.jsx`     | US-24    | Sticky top banner: Present N / Absent N / Pending N, live-refreshed        | To Do  |
| `components/attendance/StudentSearchBar.jsx`            | US-26    | Controlled input filtering the student list by name or matricule            | To Do  |
| `components/attendance/CorrectionRequestModal.jsx`      | US-22    | Modal to submit a correction request with reason field; shows free-window badge if still within 15 min | To Do  |
| `components/attendance/OfflineBanner.jsx`               | US-21, US-25 | Full-width warning banner when browser is offline; shows pending queue count | To Do  |

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
| `services/sessionService.js`           | US-18                   | `getTodaySessions()` → GET `/api/v1/sessions/today`                        | To Do       |
| `services/attendanceService.js`        | US-19, US-22, US-23     | `markAbsent()`, `toggleAbsence()`, `submitCorrection()`, `reviewCorrection()` | To Do    |
| `hooks/useSessionList.js`              | US-18                   | Fetches and exposes today's sessions; loading + error state                 | To Do       |
| `hooks/useAttendance.js`               | US-19, US-20, US-22     | Core hook: student list, tap-toggle, optimistic UI, sync status per student, correction submission | To Do |
| `hooks/useAttendanceSummary.js`        | US-24                   | Polls `GET /api/v1/sessions/:id/summary` every 5 s; returns `{ present, absent, pending }` | To Do |
| `hooks/useOfflineSync.js`              | US-21                   | Listens to `window.online/offline`; drains `offlineQueue` on reconnect; exposes queue length | To Do |
| `lib/offlineQueue.js`                  | US-21                   | IndexedDB wrapper: `enqueue(action)`, `drainQueue()`, `clearSynced()`. Uses `idb` library. | To Do |
| `lib/constants.js`                     | US-18, US-19, US-22     | Add: `SESSION_STATUS`, `ABSENCE_SOURCE`, `SYNC_STATUS`, `CORRECTION_STATUS` enums | To Do |

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

> **Offline strategy (US-21):** `POST /api/v1/absences` and `PATCH /api/v1/absences/:id` are the only endpoints queued offline. All other endpoints are online-only. On reconnect, `useOfflineSync` drains the queue in FIFO order, attaches `local_uuid` per action for server-side dedup.

---

## Offline / PWA Scope (US-21, US-25)

| Concern                | Approach                                                                  | File                        |
| ---------------------- | ------------------------------------------------------------------------- | --------------------------- |
| Service Worker         | `public/sw.js` — cache shell assets only; API calls NOT cached (data integrity) | `public/sw.js`         |
| Offline queue storage  | IndexedDB via `idb` npm library                                          | `lib/offlineQueue.js`       |
| Conflict detection     | Server returns `409` if `(session_id, student_id)` already modified by another device → `CONFLICT` sync status | `attendanceService.js` |
| Retry cap              | Max 3 retries per queued action; on 4th failure → status `FAILED`, shown in `SyncStatusBadge` | `hooks/useOfflineSync.js` |
| UI feedback            | `OfflineBanner` shows offline state + `N actions pending sync`           | `components/attendance/OfflineBanner.jsx` |

> **Note:** Full background sync (Background Sync API) is deferred. US-21 is implemented as drain-on-reconnect — simpler and sufficient for V1.

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

- `idb` library must be added to `package.json` for `lib/offlineQueue.js` (US-21).
- `GET /api/v1/sessions/today` must filter by authenticated teacher — depends on JWT claims being correctly scoped (Sprint 1 concern).
- `PATCH /api/v1/absences/:id` UPSERT strategy must be confirmed with backend team before `useAttendance` optimistic updates are finalized (US-19).
- `session.end_time` must be included in the session detail API response for free-window detection (US-22).

---

## Remaining Tasks

### Session List (US-18)

- [ ] Create `app/(dashboard)/teacher/sessions/page.jsx`
- [ ] Build `components/attendance/SessionCard.jsx`
- [ ] Build `components/attendance/SessionList.jsx`
- [ ] Create `services/sessionService.js` with `getTodaySessions()`
- [ ] Create `hooks/useSessionList.js`
- [ ] Add `SESSION_STATUS` + `session_type_enum` to `lib/constants.js`

### Absence Marking (US-19, US-20, US-26)

- [ ] Create `app/(dashboard)/teacher/sessions/[id]/page.jsx`
- [ ] Build `components/attendance/StudentAbsenceRow.jsx` (tap toggle + sync badge)
- [ ] Build `components/attendance/SyncStatusBadge.jsx`
- [ ] Build `components/attendance/StudentSearchBar.jsx`
- [ ] Create `services/attendanceService.js` (`markAbsent`, `toggleAbsence`)
- [ ] Create `hooks/useAttendance.js` (optimistic UI + sync state per student)
- [ ] Add `SYNC_STATUS` + `ABSENCE_SOURCE` to `lib/constants.js`

### Live Summary (US-24)

- [ ] Build `components/attendance/AttendanceSummaryBanner.jsx`
- [ ] Create `hooks/useAttendanceSummary.js` (polling every 5 s)

### Offline / PWA (US-21, US-25)

- [ ] Install `idb` package
- [ ] Create `lib/offlineQueue.js` (IndexedDB FIFO queue)
- [ ] Create `hooks/useOfflineSync.js` (online/offline listener + drain)
- [ ] Build `components/attendance/OfflineBanner.jsx`
- [ ] Create `public/sw.js` (shell cache only)
- [ ] Register service worker in `app/layout.jsx` (or `_app.jsx`)

### Corrections (US-22, US-23)

- [ ] Create `lib/correctionUtils.js` (`isWithinFreeWindow`)
- [ ] Build `components/attendance/CorrectionRequestModal.jsx`
- [ ] Add `submitCorrection()` to `services/attendanceService.js`
- [ ] Create `app/(dashboard)/admin/corrections/page.jsx`
- [ ] Build `components/corrections/CorrectionQueueTable.jsx`
- [ ] Build `components/corrections/CorrectionReviewModal.jsx`
- [ ] Add `reviewCorrection()` to `services/attendanceService.js`
- [ ] Add `CORRECTION_STATUS` to `lib/constants.js`

### Testing / Verification

- [ ] Verify session list shows only today's sessions for logged-in teacher
- [ ] Verify one-tap toggle (absent → present → absent) with correct API calls
- [ ] Verify sync badge transitions: PENDING → SYNCED / FAILED
- [ ] Verify offline queue: mark absences offline, verify sync on reconnect
- [ ] Verify conflict badge appears on concurrent device edit
- [ ] Verify free-window correction auto-approves without Admin action
- [ ] Verify late correction appears in Admin queue
- [ ] Verify Admin approve/reject updates student's absence status
- [ ] Verify summary banner live count matches DB state
- [ ] Verify student search filters by name AND matricule
- [ ] Verify PWA installable and usable on Chrome Android (US-25)

### Sprint Review Prep

- [ ] Code cleanup + PR reviews
- [ ] All branches merged to sprint branch
- [ ] Demo script: open session → mark 3 absences → go offline → mark 2 more → reconnect → confirm sync → request correction → admin approves
- [ ] Deploy to staging

---

## Definition of Done (DoD Check)

- [ ] Teacher sees today's session list scoped to their account (US-18)
- [ ] One-tap absence marking works with optimistic UI and server confirmation (US-19)
- [ ] Sync status badge reflects PENDING / SYNCED / FAILED in real time (US-20)
- [ ] Absences marked offline are queued and synced automatically on reconnect (US-21)
- [ ] Free-window correction submits without Admin approval; late correction enters Admin queue (US-22)
- [ ] Admin can approve or reject late corrections with mandatory comment (US-23)
- [ ] Live summary banner updates without page reload (US-24)
- [ ] Interface works on Chrome ≥ 120 without app installation; PWA manifest present (US-25)
- [ ] Student search by name and matricule filters list in real time (US-26)
- [ ] No new feature regresses Sprint 2 import/export flows
- [ ] All PRs reviewed and merged to sprint branch
- [ ] Demo approved in Sprint Review with supervisors
- [ ] Deployed to staging

> Never push to `main` directly — open a PR and wait for lead developer approval.
