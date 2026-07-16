import type { FormEventBus } from "./events.js";
import type { ResolvedFormConfig } from "./options.js";
import type { FormInstance } from "../types/index.js";

export interface FormModuleContext<TValues extends Record<string, unknown>> {
  readonly form: FormInstance<TValues>;
  readonly config: ResolvedFormConfig<TValues>;
  readonly events: FormEventBus;
  registerCleanup(cleanup: () => void): void;
}

export interface FormModule<TValues extends Record<string, unknown> = Record<string, unknown>> {
  readonly id: string;
  readonly order?: number;
  initialize?(context: FormModuleContext<TValues>): void;
  start?(context: FormModuleContext<TValues>): void;
  stop?(context: FormModuleContext<TValues>): void;
  destroy?(context: FormModuleContext<TValues>): void;
}
