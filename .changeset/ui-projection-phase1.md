---
"@jayoncode/form-intelligence": minor
"@jayoncode/form-intelligence-react": minor
"@jayoncode/form-intelligence-vue": minor
"@jayoncode/form-intelligence-angular": minor
---

Add derived UI projection (`/ui`) and submission hard guards (`submissionGuard()` enforced in `submit()`). React/Vue/Angular/DOM adapters use `form.ui.canSubmit` / `showError` / `status` for button and field UX. Raise `core-login` entry-chunk gzip budget 24→26 KB (ADR-013) for the always-on projection graph. Remove `@jayoncode/form-intelligent*` compatibility packages from the monorepo (EOL — migrate to `form-intelligence*`).
