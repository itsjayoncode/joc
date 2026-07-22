---
"@jayoncode/form-intelligence": minor
---

Draft restore: add `onRestoreDecline` (`keep` | `clear` | `remember`) and allow `onRestorePrompt` to return `"defer"` so apps can skip restore without clearing or remembering a decline. `remember` suppresses re-prompts for the same draft content until values/step change; `clearDraft` also removes the remember marker.
