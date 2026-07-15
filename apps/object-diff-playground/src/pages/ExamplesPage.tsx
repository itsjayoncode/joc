import styles from "./Pages.module.css";
import { Card } from "../components/primitives/Card.js";
import { PageContainer } from "../components/primitives/PageContainer.js";

const EXAMPLES = [
  {
    title: "Basic diff",
    code: `import { diff } from "@jayoncode/object-diff";\n\nconst result = diff({ a: 1 }, { a: 2 });`,
  },
  {
    title: "Dirty checking",
    code: `import { hasChanges } from "@jayoncode/object-diff";\n\nif (hasChanges(formState, initialState)) {\n  // show save button\n}`,
  },
  {
    title: "Patch round-trip",
    code: `import { diff, patch, applyPatch } from "@jayoncode/object-diff";\n\nconst result = diff(before, after);\nconst next = applyPatch(before, patch(result));`,
  },
];

export function ExamplesPage() {
  return (
    <PageContainer
      description="Common integration patterns for @jayoncode/object-diff."
      eyebrow="Examples"
      title="Usage snippets"
    >
      <div className={styles.cardGrid}>
        {EXAMPLES.map((example) => (
          <Card
            description="Copy into your app or package tests."
            key={example.title}
            title={example.title}
          >
            <pre className={styles.codeBlock}>{example.code}</pre>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
