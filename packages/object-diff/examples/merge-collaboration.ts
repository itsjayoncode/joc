/**
 * Three-way merge for collaborative drafts (local vs remote vs last sync).
 */
import { merge } from "@jayoncode/object-diff/merge";

const lastSynced = { title: "Draft", body: "hello" };
const localDraft = { title: "Draft", body: "hello world" };
const remoteDraft = { title: "Draft v2", body: "hello" };

const result = merge(localDraft, remoteDraft, {
  base: lastSynced,
  strategy: "latest-wins",
});

console.log("merged:", result.value);
console.log("conflicts:", result.conflicts);
