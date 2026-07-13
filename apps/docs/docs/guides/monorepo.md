# Monorepo

JOC uses a pnpm workspace and Turborepo-based repository layout from day one.

## Why this matters

- shared rules can be centralized
- package relationships stay visible
- first-party apps can develop next to the packages they support
- contributors only need to learn one repository model

## Key principle

The monorepo exists to reduce accidental complexity, not to hide coupling. Public package boundaries are still important.
