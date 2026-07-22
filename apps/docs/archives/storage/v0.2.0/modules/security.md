---
title: Security
description: Storage documentation for Security.
---

# Security

**Status:** Stable (guidance)

**Previous:** [Browser support](/packages/storage/modules/browser-support) · **Next:** [Changelog](/packages/storage/changelog)

## Trust boundary

Anything in `localStorage` / `sessionStorage` is readable by scripts on the origin. **XSS can read and write your envelopes.**

Storage does not encrypt, isolate tenants beyond namespace prefixes, or protect against same-origin script.

## Guidance

- Do not store passwords, tokens, or secrets
- TTL / schemaVersion are not security controls
- Treat snapshot JSON and diagnostics activity (keys) as sensitive
- Sanitize before injecting stored strings into the DOM

Encryption-at-rest would need a future explicit ADR — not a silent default.

See also: [browser-support.md](/packages/storage/modules/browser-support) · [faq.md](/packages/storage/modules/faq)
