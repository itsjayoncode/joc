import { Link } from "react-router-dom";

import styles from "./Pages.module.css";
import { ExplainPanel } from "../components/playground/ExplainPanel.js";
import { Card } from "../components/primitives/Card.js";
import { CodeBlock } from "../components/primitives/CodeBlock.js";
import { PageContainer } from "../components/primitives/PageContainer.js";

const EXAMPLES = [
  {
    title: "Create a form instance",
    description: "Start with initial values, validators, and an optional submit handler.",
    code: `import { createForm, required, email } from "@jayoncode/form-intelligence";

const form = createForm({
  initialValues: { email: "", name: "" },
  validators: {
    email: [required, email],
    name: [required],
  },
  onSubmit: async (values) => {
    await fetch("/api/signup", { method: "POST", body: JSON.stringify(values) });
  },
});`,
  },
  {
    title: "Headless HTML binding",
    description: "No React required — bind native inputs directly.",
    code: `const binding = form.field("email").bind();

input.name = binding.name;
input.value = binding.value;
input.onchange = (e) => binding.onChange(e.target.value);
input.onblur = binding.onBlur;`,
  },
  {
    title: "Validation timing",
    description: "Choose when validators run: onChange, onBlur, or onSubmit.",
    code: `createForm({
  initialValues: { code: "" },
  validateOn: "onBlur",
  validators: { code: [required] },
});`,
  },
  {
    title: "Autosave workflow",
    description: "Debounce persistence without manual useEffect wiring.",
    code: `createForm({
  initialValues: { draft: "" },
  workflow: {
    autosave: {
      enabled: true,
      debounceMs: 500,
      onSave: async (values) => localStorage.setItem("draft", JSON.stringify(values)),
    },
    draft: { enabled: true, storageKey: "signup-draft" },
  },
});`,
  },
  {
    title: "Multi-step wizard",
    description: "Each step validates its fields before workflow.next() advances.",
    code: `workflow: {
  wizard: {
    steps: [
      { id: "profile", fields: ["name", "email"] },
      { id: "review", fields: ["notes"] },
    ],
  },
}`,
  },
  {
    title: "Conditional rules",
    description: "Show, require, and disable submit based on other field values.",
    code: `import { createForm, when } from "@jayoncode/form-intelligence";

createForm({
  initialValues: { customerType: "Personal", companyName: "" },
  rules: [when("customerType").equals("Business").show("companyName")],
});

form.state.fieldUi.companyName?.visible;
form.state.formUi.submitDisabled;`,
  },
  {
    title: "Field dependencies",
    description: "Load select options when a parent field changes.",
    code: `when("country")
  .changes(async (country) => loadProvinces(country))
  .populate("province");`,
  },
  {
    title: "Calculations",
    description: "Derived fields without manual event wiring.",
    code: `const form = createForm({ initialValues: { price: 100, qty: 2, total: 0 } });
form.calculate("total", ({ values }) => values.price * values.qty);`,
  },
  {
    title: "Offline submit queue",
    description: "Queue while offline, flush when connectivity returns.",
    code: `createForm({
  workflow: { offlineQueue: { enabled: true } },
  onSubmit: async (values) => api.save(values),
});
await form.flushOfflineQueue();`,
  },
  {
    title: "Custom plugin",
    description: "Register with form.use() or createForm({ plugins }).",
    code: `form.use({
  name: "analytics",
  setup(form, api) {
    return api.on("submit", () => track("form_submit"));
  },
});`,
  },
] as const;

export function ExamplesPage() {
  return (
    <PageContainer
      compact
      description="Copy-paste patterns for headless forms, validation, submission, and workflow orchestration."
      eyebrow="Examples"
      title="Usage snippets"
    >
      <ExplainPanel
        body="Start in the Sandbox for live config → generated code. Use these snippets as copy-paste references, then open the matching explorer (Validation, Submission, Workflow, Rules…) to inspect behavior."
        title="How to use these examples"
      />
      <p className={styles.sandboxCue}>
        <Link className={styles.sandboxCueLink} to="/">
          Open Sandbox
        </Link>
        <span aria-hidden="true"> · </span>
        Prefer the Generated Code tab for the exact createForm() of your current experiment.
      </p>

      <div className={styles.cardGrid}>
        {EXAMPLES.map((example) => (
          <Card description={example.description} key={example.title} title={example.title}>
            <CodeBlock code={example.code} language="typescript" />
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
