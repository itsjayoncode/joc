import styles from "./Pages.module.css";
import { ExplainPanel } from "../components/playground/ExplainPanel.js";
import { Card } from "../components/primitives/Card.js";
import { PageContainer } from "../components/primitives/PageContainer.js";
import {
  FORM_INTELLIGENT_DOCS_URL,
  FORM_INTELLIGENT_NPM_URL,
  FORM_INTELLIGENT_REPO_URL,
} from "../lib/playground-links.js";

const POSITIONING = [
  {
    title: "Form OS",
    description:
      "25 capabilities — state, validation, rules, calculations, autosave, offline queue, undo/redo, analytics. Pick what you need per project.",
  },
  {
    title: "Headless first",
    description:
      "Native HTML enhancement via target + schema, or useForm() in React. You own the markup.",
  },
  {
    title: "Inspectable",
    description:
      "form.state exposes fieldUi, formUi, fieldMeta, fieldOptions, and submissionQueue for DevTools panels.",
  },
] as const;

const folderResponsibilities = [
  ["pages", "Route-level explorers — each maps to a package capability."],
  ["components/playground", "ExplainPanel, EventLog, and inspectors shared across routes."],
  ["hooks", "useFormSnapshot and useEventLog bridge UI to form instances."],
  ["lib", "Package integration boundary — import @jayoncode/form-intelligent here only."],
  ["providers / layouts", "Theme, navigation shell, and status bar."],
] as const;

export function AboutPage() {
  return (
    <PageContainer
      description="Form Intelligent is a headless form workflow engine. This playground exists to teach the API interactively before you install the package."
      eyebrow="About"
      title="Product positioning"
    >
      <ExplainPanel title="What Form Intelligent is (and is not)">
        <ul className={styles.logList}>
          <li>
            It is a headless form workflow engine — an operating system for forms — not just a
            validation library.
          </li>
          <li>
            It manages everything before, during, and after submission while you keep your UI.
          </li>
          <li>It complements field-registration libraries (React Hook Form, TanStack Form).</li>
        </ul>
      </ExplainPanel>

      <div className={styles.cardGrid}>
        {POSITIONING.map((item) => (
          <Card description={item.description} key={item.title} title={item.title} />
        ))}
      </div>

      <Card description="Official resources for the package." title="Documentation links">
        <div className={styles.externalLinks}>
          <a
            className={styles.externalLink}
            href={FORM_INTELLIGENT_DOCS_URL}
            rel="noreferrer"
            target="_blank"
          >
            Package documentation
          </a>
          <a
            className={styles.externalLink}
            href={FORM_INTELLIGENT_NPM_URL}
            rel="noreferrer"
            target="_blank"
          >
            npm
          </a>
          <a
            className={styles.externalLink}
            href={FORM_INTELLIGENT_REPO_URL}
            rel="noreferrer"
            target="_blank"
          >
            Source code
          </a>
        </div>
      </Card>

      <Card description="How this playground app is organized." title="Playground architecture">
        <div className={styles.stack}>
          {folderResponsibilities.map(([name, responsibility]) => (
            <div className={styles.recentRoute} key={name}>
              <span className={styles.routeLabel}>{name}</span>
              <span className={styles.fieldHint}>{responsibility}</span>
            </div>
          ))}
        </div>
      </Card>
    </PageContainer>
  );
}
