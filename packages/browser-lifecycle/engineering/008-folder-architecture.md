# 008 Folder Architecture

## Why This Document Exists

This document defines the internal package architecture for Browser Lifecycle Manager. It is the maintainability blueprint for implementation and contributor onboarding. It explains the folder tree, ownership boundaries, dependency rules, export policy, naming strategy, and scalability expectations before implementation proceeds.

Related documents:

- [003 System Architecture](./003-system-architecture.md)
- [004 Public API Design](./004-public-api-design.md)
- [005 Event Specification](./005-event-specification.md)
- [006 Configuration Design](./006-configuration-design.md)
- [007 Runtime Compatibility](./007-runtime-compatibility.md)
- [009 Development Roadmap](./009-development-roadmap.md)

## 1. Architecture Philosophy

### Why Browser Lifecycle Manager Is Modular

Browser Lifecycle Manager sits at the intersection of browser APIs, derived lifecycle policy, event delivery, and extensibility. Those concerns change at different rates and fail for different reasons. A modular architecture keeps those responsibilities isolated so that implementation and maintenance stay understandable over time.

### Why Responsibilities Are Separated

Responsibility separation matters because:

- browser capability access should not leak into public API layers
- derived lifecycle logic should not be embedded in utilities or constants
- plugin extensibility should not distort core invariants
- event delivery should remain reviewable as a first-class subsystem

### Why Internal Modules Should Remain Isolated

Each browser capability has unique quirks, support constraints, and fallback rules. Isolation prevents:

- accidental cross-module coupling
- fragile shared mutable state
- browser-specific logic leaking through unrelated subsystems

### Why Composition Is Preferred Over Coupling

The package should be assembled from cooperating units with narrow responsibilities. Composition makes it easier to:

- replace internals without rewriting the whole package
- add new modules without destabilizing old ones
- test low-level behavior independently

### Architectural Goals

- single responsibility per folder
- stable dependency direction
- explicit ownership
- minimal public surface
- SSR-safe browser isolation
- scalable growth toward more modules, plugins, and events

## 2. Package Structure

### Complete Folder Tree

```text
packages/browser-lifecycle/
├── engineering/
├── docs/
├── examples/
│   └── core-infrastructure/
├── src/
│   ├── browser/
│   │   └── features/
│   ├── constants/
│   ├── core/
│   │   └── config/
│   ├── errors/
│   ├── events/
│   ├── modules/
│   ├── plugins/
│   ├── types/
│   ├── utils/
│   ├── browser-lifecycle.ts
│   └── index.ts
├── tests/
│   ├── unit/
│   └── helpers/
├── README.md
├── CHANGELOG.md
├── LICENSE
├── package.json
└── tsconfig.json
```

### Folder Responsibilities

| Folder           | Why It Exists                                  | What Belongs Here                                                             | What Must Never Be Here                               |
| ---------------- | ---------------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------- |
| `engineering/`   | design record and architecture source of truth | engineering docs, ADRs, specs                                                 | implementation notes masquerading as public contracts |
| `docs/`          | package-facing long-form docs                  | guides, compatibility notes, API guidance                                     | engineering-only ADRs                                 |
| `examples/`      | executable or readable usage examples          | focused consumer examples                                                     | test fixtures disguised as examples                   |
| `src/browser/`   | browser capability access and wrappers         | feature detection, browser abstractions, raw browser helpers                  | lifecycle policy or public business logic             |
| `src/constants/` | stable shared constants                        | defaults, names, feature keys                                                 | conditional business logic                            |
| `src/core/`      | orchestrating internal package behavior        | configuration system, core lifecycle coordinator, immutable state scaffolding | direct browser binding code                           |
| `src/errors/`    | centralized error hierarchy                    | package error classes and helpers                                             | runtime behavior unrelated to errors                  |
| `src/events/`    | event system internals and contracts           | event registry, metadata, emitter internals                                   | browser observation logic                             |
| `src/modules/`   | browser capability modules                     | visibility, focus, connectivity, idle, lifecycle, cross-tab modules           | unrelated shared utilities                            |
| `src/plugins/`   | plugin host infrastructure                     | plugin manager, plugin context, lifecycle hooks                               | optional product features that should be modules      |
| `src/types/`     | shared public and internal types               | config types, snapshot types, event types, internal contracts                 | runtime logic                                         |
| `src/utils/`     | stateless helpers                              | guards, assertions, pure object helpers                                       | browser access and lifecycle logic                    |
| `tests/`         | package tests                                  | unit, integration, helpers                                                    | production runtime code                               |

## 3. Core

### `src/core/` Responsibilities

`src/core/` owns the package's internal orchestration layer.

Responsibilities:

- configuration creation and immutability
- instance initialization and shutdown coordination
- state machine ownership
- module coordination
- capability-aware effective behavior selection

### Ownership

The core layer is the only layer allowed to assemble browser wrappers, modules, events, and plugins into one package instance.

### Initialization

Core initialization should:

1. validate configuration
2. compute effective configuration
3. detect capabilities
4. initialize subsystems
5. expose a stable public instance

### Lifecycle

Core owns:

- start
- stop
- dispose
- snapshot access
- capability access

### Session Core

The session core should coordinate state and modules but should not directly perform low-level browser API access. That work belongs in `src/browser/` and module-specific adapters.

### State Machine

The state machine belongs in core because state transitions need one source of truth.

### Module Coordinator

Core should coordinate module startup, ordering, teardown, and event normalization.

### Allowed Dependencies

- `src/types/`
- `src/constants/`
- `src/errors/`
- `src/utils/`
- `src/browser/`
- `src/events/`
- `src/modules/`
- `src/plugins/`

### Forbidden Dependencies

- core should not depend on test helpers
- core should not import from package root barrel files
- core should not import docs or examples

## 4. Browser

### `src/browser/` Responsibilities

This folder isolates all direct interaction with browser APIs and runtime capability access.

Responsibilities:

- browser feature detection
- browser API wrappers
- safe access to global runtime surfaces
- native event source normalization inputs

### No Business Logic Rule

`src/browser/` must not contain:

- public lifecycle policy
- user-facing event semantics
- plugin behavior
- session-state decision logic

### Why Browser APIs Should Remain Isolated

Browser APIs are the least portable layer. Isolation ensures:

- SSR safety
- simpler compatibility reasoning
- easier testing
- lower coupling to browser quirks

## 5. Modules

### `src/modules/` Philosophy

Each browser capability becomes its own module. Modules interpret browser inputs and report normalized state changes upward to core.

### Intended Module Families

```text
src/modules/
├── visibility/
├── focus/
├── connectivity/
├── idle/
├── lifecycle/
└── cross-tab/
```

### Module Contract

Each module should define:

- responsibility
- setup and teardown contract
- internal event or callback output
- required dependencies
- capability gating behavior

### Communication Rules

- modules should not import each other arbitrarily
- modules communicate through core-owned contracts
- modules may use browser wrappers and shared utilities
- modules must not depend on plugin internals

## 6. Events

### `src/events/` Responsibilities

This folder owns the event subsystem.

Responsibilities:

- event emitter
- event registry
- event metadata
- dispatch ordering
- subscription tracking
- internal event pipeline

### Ownership Rules

- event names and payload contracts originate here with support from `src/types/`
- public event dispatch should remain package-owned
- no module should expose its own unrelated public event system

## 7. Plugins

### `src/plugins/` Responsibilities

This folder owns plugin-facing infrastructure.

Responsibilities:

- plugin manager
- plugin registration
- plugin context
- lifecycle hooks
- plugin isolation boundaries

### Plugin Communication

Plugins should communicate through documented hooks and context, not through direct imports into module internals.

### Isolation Rules

- plugins must not mutate core state directly
- plugin failure isolation belongs here and in core
- plugin extension points must remain explicit and reviewable

## 8. Types

### `src/types/` Responsibilities

This folder contains:

- shared types
- public types
- internal types
- utility types
- placeholder module and event contracts where appropriate

### Naming Conventions

- public interfaces should use product-oriented names
- internal helper types should use intent-revealing names
- avoid vague names like `Data` or `PayloadObject`

### Export Rules

- only intended public types leave the package root
- internal types may be re-used internally but not barrel-exported publicly without documentation

## 9. Utilities

### `src/utils/` Responsibilities

Utilities exist for stateless shared helpers:

- assertions
- guards
- object merging
- deep freezing
- formatting helpers

### Rules

- utilities must remain pure
- utilities must not depend on Browser Lifecycle Manager internals
- utilities must not use browser APIs directly

## 10. Constants

### `src/constants/` Responsibilities

This folder contains:

- event name constants
- configuration defaults
- feature keys
- internal stable constants

### Rules

- no business logic
- no mutable state
- no browser access

## 11. Errors

### `src/errors/` Responsibilities

This folder centralizes the package error hierarchy.

It should contain:

- `BrowserLifecycleError`
- `ConfigurationError`
- `PluginError`
- `UnsupportedFeatureError`
- `InitializationError`

### Rules

- centralized definitions only
- error names and codes stay consistent
- errors should carry helpful context without exposing internal secrets

## 12. Dependency Rules

### Dependency Direction

```text
constants/types/utils/errors
  -> browser
  -> modules
  -> events
  -> plugins
  -> core
  -> public API
```

### Allowed Imports

- lower layers may be imported by higher layers
- `src/types/`, `src/constants/`, `src/utils/`, and `src/errors/` may be shared broadly
- `src/browser/` may be used by modules and core
- `src/modules/`, `src/events/`, and `src/plugins/` may be used by core

### Forbidden Imports

- browser should not import core
- utils should not import modules or core
- modules should not import package root
- plugins should not import private module internals directly

### Circular Dependency Prevention

- do not import through barrels internally unless the dependency direction stays obvious
- prefer local direct imports inside a subsystem
- move shared contracts into `src/types/` when duplication pressure appears

### Layering Rules

- public API files sit at the outermost layer
- core assembles the package
- modules interpret capabilities
- browser accesses runtime primitives

## 13. Public Exports

### `src/index.ts`

The root index file should export only documented public APIs.

### Subpath Exports

Subpath exports should remain minimal in Version 1. Avoid exposing internal architecture as public API just because it exists on disk.

### Barrel Files

- package root barrel: yes
- subsystem barrels: allowed internally when they do not hide dependency direction
- avoid large public barrels that accidentally export internal contracts

### Internal Modules

Internal modules, browser wrappers, utilities, and core primitives should remain private unless a future phase explicitly promotes them to documented public APIs.

## 14. File Naming

### Naming Rules

| Item                | Rule                                                                               |
| ------------------- | ---------------------------------------------------------------------------------- |
| folder names        | lowercase kebab-case or lowercase single-word                                      |
| source files        | kebab-case                                                                         |
| type names          | PascalCase                                                                         |
| class names         | PascalCase                                                                         |
| function names      | camelCase                                                                          |
| constant names      | `UPPER_SNAKE_CASE` for immutable exported constants, camelCase for local constants |
| test files          | `*.test.ts`                                                                        |
| example files       | descriptive kebab-case names                                                       |
| documentation files | numbered markdown files in engineering, descriptive markdown elsewhere             |

### Consistency Rules

- package-internal naming should prefer `browser-lifecycle` over old session terminology
- file names should describe responsibility, not historical implementation detail

## 15. Import Strategy

### Preferred Import Strategy

- use relative imports within one subsystem
- use stable internal paths across subsystems
- avoid importing from the public package root inside the package implementation

### Barrel Import Rules

- do not create barrel chains that obscure ownership
- public barrels are for consumer APIs, not internal convenience

### Cross-Module Imports

Cross-module imports should be avoided. Shared contracts should move into `src/types/` or be routed through core-owned interfaces.

## 16. Scalability

### Adding New Modules

New modules should:

- get a dedicated folder
- define explicit setup/teardown contracts
- document dependency needs
- avoid reaching into unrelated module internals

### Adding Plugins

Plugin growth should happen through hook surfaces and context contracts, not special-case imports into core.

### Isolating Experimental Features

Experimental capabilities should remain:

- clearly separated
- capability-gated
- optionally excluded from default exports

### Removing Deprecated Modules

Deprecation should happen by:

- isolating deprecated code paths
- documenting migration
- removing them in major versions only

### Version 2 Evolution

This structure should still support:

- 20+ modules
- 50+ plugins
- 100+ events

because dependency direction and ownership stay explicit.

## 17. Architecture Decisions

### ADR-001: Browser Isolation Layer

| Field                 | Record                                           |
| --------------------- | ------------------------------------------------ |
| Decision              | isolate browser API access in `src/browser/`     |
| Reason                | SSR safety and reduced coupling                  |
| Alternatives          | call browser APIs directly from core and modules |
| Tradeoffs             | one more layer to maintain                       |
| Future Impact         | easier compatibility work                        |
| Rejected Alternatives | browser access spread across package             |

### ADR-002: Core Assembler Pattern

| Field                 | Record                                         |
| --------------------- | ---------------------------------------------- |
| Decision              | let core assemble modules, events, and plugins |
| Reason                | one source of orchestration truth              |
| Alternatives          | peer-to-peer subsystem coordination            |
| Tradeoffs             | core remains strategically important           |
| Future Impact         | clearer lifecycle management                   |
| Rejected Alternatives | decentralized orchestration                    |

### ADR-003: Internal Privacy by Default

| Field                 | Record                                            |
| --------------------- | ------------------------------------------------- |
| Decision              | keep internals private unless explicitly promoted |
| Reason                | long-term API stability                           |
| Alternatives          | export many subpaths early                        |
| Tradeoffs             | fewer advanced escape hatches in v1               |
| Future Impact         | smaller compatibility burden                      |
| Rejected Alternatives | broad internal export surface                     |

## 18. Architecture Checklist

| Folder           | Single Responsibility | Low Coupling | High Cohesion | Testability | Clear Ownership | Stable Dependencies | Discoverable | Status               |
| ---------------- | --------------------- | ------------ | ------------- | ----------- | --------------- | ------------------- | ------------ | -------------------- |
| `src/browser/`   | yes                   | yes          | yes           | yes         | yes             | yes                 | yes          | pass                 |
| `src/core/`      | yes                   | mostly       | yes           | yes         | yes             | yes                 | yes          | pass with discipline |
| `src/events/`    | yes                   | yes          | yes           | yes         | yes             | yes                 | yes          | pass                 |
| `src/modules/`   | yes                   | mostly       | yes           | yes         | yes             | yes                 | yes          | pass with discipline |
| `src/plugins/`   | yes                   | mostly       | yes           | yes         | yes             | yes                 | yes          | pass with discipline |
| `src/types/`     | yes                   | yes          | yes           | yes         | yes             | yes                 | yes          | pass                 |
| `src/utils/`     | yes                   | yes          | yes           | yes         | yes             | yes                 | yes          | pass                 |
| `src/constants/` | yes                   | yes          | yes           | yes         | yes             | yes                 | yes          | pass                 |
| `src/errors/`    | yes                   | yes          | yes           | yes         | yes             | yes                 | yes          | pass                 |

If a folder fails these principles during implementation, it should be redesigned before more behavior is added.

## Final Review

### Can a New Contributor Understand the Project Within 15 Minutes?

Yes, if the folder boundaries and dependency rules are preserved in implementation.

### Are Responsibilities Clearly Separated?

Yes. The main risk is letting core become too broad or letting modules import each other freely.

### Could Circular Dependencies Occur?

Yes, if types and helper contracts are not kept in the right shared layers. The import strategy and dependency rules are meant to prevent that.

### Is the Architecture Scalable?

Yes. It should scale cleanly if the package remains disciplined about ownership and public-export restraint.

### Would This Structure Still Work After Adding 20 Modules, 50 Plugins, and 100 Events?

Yes, provided event, module, and plugin boundaries stay explicit and the root public API remains small.

### Recommendations Before Implementation Begins

- enforce dependency direction early
- keep browser access isolated from core logic
- avoid promoting internals to public exports prematurely
- keep utilities and constants logic-free so they remain reusable and testable
