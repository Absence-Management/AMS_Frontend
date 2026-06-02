"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { API_LOADING_EVENT } from "@/lib/loadingBus";
import PencilLoader from "./PencilLoader";

const LoadingContext = createContext(null);

const SHOW_DELAY_MS = 150;
const HIDE_DELAY_MS = 200;

export function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showDelayed, setShowDelayed] = useState(false);

  useEffect(() => {
    let activeCount = 0;
    let showTimer = null;
    let hideTimer = null;

    function show() {
      if (hideTimer) {
        clearTimeout(hideTimer);
        hideTimer = null;
      }
      if (!visible) setVisible(true);
      if (!showDelayed) {
        if (showTimer) clearTimeout(showTimer);
        showTimer = setTimeout(() => setShowDelayed(true), SHOW_DELAY_MS);
      }
    }

    function hide() {
      if (showTimer) {
        clearTimeout(showTimer);
        showTimer = null;
      }
      if (showDelayed) setShowDelayed(false);
      if (visible) {
        hideTimer = setTimeout(() => setVisible(false), HIDE_DELAY_MS);
      }
    }

    function onLoading(event) {
      const isActive = Boolean(event.detail?.active);
      activeCount = Math.max(0, activeCount + (isActive ? 1 : -1));
      setIsLoading(activeCount > 0);
      if (activeCount > 0) show();
      else hide();
    }

    window.addEventListener(API_LOADING_EVENT, onLoading);
    return () => {
      window.removeEventListener(API_LOADING_EVENT, onLoading);
      if (showTimer) clearTimeout(showTimer);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [showDelayed, visible]);

  const value = useMemo(() => ({ isLoading }), [isLoading]);

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {visible ? (
        <div
          className={`ams-global-loader ${showDelayed ? "ams-global-loader--visible" : ""}`}
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <PencilLoader />
        </div>
      ) : null}
    </LoadingContext.Provider>
  );
}

export function useGlobalLoading() {
  const context = useContext(LoadingContext);
  if (!context) return { isLoading: false };
  return context;
}
