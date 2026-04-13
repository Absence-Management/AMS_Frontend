"use client";

import { useState } from "react";
import { createStudent } from "@/services/accountsService";
import { formatApiValidationError } from "@/lib/apiError";
import AccountFormModal from "@/components/shared/AccountFormModal";
import AccountFormFields from "@/components/shared/AccountFormFields";

const EMPTY_STUDENT_FORM = {
  email: "",
  first_name: "",
  last_name: "",
  student_id: "",
  level: "",
  group: "",
  program: "",
  phone: "",
  password: "",
};

const normalizeForPayload = (data) => ({
  email: data.email.trim().toLowerCase(),
  first_name: data.first_name.trim(),
  last_name: data.last_name.trim(),
  student_id: data.student_id.trim().toUpperCase(),
  level: data.level.trim().toUpperCase(),
  group: data.group.trim().toUpperCase(),
  program: data.program.trim().toUpperCase(),
  phone: data.phone.replace(/\s+/g, "").trim(),
  password: data.password,
});

const STUDENT_FIELDS = [
  { name: "first_name", label: "First name", id: "st-first-name" },
  { name: "last_name", label: "Last name", id: "st-last-name" },
  {
    name: "email",
    label: "Email",
    id: "st-email",
    type: "email",
    fullWidth: true,
    autoComplete: "email",
  },
  { name: "student_id", label: "Student ID", id: "st-student-id" },
  {
    name: "level",
    label: "Level",
    id: "st-level",
    placeholder: "e.g. L3",
  },
  {
    name: "group",
    label: "Group",
    id: "st-group",
    placeholder: "e.g. G1",
  },
  {
    name: "program",
    label: "Program",
    id: "st-program",
    placeholder: "e.g. INFO",
  },
  {
    name: "phone",
    label: "Phone",
    id: "st-phone",
    type: "tel",
    placeholder: "e.g. +213550000001",
    fullWidth: true,
    autoComplete: "tel",
  },
  {
    name: "password",
    label: "Password",
    id: "st-password",
    type: "password",
    placeholder: "ExampleAuth1!",
    minLength: 8,
    fullWidth: true,
    autoComplete: "new-password",
  },
];

export default function AddStudentModal({ isOpen, onClose, onCreated }) {
  const [formData, setFormData] = useState(EMPTY_STUDENT_FORM);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const setField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleClose = () => {
    if (submitting) return;
    setSubmitError("");
    setFormData(EMPTY_STUDENT_FORM);
    onClose?.();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);

    try {
      const payload = normalizeForPayload(formData);
      await createStudent(payload);

      await onCreated?.();
      handleClose();
    } catch (err) {
      const apiError = formatApiValidationError(
        err,
        "Failed to create student account. Please check fields and try again.",
      );
      setSubmitError(apiError);
      console.error("[AddStudentModal] create student failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AccountFormModal
      isOpen={isOpen}
      title="Add new student"
      subtitle="Create a student account from this page."
      labelledBy="create-student-modal-title"
      submitting={submitting}
      onClose={handleClose}
      onBackdropClick={handleBackdropClick}
      onSubmit={handleCreateStudent}
      submitLabel="Create student"
      submittingLabel="Creating…"
      error={submitError}
    >
      <AccountFormFields
        fields={STUDENT_FIELDS}
        values={formData}
        onChange={setField}
      />
    </AccountFormModal>
  );
}
