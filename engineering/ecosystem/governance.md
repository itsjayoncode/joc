# JOC ecosystem governance

**Status:** Accepted  
**Audience:** Maintainers and contributors

This document is the public operating model for how the JOC ecosystem grows. Detailed history may exist in private construction notes; **this tree is the source of truth for accepted decisions.**

---

## Principles

1. **Independent packages first** — an app may install one `@jayoncode/*` package and get real value.
2. **Preserve independence unless coupling is proven** — every architectural decision must preserve package independence unless compelling, real-world evidence shows coupling creates more value than it costs.
3. **Shared infrastructure is earned** — see [ADR-0002](./adr/0002-shared-infrastructure-policy.md). Default: Keep Local or Defer. Extract only with matrix + ADR.
4. **No framework by accident** — see [ADR-0003](./adr/0003-no-framework-by-default.md). Platform Evolution is **Closed** until documented runtime pain exists.
5. **One flagship package at a time** — a new flagship must not begin incubation until the current one reaches Product Maturation. Adapters for an existing flagship do not count as a second flagship.
6. **Every package should leave the ecosystem better** — patterns, docs lessons, and validated composition notes — not only new surface area.
7. **Patterns over forced API uniformity** — e.g. teardown naming: [terminology-teardown.md](./terminology-teardown.md).
8. **Documentation and playgrounds are part of the product.**

---

## Package admission (Phase 8)

Before scaffolding a new flagship package, write and **Accept** a brief with:

Problem · Audience · Alternatives · Why JOC? · Relationship · Non-goals · v1 scope · Playground plan · Success criteria · Design principles

Accepted briefs live under [`briefs/`](./briefs/).

Current flagship status: [`briefs/storage.md`](./briefs/storage.md) (`@jayoncode/storage@0.3.0` **shipped**; Product Maturation). Follow-on brief: [`briefs/storage-v2.md`](./briefs/storage-v2.md) (**Accepted** — quota + transforms). Next Phase 8 incubation: **none** until a new flagship brief is Accepted.

Scaffold with maintainer tooling:

```bash
pnpm joc new package <kebab-name>
pnpm joc new playground <kebab-name>
```

---

## Architecture Convergence (Phase 5)

After the first three live packages, JOC audited shared-code candidates.

**Result:** zero **Extract** decisions. See [shared-candidates.md](./shared-candidates.md) and ADRs [0004](./adr/0004-defer-shared-base-error.md)–[0007](./adr/0007-reject-shared-store-after-audit.md).

`packages/shared` is **not** created until a future matrix row is marked Extract with an Accepted ADR.

---

## Platform Evolution (Phase 10)

**Status: Closed.**

No platform pain has been demonstrated. Packages remain independently installable. No shared runtime, plugin host, or signals store is justified. Reopen only with a written problem statement after multiple mature packages show unavoidable **runtime** duplication (not similar helpers).

---

## What stays private (`_construction/`)

Session progress logs, unfinished spikes, and scratch phase drafts may remain gitignored under `_construction/`. They must **not** be the only copy of Accepted ADRs, briefs, or matrices.

When a decision is Accepted, promote (or update) the public file in `engineering/ecosystem/` in the same change set whenever practical.
