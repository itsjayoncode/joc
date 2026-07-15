import { createForm, email, required } from "@jayoncode/form-intelligent";

import type { FormInstance } from "@jayoncode/form-intelligent";

export const SAMPLE_FORM_VALUES = {
  email: "",
  name: "",
  role: "member",
};

export function getFormIntelligentIntegrationSummary() {
  return {
    packageName: "@jayoncode/form-intelligent",
    entryPoint: "src/lib/form-intelligent.ts",
    capabilities: ["createForm", "validate", "submit", "workflow", "autosave", "wizard"],
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

export { createForm, currency, email, minLength, phone, regex, required, slug } from "@jayoncode/form-intelligent";
