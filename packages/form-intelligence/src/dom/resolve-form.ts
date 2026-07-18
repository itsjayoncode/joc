import { ConfigurationError } from "../errors/index.js";

export function resolveFormElement(target: string | HTMLElement): HTMLFormElement {
  if (typeof HTMLElement !== "undefined" && target instanceof HTMLFormElement) {
    return target;
  }

  if (typeof HTMLElement !== "undefined" && target instanceof HTMLElement) {
    const nestedForm = target.closest("form");
    if (nestedForm instanceof HTMLFormElement) {
      return nestedForm;
    }

    throw new ConfigurationError("The provided element is not inside a <form>.");
  }

  if (typeof document === "undefined") {
    throw new ConfigurationError("DOM APIs are not available in this environment.");
  }

  if (typeof target === "string") {
    const element = document.querySelector(target);
    if (!(element instanceof HTMLFormElement)) {
      throw new ConfigurationError(`No <form> matched selector "${target}".`);
    }

    return element;
  }

  throw new ConfigurationError("Unsupported form target.");
}
