"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { getAdminProfile, patchAdmin } from "@/services/accountsService";

import ProfileHeader from "@/components/profile/ProfileHeader";
import SidebarProfileCard from "@/components/profile/SidebarProfileCard";
import StatCard from "@/components/profile/StatCard";
import ProfileDropdownCard from "@/components/profile/ProfileDropdownCard";

const ADMIN_LEVEL_OPTIONS = [
  { value: "regular", label: "Admin", color: "#4A5567" },
  { value: "super", label: "Super Admin", color: "#143888" },
  { value: "chef_department", label: "Chef Department", color: "#6B39F8" },
];

const PERMISSIONS = [
  { key: "can_import_data", label: "Import Data" },
  { key: "can_export_data", label: "Export Data" },
  { key: "can_manage_users", label: "Manage Users" },
  { key: "can_manage_system_config", label: "Manage System Config" },
  { key: "can_view_audit_logs", label: "View Audit Logs" },
];

function EditAdminModal({ admin, onClose, onSaved }) {
  const [form, setForm] = useState({
    first_name: admin?.first_name || "",
    last_name: admin?.last_name || "",
    phone: admin?.phone || "",
    department: admin?.department || "",
    admin_level: admin?.admin_level || "regular",
    can_import_data: admin?.can_import_data ?? false,
    can_export_data: admin?.can_export_data ?? false,
    can_manage_users: admin?.can_manage_users ?? false,
    can_manage_system_config: admin?.can_manage_system_config ?? false,
    can_view_audit_logs: admin?.can_view_audit_logs ?? false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      await patchAdmin(admin.id, form);
      onSaved();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to update admin.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/35 flex items-center justify-center">
      <div className="box-border flex flex-col items-end p-6 gap-6 w-[472px] bg-white border border-black/6 shadow-[0px_0px_7px_rgba(0,0,0,0.07)] rounded-[14px] max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col gap-5 w-full">
          <div className="flex flex-col gap-1">
            <h2 className="text-[20px] font-semibold text-[#143888] m-0">
              Edit Admin
            </h2>
            <p className="text-[14px] text-black/60 m-0">
              Update administrator account details and permissions
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-[14px] font-medium text-black/80">
                  First Name
                </label>
                <input
                  type="text"
                  value={form.first_name}
                  onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                  className="p-[10px_12px] bg-[#FBFCFC] border border-black/6 rounded-[8px] text-[14px] outline-none w-full box-border"
                />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-[14px] font-medium text-black/80">
                  Last Name
                </label>
                <input
                  type="text"
                  value={form.last_name}
                  onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                  className="p-[10px_12px] bg-[#FBFCFC] border border-black/6 rounded-[8px] text-[14px] outline-none w-full box-border"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium text-black/80">Phone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="p-[10px_12px] bg-[#FBFCFC] border border-black/6 rounded-[8px] text-[14px] outline-none w-full box-border"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium text-black/80">Department</label>
              <input
                type="text"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                className="p-[10px_12px] bg-[#FBFCFC] border border-black/6 rounded-[8px] text-[14px] outline-none w-full box-border"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium text-black/80">Admin Level</label>
              <select
                value={form.admin_level}
                onChange={(e) => setForm({ ...form, admin_level: e.target.value })}
                className="p-[10px_12px] bg-[#FBFCFC] border border-black/6 rounded-[8px] text-[14px] outline-none w-full box-border cursor-pointer"
              >
                {ADMIN_LEVEL_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium text-black/80">Permissions</label>
              <div className="flex flex-col gap-2">
                {PERMISSIONS.map((perm) => (
                  <label key={perm.key} className="flex items-center gap-2 text-[13px] text-black/70 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form[perm.key]}
                      onChange={(e) => setForm({ ...form, [perm.key]: e.target.checked })}
                      className="w-4 h-4 accent-[#143888]"
                    />
                    {perm.label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {error && <p className="text-[13px] text-[#dc2626] m-0">{error}</p>}

          <div className="flex gap-5 justify-end">
            <button
              onClick={onClose}
              disabled={saving}
              className="px-8 py-[5px] border border-black/16 rounded-[8px] bg-transparent cursor-pointer text-[16px] font-medium text-[#898989] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-[5px] border-none rounded-[8px] bg-[#143888] cursor-pointer text-[16px] font-medium text-white disabled:opacity-70"
            >
              {saving ? "Saving\u2026" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminProfilePage() {
  const { id: accountId } = useParams();

  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEdit, setShowEdit] = useState(false);

  const fetchAdmin = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAdminProfile(accountId);
      setAdmin(data);
    } catch (err) {
      setError("Failed to load admin profile.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    if (accountId) fetchAdmin();
  }, [accountId, fetchAdmin]);

  if (loading) {
    return (
      <div className="main-page">
        <div className="p-6 text-[14px] text-[#4a5567]">Loading admin profile\u2026</div>
      </div>
    );
  }

  if (error || !admin) {
    return (
      <div className="main-page">
        <div className="error-message">{error || "Admin not found."}</div>
      </div>
    );
  }

  const fullName = `${admin.first_name || ""} ${admin.last_name || ""}`.trim();
  const initials = fullName
    .split(" ")
    .map((n) => n[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="main-page flex flex-col gap-6">
      <ProfileHeader
        breadcrumbs={[
          { label: "Administrators", href: "/admin/administrators" },
          { label: "Administrator Profile" },
        ]}
        subtitle="View and manage administrators"
        onEdit={() => setShowEdit(true)}
      />

      <div className="flex flex-row gap-6.25 items-stretch">
        <div className="flex flex-col gap-4">
          <SidebarProfileCard
            name={fullName}
            subtext={`${admin.admin_level === "super" ? "Super Admin" : admin.admin_level === "chef_department" ? "Chef Department" : "Admin"} | ${admin.department || "\u2014"}`}
            email={admin.email || "\u2014"}
            idLabel="Account ID"
            idValue={admin.id}
            initials={initials}
            avatarUrl={admin.avatar_url}
          />
          <div className="box-border flex flex-col p-3 gap-2 bg-white border border-black/10 rounded-[8px]">
            <div className="flex items-center gap-2 text-[12px] text-[#4a5567]">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 4.5l5 3 5-3M2 4.5v6a1 1 0 001 1h8a1 1 0 001-1v-6M2 4.5l5-3 5 3" stroke="#999999" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{admin.phone || "\u2014"}</span>
            </div>
            <div className="flex items-center gap-2 text-[12px] text-[#4a5567]">
              <div className={`w-2 h-2 rounded-full ${admin.is_active ? "bg-[#22c55e]" : "bg-[#D64545]"}`} />
              <span>{admin.is_active ? "Active" : "Disabled"}</span>
            </div>
            {admin.created_at && (
              <div className="flex items-center gap-2 text-[12px] text-[#4a5567]">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="6" stroke="#999999" strokeWidth="1.2"/>
                  <path d="M7 4v3l2 2" stroke="#999999" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                <span>Joined {new Date(admin.created_at).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col flex-1 bg-white border border-black/10 rounded-[8px]">
          <div className="px-4 py-3 border-b border-[#E3E8EF] text-[14px] font-semibold text-black">
            Permissions
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3">
              {PERMISSIONS.map((perm) => (
                <div key={perm.key} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-[3px] ${admin[perm.key] ? "bg-[#143888]" : "bg-[#E3E8EF]"}`} />
                  <span className="text-[13px] text-[#4a5567]">{perm.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-6.25 w-51.75 shrink-0">
          <StatCard
            label="Department"
            value={admin.department || "\u2014"}
            icon={
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 3h10v8H2z" stroke="#999999" strokeWidth="1.2" rx="1"/>
                <path d="M5 7h4" stroke="#999999" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            }
          />
          <StatCard
            label="Last Activity"
            value={admin.last_activity ? new Date(admin.last_activity).toLocaleDateString() : "\u2014"}
            icon={
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="#999999" strokeWidth="1.2"/>
                <path d="M7 4v3l2 2" stroke="#999999" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            }
          />
          <ProfileDropdownCard
            label="Admin Level"
            value={admin.admin_level || "regular"}
            options={ADMIN_LEVEL_OPTIONS}
            onSave={async (newLevel) => {
              await patchAdmin(admin.id, { admin_level: newLevel });
              setAdmin({ ...admin, admin_level: newLevel });
            }}
            icon={
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7.09349 6.34079C7.03516 6.33496 6.96516 6.33496 6.90099 6.34079C5.51266 6.29413 4.41016 5.15663 4.41016 3.75663C4.41016 2.32746 5.56516 1.16663 7.00016 1.16663C8.42932 1.16663 9.59016 2.32746 9.59016 3.75663C9.58432 5.15663 8.48182 6.29413 7.09349 6.34079Z" stroke="#999999" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4.17691 8.49337C2.76525 9.43837 2.76525 10.9784 4.17691 11.9175C5.78108 12.9909 8.41191 12.9909 10.0161 11.9175C11.4277 10.9725 11.4277 9.43254 10.0161 8.49337C8.41775 7.42587 5.78691 7.42587 4.17691 8.49337Z" stroke="#999999" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
          />
        </div>
      </div>

      {showEdit && (
        <EditAdminModal
          admin={admin}
          onClose={() => setShowEdit(false)}
          onSaved={load}
        />
      )}
    </div>
  );
}
