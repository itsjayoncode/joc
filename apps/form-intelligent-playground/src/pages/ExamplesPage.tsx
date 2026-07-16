import styles from "./Pages.module.css";
import { ExplainPanel } from "../components/playground/ExplainPanel.js";
import { Card } from "../components/primitives/Card.js";
import { CodeBlock } from "../components/primitives/CodeBlock.js";
import { PageContainer } from "../components/primitives/PageContainer.js";

const EXAMPLES = [
  {
    title: "Create a form instance",
    description: "Start with initial values, validators, and an optional submit handler.",
    code: `import { createForm, required, email } from "@jayoncode/form-intelligent";

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
    code: `import { createForm, when } from "@jayoncode/form-intelligent";

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
    description: "Subscribe to lifecycle events and return cleanup.",
    code: `form.use({
  name: "analytics",
  setup(instance) {
    return instance.on("submit", () => track("form_submit"));
  },
});`,
  },
] as const;

export function ExamplesPage() {
  return (
    <PageContainer
      description="Copy-paste patterns for headless forms, validation, submission, and workflow orchestration."
      eyebrow="Examples"
      title="Usage snippets"
    >
      <ExplainPanel
        body="These snippets mirror the interactive explorers in this playground. Open Validation, Submission, or Workflow to see each pattern running live with inspectors."
        title="How to use these examples"
      />

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
