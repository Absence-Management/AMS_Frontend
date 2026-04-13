"use client";

import { useState } from "react";
import { createTeacher } from "@/services/accountsService";
import { formatApiValidationError } from "@/lib/apiError";
import AccountFormModal from "@/components/shared/AccountFormModal";
import AccountFormFields from "@/components/shared/AccountFormFields";

const EMPTY_TEACHER_FORM = {
  email: "",
  employee_id: "",
  first_name: "",
  last_name: "",
  password: "",
  phone: "",
  specialization: "",
};

const normalizeForPayload = (data) => ({
  email: data.email.trim().toLowerCase(),
  employee_id: data.employee_id.trim().toUpperCase(),
  first_name: data.first_name.trim(),
  last_name: data.last_name.trim(),
  password: data.password,
  phone: data.phone.replace(/\s+/g, "").trim(),
  specialization: data.specialization.trim(),
});

const TEACHER_FIELDS = [
  { name: "first_name", label: "First name", id: "tc-first-name" },
  { name: "last_name", label: "Last name", id: "tc-last-name" },
  {
    name: "email",
    label: "Email",
    id: "tc-email",
    type: "email",
    fullWidth: true,
    autoComplete: "email",
  },
  {
    name: "employee_id",
    label: "Employee ID",
    id: "tc-employee-id",
    placeholder: "e.g. EMP-101",
  },
  {
    name: "specialization",
    label: "Specialization",
    id: "tc-specialization",
    placeholder: "e.g. Mathematics",
  },
  {
    name: "phone",
    label: "Phone",
    id: "tc-phone",
    type: "tel",
    placeholder: "e.g. +213550000002",
    fullWidth: true,
    autoComplete: "tel",
  },
  {
    name: "password",
    label: "Password",
    id: "tc-password",
    type: "password",
    placeholder: "ExampleAuth1!",
    minLength: 8,
    fullWidth: true,
    autoComplete: "new-password",
  },
];

export default function AddTeacherModal({ isOpen, onClose, onCreated }) {
  const [formData, setFormData] = useState(EMPTY_TEACHER_FORM);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const setField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleClose = () => {
    if (submitting) return;
    setSubmitError("");
    setFormData(EMPTY_TEACHER_FORM);
    onClose?.();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const handleCreateTeacher = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);

    try {
      const payload = normalizeForPayload(formData);
      await createTeacher(payload);

      await onCreated?.();
      handleClose();
    } catch (err) {
      const apiError = formatApiValidationError(
        err,
        "Failed to create teacher account. Please check fields and try again.",
      );
      setSubmitError(apiError);
      console.error("[AddTeacherModal] create teacher failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AccountFormModal
      isOpen={isOpen}
      title="Add new teacher"
      subtitle="Create a teacher account from this page."
      labelledBy="create-teacher-modal-title"
      submitting={submitting}
      onClose={handleClose}
      onBackdropClick={handleBackdropClick}
      onSubmit={handleCreateTeacher}
      submitLabel="Create teacher"
      submittingLabel="Creating…"
      error={submitError}
    >
      <AccountFormFields
        fields={TEACHER_FIELDS}
        values={formData}
        onChange={setField}
      />
    </AccountFormModal>
  );
}
