import type { Formatter } from "@jayoncode/form-intelligence";

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
