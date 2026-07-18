import type { Validator } from "../../types/index.js";

export const maxLength =
  (max: number): Validator =>
  (value) => {
    if (value === null || value === undefined || value === "") {
      return true;
    }

    if (typeof value === "string" && value.length > max) {
      return `Must be at most ${String(max)} characters.`;
    }

    if (Array.isArray(value) && value.length > max) {
      return `Must include at most ${String(max)} items.`;
    }

    return true;
  };
