import type { Formatter } from "../types.js";

export const trim: Formatter = (value) => (typeof value === "string" ? value.trim() : value);

export const trimParser: Formatter = trim;
