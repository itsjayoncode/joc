# 003 System Architecture

## Why This Document Exists

This document defines the high-level shape of Browser Lifecycle: the modules it needs, how they communicate, and which responsibilities belong where.

Related documents:

- [002 Browser Platform Research](./002-browser-platform-research.md)
- [004 Public API Design](./004-public-api-design.md)
- [005 Event Specification](./005-event-specification.md)
- [008 Folder Architecture](./008-folder-architecture.md)
- [009 Development Roadmap](./009-development-roadmap.md)
- [010 Non-Goals](./010-non-goals.md)
- [011 Design Decisions](./011-design-decisions.md)

## Product Shape (Locked)

`@jayoncode/browser-lifecycle` is a **product**, not a composition platform.

```ts
const browser = createBrowserLifecycle();
```

One entrypoint. Batteries-included core observers. Optional intelligence layers may be added later without changing that DX.

Do **not** split the six core observers into `withVisibility()`-style installers unless the core itself becomes too large to ship as one product.

## Governing Principle (Locked)

> **Core modules observe. Optional modules interpret.**

| Layer                 | May                                                                | Must not                                                       |
| --------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------- |
| Core observers        | Attach browser listeners, normalize signals into snapshot + events | Compute business intelligence (timelines, aggregates, reports) |
| Optional intelligence | Derive from snapshot/events (or an optional Timeline buffer)       | Attach new browser API listeners                               |
| Session               | Coordinate modules, own phase + snapshot store + public event bus  | Become a grab bag of feature logic                             |

Light derivation inside core is allowed when it is **normalized session state**, not product analytics:

- idle `active` / `idle` from activity + timeout
- cross-tab `primary` / `secondary` from transport leadership
- lifecycle `suspend` / `resume` / `restored` from page lifecycle signals

## Frozen Package Layout

```text
@jayoncode/browser-lifecycle
│
├── Core Runtime (always part of createBrowserLifecycle)
│   ├── Session (coordinates only)
│   ├── Visibility
│   ├── Focus
│   ├── Connectivity
│   ├── Idle
│   ├── Lifecycle
│   ├── Cross Tab
│   ├── Snapshot store (`getSnapshot()`)
│   ├── Event bus
│   ├── Configuration
│   └── SSR / capability detection
│
├── Runtime services
│   ├── Plugins (lazy — allocate only when configured or `use()`d)
│   └── Diagnostics (debug / tooling oriented; must not accumulate unbounded state by default)
│
└── Future optional intelligence (not always-on)
    ├── Activity facade (compose existing signals — no new observers)
    ├── Local presence (page-local availability — not multi-user presence)
    ├── Timeline
    ├── Metrics (may subscribe to events directly; must not force Timeline on everyone)
    ├── Reports (consume Metrics / Timeline)
    ├── Wait helpers / Conditions
    ├── Resilience helpers
    ├── Analytics integrations (separate packages)
    ├── Persistence (separate concern)
    └── Framework adapters (separate packages)
```

## Dependency Graph (Locked)

Every new feature must fit this graph. If it does not, revisit the design.

```text
Browser APIs
│
├── Visibility
├── Focus
├── Connectivity
├── Idle
├── Lifecycle
└── Cross Tab
        │
        ▼
Session Runtime (coordinate)
        │
        ▼
Snapshot  +  Public Events
        │
        ├── Activity facade (future, derive-only)
        ├── Local presence (future, derive-only)
        ├── Timeline (future, optional buffer)
        ├── Metrics (future, optional)
        ├── Reports (future, optional)
        ├── Wait / Conditions (future, DX)
        └── Resilience (future, react helpers)
```

Forbidden directions:

```text
optional intelligence --> browser globals
plugin --> observer internals
public API --> browser globals directly
observer --> public subscriber registry directly
```

## Architectural Goals

- one clear public entrypoint
- explicit separation between raw browser observation and derived session state
- event-first design with a stable snapshot API (`getSnapshot()` is core — do not add a second Snapshot module)
- progressive enhancement for advanced browser features
- no framework dependencies in core
- easy teardown and restart
- lean runtime: disabled features must not attach listeners or allocate optional services
- performance-first: no timers, channels, or plugin work unless the consumer opted in

## Session Responsibility Rule

As optional features arrive, keep:

| Role                         | Owns                                |
| ---------------------------- | ----------------------------------- |
| Session                      | Coordination, phase machine, wiring |
| Modules                      | Behavior and browser listeners      |
| Snapshot store               | Current state                       |
| Events                       | Communicating changes               |
| Optional packages / services | Interpretation and DX helpers       |

Do not hang every future namespace permanently on the session instance (`browser.timeline`, `browser.metrics`, …) unless the feature is intentionally tiny and opt-in. Prefer plugins, lazy services, or separate packages for heavy intelligence.

## Core Modules

### Public API Layer

Exposes:

- `createBrowserLifecycle()`
- `BrowserLifecycle` instance contract
- subscription APIs
- `getSnapshot()`
- lifecycle control: start, stop, dispose

Stay intentionally thin.

### Session Orchestrator

Owns startup/shutdown sequencing, wires observers, updates snapshot, emits normalized public events, coordinates plugins when present, enforces ordering.

It coordinates modules; it must not replace them.

### Observer Modules

Each observer translates one browser concern into normalized internal signals.

| Observer     | Concern                                                   |
| ------------ | --------------------------------------------------------- |
| Visibility   | Page Visibility API                                       |
| Focus        | Window focus / blur                                       |
| Connectivity | Advisory online / offline                                 |
| Idle         | Activity inputs + idle timeout (opt-in via `idleTimeout`) |
| Lifecycle    | pagehide / pageshow / freeze / resume                     |
| Cross Tab    | Same-origin leadership (opt-in via `crossTab`)            |

Idle and cross-tab must remain **runtime-gated**: no listeners/timers/channels when disabled.

### Snapshot Store

One internal snapshot representing current known state. Evolve fields as new **normalized** state becomes available. Do not introduce a parallel Snapshot product module.

### Plugin Host (Lazy)

Plugins are optional and additive. Allocate `PluginRuntime` only when:

- `config.plugins` is non-empty, or
- `use(plugin)` is called

Plugins may observe events and snapshot; they must not redefine session truth.

### Diagnostics

Diagnostics exist for developers and playgrounds. They must remain debug-aware and must not become an unbounded always-on telemetry buffer in production defaults.

## State Flow

```text
Raw browser signal
  -> observer normalizes signal
  -> orchestrator validates and sequences it
  -> snapshot store updates
  -> public event emitted
  -> plugins notified (only if plugin runtime exists)
```

## Performance and Weight Rules

These rules exist so the package stays lightweight and does not harm browser performance:

1. **No work for disabled features** — idle off ⇒ no activity listeners/timers; cross-tab off ⇒ no BroadcastChannel/storage heartbeat.
2. **No plugin allocations by default** — empty `createBrowserLifecycle()` must not construct plugin infrastructure.
3. **Optional intelligence is opt-in** — Timeline/Metrics/Reports must not run (or retain history) unless enabled.
4. **Metrics must not require Timeline** — counters can subscribe to events; Timeline is an optional retention buffer.
5. **Prefer ~stable gzip size for core** — grow intelligence outside always-on paths.

## Key Architectural Boundaries

### Browser observation versus session semantics

Separate "the browser fired X" from "the session means Y".

### Strong signals versus heuristic signals

Visibility and explicit lifecycle transitions are stronger than idle or online hints. Preserve that in metadata.

### Core versus optional intelligence

Core owns the contract. Optional layers interpret. Analytics, persistence, and framework adapters stay out of core.

### Local presence versus multi-user presence

Cross-tab awareness is in scope. Multi-user / collaborative presence is not. Future "presence" features mean **local page availability** (e.g. visible + focused + online), not users-online.

## Risks and Mitigations

| Risk                            | Mitigation                                                 |
| ------------------------------- | ---------------------------------------------------------- |
| Session becomes a god object    | Session coordinates; modules/stores/events own behavior    |
| Feature creep into analytics/BI | Observe vs interpret rule + non-goals                      |
| Optional features tax everyone  | Lazy services, opt-in config, separate packages            |
| Performance regressions         | Gate listeners/timers; measure idle/cross-tab/plugin paths |
| Premature platform API          | Keep product DX until core itself is too large             |

## Review

The core runtime is complete enough to freeze. Future investment belongs in optional interpret layers and DX helpers, not in additional always-on browser observers—unless a new observer is clearly a missing lifecycle signal.
