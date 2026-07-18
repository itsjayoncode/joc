import { capabilitiesByGroup } from "./capabilities.js";
import styles from "./Sandbox.module.css";
import { useSandbox } from "./SandboxContext.js";
import { SANDBOX_TEMPLATES } from "./templates.js";
import { DEFAULT_SANDBOX_CONFIG } from "./types.js";

import type { ValidationMode } from "../lib/form-intelligence.js";
import type { ReactNode } from "react";

const VALIDATE_ON: readonly ValidationMode[] = [
  "onChange",
  "onBlur",
  "onSubmit",
  "onTouched",
  "all",
];

function LearnMore({ href }: { readonly href: string }) {
  return (
    <a className={styles.learnMore} href={href} rel="noreferrer" target="_blank">
      Learn more
    </a>
  );
}

function Toggle({
  checked,
  label,
  onChange,
}: {
  readonly checked: boolean;
  readonly label: string;
  readonly onChange: (next: boolean) => void;
}) {
  return (
    <div className={styles.toggleRow}>
      <label>
        <input
          checked={checked}
          onChange={(event) => {
            onChange(event.target.checked);
          }}
          type="checkbox"
        />
        {label}
      </label>
    </div>
  );
}

export function SandboxConfigPanel({ resizeHandle }: { readonly resizeHandle?: ReactNode }) {
  const {
    config,
    setConfig,
    replaceConfig,
    loadTemplate,
    docsBase,
    populateSample,
    randomizeValues,
    generateInvalid,
    stressFields,
    clearStress,
    exportConfig,
    importConfig,
    resetForm,
    copyText,
  } = useSandbox();

  const docs = (path: string) => `${docsBase}${path.replace(/^\/packages\/form-intelligence/, "")}`;

  return (
    <aside className={styles.config}>
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Form</h2>
          <LearnMore href={docs("/modules/getting-started")} />
        </div>
        <p className={styles.hint}>Configure the experiment. Changes rebuild the form live.</p>
        <label className={styles.fieldLabel} htmlFor="sandbox-template">
          Template
        </label>
        <select
          className={styles.select}
          id="sandbox-template"
          onChange={(event) => {
            loadTemplate(event.target.value as typeof config.templateId);
          }}
          value={config.templateId}
        >
          {SANDBOX_TEMPLATES.map((template) => (
            <option key={template.id} value={template.id}>
              {template.label}
            </option>
          ))}
        </select>
        <div className={styles.row} style={{ marginTop: "0.5rem" }}>
          <button
            className={styles.chip}
            onClick={() => {
              replaceConfig({ ...DEFAULT_SANDBOX_CONFIG, templateId: config.templateId });
            }}
            type="button"
          >
            New form
          </button>
          <button className={styles.chip} onClick={resetForm} type="button">
            Reset
          </button>
          <button
            className={styles.chip}
            onClick={() => {
              const json = exportConfig();
              void copyText(json, "config JSON");
            }}
            type="button"
          >
            Export
          </button>
          <button
            className={styles.chip}
            onClick={() => {
              const raw = window.prompt("Paste JSON");
              if (raw) {
                importConfig(raw);
              }
            }}
            type="button"
          >
            Import
          </button>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Validation</h2>
          <LearnMore href={docs("/modules/validation")} />
        </div>
        <p className={styles.hint}>validateOn</p>
        <div className={styles.row}>
          {VALIDATE_ON.map((mode) => (
            <button
              className={mode === config.validateOn ? styles.chipActive : styles.chip}
              key={mode}
              onClick={() => {
                setConfig({ validateOn: mode });
              }}
              type="button"
            >
              {mode}
            </button>
          ))}
        </div>
        {capabilitiesByGroup("validation").map((cap) => (
          <Toggle
            checked={cap.isEnabled(config)}
            key={cap.id}
            label={cap.label}
            onChange={(enabled) => {
              setConfig(cap.setEnabled(enabled));
            }}
          />
        ))}
        {config.asyncUsername ? (
          <p className={styles.hint}>
            Async runs on username (Register) or email (other templates). Fail with{" "}
            <code>taken</code> / <code>admin</code> / <code>taken@example.com</code>. Use validateOn
            onChange or onBlur to see it fire.
          </p>
        ) : null}
        <label className={styles.fieldLabel} htmlFor="async-debounce">
          Debounce (ms)
        </label>
        <input
          className={styles.numberInput}
          id="async-debounce"
          min={0}
          onChange={(event) => {
            setConfig({ asyncDebounceMs: Number(event.target.value) || 0 });
          }}
          type="number"
          value={config.asyncDebounceMs}
        />
        <label className={styles.fieldLabel} htmlFor="async-timeout">
          Timeout (ms, 0 = off)
        </label>
        <input
          className={styles.numberInput}
          id="async-timeout"
          min={0}
          onChange={(event) => {
            setConfig({ asyncTimeoutMs: Number(event.target.value) || 0 });
          }}
          type="number"
          value={config.asyncTimeoutMs}
        />
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Submission</h2>
          <LearnMore href={docs("/modules/submission")} />
        </div>
        {capabilitiesByGroup("submission").map((cap) => (
          <Toggle
            checked={cap.isEnabled(config)}
            key={cap.id}
            label={cap.label}
            onChange={(enabled) => {
              setConfig(cap.setEnabled(enabled));
            }}
          />
        ))}
        <label className={styles.fieldLabel} htmlFor="mock-latency">
          Mock latency (ms)
        </label>
        <input
          className={styles.numberInput}
          id="mock-latency"
          min={0}
          onChange={(event) => {
            setConfig({ mockLatencyMs: Number(event.target.value) || 0 });
          }}
          type="number"
          value={config.mockLatencyMs}
        />
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Workflow</h2>
          <LearnMore href={docs("/modules/workflow")} />
        </div>
        {capabilitiesByGroup("workflow").map((cap) => (
          <Toggle
            checked={cap.isEnabled(config)}
            key={cap.id}
            label={cap.label}
            onChange={(enabled) => {
              setConfig(cap.setEnabled(enabled));
            }}
          />
        ))}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Rules</h2>
          <LearnMore href={docs("/modules/rules")} />
        </div>
        <Toggle
          checked={config.conditionalBusiness}
          label="Business rules (show/require)"
          onChange={(enabled) => {
            setConfig({ conditionalBusiness: enabled });
          }}
        />
        {config.conditionalBusiness ? (
          <p className={styles.hint}>
            Active: customerType === Business → show + require companyName
          </p>
        ) : (
          <p className={styles.hint}>No active business rules.</p>
        )}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Calculations</h2>
          <LearnMore href={docs("/modules/calculations")} />
        </div>
        {capabilitiesByGroup("calculations").map((cap) => (
          <Toggle
            checked={cap.isEnabled(config)}
            key={cap.id}
            label={cap.label}
            onChange={(enabled) => {
              setConfig(cap.setEnabled(enabled));
            }}
          />
        ))}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Plugins</h2>
          <LearnMore href={docs("/modules/plugins")} />
        </div>
        {capabilitiesByGroup("plugins").map((cap) => (
          <Toggle
            checked={cap.isEnabled(config)}
            key={cap.id}
            label={cap.label}
            onChange={(enabled) => {
              setConfig(cap.setEnabled(enabled));
            }}
          />
        ))}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Experiments</h2>
        </div>
        <div className={styles.row}>
          <button className={styles.chip} onClick={populateSample} type="button">
            Sample data
          </button>
          <button className={styles.chip} onClick={randomizeValues} type="button">
            Randomize
          </button>
          <button className={styles.chip} onClick={generateInvalid} type="button">
            Invalid data
          </button>
          <button
            className={styles.chip}
            onClick={() => {
              stressFields(100);
            }}
            type="button"
          >
            100 fields
          </button>
          <button
            className={styles.chip}
            onClick={() => {
              stressFields(50);
            }}
            type="button"
          >
            Large form
          </button>
          <button className={styles.chip} onClick={clearStress} type="button">
            Clear stress
          </button>
        </div>
      </section>
      {resizeHandle}
    </aside>
  );
}
