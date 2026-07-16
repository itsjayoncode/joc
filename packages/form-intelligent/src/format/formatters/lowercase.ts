import type { Formatter } from "../types.js";

export const lowercase: Formatter = (value) =>
  typeof value === "string" ? value.toLowerCase() : value;

export const lowercaseParser: Formatter = lowercase;
