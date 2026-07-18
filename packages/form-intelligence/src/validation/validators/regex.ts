import type { Validator } from "../../types/index.js";

export const regex =
  (pattern: RegExp, message = "Invalid format."): Validator =>
  (value) => {
    if (value === null || value === undefined || value === "") {
      return true;
    }

    return typeof value === "string" && pattern.test(value) ? true : message;
  };
