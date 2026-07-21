---
title: Ecosystem governance
description: How JOC decides package independence, shared infrastructure, expansion, and platform work.
---

# Ecosystem governance

JOC grows as a **toolkit of independent libraries**. Accepted decisions for contributors live in the repository under [`engineering/ecosystem/`](https://github.com/itsjayoncode/joc/tree/master/engineering/ecosystem).

## Read these

| Doc                                                                                                             | Why                                                 |
| --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| [ROADMAP.md](https://github.com/itsjayoncode/joc/blob/master/ROADMAP.md)                                        | Phase model + current era                           |
| [governance.md](https://github.com/itsjayoncode/joc/blob/master/engineering/ecosystem/governance.md)            | Principles + incubation rules                       |
| [Shared candidates](https://github.com/itsjayoncode/joc/blob/master/engineering/ecosystem/shared-candidates.md) | Why there is no `packages/shared` yet               |
| [Storage brief](https://github.com/itsjayoncode/joc/blob/master/engineering/ecosystem/briefs/storage.md)        | Next flagship package                               |
| [ADRs](https://github.com/itsjayoncode/joc/tree/master/engineering/ecosystem/adr)                               | Independence, shared infra, no framework by default |

## Short version

- Install one package; compose more in app code ([composition guide](/guides/composition)).
- Do not force identical APIs across packages ([teardown naming](https://github.com/itsjayoncode/joc/blob/master/engineering/ecosystem/terminology-teardown.md)).
- One new flagship at a time, only with an accepted brief.
- No shared platform runtime until real multi-package pain is documented (Phase 10 Closed).
