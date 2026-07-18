import type { Validator } from "../../types/index.js";

export interface NumberValidatorOptions {
  readonly min?: number;
  readonly max?: number;
  readonly integer?: boolean;
}

function toNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

export function number(options: NumberValidatorOptions = {}): Validator {
  return (value) => {
    if (value === null || value === undefined || value === "") {
      return true;
    }

    const parsed = toNumber(value);
    if (parsed === undefined) {
      return "Enter a valid number.";
    }

    if (options.integer && !Number.isInteger(parsed)) {
      return "Enter a whole number.";
    }

    if (options.min !== undefined && parsed < options.min) {
      return `Must be at least ${String(options.min)}.`;
    }

    if (options.max !== undefined && parsed > options.max) {
      return `Must be at most ${String(options.max)}.`;
    }

    return true;
  };
}

export const min =
  (minimum: number): Validator =>
  (value) => {
    if (value === null || value === undefined || value === "") {
      return true;
    }

    if (typeof value === "string") {
      return value.length >= minimum ? true : `Must be at least ${String(minimum)} characters.`;
    }

    const parsed = toNumber(value);
    if (parsed === undefined) {
      return "Enter a valid number.";
    }

    return parsed >= minimum ? true : `Must be at least ${String(minimum)}.`;
  };

export const max =
  (maximum: number): Validator =>
  (value) => {
    if (value === null || value === undefined || value === "") {
      return true;
    }

    if (typeof value === "string") {
      return value.length <= maximum ? true : `Must be at most ${String(maximum)} characters.`;
    }

    const parsed = toNumber(value);
    if (parsed === undefined) {
      return "Enter a valid number.";
    }

    return parsed <= maximum ? true : `Must be at most ${String(maximum)}.`;
  };
