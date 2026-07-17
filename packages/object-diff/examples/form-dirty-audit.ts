/**
 * Form-style dirty check + markdown audit log.
 * Mirrors how form-intelligent (or any form layer) can consume object-diff.
 */
import { diff, hasChanges, serialize } from "@jayoncode/object-diff";

const saved = { email: "ada@example.com", role: "admin" };
const draft = { email: "ada@example.com", role: "editor" };

if (hasChanges(saved, draft)) {
  const audit = serialize(diff(saved, draft), "markdown", { title: "Form changes" });
  console.log(audit);
}
