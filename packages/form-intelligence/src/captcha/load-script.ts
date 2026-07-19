import { CaptchaError } from "./errors.js";

/**
 * Load a third-party CAPTCHA script once and resolve the global SDK.
 */
export function loadCaptchaScript<T>(options: {
  readonly scriptUrl: string;
  readonly readGlobal: () => T | undefined;
  readonly unavailableMessage: string;
}): Promise<T> {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return Promise.reject(new CaptchaError(options.unavailableMessage, "captchaUnavailable"));
  }

  const existing = options.readGlobal();
  if (existing) {
    return Promise.resolve(existing);
  }

  const existingScript = document.querySelector<HTMLScriptElement>(
    `script[src="${options.scriptUrl}"]`,
  );

  const waitForGlobal = (): Promise<T> =>
    new Promise((resolve, reject) => {
      const finish = (): void => {
        const sdk = options.readGlobal();
        if (sdk) {
          resolve(sdk);
        } else {
          reject(new CaptchaError(options.unavailableMessage, "captchaUnavailable"));
        }
      };

      if (options.readGlobal()) {
        finish();
        return;
      }

      const onLoad = (): void => {
        finish();
      };
      const onError = (): void => {
        reject(new CaptchaError("Failed to load CAPTCHA script.", "captchaUnavailable"));
      };

      if (existingScript) {
        existingScript.addEventListener("load", onLoad);
        existingScript.addEventListener("error", onError);
        return;
      }

      const script = document.createElement("script");
      script.src = options.scriptUrl;
      script.async = true;
      script.onload = onLoad;
      script.onerror = onError;
      document.head.appendChild(script);
    });

  return waitForGlobal();
}
