import type { CalculationComputeContext, CalculationDefinition } from "./run-calculations.js";
import type { FieldPath } from "../workflow/types.js";

export interface CalculationBuilder<
  TValues extends Record<string, unknown> = Record<string, unknown>,
> {
  from(...deps: FieldPath[]): CalculationBuilder<TValues>;
  lazy(enabled?: boolean): CalculationBuilder<TValues>;
  memoized(enabled?: boolean): CalculationBuilder<TValues>;
  markDirty(enabled?: boolean): CalculationBuilder<TValues>;
  compute(fn: (ctx: CalculationComputeContext<TValues>) => unknown): void;
}

type RegisterFn<TValues extends Record<string, unknown>> = (
  definition: CalculationDefinition<TValues>,
) => void;

/**
 * Fluent `calculate(path).from(...).compute(fn)` builder (API freeze §3).
 */
export class CalculationBuilderImpl<
  TValues extends Record<string, unknown> = Record<string, unknown>,
> implements CalculationBuilder<TValues> {
  private readonly path: FieldPath;
  private deps: FieldPath[] | undefined;
  private lazyEnabled = false;
  private memoizedEnabled = false;
  private markDirtyEnabled = false;
  private register: RegisterFn<TValues> | undefined;

  public constructor(path: FieldPath) {
    this.path = path;
  }

  public _attachRegister(register: RegisterFn<TValues>): this {
    this.register = register;
    return this;
  }

  public from(...deps: FieldPath[]): this {
    this.deps = deps;
    return this;
  }

  public lazy(enabled = true): this {
    this.lazyEnabled = enabled;
    return this;
  }

  public memoized(enabled = true): this {
    this.memoizedEnabled = enabled;
    return this;
  }

  public markDirty(enabled = true): this {
    this.markDirtyEnabled = enabled;
    return this;
  }

  public compute(fn: (ctx: CalculationComputeContext<TValues>) => unknown): void {
    if (!this.register) {
      throw new Error(
        "calculate(path).compute() must be used via form.calculate(path) (or attach a form register).",
      );
    }

    this.register({
      path: this.path,
      compute: fn,
      ...(this.deps === undefined ? {} : { deps: this.deps }),
      ...(this.markDirtyEnabled ? { markDirty: true } : {}),
      ...(this.lazyEnabled ? { lazy: true } : {}),
      ...(this.memoizedEnabled ? { memoized: true } : {}),
    });
  }
}

/**
 * Root helper — returns an unbound builder. Prefer `form.calculate(path)`.
 */
export function calculate<TValues extends Record<string, unknown> = Record<string, unknown>>(
  path: FieldPath,
): CalculationBuilder<TValues> {
  return new CalculationBuilderImpl<TValues>(path);
}
