import { createForm, email, required } from "@jayoncode/form-intelligent";

createForm({
  initialValues: { email: "", password: "" },
  onSubmit() {
    return undefined;
  },
});

void email;
void required;
