---
title: Captcha
description: Form Intelligence documentation for Captcha.
---

# CAPTCHA

Obtain a provider token in the **Security Stage** before `onSubmit` — without owning field validation or presentation.

**Related:** [Submission](/packages/form-intelligence/modules/submission) · [Plugins](/packages/form-intelligence/modules/plugins) · [Entrypoints](/packages/form-intelligence/modules/entrypoints)

::: tip Playground
[CAPTCHA lab →](/playground/form-intelligence/captcha) — simulate success/failure and inspect `meta.security.captcha`.
:::

## Import path

```ts
import {
  captcha,
  turnstile,
  recaptcha,
  hcaptcha,
  mockCaptcha,
} from "@jayoncode/form-intelligence/captcha";
```

| Need                         | Import                                 |
| ---------------------------- | -------------------------------------- |
| Plugin + providers           | `@jayoncode/form-intelligence/captcha` |
| Explain submit block reasons | `form.ui.explain("submit")` via `/ui`  |

## Basic usage

```ts
import { createForm } from "@jayoncode/form-intelligence";
import { captcha, turnstile } from "@jayoncode/form-intelligence/captcha";

createForm({
  target: "#contact",
  plugins: [
    captcha(
      turnstile({
        siteKey: "…",
        container: "#captcha", // best practice; omit for auto-placement
      }),
    ),
  ],
  onSubmit(values, meta) {
    const captcha = meta?.security?.captcha;
    // Send captcha.token to your API for server-side verification
  },
});
```

```html
<form id="contact">
  <!-- fields -->
  <div id="captcha"></div>
  <button type="submit">Send</button>
</form>
```

## Providers

| Factory         | Vendor               | Kind                         |
| --------------- | -------------------- | ---------------------------- |
| `turnstile()`   | Cloudflare Turnstile | widget                       |
| `recaptcha()`   | Google reCAPTCHA     | v3 invisible or v2 widget    |
| `hcaptcha()`    | hCaptcha             | widget (or hybrid invisible) |
| `mockCaptcha()` | — (tests / lab)      | invisible by default         |

Token shape is always the same: `meta.security.captcha` → `{ provider, token, expiresAt? }`.

### Turnstile

Cloudflare Turnstile widget. Pass `container` for a mount host; omit it to auto-place before the submit button.

```ts
captcha(
  turnstile({
    siteKey: "…",
    container: "#captcha",
    theme: "auto",
    size: "normal",
    action: "contact", // optional Cloudflare action
    timeoutMs: 15_000,
  }),
);
```

| Option              | Type                                       | Notes                                |
| ------------------- | ------------------------------------------ | ------------------------------------ |
| `siteKey`           | `string`                                   | Required                             |
| `container`         | selector \| element \| `() => HTMLElement` | Manual mount (recommended)           |
| `theme`             | `"light"` \| `"dark"` \| `"auto"`          | Widget appearance                    |
| `size`              | `"normal"` \| `"compact"` \| `"flexible"`  | Widget size                          |
| `action`            | `string`                                   | Optional Cloudflare action label     |
| `timeoutMs`         | `number`                                   | Abort `execute()` → `captchaTimeout` |
| `scriptUrl` / `sdk` | —                                          | Tests / mirrors                      |

Vendor docs: [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/).

### reCAPTCHA

Google reCAPTCHA — **v3** (invisible) or **v2** (checkbox / invisible widget).

**Version selection:** `version: "v2" | "v3"`. If omitted, `action` present → **v3**, otherwise **v2**.

#### v3 (invisible)

No widget, no `container` / `theme`. `action` names the user intent for Google scoring; verify it again on the server.

```ts
captcha(
  recaptcha({
    siteKey: "…",
    action: "contact", // e.g. login | signup | contact
  }),
);
```

On the server, after Google siteverify, reject the request if the returned `action` does not match (e.g. expected `"contact"`).

#### v2 (widget)

```ts
captcha(
  recaptcha({
    siteKey: "…",
    version: "v2",
    container: "#captcha",
    theme: "dark",
    size: "normal", // "normal" | "compact" | "invisible"
  }),
);
```

| Option              | Type                                       | Notes                                                  |
| ------------------- | ------------------------------------------ | ------------------------------------------------------ |
| `siteKey`           | `string`                                   | Required                                               |
| `version`           | `"v2"` \| `"v3"`                           | Defaults from `action` (see above)                     |
| `action`            | `string`                                   | **v3:** required for meaningful scoring; ignored by v2 |
| `container`         | mount host                                 | **v2** only                                            |
| `theme`             | `"light"` \| `"dark"`                      | **v2** only                                            |
| `size`              | `"normal"` \| `"compact"` \| `"invisible"` | **v2** only                                            |
| `timeoutMs`         | `number`                                   | Abort `execute()` → `captchaTimeout`                   |
| `scriptUrl` / `sdk` | —                                          | Tests / mirrors                                        |

Vendor docs: [reCAPTCHA](https://developers.google.com/recaptcha).

### hCaptcha

hCaptcha widget (or hybrid when `size: "invisible"`).

```ts
captcha(
  hcaptcha({
    siteKey: "…",
    container: "#captcha",
    theme: "light",
    size: "normal",
  }),
);
```

| Option              | Type                                       | Notes                                         |
| ------------------- | ------------------------------------------ | --------------------------------------------- |
| `siteKey`           | `string`                                   | Required                                      |
| `container`         | mount host                                 | Manual mount (recommended)                    |
| `theme`             | `"light"` \| `"dark"`                      | Widget appearance                             |
| `size`              | `"normal"` \| `"compact"` \| `"invisible"` | `"invisible"` → hybrid (`render` + `execute`) |
| `timeoutMs`         | `number`                                   | Abort `execute()` → `captchaTimeout`          |
| `scriptUrl` / `sdk` | —                                          | Tests / mirrors                               |

Vendor docs: [hCaptcha](https://docs.hcaptcha.com/).

### mockCaptcha

Deterministic provider for unit tests and the playground lab — **no vendor SDK**.

```ts
captcha(
  mockCaptcha({
    provider: "mock",
    token: "test-token",
    kind: "invisible", // default — or "widget"
    failWith: "captchaFailed", // optional — throws CaptchaError
    delayMs: 200, // optional — execute latency (captchaPending)
    loadDelayMs: 500, // optional — load latency (captchaLoading)
    expiresAt: Date.now() + 60_000, // optional token expiry
    // execute: async () => ({ provider: "mock", token: "custom" }),
  }),
);
```

| Option         | Type                          | Notes                                            |
| -------------- | ----------------------------- | ------------------------------------------------ |
| `provider`     | `string`                      | Default `"mock"`                                 |
| `token`        | `string`                      | Default `"mock-token"`                           |
| `kind`         | `"invisible"` \| `"widget"`   | Default `"invisible"`                            |
| `failWith`     | captcha reason                | Throws `CaptchaError` with that reason           |
| `delayMs`      | `number`                      | Artificial latency before execute resolve/reject |
| `loadDelayMs`  | `number`                      | Artificial latency during `load()` / prepare     |
| `failLoadWith` | captcha reason                | Fail during `load()` (e.g. `captchaUnavailable`) |
| `expiresAt`    | `number`                      | Copied onto the returned token                   |
| `execute`      | `() => Promise<CaptchaToken>` | Full override of execute behavior                |

### Custom providers

Implement `CaptchaProvider` (`load`, optional `render`, `execute`, optional `reset` / `destroy`) and pass the result to `captcha()`.

For non-CAPTCHA security (CSRF, OTP, …), register a custom Security Stage via `registerSecurityStage` from `@jayoncode/form-intelligence/submission` — see [Custom Security Stage](#custom-security-stage) below.

## Pipeline

```text
Submit → hard guards → Validation → Security Stage (CAPTCHA) → beforeSubmit → onSubmit
```

On failure the stage **aborts** (no `onSubmit`). Reasons appear in `form.ui.explain("submit")`:

| Reason               | Meaning                                      |
| -------------------- | -------------------------------------------- |
| `captchaLoading`     | SDK / widget still initializing (`prepare`)  |
| `captchaPending`     | Challenge in flight during submit            |
| `captchaFailed`      | User challenge failed / dismissed            |
| `captchaExpired`     | Token expired                                |
| `captchaTimeout`     | Challenge timed out                          |
| `captchaUnavailable` | SDK / network / provider infrastructure fail |

`captchaLoading` is set while the Security Stage eagerly loads and mounts the provider. Prefer `disabled={!form.ui.canSubmit}` (or adapter submit helpers) so the button stays locked until the widget is ready — no DOM observers required.

These `captcha*` reasons always hard-block `form.ui.canSubmit` (contributor `security`) — they are **not** gated by `disableSubmitWhen`. See [UI projection](/packages/form-intelligence/modules/ui-projection#hard-guards-vs-ux-policy).

Server verification stays **out of this package** — only the browser token is acquired.

### Errors / typing failures

```ts
import {
  CaptchaError,
  isCaptchaError,
  captchaReasonFromUnknown,
} from "@jayoncode/form-intelligence/captcha";

try {
  // provider execute path
} catch (error) {
  if (isCaptchaError(error)) {
    console.log(error.reason); // CaptchaBlockReason
  }
  const reason = captchaReasonFromUnknown(error);
  // TimeoutError → captchaTimeout; otherwise captchaUnavailable when not CaptchaError
}
```

| Helper                     | Role                                                 |
| -------------------------- | ---------------------------------------------------- |
| `CaptchaError`             | Typed error with `.reason`                           |
| `isCaptchaError(error)`    | Narrow to `CaptchaError`                             |
| `captchaReasonFromUnknown` | Map unknown failures → block reason for explain / UI |

### Custom Security Stage

`captcha()` registers through `registerSecurityStage`. Authors can register one stage handler per form (last registration wins) for CSRF / OTP-style work:

```ts
import { registerSecurityStage } from "@jayoncode/form-intelligence/submission";

let pending = false;

const unregister = registerSecurityStage(
  form,
  async ({ signal }) => {
    pending = true;
    try {
      const ok = await verifyOtp(signal);
      if (!ok) {
        return { ok: false, reasons: ["otpFailed"] };
      }
      // Optional: attach typed captcha-shaped payload, or omit `security`
      return { ok: true };
    } finally {
      pending = false;
    }
  },
  {
    explainReasons: () => (pending ? ["otpPending"] : []),
  },
);
```

One stage registration per form (last writer wins). Prefer CAPTCHA factories for CAPTCHA. Use `registerSecurityStage` for other gates in the same slot (after validation, before `beforeSubmit` / `onSubmit`). Soft explain reasons you invent should also be understood by your UI — only `captcha*` reasons are built into `/ui` hard-block mapping today.

| Export (from `/submission`)      | Role                                                             |
| -------------------------------- | ---------------------------------------------------------------- |
| `registerSecurityStage`          | Register one stage handler per form                              |
| `runSecurityStage`               | Invoked internally by `submit()` — you rarely call this directly |
| `getSecurityStageExplainReasons` | Soft reasons surfaced in `form.ui.explain("submit")`             |

Full table with `evaluateSubmissionGuard` and low-level submit internals: [Submission → Security Stage API](/packages/form-intelligence/modules/submission#security-stage-api).

### Offline queue

When `workflow.offlineQueue` is enabled and the device is offline:

1. **Enqueue** runs the Security Stage first — failed captcha does not queue.
2. **Flush** re-runs the Security Stage for a **fresh** token and passes `meta.security.captcha` into `onSubmit`.

Enqueue-time tokens are not stored (they expire). Flush failure keeps the item pending.

## See also

- [Plugin author guide](/packages/form-intelligence/modules/plugins#plugin-author-guide)
- Construction ADR: `_construction/form-intelligence/4. Captcha/` (repo maintainers)
