"use client";

import AdminGroupsTable from "@/components/dashboard/AdminGroupsTable";
import { useEffect, useState } from "react";

import { groupsService } from "@/services/groupsService";

export default function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchGroups() {
      try {
        setLoading(true);
        const data = await groupsService.getAll();
        setGroups(data);
      } catch (err) {
        setError("Failed to load groups");
      } finally {
        setLoading(false);
      }
    }
    fetchGroups();
  }, []);

  return (
    <div className="main-page groups-page">
      <div className="main-header">
        <div className="main-header-text">
          <h2 className="main-title">Groups</h2>
          <p className="main-subtitle">View and manage groups</p>
        </div>
      </div>
      
      {loading ? null : error ? (
        <div className="error-message mt-4">{error}</div>
      ) : (
        <AdminGroupsTable groups={groups} />
      )}
    </div>
  );
}
