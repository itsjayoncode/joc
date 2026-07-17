import type { TtlInput } from "../../types/async-validation.js";

const TTL_PATTERN = /^(\d+(?:\.\d+)?)(ms|s|m|h)$/;

/**
 * Parse TTL input to milliseconds.
 * Plain numbers are treated as milliseconds.
 */
export function parseTtl(input: TtlInput): number {
  if (typeof input === "number") {
    if (!Number.isFinite(input) || input < 0) {
      throw new RangeError(`Invalid TTL number: ${input}`);
    }
    return input;
  }

  const match = TTL_PATTERN.exec(input);
  if (!match) {
    throw new TypeError(`Invalid TTL string: ${input}`);
  }

  const amount = Number(match[1]);
  const unit = match[2];
  switch (unit) {
    case "ms":
      return amount;
    case "s":
      return amount * 1_000;
    case "m":
      return amount * 60_000;
    case "h":
      return amount * 3_600_000;
    default:
      throw new TypeError(`Invalid TTL unit: ${unit}`);
  }
}
