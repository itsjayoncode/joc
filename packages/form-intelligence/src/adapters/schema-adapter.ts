/**
 * Bridge any validation library into Form Intelligence.
 * Schema adapters are optional — core never depends on Zod/Yup/etc.
 * Error keys are field paths (dot notation).
 */
export interface SchemaAdapter<TValues extends Record<string, unknown> = Record<string, unknown>> {
  readonly name?: string;
  validate(
    values: TValues,
  ): Readonly<Record<string, string>> | Promise<Readonly<Record<string, string>>>;
}

export function isSchemaAdapter(value: unknown): value is SchemaAdapter {
  return (
    typeof value === "object" &&
    value !== null &&
    "validate" in value &&
    typeof (value as SchemaAdapter).validate === "function"
  );
}
