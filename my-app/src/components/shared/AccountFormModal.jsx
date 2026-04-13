"use client";

export default function AccountFormModal({
  isOpen,
  title,
  subtitle,
  labelledBy,
  submitting,
  onClose,
  onBackdropClick,
  onSubmit,
  submitLabel,
  submittingLabel,
  error,
  children,
}) {
  if (!isOpen) return null;

  return (
    <div className="export-modal-backdrop" onClick={onBackdropClick}>
      <div
        className="export-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
      >
        <div className="export-modal-header">
          <div>
            <h3 className="export-modal-title" id={labelledBy}>
              {title}
            </h3>
            {subtitle && <p className="export-modal-subtitle">{subtitle}</p>}
          </div>
          <button
            className="export-modal-close"
            onClick={onClose}
            aria-label={`Close ${title.toLowerCase()} modal`}
            disabled={submitting}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <line
                x1="18"
                y1="6"
                x2="6"
                y2="18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="6"
                y1="6"
                x2="18"
                y2="18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="export-modal-body">
            <div className="export-modal-grid">{children}</div>

            {error && (
              <div className="error-message" style={{ marginTop: 12 }}>
                {error}
              </div>
            )}
          </div>

          <div className="export-modal-footer">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={submitting}>
              {submitting ? submittingLabel : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
