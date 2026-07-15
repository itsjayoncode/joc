import { diff, patch, applyPatch } from "@jayoncode/object-diff";

const before = { user: { name: "John", active: true } };
const after = { user: { name: "Jane", active: true }, role: "admin" };

const result = diff(before, after);
const operations = patch(result);
const next = applyPatch(before, operations);

console.log("changes:", result.changes);
console.log("patched:", next);
