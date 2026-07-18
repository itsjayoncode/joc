import { getSandboxTemplate } from "./templates.js";

import type { SandboxConfig } from "./types.js";

export function generateSandboxCode(config: SandboxConfig): string {
  const template = getSandboxTemplate(config.templateId);
  const lines: string[] = [
    `import { createForm, required, email, minLength, when } from "@jayoncode/form-intelligence";`,
    ``,
    `const form = createForm({`,
    `  initialValues: ${JSON.stringify(template.initialValues, null, 2).replace(/\n/g, "\n  ")},`,
    `  validateOn: "${config.validateOn}",`,
  ];

  lines.push(`  validators: {`);
  for (const path of template.fieldOrder) {
    if (path === "email") {
      lines.push(`    ${path}: [required, email],`);
    } else if (path === "password") {
      lines.push(`    ${path}: [required, minLength(8)],`);
    } else if (path === "confirmPassword") {
      lines.push(`    ${path}: [required /* matchesField("password") */],`);
    } else if (path === "username" && config.asyncUsername) {
      lines.push(`    ${path}: [required /* asyncValidator({ … }) */],`);
    } else if (path !== "total" && path !== "tax") {
      lines.push(`    ${path}: [required],`);
    }
  }
  lines.push(`  },`);

  if (config.conditionalBusiness) {
    lines.push(`  rules: [`);
    lines.push(
      `    when("customerType").equals("Business").show("companyName").require("companyName"),`,
    );
    lines.push(`  ],`);
  }

  const workflowBits: string[] = [];
  if (config.autosave) {
    workflowBits.push(`    autosave: { enabled: true, debounceMs: 500, onSave },`);
  }
  if (config.draft) {
    workflowBits.push(
      `    draft: { enabled: true, storageKey: "fi-sandbox-draft-${config.templateId}" },`,
    );
  }
  if (config.wizard) {
    workflowBits.push(`    wizard: { steps: [/* … */] },`);
  }
  if (config.offlineQueue) {
    workflowBits.push(`    offlineQueue: { enabled: true },`);
  }
  if (workflowBits.length > 0) {
    lines.push(`  workflow: {`);
    lines.push(...workflowBits);
    lines.push(`  },`);
  }

  lines.push(`  onSubmit: async (values) => {`);
  lines.push(`    // ${config.simulateFailure ? "simulate failure" : "POST values"}`);
  lines.push(`    await api.save(values);`);
  if (config.resetAfterSubmit) {
    lines.push(`    form.reset();`);
  }
  lines.push(`  },`);
  lines.push(`});`);

  if (config.calculations) {
    lines.push(``);
    lines.push(`// Optional calculations`);
    lines.push(`// form.calculate("total").from(…).compute(…)`);
  }

  lines.push(``);
  lines.push(`export { form };`);
  return lines.join("\n");
}
