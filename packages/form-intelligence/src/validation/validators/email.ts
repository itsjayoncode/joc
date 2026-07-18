import type { Validator } from "../../types/index.js";

export const email: Validator = (value) => {
  if (value === null || value === undefined || value === "") {
    return true;
  }

  if (typeof value !== "string") {
    return "Enter a valid email address.";
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? true : "Enter a valid email address.";
};
