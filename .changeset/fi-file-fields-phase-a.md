---
"@jayoncode/form-intelligence": minor
---

File fields: Phase A foundation (`File[]` DOM read/clear, non-persistent omit from drafts/history/offline), Phase B ergonomics (`accept` / `maxSize` / `minSize` / `maxFiles` / `minFiles`, `form.toFormData()` / `form.payload()`, file-shaped `bind()`), and Phase C opt-in `@jayoncode/form-intelligence/upload` (`uploadTransport` multipart progress + abort). Raise `core-login` entry-chunk gzip budget 27→28 KB (ADR-013) for file orchestration on the createForm graph; upload XHR remains `/upload`-only.
