import type { Validator } from "../../types/index.js";

export interface CurrencyValidatorOptions {
  readonly precision?: number;
  readonly min?: number;
  readonly max?: number;
}

export function currency(options: CurrencyValidatorOptions = {}): Validator {
  const precision = options.precision ?? 2;

  return (value) => {
    if (value === null || value === undefined || value === "") {
      return true;
    }

    const raw = typeof value === "number" ? String(value) : String(value).replace(/,/g, "").trim();
    if (!/^-?\d+(\.\d+)?$/.test(raw)) {
      return "Enter a valid amount.";
    }

    const decimalPart = raw.split(".")[1];
    if (decimalPart !== undefined && decimalPart.length > precision) {
      return `Use at most ${String(precision)} decimal places.`;
    }

    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) {
      return "Enter a valid amount.";
    }

    if (options.min !== undefined && parsed < options.min) {
      return `Amount must be at least ${String(options.min)}.`;
    }

    if (options.max !== undefined && parsed > options.max) {
      return `Amount must be at most ${String(options.max)}.`;
    }

    return true;
  };
}
