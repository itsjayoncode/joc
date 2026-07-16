import { describe, expect, it, vi } from "vitest";

import { createForm } from "../../src/index.js";

describe("form analytics", () => {
  it("tracks errors and field views", async () => {
    const form = createForm({
      initialValues: { email: "" },
      workflow: { analytics: { enabled: true } },
      validators: { email: [(value) => (value ? true : "Required")] },
    });

    await vi.waitFor(() => {
      expect(form.getAnalytics().startedAt).toBeGreaterThan(0);
    });

    form.setValue("email", "a@b.com");
    await form.validate({ paths: ["email"] });
    form.setValue("email", "");
    await form.validate({ paths: ["email"] });

    const snapshot = form.getAnalytics();
    expect(snapshot.errorCount).toBeGreaterThan(0);
    expect(snapshot.fieldViews.email).toBeGreaterThan(0);
    form.destroy();
  });
});
