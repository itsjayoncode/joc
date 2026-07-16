import { createForm, email, minLength, regex, required } from "@jayoncode/form-intelligent";
import { createAnalyticsPlugin } from "@jayoncode/form-intelligent/analytics";
import {
  connectFormDevToolsToGlobal,
  enableFormDevTools,
  getFormDevTools,
} from "@jayoncode/form-intelligent/devtools";
import {
  creditCard,
  creditCardParser,
  currency,
  phone,
  philippinePhone,
  slug,
} from "@jayoncode/form-intelligent/format";
import { when } from "@jayoncode/form-intelligent/rules";
import { createBrowserLifecyclePlugin, createKeyboardPlugin, keyboard } from "@jayoncode/form-intelligent/plugins";

import type { FormInstance, FormPlugin } from "@jayoncode/form-intelligent";

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
  connectFormDevToolsToGlobal,
  createForm,
  createAnalyticsPlugin,
  createBrowserLifecyclePlugin,
  createKeyboardPlugin,
  creditCard,
  creditCardParser,
  currency,
  email,
  enableFormDevTools,
  getFormDevTools,
  keyboard,
  minLength,
  phone,
  philippinePhone,
  regex,
  required,
  slug,
  when,
};
export type { FormInstance, FormPlugin };
export { useForm, useFormState } from "@jayoncode/form-intelligent-react";
