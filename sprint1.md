# 🚀 Sprint 1 — Authentication & User Management

> **ESI Sidi Bel Abbès** · AMS Frontend · PFA 2025–2026
> **Duration:** 2 weeks · **9 User Stories** · **37 Story Points**

---

## 🎯 Sprint Goal

Set up complete authentication (email/password + Google OAuth 2.0), JWT session management, and role-based access control for Admin and Teacher roles.

---

## 📋 User Stories

| ID    | Role  | User Story                                   | Priority  | Points | Status               |
| ----- | ----- | -------------------------------------------- | --------- | ------ | -------------------- |
| US-01 | All   | Login with institutional email + password    | 🔴 High   | 5      | ✅ Done              |
| US-02 | All   | Login with Google OAuth 2.0                  | 🔴 High   | 8      | ⚠️ Needs Credentials |
| US-03 | All   | Reset password via email link (valid 30min)  | 🔴 High   | 5      | ⚠️ Needs SMTP        |
| US-04 | Admin | Create / edit / disable user accounts        | 🔴 High   | 5      | ⏳ In Progress       |
| US-05 | Admin | Assign roles (Admin / Teacher)               | 🔴 High   | 3      | ⏳ In Progress       |
| US-06 | All   | Auto logout after 30min inactivity           | 🟡 Medium | 3      | ✅ Done              |
| US-07 | All   | JWT auto-refresh (access 15min / refresh 7d) | 🟡 Medium | 3      | ✅ Done              |
| US-08 | Admin | View audit log (date, IP, status)            | 🟡 Medium | 3      | ⏳ Not Started       |
| US-09 | All   | Clear error message on wrong credentials     | 🟢 Low    | 2      | ✅ Done              |

---

## 📁 Files to Implement

### Pages

| File                                   | User Story          | Status         |
| -------------------------------------- | ------------------- | -------------- |
| `app/(auth)/layout.jsx`                | All auth pages      | ✅ Done        |
| `app/(auth)/login/page.jsx`            | US-01, US-02, US-09 | ✅ Done        |
| `app/(auth)/forgot-password/page.jsx`  | US-03               | ✅ Done        |
| `app/(dashboard)/layout.jsx`           | US-04, US-05        | ✅ Done        |
| `app/(dashboard)/admin/users/page.jsx` | US-04, US-05        | ⏳ Not Started |
| `app/(dashboard)/admin/audit/page.jsx` | US-08               | ⏳ Not Started |

### Components

| File                                     | User Story   | Status         |
| ---------------------------------------- | ------------ | -------------- |
| `components/auth/LoginForm.jsx`          | US-01, US-09 | ✅ Done        |
| `components/auth/GoogleOAuthButton.jsx`  | US-02        | ✅ Done        |
| `components/auth/ForgotPasswordForm.jsx` | US-03        | ✅ Done        |
| `components/layout/Sidebar.jsx`          | US-04, US-05 | ⏳ Not Started |
| `components/layout/Navbar.jsx`           | US-04        | ⏳ Not Started |
| `components/layout/RoleGuard.jsx`        | US-05        | ✅ Done        |
| `components/shared/DataTable.jsx`        | US-08        | ⏳ Not Started |
| `components/shared/StatusBadge.jsx`      | US-04        | ⏳ Not Started |
| `components/shared/ConfirmDialog.jsx`    | US-04        | ⏳ Not Started |
| `components/shared/EmptyState.jsx`       | US-04        | ⏳ Not Started |

### Logic

| File                      | User Story                           | Status         |
| ------------------------- | ------------------------------------ | -------------- |
| `lib/constants.js`        | ROLES, STATUSES, TOKEN config        | ✅ Done        |
| `lib/utils.js`            | Date format, role redirect helpers   | ⏳ Not Started |
| `store/authStore.js`      | US-01→07                             | ✅ Done        |
| `services/api.js`         | All — Axios instance + interceptors  | ✅ Done        |
| `services/authService.js` | US-01, US-02, US-03, US-07           | ✅ Done        |
| `services/userService.js` | US-04, US-05, US-08                  | ✅ Done        |
| `hooks/useAuth.js`        | US-07                                | ✅ Done        |
| `hooks/useAutoLogout.js`  | US-06                                | ✅ Done        |
| `hooks/useRoleGuard.js`   | US-05                                | ✅ Done        |
| `middleware.js`           | US-05 — server-side route protection | ✅ Done        |

---

## 📅 Week 1

### Day 1 — Project Setup ✅

- [x] Install dependencies: `npm install zustand axios`
- [ ] ~~Setup shadcn/ui~~ — skipped, styling after designer delivers
- [x] Fill `constants.js` — ROLES, STATUSES, TOKEN
- [ ] Fill `utils.js` — formatDate, getRoleRedirect
- [x] Create `authStore.js` — user, role, isAuthenticated
- [x] Create `api.js` — Axios instance + JWT interceptor

### Day 2 — Login Page ✅

- [x] Create `authService.js` — login, logout, forgotPassword, refreshToken
- [x] Build `LoginForm.jsx` — email + password + error message
- [x] Build `(auth)/layout.jsx` — centered card layout
- [x] Build `(auth)/login/page.jsx`

### Day 3 — Google OAuth + Forgot Password ✅

- [x] Build `GoogleOAuthButton.jsx` — redirect to backend OAuth
- [x] Build `ForgotPasswordForm.jsx` — email input + success state
- [x] Build `(auth)/forgot-password/page.jsx`

### Day 4 — JWT + Auto Logout ✅

- [x] Implement `useAuth.js` — refresh token every 14min
- [x] Implement `useAutoLogout.js` — 30min inactivity timer
- [ ] ~~Save token in localStorage~~ — removed, using httpOnly cookie only ✅ secure

### Day 5 — Route Protection ✅

- [x] Create `middleware.js` — protect /admin and /teacher
- [x] Build `RoleGuard.jsx` — client-side role check
- [x] Implement `useRoleGuard.js`
- [x] Build `(dashboard)/layout.jsx` — Sidebar + Navbar wrapper

---

## 📅 Week 2

### Day 6 — Sidebar + Navbar ⏳

- [ ] Build `Sidebar.jsx` — role-aware links (Admin / Teacher)
- [ ] Build `Navbar.jsx` — user name + role display
- [ ] Test full navigation flow after login

### Day 7 — User Management ⏳

- [x] Create `userService.js` — getUsers, createUser, updateUser, disableUser, assignRole
- [ ] Build `/admin/users` page — users list with DataTable
- [ ] Add create user modal
- [ ] Add disable user button with confirmation

### Day 8 — Role Assignment + Audit Log ⏳

- [ ] Add assign role dropdown to user management
- [ ] Build `/admin/audit` page — connection log
- [ ] Build `DataTable.jsx` — with search filter

### Day 9 — Testing & Bug Fixes ⏳

- [ ] Test login with email + password
- [ ] Test login with Google
- [ ] Test wrong credentials error (US-09)
- [ ] Test role redirect after login
- [ ] Test auto logout after 30min
- [ ] Test JWT auto-refresh
- [ ] Fix any bugs found

### Day 10 — Sprint Review Prep ⏳

- [ ] Code cleanup
- [ ] All PRs reviewed and merged to main
- [ ] Demo ready for Sprint Review
- [ ] Update README if needed
- [ ] Deploy to staging

---

## 🔗 Backend Dependencies

| Endpoint                           | Needed By          | Day   | Status               |
| ---------------------------------- | ------------------ | ----- | -------------------- |
| `POST /api/v1/auth/login`          | LoginForm          | Day 2 | ✅ Working           |
| `GET /api/v1/auth/google`          | GoogleOAuthButton  | Day 3 | ⚠️ Needs credentials |
| `POST /api/v1/auth/reset-password` | ForgotPasswordForm | Day 3 | ⚠️ Needs SMTP        |
| `POST /api/v1/auth/refresh`        | useAuth            | Day 4 | ✅ Working           |
| `POST /api/v1/auth/logout`         | Sidebar            | Day 6 | ✅ Working           |
| `GET /api/v1/auth/me`              | useAuth            | Day 4 | ✅ Working           |
| `GET /api/v1/users/`               | Users page         | Day 7 | ✅ Working           |
| `POST /api/v1/users/`              | Users page         | Day 7 | ✅ Working           |
| `PATCH /api/v1/users/:id/disable`  | Users page         | Day 7 | ⏳ To verify         |
| `PATCH /api/v1/users/:id/role`     | Users page         | Day 8 | ⏳ To verify         |
| `GET /api/v1/audit`                | Audit page         | Day 8 | ⏳ To verify         |

---

## ⚠️ Blockers

| Blocker                         | Solution                                                     |
| ------------------------------- | ------------------------------------------------------------ |
| Google OAuth — `invalid_client` | Setup real credentials at `https://console.cloud.google.com` |
| Forgot password — 500 error     | Configure Gmail SMTP in backend `.env`                       |

---

## 🧪 Mock Data (Until Backend is Ready)

```js
export const mockUsers = [
  {
    id: 1,
    first_name: "Ilyes",
    last_name: "Brahmi",
    email: "i.brahmi@esi-sba.dz",
    role: "TEACHER",
    is_active: true,
  },
  {
    id: 2,
    first_name: "Rim",
    last_name: "Bouhafs",
    email: "r.bouhafs@esi-sba.dz",
    role: "TEACHER",
    is_active: true,
  },
  {
    id: 3,
    first_name: "M. Amine",
    last_name: "Bradji",
    email: "m.bradji@esi-sba.dz",
    role: "TEACHER",
    is_active: true,
  },
  {
    id: 4,
    first_name: "Admin",
    last_name: "ESI",
    email: "admin@esi-sba.dz",
    role: "ADMIN",
    is_active: true,
  },
];

export const mockAuditLog = [
  {
    id: 1,
    user: "admin@esi-sba.dz",
    date: "2026-03-10 08:32",
    ip: "192.168.1.1",
    status: "LOGIN_SUCCESS",
  },
  {
    id: 2,
    user: "unknown@test.com",
    date: "2026-03-10 09:15",
    ip: "41.109.2.33",
    status: "LOGIN_FAILED",
  },
];
```

---

## 👥 Task Assignment

| Member         | Tasks                                                           | Status         |
| -------------- | --------------------------------------------------------------- | -------------- |
| **You (Lead)** | api.js · authStore · middleware · RoleGuard · review all PRs    | ✅ Done        |
| **Member 2**   | LoginForm · GoogleOAuthButton · ForgotPasswordForm · auth pages | ✅ Done        |
| **Member 3**   | userService · /admin/users · /admin/audit · DataTable           | ⏳ In Progress |

---

## ✅ Definition of Done

- [x] User can login with email + password
- [ ] User can login with Google
- [ ] User receives reset link by email (valid 30min)
- [ ] Admin can create / edit / disable users
- [ ] Admin can assign roles (Admin / Teacher)
- [x] Wrong credentials show a clear error message
- [x] Session auto-expires after 30min inactivity
- [x] JWT refreshes automatically every 14min
- [ ] Admin can view audit log
- [x] All routes protected — no access without login
- [ ] All PRs reviewed and merged to main
- [ ] Demo approved in Sprint Review
- [ ] Deployed to staging

---

## 🔀 Git Branches for This Sprint

```text
feature/us-01-login-form       ✅ merged
feature/us-02-google-oauth     ⚠️ needs credentials
feature/us-03-forgot-password  ⚠️ needs SMTP
feature/us-04-user-management  ⏳ in progress
feature/us-05-role-assignment  ⏳ in progress
feature/us-06-auto-logout      ✅ merged
feature/us-07-jwt-refresh      ✅ merged
feature/us-08-audit-log        ⏳ not started
```

> **Rule:** Never push to `main` directly — open a PR and wait for lead developer approval.
