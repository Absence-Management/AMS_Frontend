"use client";

import { useState, useEffect } from "react";
import api from "@/services/api";

/**
 * Hook to poll the attendance summary for a specific session.
 * 
 * @param {number|string} sessionId - The ID of the session
 * @param {number} interval - Polling interval in ms (default 5s)
 */
export function useAttendanceSummary(sessionId, interval = 5000) {
  const [summary, setSummary] = useState({
    present: 0,
    absent: 0,
    pending: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionId) return;

    let isMounted = true;

    async function fetchSummary() {
      try {
        const { data } = await api.get(`/v1/sessions/${sessionId}/summary`);
        
        if (isMounted) {
          setSummary({
            present: data.present_count ?? data.present ?? 0,
            absent: data.absent_count ?? data.absent ?? 0,
            pending: data.pending_count ?? data.pending ?? 0,
            total: data.total_students ?? data.total ?? 0,
          });
          setLoading(false);
        }
      } catch (err) {
        // Fail silently — the summary endpoint may not be implemented yet.
        // Attendance marking still works; the banner just shows stale counts.
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchSummary(); // Initial fetch

    const timer = setInterval(fetchSummary, interval);

    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, [sessionId, interval]);

  return { summary, loading, error };
}
