import styles from "./Pages.module.css";
import { ExplainPanel } from "../components/playground/ExplainPanel.js";
import { Card } from "../components/primitives/Card.js";
import { CodeBlock } from "../components/primitives/CodeBlock.js";
import { PageContainer } from "../components/primitives/PageContainer.js";

const ADAPTERS = [
  {
    name: "Headless HTML",
    status: "Available now",
    description: "Use field().bind() with native inputs — zero framework dependency.",
    code: `const binding = form.field("email").bind();\n<input name={binding.name} value={binding.value} onChange={(e) => binding.onChange(e.target.value)} />`,
  },
  {
    name: "React adapter",
    status: "Planned (@jayoncode/form-intelligent-react)",
    description: "useFormField() hook and context provider for React apps.",
    code: `// coming soon\nconst field = useFormField("email");`,
  },
  {
    name: "Zod adapter",
    status: "Planned (@jayoncode/form-intelligent-zod)",
    description: "Bridge Zod schemas to the validation pipeline via SchemaAdapter.",
    code: `// coming soon\nadapter: zodAdapter(signupSchema)`,
  },
  {
    name: "React Hook Form bridge",
    status: "Planned",
    description: "Keep RHF field registration while delegating workflow to Form Intelligent.",
    code: `// bridge registers fields in RHF\n// workflow/autosave stays in createForm()`,
  },
  {
    name: "TanStack Form bridge",
    status: "Planned",
    description: "Composable bridge for teams already standardized on TanStack Form.",
    code: `// planned integration pattern`,
  },
  {
    name: "Vue / Angular / Svelte",
    status: "Planned",
    description: "Framework-specific composables and services mirroring the React adapter API.",
    code: `// @jayoncode/form-intelligent-vue (planned)`,
  },
] as const;

export function AdaptersPage() {
  return (
    <PageContainer
      description="How Form Intelligent fits alongside UI frameworks and validation libraries — not instead of them."
      eyebrow="Adapters"
      title="Adapter Playground"
    >
      <ExplainPanel
        body="Form Intelligent deliberately avoids owning field registration. Adapters translate framework events into setValue, bind(), and workflow APIs. Until adapter packages ship, use the headless binding pattern below."
        title="Positioning"
      />

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
