import { CaptchaRuntime } from "./runtime.js";
import { registerSecurityStage } from "../submission/security-stage.js";

import type { CaptchaSetup } from "./types.js";
import type { FormInstance, FormPlugin } from "../types/index.js";

/**
 * Register CAPTCHA as the Security Stage for a form (ADR-CAP-001).
 *
 * @example
 * ```ts
 * import { captcha, turnstile } from "@jayoncode/form-intelligence/captcha";
 *
 * createForm({
 *   plugins: [
 *     captcha(turnstile({ siteKey: "...", container: "#captcha" })),
 *   ],
 * });
 * ```
 */
export function captcha(setup: CaptchaSetup): FormPlugin {
  return {
    name: "captcha",
    setup(form) {
      const formLike = form as FormInstance<Record<string, unknown>>;
      const runtime = new CaptchaRuntime(formLike, setup);

      // Eager load (and render when DOM is ready); failures surface on submit / explain.
      void runtime.prepare().catch(() => {
        // prepare stores lastFailure; submit path re-attempts.
      });

      const unregister = registerSecurityStage(formLike, ({ signal }) => runtime.run(signal), {
        explainReasons: () => runtime.explainReasons(),
      });

      return () => {
        unregister();
        void runtime.destroy();
      };
    },
  };
}
