# Shared Candidates Matrix

**Status:** Filled — Architecture Convergence; ADRs 0004–0007 **Accepted**  
**Verdict:** **Zero Extract**. Prefer **Keep Local** / **Defer**. Do **not** create `packages/shared`. Revisit Defer rows only after another mature package provides new evidence.

Canonical home: [`engineering/ecosystem/`](./README.md). Governance: [governance.md](./governance.md).

**Packages:** `@jayoncode/browser-lifecycle` (BL) · `@jayoncode/form-intelligence` (FI) · `@jayoncode/object-diff` (OD)

| Candidate                                   | Used by (packages) | Stable?       | Worth versioning?    | Decision                       | Why?                                                     | ADR                                                                                                                                                      | Notes |
| ------------------------------------------- | ------------------ | ------------- | -------------------- | ------------------------------ | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| Event emitter / bus                         | BL, FI (OD: none)  | yes (each)    | no (as shared)       | **Keep Local**                 | BL typed payload bus ≠ FI `FormEventBus`                 | [0005](./adr/0005-keep-local-event-buses.md)                                                                                                             |       |
| Base error type                             | BL, FI, OD         | yes (pattern) | maybe (private only) | **Defer**                      | Same shape; package-owned codes/names                    | [0004](./adr/0004-defer-shared-base-error.md)                                                                                                            |       |
| Snapshot helpers                            | BL, FI             | yes (each)    | no                   | **Keep Local**                 | Same method name; different contracts                    | —                                                                                                                                                        |       |
| Metrics / diagnostics                       | BL, FI, OD         | yes (each)    | no                   | **Keep Local**                 | Different domains                                        | —                                                                                                                                                        |       |
| Tiny utils — `cloneValue` / `isPlainObject` | FI, OD             | yes           | weak                 | **Defer**                      | Tiny overlap; wait for third consumer                    | [0006](./adr/0006-defer-clone-and-plain-object-utils.md)                                                                                                 |       |
| Path helpers                                | FI, OD             | yes (each)    | no                   | **Keep Local**                 | Different path models                                    | —                                                                                                                                                        |       |
| Equality helpers                            | FI, OD             | yes           | no                   | **Reject** (shared deep equal) | OD is the deep-compare product                           | —                                                                                                                                                        |       |
| Store / signals / scheduler                 | BL, FI             | n/a           | n/a                  | **Reject**                     | Premature platform                                       | [0002](./adr/0002-shared-infrastructure-policy.md), [0003](./adr/0003-no-framework-by-default.md), [0007](./adr/0007-reject-shared-store-after-audit.md) |       |
| Teardown naming                             | BL, FI             | yes           | n/a                  | **Keep Local**                 | See [terminology-teardown.md](./terminology-teardown.md) | —                                                                                                                                                        |       |

**Decisions:** `Extract` · `Defer` · `Keep Local` · `Reject`

## Phase 6 gate

| Condition                  | Met?   |
| -------------------------- | ------ |
| Any row marked **Extract** | **No** |

→ **`packages/shared` remains uncreated.** Storage incubation must not invent shared infra.
