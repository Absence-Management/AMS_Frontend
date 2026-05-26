"use client";

function getSessionStatus(session) {
  if (session.not_recorded) {
    return { label: "Not recorded", className: "student-history-status--pending" };
  }
  if (session.was_present) {
    return { label: "Present", className: "student-history-status--present" };
  }
  if (session.was_absent) {
    return { label: "Absent", className: "student-history-status--absent" };
  }
  return { label: "Unknown", className: "student-history-status--pending" };
}

export default function StudentHistoryModal({
  isOpen,
  history,
  loading,
  error,
  onClose,
}) {
  if (!isOpen) return null;

  const studentName = [history?.nom, history?.prenom].filter(Boolean).join(" ");
  const timeline = Array.isArray(history?.timeline) ? history.timeline : [];

  return (
    <div className="export-modal-backdrop" onClick={onClose}>
      <div
        className="export-modal student-history-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="student-history-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="export-modal-header">
          <div>
            <h3 className="export-modal-title" id="student-history-title">
              Attendance history
            </h3>
            <p className="export-modal-subtitle">
              {studentName || history?.matricule || "Student"}
            </p>
          </div>
          <button
            className="export-modal-close"
            onClick={onClose}
            aria-label="Close attendance history modal"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="export-modal-body">
          {loading && <div className="student-history-state">Loading history...</div>}
          {!loading && error && <div className="student-history-error">{error}</div>}

          {!loading && !error && history && (
            <>
              <div className="student-history-summary">
                <div>
                  <span>Total sessions</span>
                  <strong>{history.total_sessions ?? 0}</strong>
                </div>
                <div>
                  <span>Present</span>
                  <strong>{history.sessions_present ?? 0}</strong>
                </div>
                <div>
                  <span>Absent</span>
                  <strong>{history.sessions_absent ?? 0}</strong>
                </div>
                <div>
                  <span>Rate</span>
                  <strong>{history.attendance_rate ?? 0}%</strong>
                </div>
              </div>

              <div className="student-history-timeline">
                {timeline.length === 0 && (
                  <div className="student-history-state">No session history found.</div>
                )}

                {timeline.map((session) => {
                  const status = getSessionStatus(session);

                  return (
                    <div className="student-history-item" key={session.session_id}>
                      <div className="student-history-item__marker" />
                      <div className="student-history-item__content">
                        <div className="student-history-item__top">
                          <div>
                            <p className="student-history-item__subject">
                              {session.subject || "Session"}
                            </p>
                            <p className="student-history-item__meta">
                              {session.date || "—"} · {session.start_time || "—"} - {session.end_time || "—"}
                            </p>
                          </div>
                          <span className={`student-history-status ${status.className}`}>
                            {status.label}
                          </span>
                        </div>
                        <p className="student-history-item__type">
                          {session.session_type || "—"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
