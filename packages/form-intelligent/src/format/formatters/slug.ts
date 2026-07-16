import type { Formatter } from "../types.js";

export const slug: Formatter = (value) =>
  typeof value === "string"
    ? value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
    : value;

export const slugParser: Formatter = slug;
