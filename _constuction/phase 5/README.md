# Phase 5 — @jayoncode/form-intelligent

**A headless form workflow engine.**

Package name: `@jayoncode/form-intelligent`  
Positioning: Framework-agnostic orchestration for validation, submission, workflows, formatting, and state — **no UI rendering**.

---

## Differentiation

Do **not** compete with React Hook Form / TanStack Form on field registration.

**Focus on workflows:**

- Validation pipelines
- Autosave & draft recovery
- Multi-step wizards
- Conditional fields
- Offline submission & retry
- Business rule orchestration
- browser-lifecycle integration
- object-diff state snapshots

---

## Phase Index

### Phase 5.1 — Product Design

| Task | Document |
|------|----------|
| 5.1.1 | [Product Vision](./Phase%205.1.1%20—%20Product%20Vision.md) |
| 5.1.2 | [Problem Research](./Phase%205.1.2%20—%20Problem%20Research.md) |
| 5.1.3 | [Competitive Analysis](./Phase%205.1.3%20—%20Competitive%20Analysis.md) |
| 5.1.4 | [Architecture](./Phase%205.1.4%20—%20Architecture.md) |
| 5.1.5 | [Public API Design](./Phase%205.1.5%20—%20Public%20API%20Design.md) |
| 5.1.6 | [Validation Architecture](./Phase%205.1.6%20—%20Validation%20Architecture.md) |
| 5.1.7 | [Workflow Engine Design](./Phase%205.1.7%20—%20Workflow%20Engine%20Design.md) |
| 5.1.8 | [Adapter Architecture](./Phase%205.1.8%20—%20Adapter%20Architecture.md) |
| 5.1.9 | [Folder Architecture](./Phase%205.1.9%20—%20Folder%20Architecture.md) |
| 5.1.10 | [Development Roadmap](./Phase%205.1.10%20—%20Development%20Roadmap.md) |

### Phase 5.2 — Core Engine

| Task | Document |
|------|----------|
| 5.2.1 | [Foundation](./Phase%205.2.1%20—%20Foundation.md) |
| 5.2.2 | [Form Core](./Phase%205.2.2%20—%20Form%20Core.md) |
| 5.2.3 | [Field System](./Phase%205.2.3%20—%20Field%20System.md) |
| 5.2.4 | [Validation Engine](./Phase%205.2.4%20—%20Validation%20Engine.md) |
| 5.2.5 | [State Engine](./Phase%205.2.5%20—%20State%20Engine.md) |
| 5.2.6 | [Submission Engine](./Phase%205.2.6%20—%20Submission%20Engine.md) |
| 5.2.7 | [Workflow Engine](./Phase%205.2.7%20—%20Workflow%20Engine.md) |
| 5.2.8 | [Formatter Engine](./Phase%205.2.8%20—%20Formatter%20Engine.md) |
| 5.2.9 | [Plugin System](./Phase%205.2.9%20—%20Plugin%20System.md) |
| 5.2.10 | [Adapter System](./Phase%205.2.10%20—%20Adapter%20System.md) |
| 5.2.11 | [Testing](./Phase%205.2.11%20—%20Testing.md) |
| 5.2.12 | [Documentation](./Phase%205.2.12%20—%20Documentation.md) |
| 5.2.13 | [Examples](./Phase%205.2.13%20—%20Examples.md) |

### Phase 5.3 — Playground

| Task | Document |
|------|----------|
| 5.3.1 | [Playground Foundation](./Phase%205.3.1%20—%20Playground%20Foundation.md) |
| 5.3.2 | [Playground Core](./Phase%205.3.2%20—%20Playground%20Core.md) |
| 5.3.3 | [Dashboard](./Phase%205.3.3%20—%20Dashboard.md) |
| 5.3.4 | [Validation Playground](./Phase%205.3.4%20—%20Validation%20Playground.md) |
| 5.3.5 | [Submission Playground](./Phase%205.3.5%20—%20Submission%20Playground.md) |
| 5.3.6 | [Workflow Playground](./Phase%205.3.6%20—%20Workflow%20Playground.md) |
| 5.3.7 | [State Explorer](./Phase%205.3.7%20—%20State%20Explorer.md) |
| 5.3.8 | [Formatter Playground](./Phase%205.3.8%20—%20Formatter%20Playground.md) |
| 5.3.9 | [Adapter Playground](./Phase%205.3.9%20—%20Adapter%20Playground.md) |
| 5.3.10 | [Plugin Playground](./Phase%205.3.10%20—%20Plugin%20Playground.md) |
| 5.3.11 | [Performance](./Phase%205.3.11%20—%20Performance%20Playground.md) |
| 5.3.12 | [Developer Tools](./Phase%205.3.12%20—%20Developer%20Tools.md) |
| 5.3.13 | [Documentation Integration](./Phase%205.3.13%20—%20Documentation%20Integration.md) |
| 5.3.14 | [Playground Release](./Phase%205.3.14%20—%20Playground%20Release.md) |

### Phase 5.4 — Ecosystem

| Task | Document |
|------|----------|
| 5.4.1 | [React Adapter](./Phase%205.4.1%20—%20React%20Adapter.md) |
| 5.4.2 | [Vue Adapter](./Phase%205.4.2%20—%20Vue%20Adapter.md) |
| 5.4.3 | [Angular Adapter](./Phase%205.4.3%20—%20Angular%20Adapter.md) |
| 5.4.4 | [Svelte Adapter](./Phase%205.4.4%20—%20Svelte%20Adapter.md) |
| 5.4.5 | [Zod Adapter](./Phase%205.4.5%20—%20Zod%20Adapter.md) |
| 5.4.6 | [Yup Adapter](./Phase%205.4.6%20—%20Yup%20Adapter.md) |
| 5.4.7 | [Valibot Adapter](./Phase%205.4.7%20—%20Valibot%20Adapter.md) |
| 5.4.8 | [DevTools](./Phase%205.4.8%20—%20DevTools.md) |
| 5.4.9 | [VSCode Extension](./Phase%205.4.9%20—%20VSCode%20Extension.md) |
| 5.4.10 | [Ecosystem Release](./Phase%205.4.10%20—%20Ecosystem%20Release.md) |

---

## Target Package Structure

```
@jayoncode/form-intelligent          ← core (headless workflow engine)
├── validation
├── workflow
├── submission
├── state
├── formatter
├── plugins
└── adapters (interfaces)

Optional packages:
├── form-intelligent-react
├── form-intelligent-vue
├── form-intelligent-angular
├── form-intelligent-svelte
├── form-intelligent-zod
├── form-intelligent-yup
├── form-intelligent-valibot
├── form-intelligent-rhf
├── form-intelligent-formik
├── form-intelligent-tanstack
└── form-intelligent-devtools

apps/form-intelligent-playground
```

---

## Execution Order

1. Complete **Phase 5.1** engineering docs → `packages/form-intelligent/engineering/`
2. Implement **Phase 5.2** core
3. Build **Phase 5.3** playground
4. Ship **Phase 5.4** adapters incrementally (React + Zod first)

---

## Note on existing `packages/forms` stub

The monorepo currently has a `@jayoncode/forms` placeholder. Phase 5.1.9 documents whether to rename, replace, or redirect that stub to `@jayoncode/form-intelligent`.
