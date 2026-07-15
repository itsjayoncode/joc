import { createForm, email, required } from "@jayoncode/form-intelligent";

const form = createForm({
  initialValues: { email: "" },
  validators: { email: [required, email] },
  onSubmit: async (values) => {
    console.log("submitted", values);
  },
});

const binding = form.field("email").bind();
console.log(binding.name, binding.value);
