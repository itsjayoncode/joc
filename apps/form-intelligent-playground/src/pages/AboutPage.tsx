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
    title: "Workflow orchestration",
    description:
      "Autosave, drafts, wizards, and submit guards are core — not community recipes layered on top of field registration.",
  },
  {
    title: "Headless first",
    description:
      "Works with plain HTML today. Framework adapters (React, Vue, Zod) extend the same createForm() instance.",
  },
  {
    title: "Inspectable",
    description:
      "Every flag (touched, dirty, visited) and error map is readable for DevTools panels and tests.",
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
          <li>It is a workflow engine for validation timing, submission, autosave, and wizards.</li>
          <li>It is not a replacement for React Hook Form or TanStack Form field registration.</li>
          <li>Adapters and bridges let both coexist — orchestration here, field wiring there.</li>
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
