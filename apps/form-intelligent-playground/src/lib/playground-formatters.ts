import type { Formatter } from "@jayoncode/form-intelligent";

export const creditCard: Formatter = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
};

export const normalizeUrl: Formatter = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim().toLowerCase();
  if (trimmed === "") {
    return trimmed;
  }

  return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
};
