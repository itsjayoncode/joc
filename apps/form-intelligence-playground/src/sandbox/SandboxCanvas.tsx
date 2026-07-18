import { activeCapabilityLabels } from "./capabilities.js";
import styles from "./Sandbox.module.css";
import { useSandbox } from "./SandboxContext.js";
import { getSandboxTemplate } from "./templates.js";
import { useFormSnapshot } from "../hooks/useFormSnapshot.js";
import { classNames } from "../utils/class-names.js";
import { toInputValue } from "../utils/field-value.js";

import type { ValidationMode } from "../lib/form-intelligence.js";

function shouldValidateOnBlur(mode: ValidationMode, touched: boolean): boolean {
  return mode === "onBlur" || mode === "all" || (mode === "onTouched" && touched);
}

export function SandboxCanvas() {
  const { form, config, fieldPaths, selectedPath, selectField } = useSandbox();
  const snapshot = useFormSnapshot(form);
  const template = getSandboxTemplate(config.templateId);
  const active = activeCapabilityLabels(config);

  const submitDisabled =
    snapshot.formUi.submitDisabled || (config.disableWhileSubmitting && snapshot.isSubmitting);

  const visiblePaths =
    config.wizard && snapshot.workflow.totalSteps > 0
      ? fieldPaths.filter((path) => {
          const stepIndex = snapshot.workflow.currentStep;
          const half = Math.ceil(fieldPaths.length / 2);
          if (stepIndex === 0) {
            return fieldPaths.indexOf(path) < half;
          }
          return fieldPaths.indexOf(path) >= half;
        })
      : fieldPaths;

  const setFieldValue = (path: string, value: unknown) => {
    form.setValue(path, value, { recordHistory: config.undoRedo });
    // createForm only auto-validates on setValue when validateOn === "onChange"
    if (config.validateOn === "all") {
      void form.validate({ paths: [path], mode: "all" });
    }
  };

  const blurField = (path: string) => {
    const handle = form.field(path);
    handle.setTouched(true);
    handle.setVisited(true);
    const touched = true;
    if (shouldValidateOnBlur(config.validateOn, touched)) {
      void form.validate({ paths: [path], mode: config.validateOn });
    }
  };

  return (
    <div className={styles.canvas}>
      <div>
        <p className={styles.hint} style={{ marginBottom: "0.35rem" }}>
          Current configuration
        </p>
        <div className={styles.badges}>
          <span className={styles.badgeOn}>validateOn: {config.validateOn}</span>
          <span className={config.asyncUsername ? styles.badgeOn : styles.badge}>Async</span>
          <span className={config.calculations ? styles.badgeOn : styles.badge}>Calculations</span>
          <span className={config.conditionalBusiness ? styles.badgeOn : styles.badge}>Rules</span>
          <span
            className={
              config.autosave || config.draft || config.wizard ? styles.badgeOn : styles.badge
            }
          >
            Workflow
          </span>
          <span className={styles.badgeOn}>
            Plugins:{" "}
            {active
              .filter((label) =>
                ["History", "Draft", "Wizard", "Offline queue", "Formatter"].includes(label),
              )
              .join(", ") || "none"}
          </span>
          <span className={styles.badge}>
            Submit: {config.simulateFailure ? "fail" : "ok"} / {config.mockLatencyMs}ms
          </span>
        </div>
        {config.asyncUsername ? (
          <p className={styles.hint}>
            Async tip: try <code>taken</code>, <code>admin</code>, or <code>taken@example.com</code>
          </p>
        ) : null}
      </div>

      <form
        className={styles.formCard}
        onSubmit={(event) => {
          event.preventDefault();
          void form.submit();
        }}
      >
        <div className={styles.sectionHead}>
          <h2
            className={styles.sectionTitle}
            style={{ textTransform: "none", letterSpacing: 0, fontSize: "0.95rem" }}
          >
            {config.stressFieldCount > 0
              ? `Stress form (${String(config.stressFieldCount)} fields)`
              : template.label}
          </h2>
          {config.wizard ? (
            <span className={styles.badgeOn}>
              Step {String(snapshot.workflow.currentStep + 1)} /{" "}
              {String(snapshot.workflow.totalSteps || 1)}
            </span>
          ) : null}
        </div>

        {visiblePaths.map((path) => {
          const meta = template.fieldMeta[path];
          const ui = snapshot.fieldUi[path];
          if (ui?.visible === false) {
            return null;
          }
          const error = snapshot.errors[path];
          const selected = selectedPath === path;
          const fieldMeta = snapshot.fieldMeta[path];
          const isReadonly = (path === "total" || path === "tax") && config.calculations;
          const disabled = Boolean(ui?.disabled) || isReadonly;
          const type = meta?.type ?? "text";

          return (
            <div
              className={classNames(styles.field, selected && styles.fieldSelected)}
              key={path}
              onClick={() => {
                selectField(path);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  selectField(path);
                }
              }}
              role="group"
            >
              <label className={styles.fieldLabel} htmlFor={`sandbox-${path}`}>
                {meta?.label ?? path}
                {ui?.required ? " *" : ""}
              </label>
              {type === "textarea" ? (
                <textarea
                  className={styles.fieldTextarea}
                  disabled={disabled}
                  id={`sandbox-${path}`}
                  name={path}
                  onBlur={() => {
                    blurField(path);
                  }}
                  onChange={(event) => {
                    setFieldValue(path, event.target.value);
                  }}
                  onFocus={() => {
                    form.field(path).onFocus();
                    selectField(path);
                  }}
                  rows={3}
                  value={toInputValue(form.values(path))}
                />
              ) : type === "select" ? (
                <select
                  className={styles.fieldSelect}
                  disabled={disabled}
                  id={`sandbox-${path}`}
                  name={path}
                  onBlur={() => {
                    blurField(path);
                  }}
                  onChange={(event) => {
                    setFieldValue(path, event.target.value);
                  }}
                  onFocus={() => {
                    form.field(path).onFocus();
                    selectField(path);
                  }}
                  value={toInputValue(form.values(path))}
                >
                  {(meta?.options ?? []).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  className={styles.fieldInput}
                  disabled={disabled}
                  id={`sandbox-${path}`}
                  name={path}
                  onBlur={() => {
                    blurField(path);
                  }}
                  onChange={(event) => {
                    if (type === "number") {
                      const raw = event.target.value;
                      setFieldValue(path, raw === "" ? "" : Number(raw));
                    } else {
                      setFieldValue(path, event.target.value);
                    }
                  }}
                  onFocus={() => {
                    form.field(path).onFocus();
                    selectField(path);
                  }}
                  type={type === "number" ? "number" : type}
                  value={toInputValue(form.values(path))}
                />
              )}
              {error ? <p className={styles.fieldError}>{error}</p> : null}
              <div className={styles.fieldMeta}>
                <span>{snapshot.touched[path] ? "touched" : "untouched"}</span>
                <span>{snapshot.dirty[path] ? "dirty" : "pristine"}</span>
                <span>{fieldMeta?.isValidating ? "validating…" : error ? "invalid" : "ok"}</span>
              </div>
            </div>
          );
        })}

        <div className={styles.actions}>
          {config.wizard ? (
            <>
              <button
                className={styles.chip}
                disabled={!snapshot.workflow.canGoPrev}
                onClick={() => {
                  form.workflow.prev();
                }}
                type="button"
              >
                Prev
              </button>
              <button
                className={styles.chip}
                disabled={!snapshot.workflow.canGoNext}
                onClick={() => {
                  void form.workflow.next();
                }}
                type="button"
              >
                Next
              </button>
            </>
          ) : null}
          <button className={styles.submitBtn} disabled={submitDisabled} type="submit">
            {snapshot.isSubmitting ? "Submitting…" : "Submit"}
          </button>
          <span className={styles.hint} style={{ margin: 0, alignSelf: "center" }}>
            {submitDisabled
              ? snapshot.isSubmitting
                ? "Disabled while submitting"
                : snapshot.formUi.submitDisabled
                  ? "Submit blocked by rules"
                  : "Submit disabled"
              : snapshot.isValid
                ? "Ready"
                : "Invalid — submit still runs validation"}
          </span>
        </div>
      </form>
    </div>
  );
}
