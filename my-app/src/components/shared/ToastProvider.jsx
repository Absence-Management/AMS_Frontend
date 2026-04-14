"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timeoutsRef = useRef(new Map());

  const dismissToast = useCallback((id) => {
    const timeoutId = timeoutsRef.current.get(id);

    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutsRef.current.delete(id);
    }

    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    );
  }, []);

  const showToast = useCallback(
    ({ title, description = "", type = "error", duration = 4000 }) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

      setToasts((currentToasts) => [
        ...currentToasts,
        { id, title, description, type },
      ]);

      const timeoutId = setTimeout(() => {
        dismissToast(id);
      }, duration);

      timeoutsRef.current.set(id, timeoutId);
    },
    [dismissToast]
  );

  const contextValue = useMemo(
    () => ({
      showToast,
      dismissToast,
    }),
    [dismissToast, showToast]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="toast-stack" aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast toast-${toast.type}`}
            role="status"
          >
            <div>
              <p className="toast-title">{toast.title}</p>
              {toast.description ? (
                <p className="toast-description">{toast.description}</p>
              ) : null}
            </div>
            <button
              type="button"
              className="toast-close"
              onClick={() => dismissToast(toast.id)}
              aria-label="Close notification"
            >
              x
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}
