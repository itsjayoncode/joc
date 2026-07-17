import { useEffect, useMemo, useState } from "react";

import styles from "./Pages.module.css";
import { EventLog } from "../components/playground/EventLog.js";
import { ExplainPanel } from "../components/playground/ExplainPanel.js";
import { Card } from "../components/primitives/Card.js";
import { CodeBlock } from "../components/primitives/CodeBlock.js";
import { PageContainer } from "../components/primitives/PageContainer.js";
import { useEventLog } from "../hooks/useEventLog.js";
import { useFormSnapshot } from "../hooks/useFormSnapshot.js";
import {
  createBrowserLifecyclePlugin,
  createForm,
  required,
  type FormPlugin,
} from "../lib/form-intelligent.js";
import { toInputValue } from "../utils/field-value.js";

interface PluginToggle {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  enabled: boolean;
}

const PLUGIN_TEMPLATE = `import type { FormPlugin } from "@jayoncode/form-intelligent";

const audit: FormPlugin = {
  name: "audit",
  order: 10,
  setup(form, api) {
    api.on("beforeSubmit", () => {
      console.log("submitting", form.values());
      // return false to cancel
    });
    api.on("afterValidate", ({ valid }) => {
      console.log("valid?", valid);
    });
    api.on("onAutosave", ({ savedAt }) => {
      console.log("autosaved at", savedAt);
    });
    return {
      onDestroy() {
        console.log("audit removed");
      },
    };
  },
};

form.use(audit);`;

export function PluginsPage() {
  const { clear, entries, push } = useEventLog();
  const [toggles, setToggles] = useState<PluginToggle[]>([
    {
      id: "hooks",
      label: "Lifecycle hooks",
      description: "beforeValidate / afterValidate / beforeSubmit / afterSubmit / onAutosave",
      enabled: true,
    },
    {
      id: "guard",
      label: "Submit guard",
      description: "beforeSubmit returns false when note is empty — blocks submit",
      enabled: true,
    },
    {
      id: "lifecycle",
      label: "Browser lifecycle",
      description: "createBrowserLifecyclePlugin — save draft on page:hidden",
      enabled: false,
    },
  ]);

  const enabledIds = useMemo(
    () => new Set(toggles.filter((toggle) => toggle.enabled).map((toggle) => toggle.id)),
    [toggles],
  );

  const formKey = [...enabledIds].sort().join(",");

  const form = useMemo(() => {
    const instance = createForm({
      initialValues: { note: "hello" },
      validators: {
        note: [required],
      },
      workflow: {
        autosave: {
          enabled: true,
          debounceMs: 400,
          onSave: () => undefined,
        },
        draft: { enabled: true, storageKey: "fi-playground-plugin-draft-v2" },
      },
      onSubmit: (values) => {
        push(`onSubmit called: ${JSON.stringify(values)}`);
      },
    });

    if (enabledIds.has("hooks")) {
      const hooksPlugin: FormPlugin<{ note: string }> = {
        name: "playground-hooks",
        order: 10,
        setup(_form, api) {
          api.on("beforeValidate", ({ paths }) => {
            push(`hook:beforeValidate paths=${paths.join(",") || "*"}`);
          });
          api.on("afterValidate", ({ valid }) => {
            push(`hook:afterValidate valid=${String(valid)}`);
          });
          api.on("beforeSubmit", () => {
            push("hook:beforeSubmit");
          });
          api.on("afterSubmit", ({ success }) => {
            push(`hook:afterSubmit success=${String(success)}`);
          });
          api.on("onAutosave", ({ savedAt }) => {
            push(`hook:onAutosave at=${String(savedAt)}`);
          });
          push("plugin registered: playground-hooks");
          return {
            onDestroy: () => {
              push("plugin destroyed: playground-hooks");
            },
          };
        },
      };
      instance.use(hooksPlugin);
    }

    if (enabledIds.has("guard")) {
      const guardPlugin: FormPlugin<{ note: string }> = {
        name: "submit-guard",
        order: 5,
        setup(formInstance, api) {
          api.on("beforeSubmit", () => {
            const note = toInputValue(formInstance.get("note"));
            if (note.trim() === "") {
              push("hook:beforeSubmit blocked (empty note)");
              return false;
            }
            return undefined;
          });
          push("plugin registered: submit-guard");
          return {
            onDestroy: () => {
              push("plugin destroyed: submit-guard");
            },
          };
        },
      };
      instance.use(guardPlugin);
    }

    if (enabledIds.has("lifecycle")) {
      instance.use(
        createBrowserLifecyclePlugin<{ note: string }>({
          saveDraftOnHidden: true,
          flushOfflineQueueOnOnline: false,
        }),
      );
      push("plugin registered: browser-lifecycle");
    }

    return instance;
  }, [enabledIds, formKey, push]);

  useEffect(() => {
    return () => {
      form.destroy();
    };
  }, [form]);

  const snapshot = useFormSnapshot(form);

  const setEnabled = (id: string, enabled: boolean) => {
    setToggles((current) =>
      current.map((toggle) => (toggle.id === id ? { ...toggle, enabled } : toggle)),
    );
  };

  return (
    <PageContainer
      compact
      description="Enable plugins, fire validate/submit/autosave, and inspect the FormPluginApi hook stream."
      eyebrow="Plugins"
      title="Plugin Playground"
    >
      <ExplainPanel
        body="Phase 5.2.9 plugins receive setup(form, api). Use api.on() for beforeValidate, afterValidate, beforeSubmit, afterSubmit, onAutosave, and onDraftRestore. Return false from before* hooks to cancel. Cleanup via returned function or { onDestroy }."
        title="Hook-based extension model"
      />

      <div className={styles.explorerLayout}>
        <Card description="Toggle demos then exercise the form." title="Plugins">
          <ul className={styles.stackList}>
            {toggles.map((toggle) => (
              <li key={toggle.id}>
                <label className={styles.checkboxRow}>
                  <input
                    checked={toggle.enabled}
                    onChange={(event) => {
                      setEnabled(toggle.id, event.target.checked);
                    }}
                    type="checkbox"
                  />
                  <span>
                    <strong>{toggle.label}</strong>
                    <br />
                    <span className={styles.muted}>{toggle.description}</span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </Card>

        <Card
          description="Mutate note, validate, submit, or clear to block submit with the guard plugin."
          title="Trigger actions"
        >
          <label className={styles.fieldLabel}>
            note
            <input
              className={styles.textInput}
              onChange={(event) => {
                form.setValue("note", event.target.value);
              }}
              value={toInputValue(snapshot.values.note)}
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
              className={styles.primaryButton}
              onClick={() => {
                void form.submit();
              }}
              type="button"
            >
              submit()
            </button>
            <button
              className={styles.secondaryButton}
              onClick={() => {
                form.setValue("note", "");
              }}
              type="button"
            >
              Clear note
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

        <Card description="Hook activity from FormPluginApi and onSubmit." title="Plugin event log">
          <div className={styles.buttonRow}>
            <button className={styles.secondaryButton} onClick={clear} type="button">
              Clear log
            </button>
          </div>
          <EventLog entries={entries} />
        </Card>
      </div>

      <Card
        description="Copy this template into app bootstrap or integration tests."
        title="Custom plugin template"
      >
        <CodeBlock code={PLUGIN_TEMPLATE} language="typescript" />
      </Card>
    </PageContainer>
  );
}
