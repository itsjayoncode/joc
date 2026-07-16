import type { Formatter, FormatterDefinition, Parser } from "../types.js";

export function custom(format: Formatter, parse?: Parser): FormatterDefinition {
  return parse === undefined ? { format } : { format, parse };
}

export function customFormatter(format: Formatter): Formatter {
  return format;
}

export function customParser(parse: Parser): Parser {
  return parse;
}
