import type { FieldPath, SubmitOptions, ValidationMode } from "../types/index.js";

export type PluginHookName =
  | "beforeValidate"
  | "afterValidate"
  | "beforeSubmit"
  | "afterSubmit"
  | "onAutosave"
  | "onDraftRestore";

export interface ValidateHookContext<TValues extends Record<string, unknown>> {
  readonly paths: readonly FieldPath[];
  readonly mode: ValidationMode;
  readonly values: TValues;
  valid: boolean;
}

export interface SubmitHookContext<TValues extends Record<string, unknown>> {
  readonly values: TValues;
  readonly options?: SubmitOptions;
  success: boolean;
}

export interface AutosaveHookContext<TValues extends Record<string, unknown>> {
  readonly values: TValues;
  readonly savedAt: number;
}

export interface DraftRestoreHookContext {
  readonly values: Record<string, unknown>;
}

export type BeforeValidateHandler<TValues extends Record<string, unknown>> = (
  context: ValidateHookContext<TValues>,
) => boolean | void | Promise<boolean | void>;

export type AfterValidateHandler<TValues extends Record<string, unknown>> = (
  context: ValidateHookContext<TValues>,
) => void | Promise<void>;

export type BeforeSubmitHandler<TValues extends Record<string, unknown>> = (
  context: SubmitHookContext<TValues>,
) => boolean | void | Promise<boolean | void>;

export type AfterSubmitHandler<TValues extends Record<string, unknown>> = (
  context: SubmitHookContext<TValues>,
) => void | Promise<void>;

export type AutosaveHandler<TValues extends Record<string, unknown>> = (
  context: AutosaveHookContext<TValues>,
) => void | Promise<void>;

export type DraftRestoreHandler = (context: DraftRestoreHookContext) => void | Promise<void>;

export interface FormPluginApi<TValues extends Record<string, unknown>> {
  on(
    hook: "beforeValidate",
    handler: BeforeValidateHandler<TValues>,
    options?: { readonly order?: number },
  ): () => void;
  on(
    hook: "afterValidate",
    handler: AfterValidateHandler<TValues>,
    options?: { readonly order?: number },
  ): () => void;
  on(
    hook: "beforeSubmit",
    handler: BeforeSubmitHandler<TValues>,
    options?: { readonly order?: number },
  ): () => void;
  on(
    hook: "afterSubmit",
    handler: AfterSubmitHandler<TValues>,
    options?: { readonly order?: number },
  ): () => void;
  on(
    hook: "onAutosave",
    handler: AutosaveHandler<TValues>,
    options?: { readonly order?: number },
  ): () => void;
  on(
    hook: "onDraftRestore",
    handler: DraftRestoreHandler,
    options?: { readonly order?: number },
  ): () => void;
  off(hook: PluginHookName, handler: (...args: never[]) => unknown): void;
}

interface RegisteredHook<THandler> {
  readonly order: number;
  readonly registrationIndex: number;
  readonly handler: THandler;
}

export class PluginHookBus<TValues extends Record<string, unknown>> {
  private nextRegistrationIndex = 1;
  private readonly beforeValidate = new Set<RegisteredHook<BeforeValidateHandler<TValues>>>();
  private readonly afterValidate = new Set<RegisteredHook<AfterValidateHandler<TValues>>>();
  private readonly beforeSubmit = new Set<RegisteredHook<BeforeSubmitHandler<TValues>>>();
  private readonly afterSubmit = new Set<RegisteredHook<AfterSubmitHandler<TValues>>>();
  private readonly onAutosave = new Set<RegisteredHook<AutosaveHandler<TValues>>>();
  private readonly onDraftRestore = new Set<RegisteredHook<DraftRestoreHandler>>();

  public createApi(): FormPluginApi<TValues> {
    return {
      on: (hook, handler, options) => this.addHook(hook, handler, options?.order ?? 100),
      off: (hook, handler) => {
        this.removeHook(hook, handler);
      },
    };
  }

  public runBeforeValidate(context: ValidateHookContext<TValues>): boolean | Promise<boolean> {
    if (this.beforeValidate.size === 0) {
      return true;
    }

    return runGuardHooks(this.getOrdered(this.beforeValidate), context);
  }

  public async runAfterValidate(context: ValidateHookContext<TValues>): Promise<void> {
    if (this.afterValidate.size === 0) {
      return;
    }

    await runSequentialHooks(this.getOrdered(this.afterValidate), context);
  }

  public runBeforeSubmit(context: SubmitHookContext<TValues>): boolean | Promise<boolean> {
    if (this.beforeSubmit.size === 0) {
      return true;
    }

    return runGuardHooks(this.getOrdered(this.beforeSubmit), context);
  }

  public async runAfterSubmit(context: SubmitHookContext<TValues>): Promise<void> {
    if (this.afterSubmit.size === 0) {
      return;
    }

    await runSequentialHooks(this.getOrdered(this.afterSubmit), context);
  }

  public async runOnAutosave(context: AutosaveHookContext<TValues>): Promise<void> {
    if (this.onAutosave.size === 0) {
      return;
    }

    await runSequentialHooks(this.getOrdered(this.onAutosave), context);
  }

  public async runOnDraftRestore(context: DraftRestoreHookContext): Promise<void> {
    if (this.onDraftRestore.size === 0) {
      return;
    }

    await runSequentialHooks(this.getOrdered(this.onDraftRestore), context);
  }

  public clear(): void {
    this.beforeValidate.clear();
    this.afterValidate.clear();
    this.beforeSubmit.clear();
    this.afterSubmit.clear();
    this.onAutosave.clear();
    this.onDraftRestore.clear();
    this.nextRegistrationIndex = 1;
  }

  private addHook(
    hook: PluginHookName,
    handler: (...args: never[]) => unknown,
    order: number,
  ): () => void {
    const entry = {
      order,
      registrationIndex: this.nextRegistrationIndex,
      handler,
    } as RegisteredHook<never>;
    this.nextRegistrationIndex += 1;
    this.getHookSet(hook).add(entry);
    return () => {
      this.getHookSet(hook).delete(entry);
    };
  }

  private removeHook(hook: PluginHookName, handler: (...args: never[]) => unknown): void {
    for (const entry of this.getHookSet(hook)) {
      if (entry.handler === handler) {
        this.getHookSet(hook).delete(entry);
      }
    }
  }

  private getHookSet(hook: PluginHookName): Set<RegisteredHook<never>> {
    switch (hook) {
      case "beforeValidate":
        return this.beforeValidate as Set<RegisteredHook<never>>;
      case "afterValidate":
        return this.afterValidate as Set<RegisteredHook<never>>;
      case "beforeSubmit":
        return this.beforeSubmit as Set<RegisteredHook<never>>;
      case "afterSubmit":
        return this.afterSubmit as Set<RegisteredHook<never>>;
      case "onAutosave":
        return this.onAutosave as Set<RegisteredHook<never>>;
      case "onDraftRestore":
        return this.onDraftRestore as Set<RegisteredHook<never>>;
      default:
        return this.beforeValidate as Set<RegisteredHook<never>>;
    }
  }

  private getOrdered<THandler>(
    hooks: Set<RegisteredHook<THandler>>,
  ): readonly RegisteredHook<THandler>[] {
    return [...hooks].sort((left, right) => {
      if (left.order !== right.order) {
        return left.order - right.order;
      }

      return left.registrationIndex - right.registrationIndex;
    });
  }
}

async function runGuardHooks<TContext>(
  hooks: readonly RegisteredHook<(context: TContext) => boolean | void | Promise<boolean | void>>[],
  context: TContext,
): Promise<boolean> {
  for (const entry of hooks) {
    const result = await entry.handler(context);
    if (result === false) {
      return false;
    }
  }

  return true;
}

async function runSequentialHooks<TContext>(
  hooks: readonly RegisteredHook<(context: TContext) => void | Promise<void>>[],
  context: TContext,
): Promise<void> {
  for (const entry of hooks) {
    await entry.handler(context);
  }
}

export async function resolveHookResult(result: boolean | Promise<boolean>): Promise<boolean> {
  return result;
}
