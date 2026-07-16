import type { FormInstance } from "../types/index.js";

/**
 * Contract for framework UI adapters (React, Vue, Angular, Svelte, …).
 * Implementations ship in separate packages — never required by core.
 */
export interface FrameworkAdapter<
  TValues extends Record<string, unknown> = Record<string, unknown>,
> {
  readonly name: string;
  /**
   * Bind framework lifecycle / reactivity to a form instance.
   * Return a cleanup that disconnects subscriptions and effects.
   */
  connect(form: FormInstance<TValues>): void | (() => void);
}

export function isFrameworkAdapter(value: unknown): value is FrameworkAdapter {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    typeof (value as FrameworkAdapter).name === "string" &&
    "connect" in value &&
    typeof (value as FrameworkAdapter).connect === "function"
  );
}
