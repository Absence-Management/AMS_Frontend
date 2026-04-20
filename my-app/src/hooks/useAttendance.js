"use client";

import { useState, useCallback, useEffect } from "react";
import { toggleAbsence, getSessionStudents } from "@/services/attendanceService";
import { SYNC_STATUS } from "@/lib/constants";

export function useAttendance(sessionId, initialMockData = null) {
  const [students, setStudents] = useState(initialMockData || []);
  const [loading, setLoading] = useState(!initialMockData);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Skip fetch if we are injecting mock data (useful for storybook or initial dev)
    if (initialMockData) return;
    
    async function fetchStudents() {
      setLoading(true);
      setError(null);
      try {
        const data = await getSessionStudents(sessionId);
        // Normalize backend data model into UI format
        const formatted = Array.isArray(data) ? data.map(s => ({
          ...s,
          id: s.id || s.student_id,
          name: s.name || `${s.first_name} ${s.last_name}`,
          email: s.email,
          studentId: s.matricule || s.student_id,
          present: !s.is_absent,
          syncStatus: SYNC_STATUS.SYNCED,
          absenceId: s.absence_id || null,
          avatarColor: s.avatar_color || "#e2e8f0"
        })) : [];
        setStudents(formatted);
      } catch (err) {
        console.error("Failed to load students:", err);
        setError("Failed to load students from server.");
      } finally {
        setLoading(false);
      }
    }
    
    if (sessionId) {
      fetchStudents();
    }
  }, [sessionId, initialMockData]);

  const handleTogglePresent = useCallback(async (studentId) => {
    let studentToToggle = null;
    
    // 1. Optimistic UI Update
    setStudents((prev) => {
      return prev.map((s) => {
        if (s.id === studentId) {
          studentToToggle = { ...s }; // capture the state before optimistic update
          return { ...s, present: !s.present, syncStatus: SYNC_STATUS.PENDING };
        }
        return s;
      });
    });

    if (!studentToToggle) return;

    try {
      // 2. API Call
      // if studentToToggle.present was true, they are NOW marked absent (is_absent = true)
      const isNowAbsent = studentToToggle.present; 
      const result = await toggleAbsence(
        sessionId, 
        studentId, 
        isNowAbsent, 
        studentToToggle.absenceId
      );
      
      // 3. Mark as Synced
      setStudents((prev) =>
        prev.map((s) =>
          s.id === studentId
            ? { 
                ...s, 
                syncStatus: SYNC_STATUS.SYNCED,
                absenceId: result?.id || s.absenceId // Save the new absence ID if created during POST
              }
            : s
        )
      );
    } catch (err) {
      console.error("Optimistic update failed, reverting...", err);
      // 4. Revert on Failure
      setStudents((prev) =>
        prev.map((s) =>
          s.id === studentId
            ? { 
                ...s, 
                present: studentToToggle.present, 
                syncStatus: SYNC_STATUS.FAILED 
              }
            : s
        )
      );
    }
  }, [sessionId]);

  return {
    students,
    setStudents,
    loading,
    error,
    handleTogglePresent,
  };
}
