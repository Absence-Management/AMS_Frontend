import { CSV_SCHEMAS } from "@/lib/constants";

/* ===============================
   Helpers
================================ */

function normalizeHeader(header) {
  return String(header ?? "").trim().toLowerCase();
}

function detectSeparator(line) {
  let semicolons = 0;
  let commas = 0;
  let inQuotes = false;
  for (const ch of line) {
    if (ch === '"') { inQuotes = !inQuotes; continue; }
    if (inQuotes) continue;
    if (ch === ";") semicolons++;
    else if (ch === ",") commas++;
  }
  return semicolons > commas ? ";" : ",";
}

/* ===============================
   CSV Core
================================ */

function splitCsvLine(line, sep) {
  const fields = [];
  let current = "";
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const ch = line[i];

    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped double-quote inside a quoted field ("" → ")
        current += '"';
        i += 2;
        continue;
      }
      inQuotes = !inQuotes;
      i++;
      continue;
    }

    if (ch === sep && !inQuotes) {
      fields.push(current.trim());
      current = "";
      i++;
      continue;
    }

    current += ch;
    i++;
  }

  if (inQuotes) {
    throw new Error("Unclosed quote detected in CSV line");
  }

  fields.push(current.trim());
  return fields;
}

function splitCsvLines(text) {
  const lines = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (ch === '"') {
      if (inQuotes && text[i + 1] === '"') {
        current += '""';
        i++;
        continue;
      }
      inQuotes = !inQuotes;
      current += ch;
      continue;
    }

    if ((ch === "\n" || ch === "\r") && !inQuotes) {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      if (current.trim()) lines.push(current);
      current = "";
      continue;
    }

    current += ch;
  }

  if (inQuotes) {
    throw new Error("Unclosed quote detected in CSV file");
  }

  if (current.trim()) lines.push(current);
  return lines;
}

/* ===============================
   Main Parser
================================ */

/**
 * Parse and validate a CSV string against a known schema.
 *
 * @param {string} text       - raw CSV file contents
 * @param {string} schemaKey  - "students" | "teachers" | "timetable"
 * @returns {{ headers: string[], rows: object[], errors: string[] }}
 *
 * Notes:
 *   - rows with a column-count mismatch are still included in `rows` (with
 *     missing cells defaulting to "") alongside the error entry — the import
 *     page can decide whether to block on errors or show them as warnings.
 *   - errors[] is cumulative: all bad rows are reported, not just the first.
 */
export function parseAndValidateCsv(text, schemaKey) {
  const schema = CSV_SCHEMAS[schemaKey];
  if (!Array.isArray(schema) || schema.length === 0) {
    return { headers: [], rows: [], errors: ["Unsupported import type schema."] };
  }

  // ── Split into logical lines ─────────────────────────────────────────────
  let lines;
  try {
    lines = splitCsvLines(String(text ?? ""));
    // Remove lines that start with '#' (comments)
    lines = lines.filter(line => !line.trimStart().startsWith("#"));
  } catch (err) {
    return { headers: [], rows: [], errors: [err.message] };
  }

  if (lines.length < 2) {
    return {
      headers: [],
      rows: [],
      errors: ["The CSV must contain a header row and at least one data row."],
    };
  }

  // ── Parse header row ─────────────────────────────────────────────────────
  const separator = detectSeparator(lines[0]);

  let headers;
  try {
    headers = splitCsvLine(lines[0], separator).map(normalizeHeader);
  } catch (err) {
    return { headers: [], rows: [], errors: [`Header row: ${err.message}`] };
  }

  const missingHeaders = schema.filter((required) => !headers.includes(required));
  if (missingHeaders.length > 0) {
    return {
      headers,
      rows: [],
      errors: [
        `Missing required columns: ${missingHeaders.join(", ")}. Expected: ${schema.join(", ")}`,
      ],
    };
  }

  // ── Parse data rows ──────────────────────────────────────────────────────
  const errors = [];
  const rows = [];

  lines.slice(1).forEach((line, index) => {
    const rowNumber = index + 2; // 1-based, accounting for the header row

    let cells;
    try {
      cells = splitCsvLine(line, separator);
    } catch (err) {
      errors.push(`Row ${rowNumber}: ${err.message}`);
      return;
    }

    if (cells.length !== headers.length) {
      errors.push(
        `Row ${rowNumber}: expected ${headers.length} columns, got ${cells.length}`,
      );
    }

    rows.push(
      Object.fromEntries(headers.map((header, i) => [header, cells[i] ?? ""])),
    );
  });

  return { headers, rows, errors };
}