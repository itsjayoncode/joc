import {
  creditCard,
  creditCardParser,
  philippinePhone,
  philippinePhoneParser,
  slug,
} from "./formatters/index.js";
import { resolveBuiltinFormatter } from "./registry.js";

import type { FormatterDefinition } from "./types.js";

export type FormatPreset = "philippine-phone" | "credit-card" | "phone" | "currency" | "slug";

export function resolveFormatPreset(preset: FormatPreset): FormatterDefinition {
  switch (preset) {
    case "philippine-phone":
      return { format: philippinePhone, parse: philippinePhoneParser };
    case "credit-card":
      return { format: creditCard, parse: creditCardParser };
    case "phone":
      return { format: philippinePhone, parse: philippinePhoneParser };
    case "currency":
      return resolveBuiltinFormatter("currency");
    case "slug":
      return { format: slug };
    default:
      return { format: (value) => value };
  }
}

export { creditCard, creditCardParser, philippinePhone, philippinePhoneParser };
