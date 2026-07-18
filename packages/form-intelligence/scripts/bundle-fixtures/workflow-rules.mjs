import { when, evaluateFormRules } from "@jayoncode/form-intelligence/rules";

evaluateFormRules({
  rules: [when("country").equals("PH").show("province").toRule()],
  values: { country: "PH", province: "" },
  fieldPaths: ["country", "province"],
  setValue: () => undefined,
});
