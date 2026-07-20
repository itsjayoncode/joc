import { tagValidator } from "../validator-kind.js";

import type { Validator } from "../../types/index.js";

export const minLength = (min: number): Validator =>
  tagValidator((value) => {
    if (value === null || value === undefined || value === "") {
      return true;
    }

    if (typeof value === "string" && value.length < min) {
      return `Must be at least ${String(min)} characters.`;
    }

    if (Array.isArray(value) && value.length < min) {
      return `Must include at least ${String(min)} items.`;
    }

    return true;
  }, "minLength");
