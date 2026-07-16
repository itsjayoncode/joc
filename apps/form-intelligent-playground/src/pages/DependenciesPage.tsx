import { useMemo } from "react";

import styles from "./Pages.module.css";
import { Card } from "../components/primitives/Card.js";
import { PageContainer } from "../components/primitives/PageContainer.js";
import { useFormSnapshot } from "../hooks/useFormSnapshot.js";
import { createForm, when } from "../lib/form-intelligent.js";
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

export function DependenciesPage() {
  type DependencyValues = {
    country: string;
    province: string;
  };

  const form = useMemo(
    () =>
      createForm<DependencyValues>({
        initialValues: { country: "", province: "" },
        rules: [
          when<DependencyValues>("country")
            .changes((country) => PROVINCES[String(country)] ?? [])
            .populate("province")
            .build(),
        ],
      }),
    [],
  );

  const snapshot = useFormSnapshot(form);
  const provinces = snapshot.fieldOptions.province ?? [];

  return (
    <PageContainer
      description="when().changes().populate() loads dependent select options from async loaders."
      eyebrow="Dependencies"
      title="Field Dependencies"
    >
      <Card title="Country → Province">
        <label className={styles.fieldLabel}>
          Country
          <select
            name="country"
            value={toInputValue(form.values("country"))}
            onChange={(event) => {
              form.setValue("country", event.target.value);
            }}
          >
            <option value="">Select country</option>
            <option value="Philippines">Philippines</option>
            <option value="Japan">Japan</option>
          </select>
        </label>

        <label className={styles.fieldLabel}>
          Province
          <select
            name="province"
            value={toInputValue(form.values("province"))}
            onChange={(event) => {
              form.setValue("province", event.target.value);
            }}
          >
            <option value="">Select province</option>
            {provinces.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <pre>{JSON.stringify(snapshot.fieldOptions, null, 2)}</pre>
      </Card>
    </PageContainer>
  );
}
