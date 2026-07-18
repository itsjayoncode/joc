import type { Formatter, Parser } from "../types.js";

export const formatPhone: Formatter = (value) => {
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

export const phoneParser: Parser = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  return value.replace(/\D/g, "").slice(0, 10);
};
