import { getSandboxTemplate } from "./templates.js";
import {
  asyncValidator,
  createForm,
  email,
  formatCurrency,
  formatPhone,
  matchesField,
  minLength,
  required,
  ui,
} from "../lib/form-intelligence.js";

import type { SandboxConfig } from "./types.js";
import type { FormInstance } from "../lib/form-intelligence.js";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function buildStressValues(count: number): Record<string, unknown> {
  const values: Record<string, unknown> = {};
  for (let index = 0; index < count; index += 1) {
    values[`field_${String(index)}`] = "";
  }
  return values;
}

function createAsyncCheck(
  label: string,
  config: SandboxConfig,
  onConsole?: (message: string, level?: "info" | "warn" | "error" | "success") => void,
) {
  const taken = new Set(["taken", "admin", "root", "taken@example.com", "admin@example.com"]);
  return asyncValidator({
    validate: async (value) => {
      const text = typeof value === "string" ? value.trim() : "";
      if (text === "") {
        return true;
      }
      onConsole?.(`Async ${label} check: ${text}`, "info");
      await sleep(Math.max(200, Math.min(config.asyncDebounceMs || 300, 800)));
      if (taken.has(text.toLowerCase())) {
        return `${label} already taken`;
      }
      return true;
    },
    debounce: config.asyncDebounceMs > 0 ? config.asyncDebounceMs : 0,
    ...(config.asyncRetry ? { retry: { maxAttempts: 2, delayMs: 50 } } : {}),
    ...(config.asyncTimeoutMs > 0 ? { timeout: config.asyncTimeoutMs } : {}),
    ...(config.asyncCache ? { cache: "1m" as const } : {}),
  });
}

export function buildSandboxForm(
  config: SandboxConfig,
  onConsole?: (message: string, level?: "info" | "warn" | "error" | "success") => void,
): FormInstance<Record<string, unknown>> {
  const template = getSandboxTemplate(config.templateId);
  const stressCount = config.stressFieldCount;
  const initialValues =
    stressCount > 0 ? buildStressValues(stressCount) : { ...template.initialValues };
  const fieldOrder = stressCount > 0 ? Object.keys(initialValues) : [...template.fieldOrder];
  const hasUsername = fieldOrder.includes("username");

  const validators: Record<string, unknown[]> = {};

  if (stressCount > 0) {
    for (const path of fieldOrder) {
      validators[path] = [required];
    }
  } else {
    for (const path of fieldOrder) {
      const meta = template.fieldMeta[path];
      const rules: unknown[] = [];

      if (path === "username") {
        rules.push(required);
        if (config.asyncUsername) {
          rules.push(createAsyncCheck("Username", config, onConsole));
        }
      } else if (path === "email" || meta?.type === "email") {
        rules.push(required, email);
        if (config.asyncUsername && !hasUsername) {
          rules.push(createAsyncCheck("Email", config, onConsole));
        }
      } else if (path === "password") {
        rules.push(required, minLength(8));
      } else if (path === "confirmPassword") {
        rules.push(required, matchesField("password"));
      } else if (path === "companyName" && config.conditionalBusiness) {
        // required via when().require when Business
      } else if (path === "total" || path === "tax") {
        // computed — no required
      } else if (meta?.type === "select") {
        // optional selects unless explicitly required later
      } else if (meta?.type === "number") {
        rules.push(required);
      } else if (meta?.type === "textarea" || meta?.type === "text" || !meta?.type) {
        rules.push(required);
      }

      if (rules.length > 0) {
        validators[path] = rules;
      }
    }
  }

  if (config.asyncUsername) {
    onConsole?.(
      hasUsername
        ? "Async validation attached to username"
        : "Async validation attached to email (no username field)",
      "info",
    );
  }

  const form = createForm({
    initialValues,
    validateOn: config.validateOn,
    validators: validators as never,
    plugins: [ui()],
    ...(config.conditionalBusiness && "customerType" in initialValues && stressCount === 0
      ? {
          rules: [
            {
              watch: "customerType",
              equals: "Business",
              show: ["companyName"],
              require: ["companyName"],
            },
          ],
        }
      : {}),
    onSubmit: async (values) => {
      onConsole?.("Submit started…", "info");
      if (config.mockLatencyMs > 0) {
        await sleep(config.mockLatencyMs);
      }
      if (config.simulateFailure) {
        onConsole?.("Simulated API failure", "error");
        throw new Error("Simulated API failure");
      }
      onConsole?.("Submit succeeded", "success");
      if (config.resetAfterSubmit) {
        form.reset();
        onConsole?.("Form reset after submit", "info");
      }
      void values;
    },
    workflow: {
      ...(config.autosave
        ? {
            autosave: {
              enabled: true,
              debounceMs: 500,
              onSave: () => {
                onConsole?.("Autosave fired", "info");
              },
            },
          }
        : {}),
      ...(config.draft
        ? {
            draft: {
              enabled: true,
              storageKey: `fi-sandbox-draft-${config.templateId}`,
              onRestore: () => {
                onConsole?.("Draft restored", "success");
              },
            },
          }
        : {}),
      ...(config.wizard && fieldOrder.length >= 2
        ? {
            wizard: {
              steps: [
                {
                  id: "step-1",
                  fields: fieldOrder.slice(0, Math.ceil(fieldOrder.length / 2)),
                },
                {
                  id: "step-2",
                  fields: fieldOrder.slice(Math.ceil(fieldOrder.length / 2)),
                },
              ],
            },
          }
        : {}),
      ...(config.offlineQueue ? { offlineQueue: { enabled: true } } : {}),
    },
  });

  if (config.conditionalBusiness && "customerType" in initialValues && stressCount === 0) {
    onConsole?.("Business rule active: show/require companyName", "info");
  }

  for (const path of fieldOrder) {
    const meta = template.fieldMeta[path];
    const format =
      config.formatters && stressCount === 0
        ? path === "phone" || meta?.type === "tel"
          ? formatPhone
          : path === "price" ||
              path === "subtotal" ||
              path === "amount" ||
              path === "tax" ||
              path === "total"
            ? formatCurrency
            : undefined
        : undefined;

    form.field(path, {
      ...(meta?.label ? { label: meta.label } : { label: path }),
      ...(format ? { format } : {}),
    });
  }

  if (stressCount > 0) {
    onConsole?.(`Stress form: ${String(stressCount)} fields`, "warn");
  }

  if (config.formatters && stressCount === 0) {
    onConsole?.("Formatters enabled on phone / currency fields when present", "info");
  }

  if (config.calculations && stressCount === 0) {
    let wired = false;
    if ("total" in initialValues && "qty" in initialValues && "price" in initialValues) {
      form
        .calculate("total")
        .from("qty", "price")
        .compute(({ values }) => {
          const qty = Number(values.qty) || 0;
          const price = Number(values.price) || 0;
          onConsole?.("Calculation: total recomputed", "info");
          return Math.round(qty * price * 100) / 100;
        });
      wired = true;
    }
    if ("tax" in initialValues && "subtotal" in initialValues && "taxRate" in initialValues) {
      form
        .calculate("tax")
        .from("subtotal", "taxRate")
        .compute(({ values }) => {
          const subtotal = Number(values.subtotal) || 0;
          const taxRate = Number(values.taxRate) || 0;
          onConsole?.("Calculation: tax recomputed", "info");
          return Math.round(subtotal * taxRate * 100) / 100;
        });
      form
        .calculate("total")
        .from("subtotal", "tax")
        .compute(({ values }) => {
          const subtotal = Number(values.subtotal) || 0;
          const tax = Number(values.tax) || 0;
          onConsole?.("Calculation: invoice total recomputed", "info");
          return Math.round((subtotal + tax) * 100) / 100;
        });
      wired = true;
    }
    if (!wired) {
      onConsole?.(
        "Calculations enabled but template has no qty/price or subtotal/tax fields — switch to Checkout or Invoice",
        "warn",
      );
    }
  }

  if (config.conditionalBusiness && !("customerType" in initialValues) && stressCount === 0) {
    onConsole?.(
      "Business rules enabled but template has no customerType — switch to Employee",
      "warn",
    );
  }

  if (config.wizard && fieldOrder.length < 2) {
    onConsole?.("Wizard needs at least 2 fields", "warn");
  }

  return form;
}

export function listSandboxFieldPaths(config: SandboxConfig): readonly string[] {
  if (config.stressFieldCount > 0) {
    return Object.keys(buildStressValues(config.stressFieldCount));
  }
  return getSandboxTemplate(config.templateId).fieldOrder;
}

/** Templates that demonstrate a capability well. */
export function templateForCapability(
  capability: "async" | "rules" | "calculations" | "wizard" | "formatters",
): SandboxConfig["templateId"] {
  switch (capability) {
    case "async":
      return "register";
    case "rules":
      return "employee";
    case "calculations":
      return "checkout";
    case "wizard":
      return "booking";
    case "formatters":
      return "checkout";
    default:
      return "login";
  }
}
