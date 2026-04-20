"use client";

import { useState, useEffect } from "react";

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
      // In a real app: fetch(`/api/v1/sessions/${sessionId}/summary`)
      try {
        // Mocking the delay and response
        // For demonstration, we'll randomize counts slightly or just return static
        const mockData = {
          present: 24,
          absent: 4,
          pending: 2,
          total: 30,
        };

        if (isMounted) {
          setSummary(mockData);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
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
