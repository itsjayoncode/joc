// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";

import { enableFormDevTools, getFormDevTools } from "../../src/devtools/index.js";
import { createForm, required } from "../../src/index.js";

/**
 * Memory model stress — create/destroy must not leave DevTools registry entries
 * or grow form subscriptions (Spec 25). Offline queue data in storage is
 * product persistence, not a leak.
 */
describe("memory: create/destroy leak stress", () => {
  it("does not grow subscribe listeners across create/destroy cycles", () => {
    for (let cycle = 0; cycle < 30; cycle += 1) {
      const form = createForm({
        initialValues: { email: "" },
        validators: { email: [required] },
      });
      let calls = 0;
      const unsubscribe = form.subscribe(() => {
        calls += 1;
      });
      form.setValue("email", `u${cycle}@x.com`);
      expect(calls).toBeGreaterThan(0);
      unsubscribe();
      form.destroy();
    }
    expect(getFormDevTools().getActiveForms()).toHaveLength(0);
  });

  it("clears DevTools registry after destroy cycles", () => {
    for (let cycle = 0; cycle < 20; cycle += 1) {
      const form = createForm({
        initialValues: { email: "a@b.com" },
        onSubmit: vi.fn(),
      });
      enableFormDevTools(form);
      expect(getFormDevTools().getActiveForms().length).toBeGreaterThan(0);
      form.destroy();
    }
    expect(getFormDevTools().getActiveForms()).toHaveLength(0);
  });

  it("documents offline queue persistence is not a destroy leak", () => {
    const key = "fi-offline-queue:memory-doc";
    localStorage.setItem(key, JSON.stringify([{ id: "1" }]));
    const form = createForm({
      initialValues: { email: "" },
      workflow: {
        offlineQueue: { enabled: true, storageKey: "memory-doc" },
      },
    });
    form.destroy();
    // Persisted queue survives destroy by design (Spec 25 ownership table).
    expect(localStorage.getItem(key)).toBeTruthy();
    localStorage.removeItem(key);
  });
});
