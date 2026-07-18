import type { Validator } from "../../types/index.js";

export interface PasswordValidatorOptions {
  readonly minLength?: number;
  readonly requireUppercase?: boolean;
  readonly requireLowercase?: boolean;
  readonly requireNumber?: boolean;
  readonly requireSymbol?: boolean;
}

export function password(options: PasswordValidatorOptions = {}): Validator {
  const min = options.minLength ?? 8;

  return (value) => {
    if (value === null || value === undefined || value === "") {
      return true;
    }

    if (typeof value !== "string") {
      return "Enter a valid password.";
    }

    if (value.length < min) {
      return `Password must be at least ${String(min)} characters.`;
    }

    if (options.requireUppercase && !/[A-Z]/.test(value)) {
      return "Password must include an uppercase letter.";
    }

    if (options.requireLowercase && !/[a-z]/.test(value)) {
      return "Password must include a lowercase letter.";
    }

    if (options.requireNumber && !/\d/.test(value)) {
      return "Password must include a number.";
    }

    if (options.requireSymbol && !/[^A-Za-z0-9]/.test(value)) {
      return "Password must include a symbol.";
    }

    return true;
  };
}
