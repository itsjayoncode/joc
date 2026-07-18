import styles from "./Pages.module.css";
import { Card } from "../components/primitives/Card.js";
import { PageContainer } from "../components/primitives/PageContainer.js";
import { usePlaygroundUi } from "../hooks/usePlaygroundUi.js";
import { useTheme } from "../hooks/useTheme.js";
import { classNames } from "../utils/class-names.js";

import type { ThemePreference } from "../services/theme-preferences.js";

const themeOptions: readonly ThemePreference[] = ["light", "dark", "system"];

export function SettingsPage() {
  const { preference, setPreference } = useTheme();
  const { sidebarCollapsed, toggleSidebarCollapsed } = usePlaygroundUi();

  return (
    <PageContainer
      compact
      description="Application-level preferences live here so future module pages can stay focused on Form Intelligence behavior instead of shell configuration."
      eyebrow="Settings"
      title="Developer preferences and shell controls"
    >
      <div className={styles.cardGrid}>
        <Card
          description="Theme preference is persisted and resolved against the active system color scheme when needed."
          title="Theme"
        >
          <div className={styles.preferenceField}>
            <span className={styles.fieldLabel}>Color mode</span>
            <div className={styles.toggleGroup}>
              {themeOptions.map((option) => (
                <button
                  key={option}
                  className={classNames(
                    styles.choiceButton,
                    preference === option && styles.choiceButtonActive,
                  )}
                  onClick={() => {
                    setPreference(option);
                  }}
                  type="button"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </Card>

        <Card
          description="The sidebar can collapse on desktop to maximize workspace width while keeping navigation nearby."
          title="Navigation density"
        >
          <div className={styles.preferenceField}>
            <span className={styles.fieldLabel}>Sidebar mode</span>
            <button className={styles.choiceButton} onClick={toggleSidebarCollapsed} type="button">
              {sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            </button>
          </div>
        </Card>

        <Card
          description="Future phases will add developer preferences for module presets, event inspection, and QA diagnostics here."
          title="Reserved settings"
          tone="subtle"
        >
          <p className={styles.fieldHint}>
            Keeping this page in place now prevents future routing or layout reshuffles.
          </p>
        </Card>
      </div>
    </PageContainer>
  );
}
