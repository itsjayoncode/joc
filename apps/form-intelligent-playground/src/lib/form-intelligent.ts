import {
  asyncValidator,
  createForm,
  email,
  matchesField,
  minLength,
  regex,
  required,
} from "@jayoncode/form-intelligent";
import { createAnalyticsPlugin } from "@jayoncode/form-intelligent/analytics";
import {
  connectFormDevToolsToGlobal,
  enableFormDevTools,
  getFormDevTools,
} from "@jayoncode/form-intelligent/devtools";
import {
  formatCreditCard,
  creditCardParser,
  formatCurrency,
  formatPhone,
  formatPhilippinePhone,
  formatSlug,
} from "@jayoncode/form-intelligent/format";
import { when } from "@jayoncode/form-intelligent/rules";
import { createBrowserLifecyclePlugin, createKeyboardPlugin, keyboard } from "@jayoncode/form-intelligent/plugins";

import type { FormInstance, FormPlugin, ValidationMode } from "@jayoncode/form-intelligent";

export const SAMPLE_FORM_VALUES = {
  email: "",
  name: "",
  role: "member",
};

export function getFormIntelligentIntegrationSummary() {
  return {
    packageName: "@jayoncode/form-intelligent",
    reactPackageName: "@jayoncode/form-intelligent-react",
    entryPoint: "src/lib/form-intelligent.ts",
    capabilities: [
      "createForm",
      "when rules",
      "calculate",
      "autosave",
      "offlineQueue",
      "undo/redo",
      "analytics",
      "useForm",
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
};
export type { FormInstance, FormPlugin, ValidationMode };
export { useForm, useFormState } from "@jayoncode/form-intelligent-react";
