import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import styles from "./Pages.module.css";
import { ExplainPanel } from "../components/playground/ExplainPanel.js";
import { Card } from "../components/primitives/Card.js";
import { PageContainer } from "../components/primitives/PageContainer.js";
import { getPlaygroundMetadata } from "../config/app-metadata.js";
import { CURRENT_NAVIGATION_ITEMS } from "../constants/navigation.js";
import {
  createSampleForm,
  getFormIntelligentIntegrationSummary,
} from "../lib/form-intelligence.js";
import {
  FORM_INTELLIGENT_DOCS_URL,
  FORM_INTELLIGENT_NPM_URL,
  FORM_INTELLIGENT_REPO_URL,
} from "../lib/playground-links.js";

const MODULE_ROUTES = CURRENT_NAVIGATION_ITEMS.filter((item) => item.groupId === "modules");

const FORM_OS_FEATURES = [
  { label: "State & validation", paths: ["/validation", "/html-constraints", "/state", "/devtools"] },
  { label: "Rules & dependencies", paths: ["/rules", "/dependencies"] },
  { label: "Calculations & formatters", paths: ["/calculations", "/formatters"] },
  { label: "Workflow & submission", paths: ["/workflow", "/submission", "/captcha"] },
  { label: "Integrations", paths: ["/integrations", "/plugins", "/adapters"] },
  { label: "Performance", paths: ["/performance"] },
] as const;

const FEATURE_CARDS = [
  {
    title: "Form OS",
    description:
      "25 capabilities — validation, rules, calculations, autosave, offline queue, undo/redo, analytics. Pick what you need.",
  },
  {
    title: "Declarative rules",
    description:
      "when().show(), .require(), .disableSubmit() — business logic without useEffect spaghetti.",
  },
  {
    title: "Headless + React",
    description:
      "Native HTML enhancement or useForm() — form.state exposes fieldUi, fieldMeta, and submissionQueue.",
  },
] as const;

export function DashboardPage() {
  const integrationSummary = getFormIntelligentIntegrationSummary();
  const metadata = getPlaygroundMetadata();
  const form = useMemo(() => createSampleForm(), []);
  const [valid, setValid] = useState<boolean | null>(null);

  return (
    <PageContainer
      description="A headless form workflow engine — an operating system for forms. Validation, rules, calculations, autosave, offline submit, and integrations without UI lock-in."
      eyebrow="Dashboard"
      title="Form Intelligence Playground"
    >
      <ExplainPanel
        body="@jayoncode/form-intelligence manages everything that happens before, during, and after form submission — not just validation. Keep your HTML. Make your forms smarter."
        title="Form OS positioning"
      />

      <Card
        description="Configure validateOn, workflow, plugins, and rules — then inspect field state, events, performance, and generated code live."
        title="Start in the Sandbox"
        tone="brand"
      >
        <Link className={styles.externalLink} to="/">
          Open developer sandbox →
        </Link>
      </Card>

      <div className={styles.heroGrid}>
        <Card
          description="Headless workflow engine powered by @jayoncode/form-intelligence."
          title="Package integration"
          tone="brand"
        >
          <ul className={styles.inlineList}>
            <li className={styles.pill}>Playground v{metadata.versions.playground}</li>
            <li className={styles.pill}>
              {integrationSummary.packageName} v{metadata.versions.formIntelligence}
            </li>
            <li className={styles.pill}>25 Form OS capabilities</li>
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
              href={`${FORM_INTELLIGENT_DOCS_URL}/modules/capabilities`}
              rel="noreferrer"
              target="_blank"
            >
              capabilities map
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
            isDirty: {String(form.state.isDirty)} ·{" "}
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
        description="Jump into capability groups from the Form OS map."
        title="Form OS quick start"
      >
        <div className={styles.linkGrid}>
          {FORM_OS_FEATURES.map((group) => (
            <div className={styles.linkCard} key={group.label}>
              <p className={styles.linkTitle}>{group.label}</p>
              <div className={styles.buttonRow}>
                {group.paths.map((path) => {
                  const route = MODULE_ROUTES.find((item) => item.path === path);
                  if (!route) {
                    return null;
                  }

                  return (
                    <Link className={styles.secondaryButton} key={path} to={path}>
                      {route.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card
        description="Each route is a focused lab with explanations and live inspectors."
        title="All explorers"
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
