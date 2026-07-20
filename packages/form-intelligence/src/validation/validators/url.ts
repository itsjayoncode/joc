import { tagValidator } from "../validator-kind.js";

import type { Validator } from "../../types/index.js";

export const url: Validator = tagValidator((value) => {
  if (value === null || value === undefined || value === "") {
    return true;
  }

  if (typeof value !== "string") {
    return "Enter a valid URL.";
  }

  try {
    new URL(value);
    return true;
  } catch {
    return "Enter a valid URL.";
  }
}, "url");
