import { afterEach, describe, expect, it, vi } from "vitest";

import { buildSandboxForm, listSandboxFieldPaths, templateForCapability } from "./build-form.js";
import { DEFAULT_SANDBOX_CONFIG } from "./types.js";

describe("buildSandboxForm", () => {
  const forms: { destroy(): void }[] = [];

  afterEach(() => {
    for (const form of forms) {
      form.destroy();
    }
    forms.length = 0;
  });

  it("attaches async validation to email when login has async enabled", async () => {
    const logs: string[] = [];
    const form = buildSandboxForm(
      {
        ...DEFAULT_SANDBOX_CONFIG,
        asyncUsername: true,
        validateOn: "onChange",
        asyncDebounceMs: 0,
      },
      (message) => {
        logs.push(message);
      },
    );
    forms.push(form);

    form.setValue("email", "taken@example.com");
    await form.validate({ paths: ["email"] });
    await vi.waitFor(() => {
      expect(form.getFormState().errors.email).toMatch(/taken/i);
    });
    expect(logs.some((entry) => entry.includes("Async"))).toBe(true);
  });

  it("attaches async validation to username on register", async () => {
    const form = buildSandboxForm({
      ...DEFAULT_SANDBOX_CONFIG,
      templateId: "register",
      asyncUsername: true,
      asyncDebounceMs: 0,
    });
    forms.push(form);

    form.setValue("username", "admin");
    await form.validate({ paths: ["username"] });
    await vi.waitFor(() => {
      expect(form.getFormState().errors.username).toMatch(/taken/i);
    });
  });

  it("wires business rules on employee template", async () => {
    const form = buildSandboxForm({
      ...DEFAULT_SANDBOX_CONFIG,
      templateId: "employee",
      conditionalBusiness: true,
    });
    forms.push(form);

    // Workflow rule engine loads asynchronously.
    await vi.waitFor(() => {
      expect(form.getFormState().fieldUi.companyName?.visible).toBe(false);
    });

    form.setValue("customerType", "Business");
    await vi.waitFor(() => {
      expect(form.getFormState().fieldUi.companyName?.visible).toBe(true);
      expect(form.getFormState().fieldUi.companyName?.required).toBe(true);
    });

    form.setValue("customerType", "Personal");
    await vi.waitFor(() => {
      expect(form.getFormState().fieldUi.companyName?.visible).toBe(false);
    });
  });

  it("recomputes checkout total when calculations enabled", async () => {
    const form = buildSandboxForm({
      ...DEFAULT_SANDBOX_CONFIG,
      templateId: "checkout",
      calculations: true,
    });
    forms.push(form);

    form.setValue("qty", 3);
    form.setValue("price", 10);
    await vi.waitFor(() => {
      expect(form.values("total")).toBe(30);
    });
  });

  it("supports undo when history records changes", () => {
    const form = buildSandboxForm(DEFAULT_SANDBOX_CONFIG);
    forms.push(form);

    form.setValue("email", "a@b.com");
    form.setValue("email", "c@d.com");
    expect(form.undo()).toBe(true);
    expect(form.values("email")).toBe("a@b.com");
  });

  it("lists stress field paths", () => {
    expect(listSandboxFieldPaths({ ...DEFAULT_SANDBOX_CONFIG, stressFieldCount: 5 })).toHaveLength(
      5,
    );
  });

  it("maps capabilities to demo templates", () => {
    expect(templateForCapability("async")).toBe("register");
    expect(templateForCapability("rules")).toBe("employee");
    expect(templateForCapability("calculations")).toBe("checkout");
  });
});
