"use client";

import PencilLoader from "@/components/shared/PencilLoader";
import { useState, useEffect } from "react";
import ExportAbsencesButton from "@/components/dashboard/ExportAbsencesButton";
import TeacherGroupsGrid from "@/components/dashboard/TeacherGroupsGrid";
import { getMyGroups } from "@/services/teacherService";

export default function TeacherAttendancePage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadGroups() {
      try {
        setLoading(true);
        setError("");
        const data = await getMyGroups();
        if (!isMounted) return;
        setGroups(Array.isArray(data?.groups) ? data.groups : []);
      } catch (err) {
        console.error("Failed to load teacher groups:", err);
        if (isMounted) {
          setError("Failed to load your groups.");
          setGroups([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadGroups();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="main-page flex items-center justify-center min-h-[50vh]">
        <PencilLoader width="60px" height="60px" />
      </div>
    );
  }

  return (
    <div className="main-page">
      <div className="main-header">
        <div className="main-header-text">
          <h2 className="main-title">My Groups</h2>
          <p className="main-subtitle">
            Select a group to view its enrolled students and attendance.
          </p>
        </div>

        <ExportAbsencesButton />
      </div>

      <div className="mt-6">
        {error && <div className="text-red-600 p-4 text-center">{error}</div>}
        {!error && <TeacherGroupsGrid groups={groups} />}
      </div>
    </div>
  );
}
