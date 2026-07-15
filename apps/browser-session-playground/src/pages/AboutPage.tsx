import styles from "./Pages.module.css";
import { Card } from "../components/primitives/Card.js";
import { PageContainer } from "../components/primitives/PageContainer.js";

const folderResponsibilities = [
  ["app", "Application bootstrap and provider composition."],
  ["layouts", "Shell structure shared by every route."],
  ["pages", "Route-level screens only."],
  ["components", "Reusable UI building blocks and navigation widgets."],
  ["providers / contexts", "Theme and application UI state."],
  ["routes", "Route definitions and routing composition."],
  ["services", "Persistence and environment-facing helpers."],
  ["lib", "Browser Lifecycle package integration boundary."],
  ["constants / types / utils", "Static models, shared types, and small helpers."],
];

export function AboutPage() {
  return (
    <PageContainer
      description="The Playground Foundation is designed as infrastructure for future Browser Lifecycle modules, not as a one-off showcase."
      eyebrow="About"
      title="Architecture tuned for long-term extension"
    >
      <div className={styles.cardGrid}>
        <Card
          description="React, TypeScript, Vite, React Router, CSS Modules, and Vitest form the smallest stack that still supports long-lived product work."
          title="Technology choices"
        />
        <Card
          description="The shell owns theme, navigation, and recent route state. Browser Lifecycle runtime state remains behind a dedicated integration layer."
          title="State separation"
        />
        <Card
          description="Each future module page can plug into the existing route tree, shell, status bar, and shared cards without modifying the foundation."
          title="Extensibility"
        />
      </div>

      <Card
        description="Every folder has one responsibility so future phases can grow without reshaping the app."
        title="Folder structure"
      >
        <div className={styles.stack}>
          {folderResponsibilities.map(([name, responsibility]) => (
            <div key={name} className={styles.recentRoute}>
              <span className={styles.routeLabel}>{name}</span>
              <span className={styles.fieldHint}>{responsibility}</span>
            </div>
          ))}
        </div>
      </Card>
    </PageContainer>
  );
}
