import { ConfigurationError } from "../errors/index.js";

import type { CaptchaContainer } from "./types.js";
import type { FormInstance } from "../types/index.js";

export interface ResolvedMountHost {
  readonly host: HTMLElement;
  /** True when the host was created by auto-placement (plugin must remove on destroy). */
  readonly autoCreated: boolean;
}

function resolveExplicitContainer(container: CaptchaContainer): HTMLElement {
  if (typeof container === "function") {
    const host = container();
    if (!(host instanceof HTMLElement)) {
      throw new ConfigurationError(
        'CAPTCHA container resolver returned no HTMLElement. Pass a valid host (e.g. "#captcha").',
      );
    }
    return host;
  }

  if (typeof HTMLElement !== "undefined" && container instanceof HTMLElement) {
    return container;
  }

  if (typeof container === "string") {
    if (typeof document === "undefined") {
      throw new ConfigurationError("DOM APIs are not available to resolve CAPTCHA container.");
    }
    const host = document.querySelector(container);
    if (!(host instanceof HTMLElement)) {
      throw new ConfigurationError(
        `No CAPTCHA mount host matched selector "${container}". Provide a container element or omit container for auto-placement.`,
      );
    }
    return host;
  }

  throw new ConfigurationError("Unsupported CAPTCHA container value.");
}

function findBoundFormElement(form: FormInstance<Record<string, unknown>>): HTMLFormElement | null {
  if (typeof document === "undefined") {
    return null;
  }
  const el = document.querySelector(`form[data-form-intelligent="${form.id}"]`);
  return el instanceof HTMLFormElement ? el : null;
}

function autoPlaceHost(formElement: HTMLFormElement): HTMLElement {
  const host = document.createElement("div");
  host.setAttribute("data-fi-captcha", "auto");
  const submit = formElement.querySelector('button[type="submit"], input[type="submit"]');
  if (submit?.parentNode) {
    submit.parentNode.insertBefore(host, submit);
  } else {
    formElement.appendChild(host);
  }
  return host;
}

/**
 * Resolve the mount host for widget / hybrid providers.
 * Manual `container` fails fast; omitting it uses auto-placement (ADR-CAP-001).
 */
export function resolveMountHost(
  form: FormInstance<Record<string, unknown>>,
  container: CaptchaContainer | undefined,
): ResolvedMountHost {
  if (container !== undefined) {
    return { host: resolveExplicitContainer(container), autoCreated: false };
  }

  const formElement = findBoundFormElement(form);
  if (!formElement) {
    throw new ConfigurationError(
      "CAPTCHA auto-placement requires a bound <form> (createForm({ target }) or form.ref). Pass `container` for an explicit mount host.",
    );
  }

  return { host: autoPlaceHost(formElement), autoCreated: true };
}
