import { useMemo } from "react";

import styles from "./Pages.module.css";
import { Card } from "../components/primitives/Card.js";
import { PageContainer } from "../components/primitives/PageContainer.js";
import { useFormSnapshot } from "../hooks/useFormSnapshot.js";
import {
  createBrowserLifecyclePlugin,
  createForm,
  createKeyboardPlugin,
  keyboard,
} from "../lib/form-intelligent.js";
import { toInputValue } from "../utils/field-value.js";

import type { FormPlugin } from "../lib/form-intelligent.js";

export function IntegrationsPage() {
  type IntegrationValues = {
    notes: string;
  };

  const form = useMemo(() => {
    const instance = createForm<IntegrationValues>({
      initialValues: { notes: "" },
      workflow: {
        draft: { enabled: true, storageKey: "fi-playground-integrations" },
        keyboard: [
          { combo: "Ctrl+S", action: "saveDraft" },
          { combo: "Ctrl+Z", action: "undo" },
        ],
      },
    });

    instance.use(createBrowserLifecyclePlugin() as unknown as FormPlugin<IntegrationValues>);
    instance.use(
      createKeyboardPlugin([
        keyboard.shortcut("Ctrl+Enter", (target) => {
          void target.submit();
        }),
      ]) as unknown as FormPlugin<IntegrationValues>,
    );

    return instance;
  }, []);

  const snapshot = useFormSnapshot(form);
  const analytics = form.getAnalytics();

  return (
    <PageContainer
      description="Browser session draft save, keyboard shortcuts, and analytics snapshot."
      eyebrow="Integrations"
      title="Session + Keyboard"
    >
      <div className={styles.cardGrid}>
        <Card title="Notes">
          <label className={styles.fieldLabel}>
            Notes
            <textarea
              name="notes"
              rows={4}
              value={toInputValue(form.values("notes"))}
              onChange={(event) => {
                form.setValue("notes", event.target.value);
              }}
            />
          </label>
          <p>Ctrl+S save draft · Ctrl+Z undo · hide tab to autosave draft</p>
          <button
            onClick={() => {
              form.saveDraft();
            }}
            type="button"
          >
            Save draft
          </button>
          <button onClick={() => form.undo()} type="button">
            Undo
          </button>
        </Card>

        <Card title="Analytics">
          <pre>{JSON.stringify(analytics, null, 2)}</pre>
          <p>isDirty: {String(snapshot.isDirty)}</p>
        </Card>
      </div>
    </PageContainer>
  );
}
