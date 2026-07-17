import type { Formatter } from "../types.js";

export const formatUppercase: Formatter = (value) =>
  typeof value === "string" ? value.toUpperCase() : value;

export const uppercaseParser: Formatter = formatUppercase;
