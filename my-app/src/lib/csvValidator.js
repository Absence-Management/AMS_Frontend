import { CSV_SCHEMAS } from "@/lib/constants";

function normalizeHeader(header) {
  return String(header ?? "")
    .trim()
    .toLowerCase();
}

function detectSeparator(headerLine) {
  const semicolonCount = (headerLine.match(/;/g) || []).length;
  const commaCount = (headerLine.match(/,/g) || []).length;
  return semicolonCount > commaCount ? ";" : ",";
}

export function parseAndValidateCsv(text, schemaKey) {
  const schema = CSV_SCHEMAS[schemaKey];
  if (!Array.isArray(schema) || schema.length === 0) {
    return {
      headers: [],
      rows: [],
      errors: ["Unsupported import type schema."],
    };
  }

  const lines = String(text ?? "")
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "");

  if (lines.length < 2) {
    return {
      headers: [],
      rows: [],
      errors: ["The CSV must contain a header row and at least one data row."],
    };
  }

  const separator = detectSeparator(lines[0]);
  const headers = lines[0].split(separator).map(normalizeHeader);

  const missingHeaders = schema.filter(
    (requiredHeader) => !headers.includes(requiredHeader),
  );

  if (missingHeaders.length > 0) {
    return {
      headers,
      rows: [],
      errors: [
        `Missing required columns: ${missingHeaders.join(", ")}. Expected columns: ${schema.join(", ")}.`,
      ],
    };
  }

  const rows = lines.slice(1).map((line) => {
    const cells = line.split(separator);
    return Object.fromEntries(
      headers.map((header, index) => [header, cells[index]?.trim() ?? ""]),
    );
  });

  return {
    headers,
    rows,
    errors: [],
  };
}
