# First Package

The first public package in JOC should validate the ecosystem rules, not bypass them.

## Before a package is implemented

- the package responsibility should be clear
- documentation expectations should be known
- workspace conventions should already exist
- release automation should be mature enough to support public publication

## Expected package documentation structure

Every package page in JOC is designed to grow into the same shape:

1. Introduction
2. Installation
3. Quick Start
4. API
5. Events
6. Examples
7. Configuration
8. Browser Support
9. FAQ
10. Migration

This template is already reflected in the placeholder package pages.

## Engineering blueprint

The first production package should start from the repository package blueprint:

- `templates/package-template/`
- `engineering/008-package-architecture.md`
- `engineering/009-api-design-guidelines.md`
- `engineering/016-package-checklist.md`

## Versioned documentation (default)

New packages that ship a docs site section must enable versioned archives from day one (version switcher + frozen `/packages/<id>/v{version}/` snapshots). Do not ship a docs section without registering the package in `DOC_VERSIONED_PACKAGES` and bootstrapping the first archive on release.

See the monorepo policies:

- `engineering/014-versioning-policy.md` — versioned docs archives required by default
- `engineering/017-package-doc-learning-path.md` — new-package docs checklist
