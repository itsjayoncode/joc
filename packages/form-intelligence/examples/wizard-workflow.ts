/**
 * Multi-step wizard + debounced autosave + draft restore.
 *
 * Typecheck: `pnpm --filter @jayoncode/form-intelligence typecheck:examples`
 * Smoke: covered by `tests/integration/examples-smoke.test.ts`
 */
import { createForm, email, required } from "@jayoncode/form-intelligence";

const DRAFT_KEY = "fi-example:wizard-draft";

export async function runWizardWorkflowExample(): Promise<void> {
  const form = createForm({
    initialValues: {
      email: "",
      plan: "",
      card: "",
    },
    validators: {
      email: [required, email],
      plan: [required],
      card: [required],
    },
    workflow: {
      wizard: {
        initialStep: 0,
        steps: [
          { id: "account", fields: ["email"] },
          { id: "plan", fields: ["plan"] },
          { id: "payment", fields: ["card"] },
        ],
      },
      autosave: {
        enabled: true,
        debounceMs: 100,
        onSave: async (values) => {
          console.log("autosave", values);
        },
      },
      draft: {
        enabled: true,
        storageKey: DRAFT_KEY,
      },
    },
    async onSubmit(values) {
      console.log("checkout", values);
    },
  });

  form.setValue("email", "user@example.com");
  await new Promise((resolve) => setTimeout(resolve, 150));

  const advanced = await form.workflow.next();
  console.log("step after next?", form.state.workflow.currentStep, "advanced?", advanced);

  form.setValue("plan", "pro");
  await form.workflow.next();
  console.log("progress", form.state.workflow.progress);

  form.setValue("card", "4111111111111111");
  const submitted = await form.submit();
  console.log("submitted?", submitted);

  form.destroy();

  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(DRAFT_KEY);
  }
}
