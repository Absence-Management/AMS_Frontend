"use client";

import { useState, useCallback, useEffect } from "react";
import { bulkUpdateAttendance, getSessionStudents, markAbsence } from "@/services/attendanceService";
import { SYNC_STATUS } from "@/lib/constants";

export function useAttendance(sessionId, initialMockData = null) {
  const [students, setStudents] = useState(initialMockData || []);
  const [loading, setLoading] = useState(!initialMockData);
  const [error, setError] = useState(null);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSessionStudents(sessionId);
      // Backend returns: { session_id, total, records: [...] }
      const studentsList = data.records || data.students || (Array.isArray(data) ? data : []);
      
      const formatted = studentsList.map(s => ({
        ...s,
        id: s.student_id || s.matricule,
        name: `${s.nom || ""} ${s.prenom || ""}`.trim() || s.name || "",
        email: s.email,
        studentId: s.matricule,
        present: s.is_present,           // API returns is_present directly (default: false)
        participation: s.participation || null,
        totalAbsences: s.total_absences || 0,
        syncStatus: SYNC_STATUS.SYNCED,
        avatarUrl: s.avatar_url || null,
        avatarColor: "#e2e8f0",
      }));
      setStudents(formatted);
    } catch (err) {
      console.error("Failed to load students:", err);
      setError("Failed to load students from server.");
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    if (initialMockData) return;
    if (sessionId) {
      fetchStudents();
    }
  }, [sessionId, initialMockData, fetchStudents]);

  const handleTogglePresent = useCallback((studentId) => {
    // 1. Find the student and compute the new state
    let studentMatricule = null;
    let newIsPresent = null;

    // 2. Optimistic UI — flip immediately, set PENDING
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          studentMatricule = s.studentId;
          newIsPresent = !s.present;
          return { ...s, present: newIsPresent, syncStatus: SYNC_STATUS.PENDING };
        }
        return s;
      })
    );

    // 3. Fire POST /v1/absences immediately (no await — fire-and-forget with error handling)
    if (studentMatricule !== null && newIsPresent !== null) {
      markAbsence({
        sessionId,
        studentMatricule,
        isAbsent: !newIsPresent, // API uses is_absent (inverted)
      })
        .then(() => {
          // 4a. Success → mark SYNCED
          setStudents((prev) =>
            prev.map((s) =>
              s.id === studentId ? { ...s, syncStatus: SYNC_STATUS.SYNCED } : s
            )
          );
        })
        .catch(() => {
          // 4b. Failure → revert optimistic update + mark FAILED
          setStudents((prev) =>
            prev.map((s) =>
              s.id === studentId
                ? { ...s, present: !newIsPresent, syncStatus: SYNC_STATUS.FAILED }
                : s
            )
          );
        });
    }
  }, [sessionId]);

  const saveAttendance = useCallback(async () => {
    // PUT /v1/sessions/{id}/attendance — exact schema from API spec
    const payload = {
      records: students.map(s => ({
        student_matricule: s.studentId,
        is_present: s.present,
        participation: s.participation ?? null,
      }))
    };

    try {
      const result = await bulkUpdateAttendance(sessionId, payload);
      setStudents(prev => prev.map(s => ({ ...s, syncStatus: SYNC_STATUS.SYNCED })));
      return result;
    } catch (err) {
      console.error("Failed to save attendance:", err);
      setStudents(prev => prev.map(s => 
        s.syncStatus === SYNC_STATUS.PENDING 
          ? { ...s, syncStatus: SYNC_STATUS.FAILED } 
          : s
      ));
      throw err;
    }
  }, [sessionId, students]);

  const addStudent = useCallback(async (matricule) => {
    try {
      await import('@/services/attendanceService').then(({ addStudentToSession }) => 
        addStudentToSession(sessionId, matricule).then(() => fetchStudents())
      );
    } catch (err) {
      console.error("Failed to add student:", err);
      throw err;
    }
  }, [sessionId, fetchStudents]);

  const addGroup = useCallback(async (groupName) => {
    try {
      await import('@/services/attendanceService').then(({ addGroupToSession }) => 
        addGroupToSession(sessionId, groupName).then(() => fetchStudents())
      );
    } catch (err) {
      console.error("Failed to add group:", err);
      throw err;
    }
  }, [sessionId, fetchStudents]);

  return {
    students,
    setStudents,
    loading,
    error,
    handleTogglePresent,
    saveAttendance,
    addStudent,
    addGroup,
  };
}
