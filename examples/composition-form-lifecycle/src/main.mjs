import { createForm } from "@jayoncode/form-intelligence";
import { hasChanges } from "@jayoncode/object-diff";

/**
 * Composition without coupling (Node-friendly demo).
 *
 * Browser Lifecycle needs a DOM for real `page:hidden` / `session:idle` signals.
 * This example focuses on the Form Intelligence + Object Diff half of the hide+dirty
 * recipe, and prints the lifecycle wiring you would use in a browser app.
 *
 * Full browser recipes: Form Intelligence → Patterns → Composition.
 */
const defaults = { title: "", body: "" };

const drafts = [];

const form = createForm({
  initialValues: { ...defaults },
  workflow: {
    draft: {
      enabled: true,
      storageKey: "composition-demo:draft",
      adapter: {
        load: () => null,
        save: (_key, value) => {
          drafts.push(value);
        },
        clear: () => {
          drafts.length = 0;
        },
      },
    },
  },
});

form.setValue("title", "Composition demo");
form.setValue("body", "Wired without a shared runtime.");

const live = form.getValues();
const dirty = hasChanges(defaults, live);
console.log("dirty?", dirty);

if (dirty) {
  form.saveDraft();
  console.log("draft persisted count:", drafts.length);
}

console.log(`
Browser wiring (run in a document context):

  import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";

  const lifecycle = createBrowserLifecycle({ autoStart: true, idleTimeout: 90_000 });
  lifecycle.on("session:idle", () => form.saveDraft());
  lifecycle.on("page:hidden", () => {
    if (hasChanges(defaults, form.getValues())) form.saveDraft();
  });
  // App owns teardown:
  // lifecycle.dispose();
  // form.destroy();
`);

form.destroy();
console.log("composition example complete");
