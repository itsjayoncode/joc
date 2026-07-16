import type { Validator } from "../../types/index.js";

export interface DateValidatorOptions {
  readonly min?: Date | string;
  readonly max?: Date | string;
}

function toDate(value: unknown): Date | undefined {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
  }

  return undefined;
}

function toBoundary(value: Date | string | undefined): Date | undefined {
  if (value === undefined) {
    return undefined;
  }

  return value instanceof Date ? value : toDate(value);
}

export function date(options: DateValidatorOptions = {}): Validator {
  const min = toBoundary(options.min);
  const max = toBoundary(options.max);

  return (value) => {
    if (value === null || value === undefined || value === "") {
      return true;
    }

    const parsed = toDate(value);
    if (!parsed) {
      return "Enter a valid date.";
    }

    if (min && parsed < min) {
      return `Date must be on or after ${min.toISOString().slice(0, 10)}.`;
    }

    if (max && parsed > max) {
      return `Date must be on or before ${max.toISOString().slice(0, 10)}.`;
    }

    return true;
  };
}
