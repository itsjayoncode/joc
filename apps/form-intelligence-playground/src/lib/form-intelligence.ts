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
import { ui, snapshotUiProjection, setUiPolicies } from "@jayoncode/form-intelligence/ui";
import { captcha, mockCaptcha } from "@jayoncode/form-intelligence/captcha";

import type { FormInstance, FormPlugin, SubmitSecurityCaptcha, ValidationMode } from "@jayoncode/form-intelligence";
import type {
  UiDisableSubmitWhen,
  UiErrorDisplay,
  UiPolicyOptions,
} from "@jayoncode/form-intelligence/ui";
import type { CaptchaBlockReason } from "@jayoncode/form-intelligence/captcha";

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
      "captcha Security Stage",
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
  setUiPolicies,
  captcha,
  mockCaptcha,
};
export type {
  FormInstance,
  FormPlugin,
  ValidationMode,
  UiDisableSubmitWhen,
  UiErrorDisplay,
  UiPolicyOptions,
  CaptchaBlockReason,
  SubmitSecurityCaptcha,
};
export { useForm, useFormState } from "@jayoncode/form-intelligence-react";
