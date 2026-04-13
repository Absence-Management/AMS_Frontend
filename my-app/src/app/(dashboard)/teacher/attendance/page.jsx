"use client";

import ExportAbsencesButton from "@/components/dashboard/ExportAbsencesButton";

export default function TeacherAttendancePage() {
  return (
    <div className="main-page">
      <div className="main-header">
        <div className="main-header-text">
          <h2 className="main-title">Attendance export</h2>
          <p className="main-subtitle">
            Export absence data using filters. No table is shown on this page.
          </p>
        </div>

        <ExportAbsencesButton />
      </div>
    </div>
  );
}
