import { useEffect, useMemo, useState } from "react";

import styles from "./Pages.module.css";
import { EventLog } from "../components/playground/EventLog.js";
import { ExplainPanel } from "../components/playground/ExplainPanel.js";
import { SubmitExplainCard } from "../components/playground/SubmitExplainCard.js";
import { Card } from "../components/primitives/Card.js";
import { PageContainer } from "../components/primitives/PageContainer.js";
import { useEventLog } from "../hooks/useEventLog.js";
import { useFormSnapshot } from "../hooks/useFormSnapshot.js";
import { captcha, createForm, mockCaptcha, required, ui } from "../lib/form-intelligence.js";
import { toInputValue } from "../utils/field-value.js";

import type { CaptchaBlockReason, SubmitSecurityCaptcha } from "../lib/form-intelligence.js";

type ScenarioId = "success" | "fail" | "expired" | "unavailable" | "pending";

type ProviderId = "mock" | "turnstile" | "recaptcha" | "hcaptcha";

const SCENARIOS: readonly { id: ScenarioId; label: string }[] = [
  { id: "success", label: "Success" },
  { id: "fail", label: "Failed" },
  { id: "expired", label: "Expired" },
  { id: "unavailable", label: "Unavailable" },
  { id: "pending", label: "Pending → success" },
];

const PROVIDERS: readonly { id: ProviderId; label: string }[] = [
  { id: "mock", label: "mockCaptcha" },
  { id: "turnstile", label: "turnstile-shaped" },
  { id: "recaptcha", label: "recaptcha-shaped" },
  { id: "hcaptcha", label: "hcaptcha-shaped" },
];

function failReason(scenario: ScenarioId): CaptchaBlockReason | undefined {
  switch (scenario) {
    case "fail":
      return "captchaFailed";
    case "expired":
      return "captchaExpired";
    case "unavailable":
      return "captchaUnavailable";
    default:
      return undefined;
  }
}

function buildSetup(provider: ProviderId, scenario: ScenarioId) {
  const failWith = failReason(scenario);
  const delayMs = scenario === "pending" ? 700 : undefined;

  return mockCaptcha({
    provider,
    token: `${provider}-token`,
    ...(failWith ? { failWith } : {}),
    ...(delayMs ? { delayMs } : {}),
  });
}

/**
 * Interactive lab for `/captcha` — Security Stage outcomes and meta.security.captcha.
 */
export function CaptchaPage() {
  const { clear, entries, push } = useEventLog();
  const [scenario, setScenario] = useState<ScenarioId>("success");
  const [provider, setProvider] = useState<ProviderId>("mock");
  const [lastToken, setLastToken] = useState<SubmitSecurityCaptcha | null>(null);

  const form = useMemo(
    () =>
      createForm({
        initialValues: { message: "hello" },
        validators: { message: [required] },
        plugins: [ui(), captcha(buildSetup(provider, scenario))],
        onSubmit: async (values, meta) => {
          const captchaMeta = meta?.security?.captcha ?? null;
          setLastToken(captchaMeta);
          push(
            `onSubmit — provider=${captchaMeta?.provider ?? "?"} token=${captchaMeta?.token ?? "?"}`,
          );
          push(`values.message=${String(values.message)}`);
          await new Promise((resolve) => setTimeout(resolve, 200));
        },
      }),
    [provider, scenario, push],
  );

  useEffect(() => {
    setLastToken(null);
    return () => {
      form.destroy();
    };
  }, [form]);

  const snapshot = useFormSnapshot(form);

  const runSubmit = async () => {
    push(`submit() — scenario=${scenario} provider=${provider}`);
    const ok = await form.submit();
    if (!ok) {
      const reasons = form.ui.explain("submit").reasons;
      push(`aborted — reasons: ${reasons.join(", ") || "none"}`);
      return;
    }
    push("submit() resolved true");
  };

  return (
    <PageContainer
      compact
      description="Security Stage before onSubmit — simulate success/failure, inspect explain reasons and meta.security.captcha."
      eyebrow="CAPTCHA"
      title="CAPTCHA Lab"
    >
      <ExplainPanel title="What you are testing">
        <ul className={styles.logList}>
          <li>
            Pipeline: guards → validation → <strong>Security Stage</strong> → beforeSubmit →
            onSubmit
          </li>
          <li>
            Failures abort with <code>captcha*</code> reasons on{" "}
            <code>form.ui.explain("submit")</code>
          </li>
          <li>
            Token lands at <code>meta.security.captcha</code> (provider-agnostic)
          </li>
          <li>
            Lab uses <code>mockCaptcha()</code> shaped like turnstile / recaptcha / hcaptcha — no
            vendor scripts
          </li>
        </ul>
      </ExplainPanel>

      <div className={styles.explorerLayout}>
        <div className={styles.stack}>
          <Card description="Recreate the form when you change these." title="Scenario">
            <div className={styles.preferenceField}>
              <span className={styles.fieldLabel}>Outcome</span>
              <div className={styles.toggleGroup} role="group" aria-label="CAPTCHA scenario">
                {SCENARIOS.map((item) => (
                  <button
                    className={
                      scenario === item.id ? styles.choiceButtonActive : styles.choiceButton
                    }
                    key={item.id}
                    onClick={() => {
                      setScenario(item.id);
                      clear();
                    }}
                    type="button"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.preferenceField}>
              <span className={styles.fieldLabel}>Provider label</span>
              <div className={styles.toggleGroup} role="group" aria-label="CAPTCHA provider">
                {PROVIDERS.map((item) => (
                  <button
                    className={
                      provider === item.id ? styles.choiceButtonActive : styles.choiceButton
                    }
                    key={item.id}
                    onClick={() => {
                      setProvider(item.id);
                      clear();
                    }}
                    type="button"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <p className={styles.fieldHint}>
                Import real providers from <code>@jayoncode/form-intelligence/captcha</code> (
                <code>turnstile</code>, <code>recaptcha</code>, <code>hcaptcha</code>).
              </p>
            </div>
          </Card>

          <Card
            description="Required message — validation still runs before Security Stage."
            title="Form"
          >
            <label className={styles.preferenceField}>
              <span className={styles.fieldLabel}>message</span>
              <input
                className={styles.textInput}
                onChange={(event) => {
                  form.setValue("message", event.target.value);
                }}
                value={toInputValue(snapshot.values.message)}
              />
            </label>

            <div className={styles.inlineList}>
              <button
                className={styles.primaryButton}
                disabled={snapshot.isSubmitting}
                onClick={() => {
                  void runSubmit();
                }}
                type="button"
              >
                {snapshot.isSubmitting ? "Submitting…" : "Submit"}
              </button>
              <button
                className={styles.secondaryButton}
                onClick={() => {
                  form.reset();
                  setLastToken(null);
                  clear();
                  push("form.reset()");
                }}
                type="button"
              >
                Reset
              </button>
            </div>

            <p className={styles.fieldHint}>
              phase=<code>{snapshot.submitPhase}</code> · canSubmit=
              <code>{String(form.ui.canSubmit)}</code>
            </p>
          </Card>

          <Card title="Last security.captcha">
            {lastToken ? (
              <pre className={styles.codeBlock}>{JSON.stringify(lastToken, null, 2)}</pre>
            ) : (
              <p className={styles.fieldHint}>No token yet — succeed a submit to capture one.</p>
            )}
          </Card>
        </div>

        <div className={styles.stack}>
          <Card title="Explain">
            <SubmitExplainCard form={form} />
          </Card>
          <Card description="Clear via scenario change or Reset." title="Event log">
            <EventLog entries={entries} />
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
