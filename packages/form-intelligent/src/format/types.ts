export type Formatter = (value: unknown) => unknown;
export type Parser = (value: unknown) => unknown;

export interface FormatterDefinition {
  readonly format: Formatter;
  readonly parse?: Parser;
}

export interface FieldFormatOptions {
  readonly format?: Formatter;
  readonly parse?: Parser;
  readonly formatOnDisplay?: boolean;
  readonly parseOnInput?: boolean;
}
