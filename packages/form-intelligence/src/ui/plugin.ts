import { createUiProjection } from "./projection.js";
import { setUiPolicies, clearUiPolicies } from "./store.js";

import type { UiPolicyOptions } from "./types.js";
import type { FormInstance, FormPlugin } from "../types/index.js";

/**
 * Register shared UI policies on a form. Enables projection-aware DOM enhancer behavior.
 * `form.ui` is always available on the form instance; this plugin customizes policies.
 */
export function ui(options: UiPolicyOptions = {}): FormPlugin {
  return {
    name: "ui",
    setup(form) {
      const formLike = form as FormInstance<Record<string, unknown>>;
      setUiPolicies(formLike, options);

      return () => {
        clearUiPolicies(formLike);
      };
    },
  };
}

export { createUiProjection };
