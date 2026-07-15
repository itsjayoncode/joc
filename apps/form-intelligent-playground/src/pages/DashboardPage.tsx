import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import styles from "./Pages.module.css";
import { ExplainPanel } from "../components/playground/ExplainPanel.js";
import { Card } from "../components/primitives/Card.js";
import { PageContainer } from "../components/primitives/PageContainer.js";
import { getPlaygroundMetadata } from "../config/app-metadata.js";
import { CURRENT_NAVIGATION_ITEMS } from "../constants/navigation.js";
import { createSampleForm, getFormIntelligentIntegrationSummary } from "../lib/form-intelligent.js";
import {
  FORM_INTELLIGENT_DOCS_URL,
  FORM_INTELLIGENT_NPM_URL,
  FORM_INTELLIGENT_REPO_URL,
} from "../lib/playground-links.js";

const MODULE_ROUTES = CURRENT_NAVIGATION_ITEMS.filter((item) => item.groupId === "modules");

const FEATURE_CARDS = [
  {
    title: "Headless by design",
    description:
      "Bind native inputs with field().bind() — no React Hook Form lock-in. Adapters layer on top when you need them.",
  },
  {
    title: "Workflow orchestration",
    description:
      "Autosave, draft restore, and wizard steps are first-class — not bolted on with useEffect spaghetti.",
  },
  {
    title: "Inspectable state",
    description:
      "Values, errors, touched, dirty, and visited flags are always readable for DevTools-style explorers.",
  },
] as const;

export function DashboardPage() {
  const integrationSummary = getFormIntelligentIntegrationSummary();
  const metadata = getPlaygroundMetadata();
  const form = useMemo(() => createSampleForm(), []);
  const [valid, setValid] = useState<boolean | null>(null);

  return (
    <PageContainer
      description="A headless form workflow engine — validate fields, submit safely, autosave drafts, and run multi-step wizards without UI framework lock-in."
      eyebrow="Dashboard"
      title="Form Intelligent Playground"
    >
      <ExplainPanel
        body="Form Intelligent focuses on workflow orchestration (validation timing, submission guards, autosave, wizards). It complements field-registration libraries like React Hook Form rather than replacing them."
        title="Why this package exists"
      />

      <div className={styles.heroGrid}>
        <Card
          description="Headless validation, submission, and workflow orchestration powered by @jayoncode/form-intelligent."
          title="Package integration"
          tone="brand"
        >
          <ul className={styles.inlineList}>
            <li className={styles.pill}>Playground v{metadata.versions.playground}</li>
            <li className={styles.pill}>
              {integrationSummary.packageName} v{metadata.versions.formIntelligent}
            </li>
            <li className={styles.pill}>{MODULE_ROUTES.length} interactive explorers</li>
          </ul>
          <div className={styles.externalLinks}>
            <a
              className={styles.externalLink}
              href={FORM_INTELLIGENT_NPM_URL}
              rel="noreferrer"
              target="_blank"
            >
              npm package
            </a>
            <a
              className={styles.externalLink}
              href={FORM_INTELLIGENT_DOCS_URL}
              rel="noreferrer"
              target="_blank"
            >
              documentation
            </a>
            <a
              className={styles.externalLink}
              href={FORM_INTELLIGENT_REPO_URL}
              rel="noreferrer"
              target="_blank"
            >
              source
            </a>
          </div>
        </Card>

        <Card
          description="Run validators on the bundled sample form."
          title="Quick validate"
          tone="brand"
        >
          <button
            className={styles.primaryButton}
            onClick={() => {
              void form.validate().then(setValid);
            }}
            type="button"
          >
            Validate sample form
          </button>
          <p className={styles.fieldHint}>
            {valid === null
              ? "Not run yet"
              : valid
                ? "All checks passed"
                : "Validation failed — open Validation explorer"}
          </p>
        </Card>
      </div>

      <div className={styles.cardGrid}>
        {FEATURE_CARDS.map((feature) => (
          <Card description={feature.description} key={feature.title} title={feature.title} />
        ))}
      </div>

      <Card
        description="Each route is a focused lab with explanations and live inspectors."
        title="Explorer quick links"
      >
        <div className={styles.linkGrid}>
          {MODULE_ROUTES.map((route) => (
            <Link className={styles.linkCard} key={route.id} to={route.path ?? "/"}>
              <p className={styles.linkTitle}>{route.label}</p>
              <p className={styles.linkDescription}>{route.description}</p>
            </Link>
          ))}
        </div>
      </Card>
    </PageContainer>
  );
}
