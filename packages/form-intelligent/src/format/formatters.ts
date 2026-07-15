import type { Formatter, Parser } from "../types/index.js";

export const trim: Formatter = (value) => (typeof value === "string" ? value.trim() : value);

export const uppercase: Formatter = (value) =>
  typeof value === "string" ? value.toUpperCase() : value;

export const lowercase: Formatter = (value) =>
  typeof value === "string" ? value.toLowerCase() : value;

export const phone: Formatter = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) {
    return digits;
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

export const currency: Formatter = (value) => {
  if (typeof value === "number") {
    return value.toFixed(2);
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed.toFixed(2) : value;
  }

  return value;
};

export const slug: Formatter = (value) =>
  typeof value === "string"
    ? value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
    : value;

export function applyFormatter(value: unknown, formatter: Formatter | undefined): unknown {
  return formatter ? formatter(value) : value;
}

export function applyParser(value: unknown, parser: Parser | undefined): unknown {
  return parser ? parser(value) : value;
}
