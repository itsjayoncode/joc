import type { UseFormReturn } from "./types.js";
import type { InjectionKey } from "vue";

export const FORM_CONTEXT_KEY: InjectionKey<UseFormReturn<Record<string, unknown>>> =
  Symbol("form-intelligent-form");
