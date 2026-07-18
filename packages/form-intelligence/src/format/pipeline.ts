import type { FieldFormatOptions, Formatter, Parser } from "./types.js";

export function applyFormatter(value: unknown, formatter: Formatter | undefined): unknown {
  return formatter ? formatter(value) : value;
}

export function applyParser(value: unknown, parser: Parser | undefined): unknown {
  return parser ? parser(value) : value;
}

export function composeFormatters(...formatters: readonly Formatter[]): Formatter {
  return (value) => {
    let current = value;
    for (const formatter of formatters) {
      current = formatter(current);
    }
    return current;
  };
}

export function composeParsers(...parsers: readonly Parser[]): Parser {
  return (value) => {
    let current = value;
    for (const parser of [...parsers].reverse()) {
      current = parser(current);
    }
    return current;
  };
}

export function parseFromInput(value: unknown, options?: FieldFormatOptions): unknown {
  if (options?.parseOnInput === false || !options?.parse) {
    return value;
  }

  return applyParser(value, options.parse);
}

export function formatForDisplay(value: unknown, options?: FieldFormatOptions): unknown {
  if (options?.formatOnDisplay === false || !options?.format) {
    return value;
  }

  return applyFormatter(value, options.format);
}

export function formatFieldValue(value: unknown, options?: FieldFormatOptions): unknown {
  const parsed = parseFromInput(value, options);
  return formatForDisplay(parsed, options);
}

export function roundTripFormat(
  value: unknown,
  options: FieldFormatOptions,
): { readonly parsed: unknown; readonly formatted: unknown } {
  const parsed = parseFromInput(value, options);
  const formatted = formatForDisplay(parsed, options);
  return { parsed, formatted };
}
