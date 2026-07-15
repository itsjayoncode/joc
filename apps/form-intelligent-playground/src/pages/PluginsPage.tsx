import { useEffect, useMemo } from "react";

import type { FormEvent, FormPlugin } from "@jayoncode/form-intelligent";

import styles from "./Pages.module.css";
import { EventLog } from "../components/playground/EventLog.js";
import { ExplainPanel } from "../components/playground/ExplainPanel.js";
import { Card } from "../components/primitives/Card.js";
import { CodeBlock } from "../components/primitives/CodeBlock.js";
import { PageContainer } from "../components/primitives/PageContainer.js";
import { useEventLog } from "../hooks/useEventLog.js";
import { createForm } from "../lib/form-intelligent.js";
import { toInputValue } from "../utils/field-value.js";

const TRACKED_EVENTS: readonly FormEvent[] = [
  "change",
  "blur",
  "focus",
  "validate",
  "submit",
  "autosave",
  "draft",
  "reset",
];

export function PluginsPage() {
  const { clear, entries, push } = useEventLog();

  const form = useMemo(
    () =>
      createForm({
        initialValues: { note: "" },
        workflow: {
          autosave: {
            enabled: true,
            debounceMs: 500,
            onSave: () => undefined,
          },
          draft: { enabled: true, storageKey: "fi-playground-plugin-draft" },
        },
      }),
    [],
  );

  useEffect(() => {
    const eventLogger: FormPlugin = {
      name: "event-logger",
      setup(instance) {
        const unsubscribers = TRACKED_EVENTS.map((event) =>
          instance.on(event, () => {
            push(`event:${event}`);
          }),
        );

        push("plugin registered: event-logger");
        return () => {
          for (const unsubscribe of unsubscribers) {
            unsubscribe();
          }
          push("plugin destroyed: event-logger");
        };
      },
    };

    const autosaveEcho: FormPlugin = {
      name: "autosave-echo",
      setup(instance) {
        return instance.on("autosave", () => {
          push("plugin hook: autosave-echo fired");
        });
      },
    };

    form.registerPlugin(eventLogger);
    form.registerPlugin(autosaveEcho);
  }, [form, push]);

  return (
    <PageContainer
      description="Register plugins that subscribe to form lifecycle events and clean up on destroy."
      eyebrow="Plugins"
      title="Plugin Playground"
    >
      <ExplainPanel
        body="Plugins are ideal for cross-cutting concerns: analytics, autosave side effects, browser-lifecycle integration, or custom DevTools panels. Each plugin can return a cleanup function."
        title="Extension model"
      />

      <div className={styles.explorerLayout}>
        <Card
          description="Mutate the note field to emit change events. Autosave and draft events fire from workflow config."
          title="Trigger events"
        >
          <label className={styles.fieldLabel}>
            note
            <input
              className={styles.textInput}
              onChange={(event) => {
                form.setValue("note", event.target.value);
              }}
              value={toInputValue(form.values("note"))}
            />
          </label>
          <div className={styles.buttonRow}>
            <button
              className={styles.secondaryButton}
              onClick={() => {
                void form.validate();
              }}
              type="button"
            >
              validate()
            </button>
            <button
              className={styles.secondaryButton}
              onClick={() => {
                form.reset();
              }}
              type="button"
            >
              reset()
            </button>
          </div>
        </Card>

        <Card
          description="Hook activity from registered plugins and core events."
          title="Plugin event log"
        >
          <div className={styles.buttonRow}>
            <button className={styles.secondaryButton} onClick={clear} type="button">
              Clear log
            </button>
          </div>
          <EventLog entries={entries} />
        </Card>
      </div>

      <Card
        description="Copy this template into your integration tests or app bootstrap."
        title="Custom plugin template"
      >
        <CodeBlock
          code={`const analytics: FormPlugin = {\n  name: "analytics",\n  setup(form) {\n    return form.on("submit", () => {\n      // track submit\n    });\n  },\n};\n\nform.registerPlugin(analytics);`}
          language="typescript"
        />
      </Card>
    </PageContainer>
  );
}
