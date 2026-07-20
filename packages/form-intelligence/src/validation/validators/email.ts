import { tagValidator } from "../validator-kind.js";

import type { Validator } from "../../types/index.js";

function isDisallowedEmailChar(char: string): boolean {
  return char === "@" || char.trim() === "";
}

function isSimpleEmailShape(value: string): boolean {
  const at = value.indexOf("@");
  if (at <= 0 || at !== value.lastIndexOf("@")) {
    return false;
  }

  const local = value.slice(0, at);
  const domain = value.slice(at + 1);
  if (local.length === 0 || domain.length === 0) {
    return false;
  }

  for (const char of local) {
    if (isDisallowedEmailChar(char)) {
      return false;
    }
  }

  for (const char of domain) {
    if (isDisallowedEmailChar(char)) {
      return false;
    }
  }

  // Same shape as /^[^\s@]+@[^\s@]+\.[^\s@]+$/ — a '.' with non-empty sides.
  const dot = domain.indexOf(".", 1);
  return dot > 0 && dot < domain.length - 1;
}

export const email: Validator = tagValidator((value) => {
  if (value === null || value === undefined || value === "") {
    return true;
  }

  if (typeof value !== "string") {
    return "Enter a valid email address.";
  }

  return isSimpleEmailShape(value) ? true : "Enter a valid email address.";
}, "email");
