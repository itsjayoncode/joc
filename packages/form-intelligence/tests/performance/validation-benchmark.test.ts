import { describe, expect, it } from "vitest";

import { createForm, required } from "../../src/index.js";

function buildFiftyFieldForm() {
  const initialValues: Record<string, string> = {};
  const validators: Record<string, ReturnType<typeof required>[]> = {};

  for (let index = 0; index < 50; index += 1) {
    const path = `field${index}`;
    initialValues[path] = index % 2 === 0 ? `value-${index}` : "";
    validators[path] = [required];
  }

  return createForm({
    initialValues,
    validators,
  });
}

describe("performance: validation benchmark", () => {
  it("validates 50 fields under 100ms (warm)", async () => {
    const form = buildFiftyFieldForm();

    // Warm paths / module caches.
    await form.validate();

    const started = performance.now();
    const ok = await form.validate();
    const elapsed = performance.now() - started;

    expect(ok).toBe(false);
    expect(elapsed).toBeLessThan(100);
    form.destroy();
  });

  it("validates 50 filled fields under 100ms", async () => {
    const form = buildFiftyFieldForm();
    for (let index = 0; index < 50; index += 1) {
      form.setValue(`field${index}`, `value-${index}`);
    }

    await form.validate();

    const started = performance.now();
    const ok = await form.validate();
    const elapsed = performance.now() - started;

    expect(ok).toBe(true);
    expect(elapsed).toBeLessThan(100);
    form.destroy();
  });
});
