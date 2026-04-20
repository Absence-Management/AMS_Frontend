"use client";

import { useEffect, useState } from "react";
import { studentsService } from "@/services/accountsService";
import { formatApiValidationError } from "@/lib/apiError";
import AccountFormModal from "@/components/shared/AccountFormModal";
import AccountFormFields from "@/components/shared/AccountFormFields";

const EMPTY_STUDENT_FORM = {
  first_name: "",
  last_name: "",
  student_id: "",
  level: "",
  group: "",
  program: "",
  phone: "",
};

const STUDENT_EDIT_FIELDS = [
  { name: "first_name", label: "First name", id: "edit-st-first-name" },
  { name: "last_name", label: "Last name", id: "edit-st-last-name" },
  { name: "student_id", label: "Student ID", id: "edit-st-student-id" },
  {
    name: "level",
    label: "Level",
    id: "edit-st-level",
    placeholder: "e.g. L4",
  },
  {
    name: "group",
    label: "Group",
    id: "edit-st-group",
    placeholder: "e.g. G2",
  },
  {
    name: "program",
    label: "Program",
    id: "edit-st-program",
    placeholder: "e.g. INFO",
  },
  {
    name: "phone",
    label: "Phone",
    id: "edit-st-phone",
    type: "tel",
    placeholder: "e.g. +213550000099",
    fullWidth: true,
    autoComplete: "tel",
  },
];

const normalizeForPayload = (data) => ({
  first_name: data.first_name.trim(),
  last_name: data.last_name.trim(),
  student_id: data.student_id.trim().toUpperCase(),
  level: data.level.trim().toUpperCase(),
  group: data.group.trim().toUpperCase(),
  program: data.program.trim().toUpperCase(),
  phone: data.phone.replace(/\s+/g, "").trim(),
});

export default function EditStudentModal({
  isOpen,
  onClose,
  onUpdated,
  student,
}) {
  const [formData, setFormData] = useState(EMPTY_STUDENT_FORM);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen || !student) return;

    const fullName = (student.name || "").trim();
    const split = fullName ? fullName.split(/\s+/) : [];
    const inferredFirst = split.length > 0 ? split[0] : "";
    const inferredLast = split.length > 1 ? split.slice(1).join(" ") : "";

    setFormData({
      first_name: (student.first_name || inferredFirst || "").trim(),
      last_name: (student.last_name || inferredLast || "").trim(),
      student_id: (student.studentId || student.student_id || "").trim(),
      level: (student.level || student.year || "").trim(),
      group: (student.group || "").trim(),
      program: (student.program || "").trim(),
      phone: (student.phone || "").trim(),
    });
    setSubmitError("");
  }, [isOpen, student]);

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
    if (!student?.id) {
      setSubmitError("Unable to update: missing student account id.");
      return;
    }

    setSubmitError("");
    setSubmitting(true);

    try {
      const payload = normalizeForPayload(formData);
      await studentsService.update(student.id, payload);

      await onUpdated?.();
      handleClose();
    } catch (err) {
      const apiError = formatApiValidationError(
        err,
        "Failed to update student account. Please check fields and try again.",
      );
      setSubmitError(apiError);
      console.error("[EditStudentModal] update student failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AccountFormModal
      isOpen={isOpen}
      title="Edit student"
      subtitle="Update student account profile fields."
      labelledBy="edit-student-modal-title"
      submitting={submitting}
      onClose={handleClose}
      onBackdropClick={handleBackdropClick}
      onSubmit={handleSubmit}
      submitLabel="Save changes"
      submittingLabel="Saving…"
      error={submitError}
    >
      <AccountFormFields
        fields={STUDENT_EDIT_FIELDS}
        values={formData}
        onChange={setField}
      />
    </AccountFormModal>
  );
}
