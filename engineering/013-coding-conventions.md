# 013 Coding Conventions

## Why This Document Exists

This document defines the naming, export, and file-level conventions that keep JOC packages consistent.

## File and Folder Naming

- package folders use kebab-case
- source files use kebab-case
- test files use `.test.ts` or `.spec.ts`
- example files and docs files use kebab-case

## Code Symbol Naming

- functions use `camelCase`
- variables use `camelCase`
- constants use `UPPER_SNAKE_CASE` only when they are true constants shared across a module
- types, interfaces, classes, and errors use `PascalCase`
- enums should be avoided unless they provide real clarity over union types

## Export Standards

- prefer named exports for public APIs
- avoid default exports
- use `src/index.ts` as the main public barrel
- add subpath exports only when there is a clear long-term maintenance case
- do not expose internal folders by accident

## Tree Shaking Rules

- keep exports explicit
- avoid side-effectful module initialization
- set `sideEffects` accurately in package metadata
- do not export large all-in-one namespaces when focused exports are clearer

## Public vs Internal Code

- code intended for public use must flow through the public export surface
- internal helpers should remain internal unless promoted intentionally
- experimental APIs should not appear stable by naming or export location

## Style Expectations

- favor small functions and clear control flow
- keep modules focused
- prefer clarity over cleverness
- add comments only when they clarify non-obvious intent
