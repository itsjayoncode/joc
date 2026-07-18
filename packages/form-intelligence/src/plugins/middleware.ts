import type { FormInstance } from "../types/index.js";

/** Phases that onion middleware and plugin hooks can observe. */
export type MiddlewarePhase =
  | "beforeValidate"
  | "afterValidate"
  | "beforeSubmit"
  | "afterSubmit"
  | "submitError"
  | "beforeSetValue"
  | "afterSetValue";

export type MiddlewareNext = () => Promise<void>;

export interface MiddlewareContext<
  TValues extends Record<string, unknown> = Record<string, unknown>,
> {
  readonly form: FormInstance<TValues>;
  readonly phase: MiddlewarePhase;
  readonly signal: AbortSignal;
  readonly meta: Readonly<Record<string, unknown>>;
  halt(reason?: string): void;
}

export type FormMiddleware<TValues extends Record<string, unknown> = Record<string, unknown>> = (
  ctx: MiddlewareContext<TValues>,
  next: MiddlewareNext,
) => void | Promise<void>;

export interface MiddlewareRegistration {
  readonly name: string;
  readonly order?: number;
  readonly phases?: readonly MiddlewarePhase[];
}

export type MiddlewareInput<TValues extends Record<string, unknown> = Record<string, unknown>> =
  | (FormMiddleware<TValues> & Partial<MiddlewareRegistration>)
  | (MiddlewareRegistration & { readonly run: FormMiddleware<TValues> });

/**
 * Maps plugin hook names → middleware phases (Phase 10 / D-MW-VS-PLUGIN).
 * Plugin `api.on(hook)` and `form.useMiddleware` share one interceptor stack per phase.
 * Documented pipeline stages: see `PLUGIN_PIPELINE_STAGES`.
 */
export const MIDDLEWARE_HOOK_MAP = {
  beforeValidate: "beforeValidate",
  afterValidate: "afterValidate",
  beforeSubmit: "beforeSubmit",
  afterSubmit: "afterSubmit",
} as const satisfies Record<string, MiddlewarePhase>;

/** Phases that exist only on the middleware onion (no plugin hook synonym yet). */
export const MIDDLEWARE_ONLY_PHASES = ["submitError", "beforeSetValue", "afterSetValue"] as const;

export type PluginMiddleware<TContext> = (
  context: TContext,
  next: () => Promise<void>,
) => void | Promise<void>;

export function composeMiddleware<TContext>(
  middlewares: readonly PluginMiddleware<TContext>[],
): (context: TContext) => Promise<void> {
  return async (context) => {
    let index = 0;

    const next = async (): Promise<void> => {
      const middleware = middlewares[index];
      index += 1;
      if (!middleware) {
        return;
      }

      await middleware(context, next);
    };

    await next();
  };
}

export async function runMiddlewareChain<TContext>(
  middlewares: readonly PluginMiddleware<TContext>[],
  context: TContext,
): Promise<void> {
  await composeMiddleware(middlewares)(context);
}

interface RegisteredMiddleware<TValues extends Record<string, unknown>> {
  readonly name: string;
  readonly order: number;
  readonly registrationIndex: number;
  readonly phases: readonly MiddlewarePhase[] | undefined;
  readonly run: FormMiddleware<TValues>;
}

export interface MiddlewareRunResult {
  readonly halted: boolean;
  readonly reason?: string;
}

/**
 * Onion middleware registry. Lower `order` runs earlier (outer). Same order → registration order.
 */
export class MiddlewarePipeline<TValues extends Record<string, unknown>> {
  private readonly entries = new Map<string, RegisteredMiddleware<TValues>>();
  private nextRegistrationIndex = 1;

  public use(middleware: MiddlewareInput<TValues>): () => void {
    const normalized = normalizeMiddlewareInput(middleware);
    const name = normalized.name;

    this.entries.set(name, {
      name,
      order: normalized.order,
      registrationIndex: this.nextRegistrationIndex,
      phases: normalized.phases,
      run: normalized.run,
    });
    this.nextRegistrationIndex += 1;

    return () => {
      this.entries.delete(name);
    };
  }

  public async run(input: {
    readonly form: FormInstance<TValues>;
    readonly phase: MiddlewarePhase;
    readonly signal: AbortSignal;
    readonly meta?: Readonly<Record<string, unknown>>;
  }): Promise<MiddlewareRunResult> {
    const chain = this.getOrderedForPhase(input.phase);
    if (chain.length === 0) {
      return { halted: false };
    }

    let halted = false;
    let reason: string | undefined;
    const meta = input.meta ?? {};

    const context: MiddlewareContext<TValues> = {
      form: input.form,
      phase: input.phase,
      signal: input.signal,
      meta,
      halt(haltReason) {
        halted = true;
        reason = haltReason;
      },
    };

    let index = 0;
    const dispatch = async (): Promise<void> => {
      if (halted || input.signal.aborted) {
        halted = true;
        return;
      }

      const entry = chain[index];
      index += 1;
      if (!entry) {
        return;
      }

      const isGuardPhase =
        input.phase === "beforeValidate" ||
        input.phase === "beforeSubmit" ||
        input.phase === "beforeSetValue";

      let nextCalled = false;
      try {
        await entry.run(context, async () => {
          nextCalled = true;
          await dispatch();
        });
      } catch {
        // Isolation: middleware throw does not brick the form.
        if (isGuardPhase) {
          halted = true;
          reason = reason ?? "middleware_error";
          return;
        }
        // Observer / after phases: continue remaining chain.
        if (!nextCalled) {
          await dispatch();
        }
        return;
      }

      if (!nextCalled && !halted && isGuardPhase) {
        // Onion stop without explicit halt — cancel guard phases only.
        halted = true;
      }
    };

    await dispatch();

    if (input.signal.aborted) {
      return { halted: true, reason: reason ?? "aborted" };
    }

    return halted ? { halted: true, ...(reason ? { reason } : {}) } : { halted: false };
  }

  public clear(): void {
    this.entries.clear();
    this.nextRegistrationIndex = 1;
  }

  private getOrderedForPhase(phase: MiddlewarePhase): readonly RegisteredMiddleware<TValues>[] {
    return [...this.entries.values()]
      .filter((entry) => entry.phases === undefined || entry.phases.includes(phase))
      .sort((left, right) => {
        if (left.order !== right.order) {
          return left.order - right.order;
        }
        return left.registrationIndex - right.registrationIndex;
      });
  }
}

function normalizeMiddlewareInput<TValues extends Record<string, unknown>>(
  middleware: MiddlewareInput<TValues>,
): {
  readonly name: string;
  readonly order: number;
  readonly phases: readonly MiddlewarePhase[] | undefined;
  readonly run: FormMiddleware<TValues>;
} {
  if ("run" in middleware && typeof middleware.run === "function") {
    return {
      name: middleware.name,
      order: middleware.order ?? 0,
      phases: middleware.phases,
      run: middleware.run,
    };
  }

  const fn = middleware as FormMiddleware<TValues> & Partial<MiddlewareRegistration>;
  return {
    name: fn.name ?? `middleware-${Math.random().toString(36).slice(2, 9)}`,
    order: fn.order ?? 0,
    phases: fn.phases,
    run: fn,
  };
}
