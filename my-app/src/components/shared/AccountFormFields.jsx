"use client";

export default function AccountFormFields({ fields, values, onChange }) {
  return fields.map((field) => {
    const {
      name,
      label,
      id,
      type = "text",
      placeholder,
      required = true,
      minLength,
      fullWidth,
      autoComplete,
    } = field;

    return (
      <div
        key={name}
        className={`export-modal-field${fullWidth ? " export-modal-field--full" : ""}`}
      >
        <label className="export-modal-label" htmlFor={id}>
          {label}
        </label>
        <input
          id={id}
          type={type}
          className="export-modal-input"
          placeholder={placeholder}
          value={values[name] ?? ""}
          onChange={(e) => onChange(name, e.target.value)}
          minLength={minLength}
          autoComplete={autoComplete}
          required={required}
        />
      </div>
    );
  });
}
