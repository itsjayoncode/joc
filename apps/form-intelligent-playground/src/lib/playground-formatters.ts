import type { Formatter } from "@jayoncode/form-intelligent";

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
