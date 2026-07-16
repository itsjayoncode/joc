import type { SubmitMeta } from "../types/index.js";

/**
 * Transport layer for form submission (fetch, GraphQL, custom API clients).
 * Keep UI frameworks out of this interface — values + meta only.
 */
export interface SubmitTransportAdapter<
  TValues extends Record<string, unknown> = Record<string, unknown>,
  TResult = unknown,
> {
  readonly name?: string;
  submit(values: TValues, meta?: SubmitMeta): Promise<TResult> | TResult;
}

export function isSubmitTransportAdapter(value: unknown): value is SubmitTransportAdapter {
  return (
    typeof value === "object" &&
    value !== null &&
    "submit" in value &&
    typeof (value as SubmitTransportAdapter).submit === "function"
  );
}
