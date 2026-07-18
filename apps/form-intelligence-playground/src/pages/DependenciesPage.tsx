import { useMemo } from "react";

import styles from "./Pages.module.css";
import { EventLog } from "../components/playground/EventLog.js";
import { ExplainPanel } from "../components/playground/ExplainPanel.js";
import { SandboxCue } from "../components/playground/SandboxCue.js";
import { Card } from "../components/primitives/Card.js";
import { PageContainer } from "../components/primitives/PageContainer.js";
import { useEventLog } from "../hooks/useEventLog.js";
import { useFormSnapshot } from "../hooks/useFormSnapshot.js";
import { createForm, when } from "../lib/form-intelligence.js";
import { toInputValue } from "../utils/field-value.js";

const PROVINCES: Record<string, readonly { label: string; value: string }[]> = {
  Philippines: [
    { label: "Laguna", value: "Laguna" },
    { label: "Batangas", value: "Batangas" },
    { label: "Quezon", value: "Quezon" },
  ],
  Japan: [
    { label: "Tokyo", value: "Tokyo" },
    { label: "Osaka", value: "Osaka" },
  ],
};

type DependencyValues = {
  country: string;
  province: string;
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function DependenciesPage() {
  const { clear, entries, push } = useEventLog();

  const form = useMemo(
    () =>
      createForm<DependencyValues>({
        initialValues: { country: "", province: "" },
        rules: [
          when<DependencyValues>("country")
            .changes(async (country) => {
              push(`loading provinces for ${String(country)}…`);
              await sleep(350);
              const options = PROVINCES[String(country)] ?? [];
              push(`loaded ${String(options.length)} province options`);
              return options;
            })
            .populate("province")
            .build(),
        ],
      }),
    [push],
  );

  const snapshot = useFormSnapshot(form);
  const provinces = snapshot.fieldOptions.province ?? [];

  return (
    <PageContainer
      compact
      description="when().changes().populate() — country drives province options (async loader with simulated latency)."
    >
      <ExplainPanel title="What you are testing">
        <ul className={styles.logList}>
          <li>Parent field change triggers a dependent option loader</li>
          <li>Async delay (~350ms) mimics an API — watch the event log</li>
          <li>
            Results land in <code>state.fieldOptions.province</code>
          </li>
        </ul>
        <SandboxCue hint="Sandbox focuses on templates; use this explorer for dependency graphs." />
      </ExplainPanel>

      <div className={styles.explorerLayout}>
        <div className={styles.stack}>
          <Card
            description="Select a country — province options populate after the async loader resolves."
            title="Country → Province"
          >
            <div className={styles.formGrid}>
              <label className={styles.fieldLabel}>
                Country
                <select
                  className={styles.textInput}
                  name="country"
                  onChange={(event) => {
                    form.setValue("country", event.target.value);
                    form.setValue("province", "");
                  }}
                  value={toInputValue(form.values("country"))}
                >
                  <option value="">Select country</option>
                  <option value="Philippines">Philippines</option>
                  <option value="Japan">Japan</option>
                </select>
              </label>

              <label className={styles.fieldLabel}>
                Province
                <select
                  className={styles.textInput}
                  disabled={provinces.length === 0}
                  name="province"
                  onChange={(event) => {
                    form.setValue("province", event.target.value);
                    push(`province → ${event.target.value}`);
                  }}
                  value={toInputValue(form.values("province"))}
                >
                  <option value="">
                    {provinces.length === 0 ? "Select a country first" : "Select province"}
                  </option>
                  {provinces.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <p className={styles.muted}>
              {provinces.length === 0
                ? "No options yet"
                : `${String(provinces.length)} options available`}
            </p>
          </Card>
        </div>

        <div className={styles.inspectorStack}>
          <Card description="Live dependent option map." title="fieldOptions">
            <pre className={styles.inspectorPre}>
              {JSON.stringify(snapshot.fieldOptions, null, 2)}
            </pre>
          </Card>
          <Card description="Loader and populate events." title="Dependency activity">
            <div className={styles.buttonRow}>
              <button className={styles.secondaryButton} onClick={clear} type="button">
                Clear log
              </button>
            </div>
            <EventLog entries={entries} />
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
