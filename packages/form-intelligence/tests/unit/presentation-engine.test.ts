// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";

import { createForm, when, required } from "../../src/index.js";
import {
  DEFAULT_FIELD_UI,
  PRESENTATION_OWNERSHIP,
  resolveFieldUi,
} from "../../src/presentation/index.js";

describe("presentation ownership", () => {
  it("documents producers vs non-writers", () => {
    expect(PRESENTATION_OWNERSHIP.producers).toContain("workflow.rules");
    expect(PRESENTATION_OWNERSHIP.producers).toContain("schema.requiredBaseline");
    expect(PRESENTATION_OWNERSHIP.nonWriters).toContain("validation");
  });

  it("resolves defaults when path missing", () => {
    expect(resolveFieldUi("missing", {})).toEqual(DEFAULT_FIELD_UI);
  });
});

describe("schema required → presentation", () => {
  it("seeds fieldUi.required from schema required: true", () => {
    const form = createForm({
      schema: { email: { required: true }, note: "text" },
    });

    expect(form.getPresentation("email").field.required).toBe(true);
    expect(form.getPresentation("note").field.required).toBeUndefined();
    expect(form.ui.requiredFields).toEqual(["email"]);
    form.destroy();
  });

  it("seeds fieldUi.required from email/password/url shortcuts", () => {
    const form = createForm({
      schema: { email: "email", password: "password", website: "url" },
    });

    expect(form.getPresentation("email").field.required).toBe(true);
    expect(form.getPresentation("password").field.required).toBe(true);
    expect(form.getPresentation("website").field.required).toBe(true);
    form.destroy();
  });

  it("seeds from validators: [required] without rules", () => {
    const form = createForm({
      initialValues: { name: "" },
      validators: { name: [required] },
    });

    expect(form.getPresentation("name").field.required).toBe(true);
    form.destroy();
  });

  it("keeps unmatched require → false over schema baseline", async () => {
    const form = createForm({
      initialValues: { customerType: "Personal", taxNumber: "" },
      schema: { taxNumber: { required: true } },
      rules: [when("customerType").equals("Business").require("taxNumber")],
    });

    await vi.waitFor(() => {
      expect(form.getPresentation("taxNumber").field.required).toBe(false);
    });

    form.setValue("customerType", "Business");
    await vi.waitFor(() => {
      expect(form.getPresentation("taxNumber").field.required).toBe(true);
    });
    form.destroy();
  });

  it("seeds when field() registers required validators", () => {
    const form = createForm({
      initialValues: { code: "" },
    });

    expect(form.getPresentation("code").field.required).toBeUndefined();
    form.field("code", { validators: [required] });
    expect(form.getPresentation("code").field.required).toBe(true);
    form.destroy();
  });
});

describe("presentation rules matrix", () => {
  it("show/hide/require/disable + submitDisabled via getPresentation", async () => {
    const form = createForm({
      initialValues: {
        customerType: "Personal",
        companyName: "",
        taxNumber: "",
        loanAmount: 0,
      },
      rules: [
        when("customerType").equals("Business").show("companyName").require("taxNumber"),
        when("loanAmount").greaterThan(500_000).disable("taxNumber").disableSubmit(),
      ],
    });

    await vi.waitFor(() => {
      expect(form.getPresentation("companyName").field.visible).toBe(false);
      expect(form.getPresentation().formUi.submitDisabled).toBe(false);
    });

    form.setValue("customerType", "Business");
    await vi.waitFor(() => {
      expect(form.getPresentation("companyName").field.visible).toBe(true);
      expect(form.getPresentation("taxNumber").field.required).toBe(true);
      expect(form.field("companyName").ui.visible).toBe(true);
    });

    form.setValue("loanAmount", 600_000);
    await vi.waitFor(() => {
      expect(form.getPresentation("taxNumber").field.disabled).toBe(true);
      expect(form.getPresentation().formUi.submitDisabled).toBe(true);
    });

    form.destroy();
  });

  it("exposes fieldOptions on presentation state after populate", async () => {
    const form = createForm({
      initialValues: { country: "", province: "" },
      rules: [
        when("country")
          .changes(async () => [{ label: "Laguna", value: "Laguna" }])
          .populate("province")
          .toRule(),
      ],
    });

    form.setValue("country", "PH");
    await vi.waitFor(() => {
      expect(form.getPresentation("province").options).toEqual([
        { label: "Laguna", value: "Laguna" },
      ]);
    });
    form.destroy();
  });
});

describe("DOM enhancer presentation", () => {
  it("applies hidden/disabled/required and submitDisabled", async () => {
    document.body.innerHTML = `
      <form id="p9">
        <div data-form-intelligent-field="companyName">
          <input name="companyName" />
        </div>
        <div data-form-intelligent-field="taxNumber">
          <input name="taxNumber" />
        </div>
        <button type="submit">Send</button>
      </form>
    `;

    const formElement = document.getElementById("p9") as HTMLFormElement;
    const form = createForm({
      target: formElement,
      initialValues: { customerType: "Personal", companyName: "", taxNumber: "", loanAmount: 0 },
      rules: [
        when("customerType").equals("Business").show("companyName").require("taxNumber"),
        when("loanAmount").greaterThan(500_000).disable("taxNumber").disableSubmit(),
      ],
    });

    const companyWrap = formElement.querySelector(
      '[data-form-intelligent-field="companyName"]',
    ) as HTMLElement;

    await vi.waitFor(() => {
      expect(companyWrap.hidden).toBe(true);
    });

    form.setValue("customerType", "Business");
    await vi.waitFor(() => {
      expect(companyWrap.hidden).toBe(false);
      const tax = formElement.querySelector('input[name="taxNumber"]') as HTMLInputElement;
      expect(tax.required).toBe(true);
    });

    form.setValue("loanAmount", 600_000);
    await vi.waitFor(() => {
      const tax = formElement.querySelector('input[name="taxNumber"]') as HTMLInputElement;
      expect(tax.disabled).toBe(true);
      const submit = formElement.querySelector('button[type="submit"]') as HTMLButtonElement;
      expect(submit.disabled).toBe(true);
    });

    form.destroy();
    document.body.innerHTML = "";
  });
});
