/**
 * Vue adapter example — illustration only (needs a Vue app shell).
 *
 * Install peers:
 *   npm install @jayoncode/form-intelligence @jayoncode/form-intelligence-vue vue
 *
 * For a live UI, use apps/form-intelligence-playground.
 */
import { defineComponent, h } from "vue";
import { useForm } from "@jayoncode/form-intelligence-vue";

export const LoginForm = defineComponent({
  name: "LoginForm",
  setup() {
    const form = useForm({
      schema: {
        email: "email",
        password: "password",
      },
      async onSubmit(values) {
        console.log("vue submit", values);
      },
    });

    return () => {
      const formProps = form.form();
      return h("form", { ref: formProps.ref, noValidate: formProps.noValidate }, [
        h("input", { ...form.field("email"), type: "email" }),
        h("input", { ...form.field("password"), type: "password" }),
        h("button", form.submit(), "Sign in"),
      ]);
    };
  },
});
