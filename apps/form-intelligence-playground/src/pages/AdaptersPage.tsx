import { useState } from "react";

import { when } from "@jayoncode/form-intelligence/rules";
import { useForm } from "@jayoncode/form-intelligence-react";

import styles from "./Pages.module.css";
import { ExplainPanel } from "../components/playground/ExplainPanel.js";
import { Card } from "../components/primitives/Card.js";
import { CodeBlock } from "../components/primitives/CodeBlock.js";
import { PageContainer } from "../components/primitives/PageContainer.js";

const ADAPTERS = [
  {
    name: "Headless HTML",
    status: "Available now",
    description: "Use createForm with target + schema, or field().setValue() in headless mode.",
    code: `createForm({\n  target: "#register",\n  schema: { email: "email", password: "password" },\n  onSubmit,\n});`,
  },
  {
    name: "Zod adapter",
    status: "Available (@jayoncode/form-intelligence-zod)",
    description: "Pass a Zod schema through zodAdapter() as createForm schema.",
    code: `import { zodAdapter } from "@jayoncode/form-intelligence-zod";\n\ncreateForm({\n  initialValues: { email: "", password: "" },\n  schema: zodAdapter(signupSchema),\n  onSubmit,\n});`,
  },
  {
    name: "Yup adapter",
    status: "Available (@jayoncode/form-intelligence-yup)",
    description: "Pass a Yup schema through yupAdapter() as createForm schema.",
    code: `import { yupAdapter } from "@jayoncode/form-intelligence-yup";\n\ncreateForm({\n  initialValues: { email: "", password: "" },\n  schema: yupAdapter(signupSchema),\n  onSubmit,\n});`,
  },
  {
    name: "Valibot adapter",
    status: "Available (@jayoncode/form-intelligence-valibot)",
    description: "Pass a Valibot schema through valibotAdapter() as createForm schema.",
    code: `import { valibotAdapter } from "@jayoncode/form-intelligence-valibot";\n\ncreateForm({\n  initialValues: { email: "", password: "" },\n  schema: valibotAdapter(signupSchema),\n  onSubmit,\n});`,
  },
  {
    name: "AJV adapter",
    status: "Available (@jayoncode/form-intelligence-ajv)",
    description: "Pass JSON Schema through ajvAdapter() — or a pre-compiled AJV validate function.",
    code: `import { ajvAdapter } from "@jayoncode/form-intelligence-ajv";\n\ncreateForm({\n  initialValues: { email: "", password: "" },\n  schema: ajvAdapter(signupSchema),\n  onSubmit,\n});`,
  },
  {
    name: "React Hook Form bridge",
    status: "Planned",
    description: "Keep RHF field registration while delegating workflow to Form Intelligence.",
    code: `// bridge registers fields in RHF\n// workflow/autosave stays in createForm()`,
  },
  {
    name: "TanStack Form bridge",
    status: "Planned",
    description: "Composable bridge for teams already standardized on TanStack Form.",
    code: `// planned integration pattern`,
  },
  {
    name: "Vue adapter",
    status: "Available (@jayoncode/form-intelligence-vue)",
    description:
      "useForm(), provideForm(), and useField() composables mirroring the React adapter.",
    code: `import { useForm } from "@jayoncode/form-intelligence-vue";\n\nconst form = useForm({\n  schema: { email: "email" },\n  onSubmit,\n});`,
  },
  {
    name: "Angular adapter",
    status: "Available (@jayoncode/form-intelligence-angular)",
    description: "FormService, provideFormIntelligent(), fiForm and fiField standalone directives.",
    code: `import { provideFormIntelligent, injectForm } from "@jayoncode/form-intelligence-angular";\n\n@Component({\n  providers: [provideFormIntelligent({ schema: { email: "email" }, onSubmit })],\n  template: '<form fiForm><input fiField="email" /></form>',\n})\nexport class LoginComponent {\n  readonly form = injectForm();\n}`,
  },
  {
    name: "Svelte",
    status: "Planned",
    description: "Framework-specific bindings mirroring the React adapter API.",
    code: `// @jayoncode/form-intelligent-svelte (planned)`,
  },
] as const;

function ReactAdapterDemo() {
  const [submitted, setSubmitted] = useState<string | null>(null);

  type AdapterDemoValues = {
    email: string;
    loanAmount: number;
  };

  const form = useForm<AdapterDemoValues>({
    schema: { email: "email" },
    initialValues: { email: "", loanAmount: 600_000 },
    rules: [when<AdapterDemoValues>("loanAmount").greaterThan(500_000).disableSubmit().build()],
    onSubmit: (values) => {
      setSubmitted(`Submitted ${values.email} (loan ${String(values.loanAmount)})`);
    },
  });

  const emailField = form.field("email");

  return (
    <Card
      description="useForm() uses form.ui.canSubmit / showError / status — same projection as Vue/Angular/DOM."
      title="React adapter (live)"
    >
      <form {...form.form()}>
        <label className={styles.fieldLabel}>
          Email
          <input {...emailField} aria-label="Email" className={styles.textInput} />
        </label>
        {form.state.errors.email && emailField["aria-invalid"] ? (
          <p className={styles.fieldHint}>{form.state.errors.email}</p>
        ) : null}

        <label className={styles.fieldLabel}>
          Loan amount
          <input
            {...form.field("loanAmount")}
            aria-label="Loan amount"
            className={styles.textInput}
            type="number"
          />
        </label>

        <button {...form.submitButton()} className={styles.primaryButton}>
          Submit
        </button>
      </form>

      <p className={styles.fieldHint}>
        formUi.submitDisabled: <code>{String(form.state.formUi.submitDisabled)}</code>
        {" · "}
        ui.canSubmit: <code>{String(form.instance.ui.canSubmit)}</code>
        {" · "}
        guard: <code>{String(form.instance.submissionGuard().allowed)}</code>
        {" · "}
        status: <code>{emailField["data-fi-status"] ?? "—"}</code>
      </p>
      {submitted ? <p className={styles.fieldHint}>{submitted}</p> : null}

      <CodeBlock
        code={`const form = useForm({\n  schema: { email: "email" },\n  rules: [when("loanAmount").greaterThan(500_000).disableSubmit()],\n  onSubmit,\n});\n\n<input {...form.field("email")} /> // aria-invalid + data-fi-status\n<button {...form.submitButton()}>Submit</button> // form.ui.canSubmit`}
        language="typescript"
      />
    </Card>
  );
}

export function AdaptersPage() {
  return (
    <PageContainer
      compact
      description="How Form Intelligence fits alongside UI frameworks and validation libraries — not instead of them."
      eyebrow="Adapters"
      title="Adapter Playground"
    >
      <ExplainPanel
        body="Form Intelligence deliberately avoids owning field registration. Adapters translate framework events into setValue, bind(), and workflow APIs. The React adapter uses useSyncExternalStore internally so components read form.state without manual subscribe."
        title="Positioning"
      />

      <ReactAdapterDemo />

      <div className={styles.cardGrid}>
        {ADAPTERS.map((adapter) => (
          <Card description={adapter.description} key={adapter.name} title={adapter.name}>
            <p className={styles.fieldHint}>{adapter.status}</p>
            <CodeBlock code={adapter.code} language="typescript" />
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
