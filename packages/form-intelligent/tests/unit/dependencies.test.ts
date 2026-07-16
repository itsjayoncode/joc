import { describe, expect, it } from "vitest";

import { createForm } from "../../src/index.js";
import { when } from "../../src/rules/index.js";

describe("field dependencies", () => {
  it("populates options when watch field changes", async () => {
    const form = createForm({
      initialValues: { country: "", province: "" },
      rules: [
        when("country")
          .changes(async (country) =>
            country === "PH"
              ? [
                  { label: "Laguna", value: "Laguna" },
                  { label: "Batangas", value: "Batangas" },
                ]
              : [],
          )
          .populate("province"),
      ],
    });

    form.setValue("country", "PH");
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(form.state.fieldOptions.province).toHaveLength(2);
    form.destroy();
  });
});
