# Schema adapter parity (Zod reference)

**Status:** Active  
**Date:** 2026-07-20  
**Related:** [016-maturity-backlog](./016-maturity-backlog.md) #7  
**User docs:** [docs/adapters.md](../docs/adapters.md#schema-adapter-contract-matrix)

## Goal

Yup / Valibot / AJV match Zod as the **reference** for the shared `SchemaAdapter` contract: field-path errors, nested/array mapping, async validation, and the shared `runSchemaAdapterContract` harness.

## Depth delivered (2026-07)

| Adapter       | Depth fix                                                                            |
| ------------- | ------------------------------------------------------------------------------------ |
| Yup           | Normalize `friends[0].name` → `friends.0.name`                                       |
| AJV           | Map `required` / `additionalProperties` via `params` (not `_form` for missing props) |
| Valibot / Zod | Nested + array contract tests; shared harness                                        |
| Core          | Nested adapter errors kept when `listAllPaths` returns a single parent path          |

## Non-goals

- Inferring Presentation `required` from Zod/Yup/AJV (still deferred for SchemaAdapter schemas — ADR-018 covers field-schema / built-in `required` only)
- New schema libraries
