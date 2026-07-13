# 005 Engineering Automation

## Why This Document Exists

This document explains the automation layer added in Phase 1.3 so contributors understand how repository quality is enforced before feature work begins.

## Automation Goals

- Keep validation consistent between local development and GitHub Actions.
- Fail fast when formatting, typing, tests, or package metadata drift.
- Prepare the repository for secure public collaboration without adding release automation too early.
- Keep the automation understandable enough that contributors can trust and maintain it.

## Workflow Design

### `quality.yml`

The reusable quality workflow is the core validation pipeline. It installs dependencies once, then runs:

- workspace health checks
- TypeScript validation
- ESLint
- Prettier checks
- Vitest with coverage
- typed package builds
- package integrity validation

### `ci.yml`

The CI workflow is the branch-oriented entrypoint for the reusable quality workflow.

### `pull-request.yml`

The pull request workflow ensures every proposed change goes through the same quality gates before merge.

### `codeql.yml`

The CodeQL workflow adds repository-level code scanning for JavaScript and TypeScript.

## Repository Health Scripts

The scripts in `scripts/` are intentionally plain Node.js checks so local development and CI use the same validation rules.

- `check-workspaces.mjs` verifies core workspace structure and manifest hygiene.
- `check-package-integrity.mjs` verifies package bootstrap consistency and package metadata rules.

## Coverage Strategy

Coverage remains local to the repository at this phase.

- Vitest generates HTML, LCOV, and JSON summary output in `coverage/`.
- CI uploads coverage artifacts for inspection.
- The repository is prepared for future external coverage reporting without requiring it today.

## Collaboration Assets

The `.github/` directory now contains:

- issue templates
- a pull request template
- Dependabot configuration
- recommended labels
- recommended security settings

These assets make the repository easier to contribute to before package implementation begins.
