/**
 * Fluent DiffResult view — discoverability without mutating diff() output.
 */
import { diff } from "@jayoncode/object-diff";
import { createDiffView } from "@jayoncode/object-diff/view";

const before = { user: { name: "Ada" }, password: "secret" };
const after = { user: { name: "Grace" }, password: "secret", role: "admin" };

const view = createDiffView(diff(before, after)).exclude(["password"]);

console.log(view.summary());
console.log(view.serialize("human"));
console.log(view.patch());
