import { describe, expect, it, vi } from "vitest";

import {
  createDevToolsPlugin,
  enableFormDevTools,
  formDevToolsRegistry,
  getFormDevTools,
} from "../../src/devtools/index.js";
import { createForm, required } from "../../src/index.js";

describe("form devtools", () => {
  it("lists active forms after enableFormDevTools", () => {
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

  it("records validation and workflow events", async () => {
    const onSubmit = vi.fn();
    const form = createForm({
      initialValues: { email: "a@b.com" },
      validators: { email: [required] },
      onSubmit,
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
    expect(onSubmit).toHaveBeenCalledTimes(1);

    const snapshot = inspector.getStateSnapshot(form.id);
    expect(snapshot?.submitCount).toBe(1);

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
