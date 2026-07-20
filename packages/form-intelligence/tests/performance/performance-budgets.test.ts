import { describe, expect, it } from "vitest";

import { createForm, required } from "../../src/index.js";

/**
 * Phase 18 timing budgets — catch order-of-magnitude regressions, not wall-clock
 * parity across machines. CI runners are often 2–3× noisier than local (ADR-013).
 */
const CI = process.env.CI === "true" || process.env.GITHUB_ACTIONS === "true";
const HEADROOM = CI ? 3 : 1.5;

const BUDGET = {
  validate50WarmMs: 150 * HEADROOM,
  /** Local baseline ~200–250ms; noise has spiked ~455ms; CI has seen ~540ms under load. */
  setValue50x100Ms: 350 * HEADROOM,
  undo50Ms: 200 * HEADROOM,
} as const;

function buildFiftyFieldForm(fill = false) {
  const initialValues: Record<string, string> = {};
  const validators: Record<string, ReturnType<typeof required>[]> = {};

  for (let index = 0; index < 50; index += 1) {
    const path = `field${index}`;
    initialValues[path] = fill || index % 2 === 0 ? `value-${index}` : "";
    validators[path] = [required];
  }

  return createForm({
    initialValues,
    validators,
  });
}

function median(samples: number[]): number {
  const sorted = [...samples].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? ((sorted[mid - 1] ?? 0) + (sorted[mid] ?? 0)) / 2
    : (sorted[mid] ?? 0);
}

function bench(run: () => void | Promise<void>, iterations = 5): Promise<number> {
  return (async () => {
    await run(); // warm
    const samples: number[] = [];
    for (let index = 0; index < iterations; index += 1) {
      const started = performance.now();
      await run();
      samples.push(performance.now() - started);
    }
    return median(samples);
  })();
}

describe("performance budgets", () => {
  it("validates 50 fields under budget (warm median)", async () => {
    const form = buildFiftyFieldForm();
    const ms = await bench(async () => {
      await form.validate();
    });
    expect(ms).toBeLessThan(BUDGET.validate50WarmMs);
    form.destroy();
  });

  it("setValue 50 fields × 100 stays under budget", async () => {
    const form = buildFiftyFieldForm(true);
    const ms = await bench(() => {
      for (let round = 0; round < 100; round += 1) {
        for (let index = 0; index < 50; index += 1) {
          form.setValue(`field${index}`, `v-${round}-${index}`);
        }
      }
    }, 3);
    expect(ms).toBeLessThan(BUDGET.setValue50x100Ms);
    form.destroy();
  });

  it("undo stack of depth 50 stays under budget", async () => {
    const form = createForm({
      initialValues: { n: 0 },
    });
    for (let index = 0; index < 50; index += 1) {
      form.setValue("n", index);
    }

    const ms = await bench(() => {
      while (form.undo()) {
        // drain
      }
      for (let index = 0; index < 50; index += 1) {
        form.setValue("n", index);
      }
    }, 3);

    expect(ms).toBeLessThan(BUDGET.undo50Ms);
    form.destroy();
  });
});
