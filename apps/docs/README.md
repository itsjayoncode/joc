# Docs App

This application hosts the VitePress documentation platform for the JOC ecosystem.

It contains:

- the public documentation homepage
- getting-started and contributor guides
- package documentation templates
- roadmap and changelog sections
- the information architecture that future package docs will inherit

## Authoring conventions

Source of truth for live packages lives in `packages/*/docs/`. Sync with `pnpm docs:sync`.

See [DOCUMENTATION_CONVENTIONS.md](./DOCUMENTATION_CONVENTIONS.md) for hub vs module templates and what to preserve (playground links, changelogs).
