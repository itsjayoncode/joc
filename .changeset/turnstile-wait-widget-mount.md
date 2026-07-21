---
"@jayoncode/form-intelligence": patch
---

Turnstile: keep `captchaLoading` until the challenge iframe (or response field) is mounted in the container, so `form.ui.canSubmit` stays false for the visible widget load—not only the script/`render()` call.
