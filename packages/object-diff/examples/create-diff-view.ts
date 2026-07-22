/**
 * Fluent DiffResult view — explain, filter, serialize, patch.
 */
import { diff } from "@jayoncode/object-diff";
import { createDiffView } from "@jayoncode/object-diff/view";

const before = { user: { name: "Ada" }, password: "secret", items: ["A", "B", "C"] };
const after = {
  user: { name: "Grace" },
  password: "secret",
  role: "admin",
  items: ["B", "C", "A"],
};

const view = createDiffView(diff(before, after, { detectMoves: true })).exclude(["password"]);

console.log(view.summary());
console.log(view.explain({ format: "human" }));
console.log(view.serialize("markdown"));
console.log(view.patch());
