import { tagValidator } from "../validator-kind.js";

import type { Validator } from "../../types/index.js";

export const required: Validator = tagValidator((value) => {
  if (value === null || value === undefined || value === "") {
    return "This field is required.";
  }

  if (Array.isArray(value) && value.length === 0) {
    return "This field is required.";
  }

  return true;
}, "required");
