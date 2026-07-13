# Installation

JOC currently targets contributors working directly in the monorepo.

## Requirements

- Node.js 20 or newer
- pnpm 10 or newer

## Install dependencies

```bash
npx pnpm@10.13.1 install
```

## Useful commands

```bash
npx pnpm@10.13.1 lint
npx pnpm@10.13.1 test
npx pnpm@10.13.1 docs:dev
npx pnpm@10.13.1 playground:dev
```

## Why the commands use pinned pnpm

The repository pins its package manager version to keep automation deterministic. If your globally installed pnpm is older, `npx pnpm@10.13.1 ...` is the safest path until your local environment is updated.
