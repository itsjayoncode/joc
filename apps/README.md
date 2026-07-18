# Apps

This directory contains first-party applications that support the JOC ecosystem.

Current applications include:

- `docs` — official VitePress documentation site
- `playground` — lightweight local package validation
- `browser-session-playground` — Browser Lifecycle engineering shell
- `form-intelligence-playground` — Form Intelligence engineering shell
- `object-diff-playground` — Object Diff engineering shell
- `website` — reserved for the future public project presence

These apps support the ecosystem without containing package feature implementations themselves. Each long-lived playground follows the same pattern:

- shell UI in `src/layouts`, `src/components`, `src/pages`
- package integration boundary in `src/lib/`
- version metadata injected through `vite.config.ts` `define` constants
