import {
  formatCreditCard,
  creditCardParser,
  formatCurrency,
  currencyParser,
  formatLowercase,
  lowercaseParser,
  formatPhone,
  phoneParser,
  formatSlug,
  slugParser,
  trim,
  trimParser,
  formatUppercase,
  uppercaseParser,
} from "./formatters/index.js";

import type { FormatterDefinition } from "./types.js";

export type BuiltinFormatterName =
  "phone" | "currency" | "creditCard" | "uppercase" | "lowercase" | "trim" | "slug";

const BUILTIN_FORMATTERS: Record<BuiltinFormatterName, FormatterDefinition> = {
  phone: { format: formatPhone, parse: phoneParser },
  currency: { format: formatCurrency, parse: currencyParser },
  creditCard: { format: formatCreditCard, parse: creditCardParser },
  uppercase: { format: formatUppercase, parse: uppercaseParser },
  lowercase: { format: formatLowercase, parse: lowercaseParser },
  trim: { format: trim, parse: trimParser },
  slug: { format: formatSlug, parse: slugParser },
};

export class FormatterRegistry {
  private readonly custom = new Map<string, FormatterDefinition>();

  public register(name: string, definition: FormatterDefinition): void {
    this.custom.set(name, definition);
  }

  public resolve(name: string): FormatterDefinition | undefined {
    if (name in BUILTIN_FORMATTERS) {
      return BUILTIN_FORMATTERS[name as BuiltinFormatterName];
    }

    return this.custom.get(name);
  }

  public list(): string[] {
    return [...Object.keys(BUILTIN_FORMATTERS), ...this.custom.keys()];
  }
}

export const defaultFormatterRegistry = new FormatterRegistry();

export function resolveBuiltinFormatter(name: BuiltinFormatterName): FormatterDefinition {
  return BUILTIN_FORMATTERS[name];
}
