import styles from "./SubmitExplainCard.module.css";

import type { FormInstance } from "../../lib/form-intelligence.js";

export interface SubmitExplainCardProps<
  TValues extends Record<string, unknown> = Record<string, unknown>,
> {
  readonly form: FormInstance<TValues>;
}

/**
 * Playground panel: hard `submissionGuard()` vs UX `form.ui.explain("submit")`.
 */
export function SubmitExplainCard<TValues extends Record<string, unknown>>({
  form,
}: SubmitExplainCardProps<TValues>) {
  const guard = form.submissionGuard();
  const explain = form.ui.explain("submit");
  const canSubmit = form.ui.canSubmit;

  return (
    <div className={styles.root}>
      <p className={styles.headline}>{canSubmit ? "Ready to submit" : "Why can’t I submit?"}</p>

      <p className={styles.sectionLabel}>Hard guard (engine)</p>
      <p className={styles.meta}>
        submissionGuard.allowed=<code>{String(guard.allowed)}</code>
      </p>
      {guard.reasons.length === 0 ? (
        <p className={styles.empty}>No hard blocks — pipeline may start.</p>
      ) : (
        <ul className={styles.reasons}>
          {guard.reasons.map((reason) => (
            <li key={reason}>
              <code>{reason}</code>
            </li>
          ))}
        </ul>
      )}

      <p className={styles.sectionLabel}>Button UX (projection)</p>
      <p className={styles.meta}>
        form.ui.canSubmit=<code>{String(canSubmit)}</code> · phase=
        <code>{form.ui.phase}</code>
      </p>
      {explain.reasons.length === 0 ? (
        <p className={styles.empty}>No UX block reasons.</p>
      ) : (
        <ul className={styles.reasons}>
          {explain.reasons.map((reason) => (
            <li key={reason}>
              <code>{reason}</code>
            </li>
          ))}
        </ul>
      )}
      <p className={styles.meta}>contributors: {explain.contributors.join(", ") || "—"}</p>
    </div>
  );
}
