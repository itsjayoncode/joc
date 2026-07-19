import { describe, expect, it, vi } from "vitest";

import {
  createDevToolsPlugin,
  enableFormDevTools,
  formDevToolsRegistry,
  getFormDevTools,
  redactFormStateSnapshot,
  redactValuesRecord,
  RingBuffer,
} from "../../src/devtools/index.js";
import { createForm, required } from "../../src/index.js";

describe("RingBuffer", () => {
  it("evicts oldest entries when over capacity", () => {
    const buffer = new RingBuffer<number>(3);
    buffer.push(1);
    buffer.push(2);
    buffer.push(3);
    buffer.push(4);
    expect(buffer.toArray()).toEqual([2, 3, 4]);
    expect(buffer.size).toBe(3);
  });
});

describe("form devtools", () => {
  it("lists active forms after enableFormDevTools and cleans up on destroy", () => {
    const form = createForm({
      initialValues: { email: "" },
      validators: { email: [required] },
    });

    enableFormDevTools(form);
    expect(getFormDevTools().getActiveForms()).toHaveLength(1);
    expect(getFormDevTools().getActiveForms()[0]?.id).toBe(form.id);

    form.destroy();
    expect(getFormDevTools().getActiveForms()).toHaveLength(0);
  });

  it("records validation, workflow, plugins, and performance marks", async () => {
    const onSubmit = vi.fn();
    const form = createForm({
      initialValues: { email: "a@b.com" },
      validators: { email: [required] },
      onSubmit,
    });

    form.use({
      name: "audit",
      order: 10,
      version: "1.0.0",
      setup() {
        return undefined;
      },
    });
    form.use(createDevToolsPlugin());
    await form.submit();

    const inspector = getFormDevTools();
    expect(inspector.getValidationLog(form.id).some((entry) => entry.phase === "validated")).toBe(
      true,
    );
    expect(inspector.getWorkflowTimeline(form.id).some((entry) => entry.type === "submit")).toBe(
      true,
    );
    expect(inspector.getEventLog(form.id).some((entry) => entry.type === "submit")).toBe(true);
    expect(inspector.getPlugins(form.id).some((plugin) => plugin.name === "audit")).toBe(true);
    expect(inspector.getPlugins(form.id).some((plugin) => plugin.name === "devtools")).toBe(true);
    expect(inspector.getPerformanceMarks(form.id).some((mark) => mark.name === "validate")).toBe(
      true,
    );
    expect(inspector.getPerformanceMarks(form.id).some((mark) => mark.name === "submit")).toBe(
      true,
    );
    expect(onSubmit).toHaveBeenCalledTimes(1);

    const snapshot = inspector.getStateSnapshot(form.id);
    expect(snapshot?.submitCount).toBe(1);

    const uiProjection = inspector.getUiProjection(form.id);
    expect(uiProjection?.canSubmit).toBe(true);
    expect(uiProjection?.submitExplain.value).toBe(true);
    expect(uiProjection?.fields.some((field) => field.path === "email")).toBe(true);

    form.destroy();
  });

  it("redacts values when captureStateOnWorkflowEvents is enabled", async () => {
    const form = createForm({
      initialValues: { email: "secret@example.com" },
      onSubmit: vi.fn(),
    });

    enableFormDevTools(form, {
      captureStateOnWorkflowEvents: true,
      redactValues: true,
    });
    await form.submit();

    const submitEntry = getFormDevTools()
      .getWorkflowTimeline(form.id)
      .find((entry) => entry.type === "submit");
    expect(submitEntry?.detail?.values).toEqual({ email: "***" });

    form.destroy();
  });

  it("clears logs for one form or all forms", async () => {
    const form = createForm({
      initialValues: { email: "a@b.com" },
      onSubmit: vi.fn(),
    });
    const other = createForm({
      initialValues: { name: "Jay" },
      onSubmit: vi.fn(),
    });

    enableFormDevTools(form);
    enableFormDevTools(other);
    await form.submit();
    await other.submit();

    expect(getFormDevTools().getEventLog(form.id).length).toBeGreaterThan(0);
    getFormDevTools().clearLogs(form.id);
    expect(getFormDevTools().getEventLog(form.id)).toHaveLength(0);
    expect(getFormDevTools().getEventLog(other.id).length).toBeGreaterThan(0);

    getFormDevTools().clearLogs();
    expect(getFormDevTools().getEventLog(other.id)).toHaveLength(0);

    form.destroy();
    other.destroy();
    formDevToolsRegistry.clearLogs();
  });
});

describe("devtools redaction helpers", () => {
  it("redacts form state values for export", () => {
    const redacted = redactValuesRecord({ email: "a@b.com", nested: { x: 1 } });
    expect(redacted.email).toBe("***");
    expect(redacted.nested).toEqual({ x: "***" });

    const snapshot = redactFormStateSnapshot({
      values: { email: "a@b.com" },
      isValid: true,
    });
    expect(snapshot.values.email).toBe("***");
    expect(snapshot.isValid).toBe(true);
  });
});
