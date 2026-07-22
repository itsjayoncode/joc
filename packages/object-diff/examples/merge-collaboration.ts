/**
 * Three-way merge for collaborative drafts (local vs remote vs last sync).
 * Use `identityKey` when drafts contain identity-stable lists.
 */
import { merge } from "@jayoncode/object-diff/merge";

const lastSynced = {
  title: "Draft",
  body: "hello",
  items: [
    { id: 1, label: "one" },
    { id: 2, label: "two" },
  ],
};
const localDraft = {
  title: "Draft",
  body: "hello world",
  items: [
    { id: 1, label: "one-local" },
    { id: 2, label: "two" },
  ],
};
const remoteDraft = {
  title: "Draft v2",
  body: "hello",
  items: [
    { id: 2, label: "two" },
    { id: 3, label: "three" },
  ],
};

const result = merge(localDraft, remoteDraft, {
  base: lastSynced,
  strategy: "latest-wins",
  identityKey: "id",
});

console.log("merged:", result.value);
console.log("conflicts:", result.conflicts);
