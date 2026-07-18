import { createForm, email, required } from "@jayoncode/form-intelligence";

createForm({
  initialValues: { email: "", password: "" },
  onSubmit() {
    return undefined;
  },
});

void email;
void required;
