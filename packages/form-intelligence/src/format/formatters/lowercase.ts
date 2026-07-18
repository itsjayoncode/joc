import type { Formatter } from "../types.js";

export const formatLowercase: Formatter = (value) =>
  typeof value === "string" ? value.toLowerCase() : value;

export const lowercaseParser: Formatter = formatLowercase;
