import type { Validator } from "@jayoncode/form-intelligent";

export const passwordStrength: Validator = (value) => {
  if (value === null || value === undefined || value === "") {
    return true;
  }

  if (typeof value !== "string") {
    return "Password must be a string.";
  }

  if (value.length < 8) {
    return "Use at least 8 characters.";
  }

  if (!/[A-Z]/.test(value) || !/[0-9]/.test(value)) {
    return "Include one uppercase letter and one number.";
  }

  return true;
};

export function matchesField(
  otherPath: string,
  message = "Values must match.",
): Validator<Record<string, unknown>> {
  return (value, context) => {
    const other = context.values[otherPath];
    if (value === other) {
      return true;
    }

    return message;
  };
}

export function asyncAvailabilityCheck(delayMs = 700): Validator<Record<string, unknown>> {
  return async (value) => {
    if (value === null || value === undefined || value === "") {
      return true;
    }

    if (typeof value !== "string") {
      return "Enter a username.";
    }

    await new Promise((resolve) => setTimeout(resolve, delayMs));

    const taken = ["admin", "root", "jay"].includes(value.toLowerCase());
    return taken ? "That username is already taken." : true;
  };
}
