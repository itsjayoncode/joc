# Security Policy

## Supported versions

JOC publishes multiple `@jayoncode/*` packages on npm. Security fixes are prioritized for **the latest release** of each actively maintained package on its current major line.

| Package family                              | Support focus            |
| ------------------------------------------- | ------------------------ |
| `@jayoncode/browser-lifecycle` (+ adapters) | Latest published version |
| `@jayoncode/form-intelligence` (+ adapters) | Latest published version |
| `@jayoncode/object-diff`                    | Latest published version |

Older minor/patch releases may receive fixes at maintainer discretion (especially for severe issues). Pre-1.0 packages may include breaking changes when a fix requires API correction; we will document migration notes in the release.

## Reporting a vulnerability

**Please do not open public GitHub issues** for suspected security vulnerabilities.

Prefer one of these private channels:

1. **GitHub private vulnerability reporting** (if enabled on the repository): use **Security → Report a vulnerability** on [itsjayoncode/joc](https://github.com/itsjayoncode/joc)
2. **Email:** [jayoncode@gmail.com](mailto:jayoncode@gmail.com) with subject starting with `[SECURITY]`

Include as much of the following as you can:

- Affected package name(s) and version(s)
- A clear description of the concern
- Reproduction steps or a minimal proof-of-concept (no weaponized exploit required)
- Impact assessment (confidentiality, integrity, availability; who can trigger it)
- Suggested mitigation if known
- Whether you are OK being credited in release notes

## What to expect

| Step              | Typical timing                                                               |
| ----------------- | ---------------------------------------------------------------------------- |
| Acknowledgement   | Within a few business days                                                   |
| Initial triage    | Confirm severity and affected packages                                       |
| Fix / mitigation  | Coordinated with a private or staged disclosure                              |
| Public disclosure | After a fix is available (or risk is accepted), via release notes / advisory |

We will not take legal action against good-faith reporters who follow this policy and avoid privacy violations, data destruction, or service disruption.

## Out of scope (usually)

Unless they demonstrate a realistic security impact on consumers of published packages, the following are generally **not** treated as vulnerabilities:

- Issues that require already-compromised developer machines or malicious maintainer access
- Social engineering of maintainers or npm account takeover (report platform abuse to GitHub / npm)
- Denial of service that only affects pathological local misuse without a practical remote vector
- Vulnerabilities solely in third-party dependencies — please report those upstream; we track Dependabot / advisories and upgrade promptly when relevant
- Missing documentation or non-security bugs (use normal issues / PRs)

## Security practices in this repository

- Dependency alerts and updates (Dependabot)
- Code scanning (CodeQL) in CI
- Secret scanning / push protection where enabled on GitHub
- Package boundary and integrity checks before release
- Independent SemVer lines so security patches can ship without waiting on unrelated packages

Repository hardening recommendations for maintainers live in [`.github/SECURITY_SETTINGS.md`](./.github/SECURITY_SETTINGS.md).

## Prefer responsible disclosure

If you find a vulnerability in a JOC package used in production, thank you for reporting it privately. Coordinated disclosure helps us protect users while we prepare a fix and release.
