"use client";

import { useEffect, useState } from "react";
import { teachersService } from "@/services/accountsService";
import { formatApiValidationError } from "@/lib/apiError";
import AccountFormModal from "@/components/shared/AccountFormModal";
import AccountFormFields from "@/components/shared/AccountFormFields";

const EMPTY_TEACHER_FORM = {
  employee_id: "",
  first_name: "",
  last_name: "",
  phone: "",
  specialization: "",
};

const TEACHER_EDIT_FIELDS = [
  {
    name: "employee_id",
    label: "Employee ID",
    id: "edit-tc-employee-id",
    placeholder: "e.g. EMP-212",
  },
  { name: "first_name", label: "First name", id: "edit-tc-first-name" },
  { name: "last_name", label: "Last name", id: "edit-tc-last-name" },
  {
    name: "specialization",
    label: "Specialization",
    id: "edit-tc-specialization",
    placeholder: "e.g. Computer Science",
  },
  {
    name: "phone",
    label: "Phone",
    id: "edit-tc-phone",
    type: "tel",
    placeholder: "e.g. +213550000099",
    fullWidth: true,
    autoComplete: "tel",
  },
];

const normalizeForPayload = (data) => ({
  employee_id: data.employee_id.trim().toUpperCase(),
  first_name: data.first_name.trim(),
  last_name: data.last_name.trim(),
  phone: data.phone.replace(/\s+/g, "").trim(),
  specialization: data.specialization.trim(),
});

export default function EditTeacherModal({
  isOpen,
  onClose,
  onUpdated,
  teacher,
}) {
  const [formData, setFormData] = useState(EMPTY_TEACHER_FORM);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen || !teacher) return;

    const fullName = (teacher.name || "").trim();
    const split = fullName ? fullName.split(/\s+/) : [];
    const inferredFirst = split.length > 0 ? split[0] : "";
    const inferredLast = split.length > 1 ? split.slice(1).join(" ") : "";

    setFormData({
      employee_id: (teacher.employee_id || "").trim(),
      first_name: (teacher.first_name || inferredFirst || "").trim(),
      last_name: (teacher.last_name || inferredLast || "").trim(),
      phone: (teacher.phone || "").trim(),
      specialization: (teacher.specialization || teacher.subject || "").trim(),
    });
    setSubmitError("");
  }, [isOpen, teacher]);

  const setField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleClose = () => {
    if (submitting) return;
    setSubmitError("");
    onClose?.();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!teacher?.id) {
      setSubmitError("Unable to update: missing teacher account id.");
      return;
    }

    setSubmitError("");
    setSubmitting(true);

    try {
      const payload = normalizeForPayload(formData);
      await teachersService.update(teacher.id, payload);

      await onUpdated?.();
      handleClose();
    } catch (err) {
      const apiError = formatApiValidationError(
        err,
        "Failed to update teacher account. Please check fields and try again.",
      );
      setSubmitError(apiError);
      console.error("[EditTeacherModal] update teacher failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AccountFormModal
      isOpen={isOpen}
      title="Edit teacher"
      subtitle="Update teacher account profile fields."
      labelledBy="edit-teacher-modal-title"
      submitting={submitting}
      onClose={handleClose}
      onBackdropClick={handleBackdropClick}
      onSubmit={handleSubmit}
      submitLabel="Save changes"
      submittingLabel="Saving…"
      error={submitError}
    >
      <AccountFormFields
        fields={TEACHER_EDIT_FIELDS}
        values={formData}
        onChange={setField}
      />
    </AccountFormModal>
  );
}
