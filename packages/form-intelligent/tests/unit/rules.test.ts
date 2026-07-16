import { describe, expect, it, vi } from "vitest";

import { createForm, required } from "../../src/index.js";
import { when } from "../../src/rules/index.js";

describe("form rules", () => {
  it("shows fields when a when rule matches", async () => {
    const form = createForm({
      initialValues: { customerType: "Personal", companyName: "" },
      rules: [when("customerType").equals("Business").show("companyName")],
    });

    await vi.waitFor(() => {
      expect(form.state.fieldUi.companyName?.visible).toBe(false);
    });

    form.setValue("customerType", "Business");
    await vi.waitFor(() => {
      expect(form.state.fieldUi.companyName?.visible).toBe(true);
    });
    form.destroy();
  });

  it("supports runtime form.when registration", async () => {
    const form = createForm({
      initialValues: { loanAmount: 0, managerApproval: "" },
    });

    form.when("loanAmount").greaterThan(500_000).require("managerApproval");

    form.setValue("loanAmount", 600_000);
    await vi.waitFor(() => {
      expect(form.state.fieldUi.managerApproval?.required).toBe(true);
      expect(form.state.fieldUi.managerApproval?.visible).not.toBe(false);
    });
    form.destroy();
  });
});

describe("dirty helpers", () => {
  it("tracks changed fields", () => {
    const form = createForm({
      initialValues: { email: "a@b.com", name: "Jay" },
    });

    expect(form.isDirty()).toBe(false);
    expect(form.changedFields()).toEqual([]);

    form.setValue("email", "c@d.com");
    expect(form.isDirty()).toBe(true);
    expect(form.changedFields()).toEqual(["email"]);
    form.destroy();
  });
});

describe("required rule fields", () => {
  it("marks dynamic required fields through rules", async () => {
    const form = createForm({
      initialValues: { customerType: "Business", taxNumber: "" },
      validators: { taxNumber: [required] },
      rules: [when("customerType").equals("Business").require("taxNumber")],
    });

    await vi.waitFor(() => {
      expect(form.state.fieldUi.taxNumber?.required).not.toBe(false);
    });

    form.setValue("customerType", "Personal");
    await vi.waitFor(() => {
      expect(form.state.fieldUi.taxNumber?.required).toBe(false);
    });
    form.destroy();
  });
});

describe("submit control rules", () => {
  it("disables submit through business rules", async () => {
    const form = createForm({
      initialValues: { loanAmount: 600_000, managerApproval: "" },
      rules: [
        when("loanAmount")
          .greaterThan(500_000)
          .then((ctx) => {
            ctx.disableSubmit();
            ctx.require("managerApproval");
          }),
      ],
    });

    await vi.waitFor(() => {
      expect(form.state.formUi.submitDisabled).toBe(true);
      expect(form.state.fieldUi.managerApproval?.required).toBe(true);
    });
    form.destroy();
  });

  it("disables submit via fluent disableSubmit in config rules", async () => {
    const form = createForm({
      initialValues: { loanAmount: 600_000 },
      rules: [when("loanAmount").greaterThan(500_000).disableSubmit()],
    });

    await vi.waitFor(() => {
      expect(form.state.formUi.submitDisabled).toBe(true);
    });
    form.destroy();
  });
});
