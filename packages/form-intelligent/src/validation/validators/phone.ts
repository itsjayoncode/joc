import type { Validator } from "../../types/index.js";

const E164_PATTERN = /^\+[1-9]\d{6,14}$/;

export function phone(message = "Enter a valid phone number."): Validator {
  return (value) => {
    if (value === null || value === undefined || value === "") {
      return true;
    }

    if (typeof value !== "string") {
      return message;
    }

    const normalized = value.replace(/[\s()-]/g, "");
    return E164_PATTERN.test(normalized) ? true : message;
  };
}
