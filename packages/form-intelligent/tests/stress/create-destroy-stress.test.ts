import { describe, expect, it } from "vitest";

import { createForm, required } from "../../src/index.js";

/** CI runners are often 2–3× noisier than local (same rationale as performance budgets). */
const CI = process.env.CI === "true" || process.env.GITHUB_ACTIONS === "true";
const RAPID_SET_BUDGET_MS = 2000 * (CI ? 1.5 : 1);

describe("stress: create/destroy + rapid setValue", () => {
  it("creates and destroys 1000 forms without throwing", () => {
    for (let index = 0; index < 1000; index += 1) {
      const form = createForm({
        initialValues: { n: index },
        validators: { n: [required] },
      });
      form.setValue("n", index + 1);
      form.destroy();
    }
  });

  it("handles 200 fields with rapid setValue under budget", () => {
    const initialValues: Record<string, string> = {};
    for (let index = 0; index < 200; index += 1) {
      initialValues[`f${index}`] = "";
    }

    const form = createForm({ initialValues });
    const started = performance.now();
    for (let round = 0; round < 20; round += 1) {
      for (let index = 0; index < 200; index += 1) {
        form.setValue(`f${index}`, `v-${round}-${index}`);
      }
    }
    const elapsed = performance.now() - started;
    // Structural guard against accidental O(n²) notify storms.
    expect(elapsed).toBeLessThan(RAPID_SET_BUDGET_MS);
    form.destroy();
  });
});
