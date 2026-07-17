import { describe, expect, it, vi } from "vitest";

import { FormAnalyticsTracker, isAnalyticsPathAllowed } from "../../src/engines/analytics/index.js";
import { createForm, required } from "../../src/index.js";

describe("form analytics", () => {
  it("tracks errors and field views when enabled", async () => {
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
    expect(snapshot.timeToFirstErrorMs).not.toBeNull();
    form.destroy();
  });

  it("returns empty snapshot when disabled", () => {
    const form = createForm({
      initialValues: { email: "secret@x.com" },
      workflow: { analytics: { enabled: false } },
    });

    expect(form.getAnalytics()).toMatchObject({
      startedAt: 0,
      errorCount: 0,
      timeToCompleteMs: null,
      timeToFirstErrorMs: null,
    });
    form.destroy();
  });

  it("records timing on successful submit", async () => {
    const form = createForm({
      initialValues: { email: "a@b.com" },
      workflow: { analytics: { enabled: true } },
      onSubmit: vi.fn(),
    });

    await vi.waitFor(() => {
      expect(form.getAnalytics().startedAt).toBeGreaterThan(0);
    });

    await form.submit();
    const snap = form.getAnalytics();
    expect(snap.completedAt).not.toBeNull();
    expect(snap.timeToCompleteMs).not.toBeNull();
    expect(snap.timeToCompleteMs).toBeGreaterThanOrEqual(0);
    form.destroy();
  });
});

describe("analytics privacy", () => {
  it("never stores field values in snapshots", async () => {
    const secret = "ssn-999-99-9999";
    const form = createForm({
      initialValues: { ssn: secret, email: "user@x.com" },
      workflow: { analytics: { enabled: true } },
      validators: { email: [required] },
    });

    await vi.waitFor(() => {
      expect(form.getAnalytics().startedAt).toBeGreaterThan(0);
    });

    form.setValue("ssn", secret);
    form.setValue("email", "");
    await form.validate();

    const snapshot = form.getAnalytics();
    const json = JSON.stringify(snapshot);
    expect(json).not.toContain(secret);
    expect(json).not.toContain("user@x.com");
    expect(snapshot).not.toHaveProperty("values");
    form.destroy();
  });

  it("honors includePaths allowlist", () => {
    const tracker = new FormAnalyticsTracker({ includePaths: ["email"] });
    tracker.recordFieldView("email");
    tracker.recordFieldView("ssn");
    tracker.recordFieldError("ssn");
    tracker.recordFieldError("email");

    const snap = tracker.getSnapshot();
    expect(snap.fieldViews).toEqual({ email: 1 });
    expect(snap.errorsByField).toEqual({ email: 1 });
    expect(snap.errorCount).toBe(1);
  });

  it("honors excludePaths denylist", () => {
    expect(isAnalyticsPathAllowed("ssn", { excludePaths: ["ssn"] })).toBe(false);
    const tracker = new FormAnalyticsTracker({ excludePaths: ["ssn"] });
    tracker.recordFieldView("ssn");
    tracker.recordFieldView("email");
    expect(tracker.getSnapshot().fieldViews).toEqual({ email: 1 });
  });

  it("wires include/exclude through createForm", async () => {
    const form = createForm({
      initialValues: { email: "", ssn: "" },
      workflow: {
        analytics: {
          enabled: true,
          excludePaths: ["ssn"],
        },
      },
      validators: {
        email: [required],
        ssn: [required],
      },
    });

    await vi.waitFor(() => {
      expect(form.getAnalytics().startedAt).toBeGreaterThan(0);
    });

    form.setValue("email", "a");
    form.setValue("ssn", "1");
    await form.validate();

    const snap = form.getAnalytics();
    expect(snap.fieldViews.ssn).toBeUndefined();
    expect(snap.errorsByField.ssn).toBeUndefined();
    form.destroy();
  });
});
