import {
  asyncValidator,
  createForm,
  email,
  matchesField,
  minLength,
  regex,
  required,
} from "@jayoncode/form-intelligence";
import { createAnalyticsPlugin } from "@jayoncode/form-intelligence/analytics";
import {
  connectFormDevToolsToGlobal,
  enableFormDevTools,
  getFormDevTools,
} from "@jayoncode/form-intelligence/devtools";
import {
  formatCreditCard,
  creditCardParser,
  formatCurrency,
  formatPhone,
  formatPhilippinePhone,
  formatSlug,
} from "@jayoncode/form-intelligence/format";
import { when } from "@jayoncode/form-intelligence/rules";
import { createBrowserLifecyclePlugin, createKeyboardPlugin, keyboard } from "@jayoncode/form-intelligence/plugins";
import { ui, snapshotUiProjection } from "@jayoncode/form-intelligence/ui";

import type { FormInstance, FormPlugin, ValidationMode } from "@jayoncode/form-intelligence";

export const SAMPLE_FORM_VALUES = {
  email: "",
  name: "",
  role: "member",
};

export function getFormIntelligentIntegrationSummary() {
  return {
    packageName: "@jayoncode/form-intelligence",
    reactPackageName: "@jayoncode/form-intelligence-react",
    entryPoint: "src/lib/form-intelligence.ts",
    capabilities: [
      "createForm",
      "when rules",
      "calculate",
      "autosave",
      "offlineQueue",
      "undo/redo",
      "analytics",
      "useForm",
      "ui projection",
      "submissionGuard",
    ],
  };
}

export function createSampleForm(
  onSubmit?: (values: typeof SAMPLE_FORM_VALUES) => void | Promise<void>,
): FormInstance<typeof SAMPLE_FORM_VALUES> {
  return createForm({
    initialValues: { ...SAMPLE_FORM_VALUES },
    validators: {
      email: [required, email],
      name: [required],
    },
    ...(onSubmit ? { onSubmit } : {}),
  });
}

export {
  asyncValidator,
  connectFormDevToolsToGlobal,
  createForm,
  createAnalyticsPlugin,
  createBrowserLifecyclePlugin,
  createKeyboardPlugin,
  formatCreditCard,
  creditCardParser,
  formatCurrency,
  email,
  enableFormDevTools,
  getFormDevTools,
  keyboard,
  matchesField,
  minLength,
  formatPhone,
  formatPhilippinePhone,
  regex,
  required,
  formatSlug,
  when,
  ui,
  snapshotUiProjection,
};
export type { FormInstance, FormPlugin, ValidationMode };
export { useForm, useFormState } from "@jayoncode/form-intelligence-react";
