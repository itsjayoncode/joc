# JOC ENGINEERING TASK
# Phase 1.2 — Developer Tooling Foundation

You are acting as a Principal TypeScript Architect, Build Engineer, Open Source Maintainer, and DX (Developer Experience) Engineer.

Your responsibility is NOT to implement any library features.

Your responsibility is to establish the engineering standards that every future JOC package will inherit.

Think like the maintainers of:

- TypeScript
- Vite
- VueUse
- TanStack
- Zod
- Vitest

Your goal is to create a professional developer experience that scales to dozens of packages.

---

# CURRENT STATUS

The repository foundation already exists.

The monorepo is configured.

Folder structure is complete.

This milestone only adds developer tooling.

---

# OBJECTIVES

Configure:

- TypeScript
- ESLint
- Prettier
- Vitest

Nothing else.

Do NOT configure

- GitHub Actions
- Release system
- Documentation
- Playground
- Browser Lifecycle Manager implementation

Those belong to later milestones.

---

# ENGINEERING PHILOSOPHY

JOC is an ecosystem.

Every package should feel identical.

Developers should never have to configure TypeScript separately for each package.

Everything should inherit shared standards.

Avoid duplicated configuration.

---

# TYPESCRIPT

Configure TypeScript for a modern reusable library ecosystem.

Requirements

✓ Strict mode enabled

✓ Zero use of "any"

✓ Composite projects

✓ Incremental builds

✓ Declaration files

✓ Source maps

✓ NodeNext module resolution

✓ Path aliases

✓ Project references where appropriate

✓ Fast incremental compilation

The architecture should support

- Browser packages
- Node packages
- Shared packages
- Future adapters

Create

tsconfig.base.json

Root configuration.

Each package should extend it.

Do NOT duplicate compiler options.

Also create

tsconfig.json

for

packages/browser-lifecycle

packages/shared

Only minimal bootstrap.

No implementation.

---

# ESLINT

Configure modern Flat Config.

No deprecated configuration.

Use

typescript-eslint

Requirements

✓ Type-aware linting

✓ Import ordering

✓ Consistent style

✓ Unused imports detection

✓ No console (except allowed examples)

✓ Prefer const

✓ Explicit exports

✓ No implicit any

The configuration must be reusable across every package.

Create

eslint.config.js

at the repository root.

Packages should automatically inherit it.

---

# PRETTIER

Create a professional opinionated formatting configuration.

Requirements

Consistent

Readable

Minimal

No project-specific hacks.

Generate

prettier.config.js

.editorconfig

.prettierignore

---

# VITEST

Configure Vitest for the monorepo.

Requirements

Support

Future browser packages

Future Node packages

Coverage

Fast execution

Workspace support

Path aliases

Generate

vitest.config.ts

Create

tests/

with an initial structure.

Create

test-utils/

for future shared utilities.

No feature tests.

Only bootstrap.

---

# PACKAGE CONFIGURATION

Update package.json files appropriately.

Do NOT install unnecessary dependencies.

Only install what is required for

TypeScript

ESLint

Prettier

Vitest

Keep dependency count low.

---

# DIRECTORY STRUCTURE

After this milestone the repository should resemble

joc/

├── packages/
│
├── tests/
│   ├── fixtures/
│   ├── mocks/
│   ├── helpers/
│   └── README.md
│
├── tsconfig.base.json
├── eslint.config.js
├── prettier.config.js
├── vitest.config.ts
├── .editorconfig
├── .prettierignore
└── package.json

---

# CODE QUALITY

All configurations must be

Minimal

Readable

Well documented

Future-proof

Do not over-engineer.

Prefer clarity over cleverness.

---

# OUTPUT REQUIREMENTS

Work incrementally.

For each tool

1.

Explain why this tool exists.

2.

Explain why the chosen configuration is appropriate for an open-source library ecosystem.

3.

Generate the configuration.

4.

Explain any tradeoffs.

Never dump all files at once.

Review each configuration before moving to the next.

---

# FINAL VALIDATION

Before finishing

Review the repository.

Ensure

✓ Every package inherits TypeScript correctly.

✓ ESLint works across the monorepo.

✓ Prettier formats consistently.

✓ Vitest can discover tests.

✓ No duplicated configuration exists.

✓ The repository remains lightweight.

The output should leave the repository in a professional, production-ready state for Phase 1.3.