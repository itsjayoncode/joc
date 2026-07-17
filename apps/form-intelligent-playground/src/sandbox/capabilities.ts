import type { SandboxConfig } from "./types.js";
import type { FormInstance } from "../lib/form-intelligent.js";

/**
 * Extensibility surface for sandbox capabilities.
 * New package plugins should register here so the left sidebar, console,
 * performance panel, and generated code pick them up without redesign.
 */
export interface SandboxCapability {
  readonly id: string;
  readonly label: string;
  readonly group: "validation" | "submission" | "workflow" | "rules" | "calculations" | "plugins";
  readonly docsPath: string;
  readonly description: string;
  readonly isEnabled: (config: SandboxConfig) => boolean;
  readonly setEnabled: (enabled: boolean) => Partial<SandboxConfig>;
  /** Optional post-createForm hook (e.g. register plugins). */
  readonly apply?: (
    form: FormInstance<Record<string, unknown>>,
    config: SandboxConfig,
    log: (message: string) => void,
  ) => void;
  readonly codeHint?: (config: SandboxConfig) => string | undefined;
}

export const SANDBOX_CAPABILITIES: readonly SandboxCapability[] = [
  {
    id: "async-username",
    label: "Async validation",
    group: "validation",
    docsPath: "/packages/form-intelligent/modules/validation",
    description: "Debounced async check on username (Register) or email (other templates).",
    isEnabled: (c) => c.asyncUsername,
    setEnabled: (enabled) => ({ asyncUsername: enabled }),
    codeHint: (c) => (c.asyncUsername ? "asyncValidator({ validate, debounce, … })" : undefined),
  },
  {
    id: "async-retry",
    label: "Retry",
    group: "validation",
    docsPath: "/packages/form-intelligent/modules/validation",
    description: "Retry failed async validators.",
    isEnabled: (c) => c.asyncRetry,
    setEnabled: (enabled) => ({ asyncRetry: enabled }),
  },
  {
    id: "async-cache",
    label: "Cache",
    group: "validation",
    docsPath: "/packages/form-intelligent/modules/validation",
    description: "Memory-cache async results (TTL 1m).",
    isEnabled: (c) => c.asyncCache,
    setEnabled: (enabled) => ({ asyncCache: enabled }),
  },
  {
    id: "reset-after-submit",
    label: "Reset after submit",
    group: "submission",
    docsPath: "/packages/form-intelligent/modules/submission",
    description: "Call form.reset() after successful submit.",
    isEnabled: (c) => c.resetAfterSubmit,
    setEnabled: (enabled) => ({ resetAfterSubmit: enabled }),
  },
  {
    id: "simulate-failure",
    label: "Simulate failure",
    group: "submission",
    docsPath: "/packages/form-intelligent/modules/submission",
    description: "Throw from onSubmit to exercise error paths.",
    isEnabled: (c) => c.simulateFailure,
    setEnabled: (enabled) => ({ simulateFailure: enabled }),
  },
  {
    id: "disable-while-submitting",
    label: "Disable while submitting",
    group: "submission",
    docsPath: "/packages/form-intelligent/modules/submission",
    description: "Disable submit button while isSubmitting.",
    isEnabled: (c) => c.disableWhileSubmitting,
    setEnabled: (enabled) => ({ disableWhileSubmitting: enabled }),
  },
  {
    id: "conditional-business",
    label: "Conditional visibility",
    group: "workflow",
    docsPath: "/packages/form-intelligent/modules/rules",
    description: "when().show().require() for Business customers.",
    isEnabled: (c) => c.conditionalBusiness,
    setEnabled: (enabled) => ({ conditionalBusiness: enabled }),
    codeHint: (c) =>
      c.conditionalBusiness
        ? 'when("customerType").equals("Business").show("companyName").require("companyName")'
        : undefined,
  },
  {
    id: "autosave",
    label: "Autosave",
    group: "workflow",
    docsPath: "/packages/form-intelligent/modules/workflow",
    description: "Debounced autosave to sessionStorage.",
    isEnabled: (c) => c.autosave,
    setEnabled: (enabled) => ({ autosave: enabled }),
  },
  {
    id: "draft",
    label: "Draft",
    group: "plugins",
    docsPath: "/packages/form-intelligent/modules/workflow",
    description: "Persist draft across reloads.",
    isEnabled: (c) => c.draft,
    setEnabled: (enabled) => ({ draft: enabled }),
  },
  {
    id: "wizard",
    label: "Wizard",
    group: "plugins",
    docsPath: "/packages/form-intelligent/modules/workflow",
    description: "Two-step wizard over template fields.",
    isEnabled: (c) => c.wizard,
    setEnabled: (enabled) => ({ wizard: enabled }),
  },
  {
    id: "offline",
    label: "Offline queue",
    group: "plugins",
    docsPath: "/packages/form-intelligent/modules/workflow",
    description: "Queue submits while offline.",
    isEnabled: (c) => c.offlineQueue,
    setEnabled: (enabled) => ({ offlineQueue: enabled }),
  },
  {
    id: "calculations",
    label: "Computed fields",
    group: "calculations",
    docsPath: "/packages/form-intelligent/modules/calculations",
    description: "form.calculate() for totals / tax.",
    isEnabled: (c) => c.calculations,
    setEnabled: (enabled) => ({ calculations: enabled }),
  },
  {
    id: "history",
    label: "History",
    group: "plugins",
    docsPath: "/packages/form-intelligent/modules/workflow",
    description: "Undo / redo via form.undo() / form.redo().",
    isEnabled: (c) => c.undoRedo,
    setEnabled: (enabled) => ({ undoRedo: enabled }),
  },
  {
    id: "formatters",
    label: "Formatter",
    group: "plugins",
    docsPath: "/packages/form-intelligent/modules/formatters",
    description: "Display formatters on eligible fields.",
    isEnabled: (c) => c.formatters,
    setEnabled: (enabled) => ({ formatters: enabled }),
  },
];

export function capabilitiesByGroup(
  group: SandboxCapability["group"],
): readonly SandboxCapability[] {
  return SANDBOX_CAPABILITIES.filter((entry) => entry.group === group);
}

export function activeCapabilityLabels(config: SandboxConfig): readonly string[] {
  return SANDBOX_CAPABILITIES.filter((entry) => entry.isEnabled(config)).map(
    (entry) => entry.label,
  );
}
