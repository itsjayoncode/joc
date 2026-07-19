// @vitest-environment jsdom

import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h, nextTick } from "vue";

import { when } from "@jayoncode/form-intelligence/rules";
import { provideForm, useField, useForm } from "@jayoncode/form-intelligence-vue";

function RegisterForm({
  onSubmit,
}: {
  onSubmit: (values: { email: string; password: string }) => void | Promise<void>;
}) {
  return defineComponent({
    setup() {
      const form = useForm({
        schema: {
          email: "email",
          password: "password",
        },
        onSubmit,
      });

      return () =>
        h("form", { ...form.form() }, [
          h("input", { name: "email", "aria-label": "Email" }),
          h("input", { name: "password", type: "password", "aria-label": "Password" }),
          h("button", form.submit(), "Register"),
        ]);
    },
  });
}

describe("useForm", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("enhances native markup without manual handlers", async () => {
    const onSubmit = vi.fn();

    const wrapper = mount(RegisterForm({ onSubmit }), { attachTo: document.body });
    await nextTick();
    await flushPromises();

    await wrapper.get("[aria-label='Email']").setValue("user@example.com");
    await wrapper.get("[aria-label='Password']").setValue("secret123");
    await wrapper.get("button").trigger("click");
    await flushPromises();

    expect(onSubmit).toHaveBeenCalledWith(
      {
        email: "user@example.com",
        password: "secret123",
      },
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("disables submit while in flight", async () => {
    let resolveSubmit: (() => void) | undefined;
    const onSubmit = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSubmit = resolve;
        }),
    );

    const wrapper = mount(RegisterForm({ onSubmit }), { attachTo: document.body });
    await nextTick();
    await flushPromises();

    await wrapper.get("[aria-label='Email']").setValue("user@example.com");
    await wrapper.get("[aria-label='Password']").setValue("secret123");

    const button = wrapper.get("button");
    await button.trigger("click");
    await flushPromises();

    expect(button.attributes("disabled")).toBeDefined();
    expect(button.attributes("aria-busy")).toBe("true");

    resolveSubmit?.();
    await flushPromises();

    expect(button.attributes("disabled")).toBeUndefined();
  });

  it("exposes form.state for errors and validity without manual subscribe", async () => {
    const onSubmit = vi.fn();

    const SignupForm = defineComponent({
      setup() {
        const form = useForm({
          schema: { email: "email" },
          onSubmit,
        });

        return () =>
          h(
            "form",
            {
              ...form.form(),
              "data-valid": String(form.state.value.isValid),
            },
            [
              h("input", { name: "email", "aria-label": "Email" }),
              h("output", { "aria-label": "Error" }, form.state.value.errors.email ?? ""),
              h("button", { type: "submit" }, "Submit"),
            ],
          );
      },
    });

    const wrapper = mount(SignupForm, { attachTo: document.body });
    await nextTick();
    await flushPromises();
    await wrapper.get("button").trigger("click");
    await flushPromises();
    await vi.waitFor(() => {
      expect(wrapper.get("[aria-label='Error']").text()).toContain("required");
    });
    expect(wrapper.get("form").attributes("data-valid")).toBe("false");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("disables submit when formUi.submitDisabled is true", async () => {
    const LoanForm = defineComponent({
      setup() {
        const form = useForm({
          initialValues: { loanAmount: 600_000 },
          rules: [when("loanAmount").greaterThan(500_000).disableSubmit()],
        });

        return () =>
          h("form", { ...form.form() }, [
            h("input", { name: "loanAmount", "aria-label": "Amount" }),
            h("button", form.submitButton(), "Submit"),
          ]);
      },
    });

    const wrapper = mount(LoanForm, { attachTo: document.body });
    await nextTick();
    await flushPromises();

    expect(wrapper.get("button").attributes("disabled")).toBeDefined();
  });
});

describe("provideForm / useField", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("lets child fields resolve the parent form context", async () => {
    const onSubmit = vi.fn();

    const EmailField = defineComponent({
      setup() {
        const email = useField("email");
        return () => h("input", { name: email.name, "aria-label": "Email" });
      },
    });

    const ParentForm = defineComponent({
      setup() {
        const form = provideForm({
          schema: { email: "email" },
          onSubmit,
        });

        return () =>
          h("form", { ...form.form() }, [h(EmailField), h("button", { type: "submit" }, "Submit")]);
      },
    });

    const wrapper = mount(ParentForm, { attachTo: document.body });
    await nextTick();
    await flushPromises();
    await wrapper.get("[aria-label='Email']").setValue("user@example.com");
    await wrapper.get("button").trigger("click");
    await flushPromises();

    expect(onSubmit).toHaveBeenCalledWith(
      { email: "user@example.com" },
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("exposes controller façade and focusFirstInvalid", async () => {
    const onSubmit = vi.fn();

    const Probe = defineComponent({
      setup() {
        const form = useForm({
          schema: { email: "email" },
          onSubmit,
        });
        expect(form.controller).toBeDefined();
        expect(form.fieldController("email").ui.status).toBeDefined();
        expect(typeof form.focusFirstInvalid).toBe("function");
        return () => h("form", { ...form.form() }, [h("input", { name: "email" })]);
      },
    });

    mount(Probe, { attachTo: document.body });
    await nextTick();
  });
});
