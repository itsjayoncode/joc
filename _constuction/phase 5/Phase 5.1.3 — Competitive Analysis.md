# JOC ENGINEERING TASK
# Phase 5.1.3 — Competitive Analysis
# Package: @jayoncode/form-intelligent

===============================================================================
ROLE
===============================================================================

You are acting as a Competitive Intelligence Analyst and TypeScript Library Strategist.

You are NOT implementing code.

===============================================================================
DEPENDENCIES
===============================================================================

Requires

✓ Phase 5.1.1 — Product Vision

✓ Phase 5.1.2 — Problem Research

===============================================================================
OBJECTIVE
===============================================================================

Produce `packages/form-intelligent/engineering/002-competitive-analysis.md`.

The goal is **not** to replace existing libraries but to identify where `@jayoncode/form-intelligent` complements them.

===============================================================================
OUTPUT
===============================================================================

packages/form-intelligent/engineering/002-competitive-analysis.md

===============================================================================
LIBRARIES TO RESEARCH
===============================================================================

- React Hook Form
- TanStack Form
- Formik
- Final Form
- Conform
- Native HTML Forms + Constraint Validation API

Optional extended research:

- Felte, Vest, Superforms, Houseform

===============================================================================
COMPARISON DIMENSIONS
===============================================================================

For each library, analyze:

| Dimension | What to document |
|-----------|------------------|
| Bundle size | Core + typical setup |
| DX | API ergonomics, learning curve |
| Performance | Re-renders, subscription model |
| Adapters | Framework support |
| Validation | Built-in, schema, async |
| Workflow | Wizards, autosave, drafts, retry |
| Extensibility | Plugins, middleware |
| Headless | UI coupling level |
| Framework agnostic | Yes/no |

===============================================================================
STRATEGIC POSITIONING
===============================================================================

Document:

**Where competitors win**

- Field registration performance (RHF, TanStack)
- React ecosystem maturity (Formik)
- Remix/server actions (Conform)

**Where @jayoncode/form-intelligent wins**

- Framework-agnostic workflow engine
- First-class autosave / draft / wizard / retry primitives
- Optional adapters for RHF, Formik, TanStack (orchestration layer)
- JOC ecosystem integration (browser-lifecycle, object-diff)
- Native HTML workflow without framework

**Integration strategy**

```
@jayoncode/form-intelligent (workflow core)
        ↓ optional
@jayoncode/form-intelligent-react + react-hook-form adapter
```

Developers keep RHF for fields; `@jayoncode/form-intelligent` owns submit workflow, autosave, wizard steps.

===============================================================================
COMPARISON MATRIX
===============================================================================

Produce a feature matrix table (markdown) covering all libraries vs `@jayoncode/form-intelligent`.

Include honest "partial" and "none" ratings.

===============================================================================
RISKS
===============================================================================

- Perceived as "yet another form library"
- Adapter maintenance burden
- Competing feature creep into field binding

Mitigations for each.

===============================================================================
ACCEPTANCE CRITERIA
===============================================================================

✓ All listed libraries researched

✓ Clear complement-vs-compete narrative

✓ Matrix is actionable for API design

===============================================================================
STOP CONDITION
===============================================================================

STOP after Competitive Analysis.

Proceed to Phase 5.1.4 — Architecture.
