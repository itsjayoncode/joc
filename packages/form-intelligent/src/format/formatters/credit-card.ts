import type { Formatter, Parser } from "../types.js";

export const creditCard: Formatter = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
};

export const creditCardParser: Parser = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  return value.replace(/\D/g, "").slice(0, 16);
};
