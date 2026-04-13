# Sprint 2 — Import / Export des Données

> **ESI Sidi Bel Abbès** · AMS Frontend · PFA 2025–2026  
> **Duration:** 2 weeks · **8 User Stories** · **39 Story Points**  
> **Last update:** 12 Apr 2026 (based on current codebase snapshot)

---

## Sprint Goal

Allow the Administrator to import student lists and session planning from Progres via CSV, preview the data before saving, and export absence reports with filters (CSV + PDF with ESI-SBA header).

---

## User Stories (Current Status)

| ID    | Role            | User Story                                                                  | Priority | Points | Status      |
| ----- | --------------- | --------------------------------------------------------------------------- | -------- | ------ | ----------- |
| US-10 | Admin           | Import a CSV file of student list (from Progres) to populate the database   | High     | 8      | Done        |
| US-11 | Admin           | Import a CSV file of session planning (sessions, rooms, teachers)           | High     | 8      | In Progress |
| US-12 | Admin           | See a detailed error report after each CSV import (line, field, error type) | High     | 5      | Done        |
| US-13 | Admin           | Consult the history of all imports (date, file, status, rows imported)      | Medium   | 3      | Done        |
| US-14 | Admin / Teacher | Export absence data as CSV with filters (filière, module, dates, student)   | High     | 5      | Done        |
| US-15 | Admin           | Export a formatted PDF absence report with ESI-SBA header                   | Medium   | 5      | To Do       |
| US-16 | Admin           | System validates CSV column format before import to avoid corrupted data    | High     | 3      | In Progress |
| US-17 | Admin           | Receive a notification in case of a critical error during import            | Medium   | 2      | Done        |

---

## Implemented Screens / Routes

- **Import / Export** — `app/(dashboard)/admin/import/page.jsx`  
  Status: **In Progress** · Students + teachers + timetable flow present in one page.
- **Import History** — `app/(dashboard)/admin/import/history/page.jsx`  
  Status: **Done** · Paginated history table wired to API.
- **Export data modal** — `components/dashboard/ExportAbsencesButton.jsx` (used in `/admin/import`)  
  Status: **Done (CSV flow)** · Export is handled via button/modal, no dedicated page needed.
- **Teacher attendance export page** — `app/(dashboard)/teacher/attendance/page.jsx`  
  Status: **Done (UI)** · Header + export button page for teacher.
- **Legacy timetable route** — `app/(dashboard)/admin/import/TimeTable/page.jsx`  
  Status: **Removed** · Merged into main import page.

---

## Components Status

- `components/dashboard/ImportButton.jsx` — US-10, US-11 — **Done**
- `components/dashboard/ImportErrorReportModal.jsx` — US-12 — **Done**
- `components/import/CriticalErrorNotification.jsx` — US-17 — **Done**
- `components/dashboard/ImportPreviewTable.jsx` — US-10, US-11 — **To Do**
- `components/dashboard/ImportHistoryTable.jsx` — US-13 — **To Do**
- `components/dashboard/ExportAbsencesButton.jsx` — US-14 — **Done (CSV modal + filters)**
- `components/dashboard/ExportFilterPanel.jsx` — US-14, US-15 — **Not needed** (replaced by modal in `ExportAbsencesButton`)
- `components/dashboard/ExportButton.jsx` — US-14, US-15 — **Not needed** (replaced by modal in `ExportAbsencesButton`)
- `components/shared/StatusBadge.jsx` — US-10 (Safe/Exclu) — **To Do**

### Notes

- CSV upload zone and preview rendering are currently inline in `app/(dashboard)/admin/import/page.jsx`.
- Import history UI is currently inline in `app/(dashboard)/admin/import/history/page.jsx`.
- Teacher can access export from `/teacher/attendance` (sidebar link added).
- No `components/import/options/*` files in the current codebase.

---

## Logic / Services / Hooks Status

- `services/importService.js` — US-10, US-11, US-12, US-13, US-16 — **Done**  
  Students/teachers/timetable + history API methods present.
- `services/exportService.js` — US-14, US-15 — **In Progress**  
  JSON preview + CSV download implemented; PDF not implemented.
- `hooks/useImport.js` — US-10, US-11, US-12, US-16, US-17 — **To Do**  
  Logic still inline in import page.
- `hooks/useExport.js` — US-14, US-15 — **In Progress**  
  Filter + preview + CSV download state exists.
- `hooks/useDashboardTable.js` — Shared pagination/filter state — **Done**
- `lib/csvValidator.js` — US-16 column schema validation — **To Do** (file missing)
- `lib/constants.js` — CSV schemas and student status constants — **In Progress**  
  API endpoints exist; `CSV_SCHEMAS`/`STUDENT_STATUS` not added.

---

## Backend Endpoints (from frontend integration state)

- `POST /api/v1/import/students` — Needed by import page — **Integrated**
- `POST /api/v1/import/teachers` — Needed by import page — **Integrated**
- `POST /api/v1/import/timetable` — Needed by import page — **Integrated**
- `POST /api/v1/import/confirm/:importId` — Needed by submit & save confirmation — **To Do**
- `GET /api/v1/import-export/history` — Needed by import history page — **Integrated**
- `GET /api/v1/export/absences` (JSON) — Needed by export preview — **Integrated**
- `GET /api/v1/export/absences` (CSV) — Needed by export CSV download — **Integrated**
- `GET /api/v1/export/pdf` — Needed by export PDF — **To Do**

> **Note:** “Integrated” means frontend code is wired to endpoint paths; backend readiness still needs runtime confirmation.

---

## CSV Validation Snapshot

- **Students:** basic CSV parsing only (no strict schema validator).
- **Teachers:** basic CSV parsing only (no strict schema validator).
- **Session planning:** header validation implemented inline in import page.

> Separator support in code: comma `,` and semicolon `;`  
> Encoding expectation: UTF-8

---

## Blockers / Risks

- Missing `useImport` hook → import page remains large and harder to maintain.
- Missing `csvValidator.js` → US-16 not fully closed for students/teachers.
- Missing PDF flow → US-15 still blocked.

---

## Remaining Tasks

### Import Flow

- [x] Import type selector (`ImportButton`)
- [x] CSV upload zone in `/admin/import`
- [x] Timetable preview in `/admin/import`
- [x] Error report modal (`ImportErrorReportModal`)
- [x] Critical error notification (`CriticalErrorNotification`)
- [x] Import history page UI (`/admin/import/history`)
- [x] Import service wiring (`importService.js`)
- [ ] Build `lib/csvValidator.js` (strict schema validation for all import types)
- [ ] Build reusable `components/dashboard/ImportPreviewTable.jsx`
- [ ] Extract `hooks/useImport.js` from inline import page logic
- [ ] Complete and clean `/admin/import` implementation (decomposition + validator)

### Export Flow

- [x] Create export logic (`services/exportService.js` for preview + CSV)
- [x] Create export state hook (`hooks/useExport.js`)
- [x] Implement export modal in `components/dashboard/ExportAbsencesButton.jsx`
- [x] Add teacher export entry page (`/teacher/attendance`) with export button
- [ ] Confirm whether `useExport.js` will be used or removed (currently button manages its own state)
- [ ] Add PDF export service + UI flow

### Testing / Verification

- [ ] Verify import students CSV end-to-end
- [ ] Verify import teachers CSV end-to-end
- [ ] Verify import planning CSV end-to-end
- [ ] Verify critical error notification in real failure scenario
- [ ] Verify import history pagination/data accuracy
- [ ] Verify export preview with filters
- [x] Verify CSV download with filters
- [x] Verify teacher/admin access rules for export routes/actions

### Sprint Review Prep

- [ ] Code cleanup
- [ ] PR review + merge process completed
- [ ] Demo ready for Sprint Review
- [ ] Deploy to staging

---

## Definition of Done (Current Check)

- [x] Admin can select import type (students / teachers / planning)
- [x] Admin can upload CSV and see preview before submit
- [ ] System validates CSV columns robustly for all import types (US-16)
- [x] Admin sees detailed import error report (US-12)
- [x] Admin receives critical import error notification (US-17)
- [ ] Submit & save flow fully validated against backend for all import types
- [x] Admin can consult import history (US-13)
- [x] Admin and Teacher can export absences as CSV with filters
- [ ] Admin can export formatted PDF report (US-15)
- [ ] Route-level protection fully verified for export permissions
- [ ] All PRs reviewed and merged
- [ ] Demo approved in Sprint Review
- [ ] Deployed to staging

> Never push to `main` directly — open a PR and wait for lead developer approval.
