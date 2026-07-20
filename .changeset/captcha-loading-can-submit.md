---
"@jayoncode/form-intelligence": minor
"@jayoncode/form-intelligence-react": patch
"@jayoncode/form-intelligence-vue": patch
"@jayoncode/form-intelligence-angular": patch
"@jayoncode/form-intelligence-svelte": patch
---

Surface `captchaLoading` while CAPTCHA prepare runs so `form.ui.canSubmit` stays false until the provider is ready; notify subscribers on Security Stage state transitions. Playground CAPTCHA lab: Loading → ready scenario + submit gated on `canSubmit`. `mockCaptcha` gains `loadDelayMs` / `failLoadWith`.
