import { describe, expect, expectTypeOf, it, vi } from "vitest";

import { createForm, when } from "../../src/index.js";

import type { CreateFormConfig, FormRuleInput } from "../../src/index.js";

describe("rules config accepts when() builders", () => {
  it("accepts default when() builders into typed CreateFormConfig.rules", async () => {
    type Values = { name: string; email: string; code: string };

    // Matches app usage: when() without an explicit values generic.
    const rule = when("name").equals("blocked").disableSubmit();
    expectTypeOf(rule).toExtend<FormRuleInput<Values>>();

    const config = {
      initialValues: { name: "blocked", email: "", code: "" },
      rules: [rule, when("email").equals("").disableSubmit()],
    } satisfies CreateFormConfig<Values>;

    const form = createForm(config);
    await vi.waitFor(() => {
      expect(form.state.formUi.submitDisabled).toBe(true);
    });
    form.destroy();
  });
});
