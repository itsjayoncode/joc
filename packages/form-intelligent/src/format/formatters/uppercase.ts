import type { Formatter } from "../types.js";

export const uppercase: Formatter = (value) =>
  typeof value === "string" ? value.toUpperCase() : value;

export const uppercaseParser: Formatter = uppercase;
