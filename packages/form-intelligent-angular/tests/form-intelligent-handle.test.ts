import { describe, expect, it, vi } from "vitest";

import { when } from "@jayoncode/form-intelligent/rules";

import { FormIntelligentHandleImpl } from "../src/form-intelligent-handle.js";
import { selectFormState } from "../src/select-form-state.js";

describe("FormIntelligentHandleImpl", () => {
  it("updates the state signal when values change", () => {
    const handle = new FormIntelligentHandleImpl({
      initialValues: { email: "" },
      schema: { email: "email" },
    });

    handle.instance.setValue("email", "user@example.com");
    expect(handle.state().values.email).toBe("user@example.com");
    handle.destroy();
  });

  it("disables submit when formUi.submitDisabled is true", async () => {
    const handle = new FormIntelligentHandleImpl({
      initialValues: { loanAmount: 600_000 },
      rules: [when("loanAmount").greaterThan(500_000).disableSubmit()],
    });

    await vi.waitFor(() => {
      expect(handle.submit().disabled).toBe(true);
    });

    handle.destroy();
  });

  it("returns no errors when validation passes", async () => {
    const handle = new FormIntelligentHandleImpl({
      initialValues: { email: "user@example.com" },
      schema: { email: "email" },
    });

    expect(await handle.instance.validate()).toBe(true);
    expect(handle.state().errors).toEqual({});
    handle.destroy();
  });
});

describe("selectFormState", () => {
  it("projects a slice of form state", () => {
    const handle = new FormIntelligentHandleImpl({
      initialValues: { email: "user@example.com" },
    });

    const email = selectFormState(handle, (state) => state.values.email);
    expect(email()).toBe("user@example.com");
    handle.destroy();
  });
});
