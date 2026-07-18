import {
  formatCreditCard,
  creditCardParser,
  formatPhilippinePhone,
  philippinePhoneParser,
  formatSlug,
} from "./formatters/index.js";
import { resolveBuiltinFormatter } from "./registry.js";

import type { FormatterDefinition } from "./types.js";

export type FormatPreset = "philippine-phone" | "credit-card" | "phone" | "currency" | "slug";

export function resolveFormatPreset(preset: FormatPreset): FormatterDefinition {
  switch (preset) {
    case "philippine-phone":
      return { format: formatPhilippinePhone, parse: philippinePhoneParser };
    case "credit-card":
      return { format: formatCreditCard, parse: creditCardParser };
    case "phone":
      return { format: formatPhilippinePhone, parse: philippinePhoneParser };
    case "currency":
      return resolveBuiltinFormatter("currency");
    case "slug":
      return { format: formatSlug };
    default:
      return { format: (value) => value };
  }
}

export { formatCreditCard, creditCardParser, formatPhilippinePhone, philippinePhoneParser };
