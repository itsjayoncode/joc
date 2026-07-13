# 004 Public API Design

## Why This Document Exists

This document defines the complete public API design for Browser Lifecycle Manager before implementation begins. Its purpose is to make the package contract explicit enough that implementation can proceed without inventing names, lifecycle semantics, status surfaces, plugin behavior, or configuration shape ad hoc.

Related documents:

- [000 Product Vision](./000-product-vision.md)
- [002 Browser Platform Research](./002-browser-platform-research.md)
- [003 System Architecture](./003-system-architecture.md)
- [005 Event Specification](./005-event-specification.md)
- [006 Configuration Design](./006-configuration-design.md)

## 1. API Philosophy

### Why Browser Lifecycle Manager Should Feel Different

Browser Lifecycle Manager should feel like a platform primitive rather than a framework helper. The API should not read like a wrapper around raw browser events, nor like a monolithic session framework. It should feel small, explicit, composable, and honest about the difference between strong signals and heuristics.

### Guiding Principles

#### Simple

The first-use path should be readable in one pass. Developers should be able to create an instance, start it if needed, read a snapshot, and subscribe to events without learning internal concepts first.

#### Predictable

Method names, event semantics, and lifecycle transitions should behave consistently across the package. The API should avoid overloaded methods and surprising convenience features.

#### Framework Agnostic

The API must work equally well in vanilla JavaScript, React, Vue, Angular, Svelte, Next.js, Electron, and future adapters. No public API should assume a component model or reactive runtime.

#### Composable

Consumers should be able to use only the pieces they need: snapshot access, named events, full event subscription, or plugin registration.

#### Tree Shakeable

The package should expose a narrow root entrypoint with a minimal default surface. Public APIs should avoid unnecessary global helpers or singleton registries that imply always-on behavior.

#### Minimal

The Version 1 API should include only the methods, options, and status surfaces needed to express the lifecycle model clearly. Anything that adds surface area without clarity should be omitted.

#### Type Safe

Event names, event payloads, snapshots, configuration, plugin context, and capabilities should all be easy to discover through TypeScript without requiring users to read internals.

#### Long-Term Stable

This API must still make sense years from now. That means preferring plain names, clear ownership, explicit instance lifecycles, and additive extension over clever shortcuts.

## 2. Entry Point

### `createBrowserLifecycle()`

#### Purpose

`createBrowserLifecycle()` creates an explicitly owned Browser Lifecycle Manager instance with its own configuration, status, listeners, and plugin registrations.

#### Naming

The name should be `createBrowserLifecycle()` because the package models browser lifecycle, not general browser "session" state and not a hidden runtime singleton.

#### Why `createBrowserLifecycle()` Instead of `new BrowserLifecycle()`

Factory creation is preferable because:

- it keeps construction semantics explicit without exposing class-based implementation details
- it allows internal capability detection and configuration normalization before an instance is returned
- it keeps the public contract stable even if the internal implementation stops being class-based later

#### Why Not a Singleton

A singleton would hide ownership, make tests harder, and create ambiguous behavior in applications with multiple lifecycle scopes or embedded runtimes.

#### Why Not a Builder

A builder adds ceremony without enough value for Version 1. The configuration surface is intentionally small and should remain understandable as one object.

#### Tradeoff Summary

| Approach | Strengths | Weaknesses | Decision |
| --- | --- | --- | --- |
| `createBrowserLifecycle()` | explicit, stable, testable, implementation-neutral | slightly more verbose than `new` | chosen |
| `new BrowserLifecycle()` | familiar OO feel | exposes implementation style too early | rejected |
| singleton | convenient in tiny demos | poor ownership and test ergonomics | rejected |
| builder | configurable and staged | too heavy for current API size | rejected |

### Entry Point Table

| API | Purpose | Parameters | Return Type | Throws |
| --- | --- | --- | --- | --- |
| `createBrowserLifecycle(config?)` | create a lifecycle instance | `config?: BrowserLifecycleConfig` | `BrowserLifecycle` | invalid configuration, unsupported required environment assumptions |

### Example

```ts
import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";

const lifecycle = createBrowserLifecycle({
  autoStart: true,
  idleTimeout: 5 * 60 * 1000,
});
```

## 3. Browser Lifecycle Object

### Central Object: `BrowserLifecycle`

`BrowserLifecycle` is the central public object because it expresses the only ownership boundary that matters to the consumer: one lifecycle observer with one configuration model and one set of subscriptions.

### Responsibilities

- own lifecycle startup and shutdown
- expose readonly lifecycle status
- expose normalized snapshots
- manage event subscriptions
- manage plugin registration
- expose detected capability state

### Lifecycle

The instance lifecycle should be:

```text
created -> running -> stopped -> running -> disposed
```

Disposed is terminal.

### Ownership

The consumer owns the instance. Nothing in the public API should imply hidden global ownership.

### Internal State

Internal state includes observer registrations, event listeners, transport state, plugin state, timers, and capability detection details.

### Public State

Public state includes:

- lifecycle phase
- visibility
- attention
- activity
- connectivity hint
- lifecycle phase detail
- tab role
- capabilities
- timestamps

### State Transitions

Public state transitions should be monotonic in meaning but not over-abstracted. The API should not compress visibility, attention, activity, and restoration into one vague status string.

### Relationship with Modules

BrowserLifecycle should be the orchestration surface above internal observers and state modules. Consumers should never need to understand those internal modules to use the public API.

## 4. Methods

### Chosen Public Methods

| Method | Keep? | Reason |
| --- | --- | --- |
| `start()` | yes | explicit observation control |
| `stop()` | yes | reversible pause of observation |
| `dispose()` | yes | terminal teardown |
| `getSnapshot()` | yes | immediate state read |
| `getCapabilities()` | yes | understand degraded behavior |
| `on()` | yes | named event subscription |
| `off()` | yes | targeted unsubscription |
| `once()` | yes | one-shot subscription convenience |
| `subscribe()` | yes | full normalized event feed |
| `use()` | yes | plugin registration |
| `isRunning()` | yes | clear host-friendly status check |
| `pause()` | no | ambiguous versus `stop()` |
| `resume()` | no | ambiguous versus `start()` |
| `destroy()` | no | `dispose()` is more precise |
| `status()` | no | prefer readonly property or snapshot |
| `state()` | no | `getSnapshot()` is clearer |
| `unsubscribe()` | no | return unsubscribe functions instead |
| `plugin()` | no | `use()` is cleaner |
| `register()` | no | too generic for v1 |
| `listeners()` | no public API | increases emitter-style surface without enough value |
| `removeAll()` | no public API | too broad and error-prone |
| `emit()` | internal only | consumers should not emit package lifecycle events |

### `start()`

| Field | Design |
| --- | --- |
| Purpose | begin live observation |
| Parameters | none |
| Return Type | `void` |
| Throws | disposed instance errors, startup invariant errors |
| Side Effects | attaches observers and transports |

When to use it:

- when `autoStart` is `false`
- when the host wants explicit control

When not to use it:

- when the instance is already running
- after `dispose()`

Backward compatibility considerations:

- keep idempotent behavior stable
- avoid later changing it to async unless absolutely necessary

Example:

```ts
const lifecycle = createBrowserLifecycle({ autoStart: false });
lifecycle.start();
```

### `stop()`

| Field | Design |
| --- | --- |
| Purpose | stop live observation without destroying the instance |
| Parameters | none |
| Return Type | `void` |
| Throws | disposed instance errors |
| Side Effects | detaches observers, preserves last snapshot |

When to use it:

- test teardown
- controlled app shell pause
- temporary disablement

When not to use it:

- when permanent teardown is intended

Backward compatibility considerations:

- preserve idempotency
- do not redefine `stop()` as terminal later

### `dispose()`

| Field | Design |
| --- | --- |
| Purpose | terminal teardown |
| Parameters | none |
| Return Type | `void` |
| Throws | should not throw on repeated calls |
| Side Effects | clears listeners, plugins, observers, transports |

When to use it:

- final teardown
- test cleanup
- host unmount or process shutdown

When not to use it:

- when restart is intended

Backward compatibility considerations:

- keep terminal semantics permanent

### `getSnapshot()`

| Field | Design |
| --- | --- |
| Purpose | read current normalized lifecycle state |
| Parameters | none |
| Return Type | `Readonly<BrowserLifecycleSnapshot>` |
| Throws | disposed instance errors only if the package chooses to invalidate reads after dispose; recommended default is allow final snapshot reads |
| Side Effects | none |

When to use it:

- immediate status reads
- rendering and adapter integration
- debugging and assertions

When not to use it:

- when the consumer actually needs transition notifications rather than current state

Backward compatibility considerations:

- snapshot shape should evolve additively where possible

### `getCapabilities()`

| Field | Design |
| --- | --- |
| Purpose | expose detected platform capability state |
| Parameters | none |
| Return Type | `Readonly<BrowserLifecycleCapabilities>` |
| Throws | none in normal use |
| Side Effects | none |

When to use it:

- degraded behavior explanation
- diagnostics
- adapter decisions

When not to use it:

- as a replacement for subscribing to lifecycle state

### `isRunning()`

| Field | Design |
| --- | --- |
| Purpose | report whether live observation is currently active |
| Parameters | none |
| Return Type | `boolean` |
| Throws | none |
| Side Effects | none |

When to use it:

- host control flow
- test assertions

When not to use it:

- as a substitute for reading the full lifecycle phase

### `on(event, listener)`

| Field | Design |
| --- | --- |
| Purpose | subscribe to one named event |
| Parameters | event name and typed listener |
| Return Type | unsubscribe function |
| Throws | unknown event names, disposed instance errors |
| Side Effects | registers a named listener |

When to use it:

- specific lifecycle reactions

When not to use it:

- when a full event feed is more appropriate

Backward compatibility considerations:

- event-name additions should be additive

### `off(event, listener)`

| Field | Design |
| --- | --- |
| Purpose | remove a named listener |
| Parameters | event name and listener |
| Return Type | `void` |
| Throws | disposed instance errors only if the package makes disposed interaction invalid |
| Side Effects | unregisters listener |

When to use it:

- interoperability with explicit listener management code

When not to use it:

- when the unsubscribe function from `on()` is already used

### `once(event, listener)`

| Field | Design |
| --- | --- |
| Purpose | subscribe for one invocation |
| Parameters | event name and listener |
| Return Type | unsubscribe function |
| Throws | same as `on()` |
| Side Effects | auto-removes listener after first match |

### `subscribe(listener)`

| Field | Design |
| --- | --- |
| Purpose | subscribe to all normalized events |
| Parameters | one subscriber callback |
| Return Type | unsubscribe function |
| Throws | disposed instance errors |
| Side Effects | registers feed listener |

When to use it:

- logging
- debugging
- adapter layers
- plugins and analytics handoff

When not to use it:

- when only one event matters

### `use(plugin)`

| Field | Design |
| --- | --- |
| Purpose | register a plugin before startup |
| Parameters | `plugin: BrowserLifecyclePlugin` |
| Return Type | `void` |
| Throws | duplicate plugin id, disposed instance errors, registration after startup |
| Side Effects | registers plugin hooks and metadata |

When to use it:

- diagnostics extension
- transport extension
- framework-neutral lifecycle observers

When not to use it:

- when simple subscription is sufficient

Backward compatibility considerations:

- keep plugin lifecycle predictable
- preserve additive semantics

## State Diagram

```text
created
  -> start()
running
  -> stop()
stopped
  -> start()
running
  -> dispose()
disposed
```

## Sequence Diagram

```text
consumer -> createBrowserLifecycle(config)
consumer <- BrowserLifecycle instance
consumer -> start()
instance -> compute initial snapshot
instance -> attach observers
browser -> emits platform signal
instance -> normalize event
instance -> update snapshot
instance -> notify listeners and subscribers
```

## 5. Events

### Event API Design

The public event API should remain intentionally small:

- `on()`
- `off()`
- `once()`
- `subscribe()`

### Should Developers Ever Call `emit()`?

No. Public `emit()` should not exist. Browser lifecycle events should represent normalized browser observations and internal state transitions, not application-authored custom events.

### Event Method Table

| Method | Public? | Purpose | Notes |
| --- | --- | --- | --- |
| `on()` | yes | named subscription | default event API |
| `off()` | yes | named unsubscribe | explicit removal |
| `once()` | yes | one-shot subscription | convenience |
| `subscribe()` | yes | full feed subscription | adapter and debug oriented |
| `emit()` | no | internal only | preserve event integrity |
| `listeners()` | no | omitted | unnecessary emitter-style surface |
| `removeAll()` | no | omitted | too broad and easy to misuse |

### Event Naming

Event names should stay namespaced and string-based:

- `session:started`
- `session:stopped`
- `page:visible`
- `page:hidden`
- `window:focus`
- `window:blur`
- `session:active`
- `session:idle`
- `connection:online`
- `connection:offline`
- `page:suspend`
- `page:resume`
- `session:restored`
- `tab:primary`
- `tab:secondary`

### Event Integrity Principles

- event emission is package-owned
- snapshot updates happen before public delivery
- event payloads are readonly
- subscribers should never mutate package state directly

## 6. Status

### Status API Philosophy

The package should offer explicit readonly state, not framework-style reactivity. Consumers can integrate that state into their own reactive system if needed.

### Chosen Status Surface

```text
session.isRunning()
session.getSnapshot()
session.getCapabilities()
```

### Why Not Public Mutable Properties

Mutable public properties like `session.state` or `session.status` encourage ambiguous mutation expectations and are harder to evolve safely.

### Should State Be Immutable?

Yes. Snapshot and capability objects should be treated as readonly public views.

### Should State Be Readonly?

Yes. Public status must never be writable by consumers.

### Should Status Be Reactive?

No, not at the core package level. Reactivity belongs in adapters and framework integrations.

### Recommended Snapshot Shape

| Field | Meaning |
| --- | --- |
| `phase` | `created`, `running`, `stopped`, or `disposed` |
| `visibility` | visible or hidden state |
| `attention` | focused or unfocused attention model |
| `activity` | active or idle heuristic |
| `connectivity` | online, offline, or unknown advisory state |
| `lifecycle` | normalized page lifecycle phase |
| `tab` | primary, secondary, single, or unknown |
| `timestamps` | important lifecycle timing metadata |
| `capabilities` | effective capability state |

## 7. Plugin API

### Public Shape

The core plugin entrypoint should be `use(plugin)`.

### Why `use()` Instead of `plugin()` or `register()`

- `use()` is established and readable for additive extension
- `plugin()` is awkward as an imperative verb
- `register()` is overly generic and less discoverable in this context

### Plugin Lifecycle

```text
plugin object created by consumer
  -> lifecycle.use(plugin)
  -> plugin validated
  -> plugin initialized during startup
  -> plugin observes normalized events
  -> plugin cleaned up during stop/dispose
```

### Plugin Context

Plugin context should allow:

- readonly snapshot reads
- capability reads
- event subscription to normalized events
- registration of plugin cleanup logic
- access to plugin-local metadata

### Plugin Metadata

Each plugin should have:

- stable `id`
- optional `name`
- optional `version`
- optional `description`

### How Plugins Integrate

Plugins should integrate through normalized events and readonly context, not by mutating internal state machines.

### How Plugins Communicate

Plugins communicate through package-owned hooks and event subscriptions, not direct peer-to-peer plugin references in the core contract.

### How Plugins Extend Browser Lifecycle

Plugins should extend observability and side effects, not redefine lifecycle truth.

## 8. Configuration

### Configuration Philosophy

Configuration should stay intentionally small. It should tune lifecycle behavior rather than expose every internal observer detail.

### Proposed Configuration Object

| Option | Purpose | Type | Default | Validation | Interaction Notes |
| --- | --- | --- | --- | --- | --- |
| `autoStart` | start observation immediately | `boolean` | `true` | boolean only | interacts with plugin registration timing |
| `emitInitialState` | optionally emit startup transitions | `boolean` | `false` | boolean only | works with `autoStart` |
| `idleTimeout` | enable idle detection | `number | false` | `false` | positive integer or `false` | requires activity observation |
| `activityEvents` | choose activity sources | `"default" | string[]` | `"default"` | non-empty allowlisted array | meaningful only with `idleTimeout` |
| `activityDebounce` | reduce noisy activity input | `number` | `250` | integer >= 0 | affects idle responsiveness |
| `crossTab` | enable cross-tab coordination | `boolean | BrowserLifecycleCrossTabConfig` | `false` | object or boolean | enables BroadcastChannel or storage fallback |
| `debug` | enable extra diagnostics | `boolean` | `false` | boolean only | may pair with event buffering |
| `eventBufferSize` | keep recent event history | `number` | `0` | integer >= 0 | primarily useful with debug |
| `plugins` | register startup plugins | `BrowserLifecyclePlugin[]` | `[]` | unique stable ids | preferred when `autoStart` is `true` |

### Keep Configuration Small

Version 1 should avoid:

- per-event enable flags
- custom observer class injection
- transport class overrides
- framework-specific configuration

## 9. Error Handling

### Public Error Philosophy

The package should throw only for invalid consumer actions or broken invariants. Weak browser capabilities should usually degrade behavior, not throw.

### Error Categories

| Error Category | When to Throw | When to Warn | When to Ignore |
| --- | --- | --- | --- |
| configuration errors | invalid option values, conflicting options | never preferred over throw for invalid config | never |
| unsupported browser conditions | only when a required environment assumption for core usage truly fails | when optional features degrade | when absence is expected and documented |
| plugin errors | invalid plugin contract, duplicate ids | plugin capability degradation | plugin no-op optional hooks |
| lifecycle errors | start after dispose, invalid terminal usage | idempotent repeated operations should not warn | no-op idempotent stop/dispose cases |
| event subscription errors | unknown event names | none | none |

### Public Errors

Recommended public error families:

- `BrowserLifecycleConfigError`
- `BrowserLifecycleLifecycleError`
- `BrowserLifecyclePluginError`

### Warnings Instead of Errors

Warnings are preferable when:

- BroadcastChannel is unavailable and storage fallback is used
- connectivity APIs are absent
- optional lifecycle enhancements are unavailable

## 10. TypeScript Experience

### Design Goals

- excellent autocomplete
- strict-mode compatibility
- strong event-name inference
- ergonomic snapshot and capability reads
- minimal need for manual generic annotations

### Type Experience Principles

#### Interfaces

Public interfaces should be named and exported clearly:

- `BrowserLifecycle`
- `BrowserLifecycleConfig`
- `BrowserLifecycleSnapshot`
- `BrowserLifecycleCapabilities`
- `BrowserLifecycleEventMap`
- `BrowserLifecyclePlugin`

#### Generic Support

Generics should be used only where they improve event inference or plugin extension typing. Version 1 should avoid consumer-facing generic complexity for ordinary use.

#### Inference

`on("page:visible", ...)` should infer the correct payload type without manual type arguments.

#### Autocomplete Experience

Event names, config keys, status fields, and capability fields should be easily discoverable through editor hints.

#### Strict Mode Compatibility

All public types should make sense under `strict` TypeScript settings with readonly semantics where applicable.

#### Developer Ergonomics

The package should feel friendly to both JavaScript and TypeScript users. Type richness should support, not burden, the API.

## 11. Usage Examples

### Vanilla

```ts
import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";

const lifecycle = createBrowserLifecycle();

lifecycle.on("page:hidden", () => {
  // pause work
});
```

### React

```ts
const lifecycle = createBrowserLifecycle({ autoStart: true });

const unsubscribe = lifecycle.subscribe((event, snapshot) => {
  // bridge into component state
});
```

### Vue

```ts
const lifecycle = createBrowserLifecycle();

const stop = lifecycle.on("session:idle", () => {
  // update app-level reactive state
});
```

### Angular

```ts
const lifecycle = createBrowserLifecycle({ autoStart: false });

lifecycle.start();
```

### Svelte

```ts
const lifecycle = createBrowserLifecycle();

const snapshot = lifecycle.getSnapshot();
```

### Next.js

```ts
const lifecycle = createBrowserLifecycle({
  autoStart: true,
  crossTab: true,
});
```

### Electron

```ts
const lifecycle = createBrowserLifecycle({
  debug: true,
});
```

### PWA

```ts
const lifecycle = createBrowserLifecycle({
  idleTimeout: 5 * 60 * 1000,
});
```

## 12. API Design Decisions

### ADR-001: Factory-Based Entry Point

| Field | Record |
| --- | --- |
| Decision | use `createBrowserLifecycle()` |
| Reason | explicit ownership, stable abstraction, implementation neutrality |
| Alternatives Considered | class constructor, singleton, builder |
| Tradeoffs | slightly more verbose than `new` |
| Future Impact | preserves implementation freedom |
| Rejected Alternatives | `new BrowserLifecycle()`, singleton, builder |

### ADR-002: Instance-Owned Lifecycle

| Field | Record |
| --- | --- |
| Decision | each instance owns its own observers and lifecycle |
| Reason | testability and explicit control |
| Alternatives Considered | shared global coordinator |
| Tradeoffs | multi-instance support must be explicit |
| Future Impact | easier adapter layering |
| Rejected Alternatives | hidden singleton ownership |

### ADR-003: Event-First Plus Snapshot Access

| Field | Record |
| --- | --- |
| Decision | combine named events with `getSnapshot()` |
| Reason | supports both reactive and immediate-read workflows |
| Alternatives Considered | event-only API, snapshot-only API |
| Tradeoffs | slightly larger surface |
| Future Impact | good fit for framework-neutral consumers |
| Rejected Alternatives | event-only and snapshot-only designs |

### ADR-004: No Public Emit API

| Field | Record |
| --- | --- |
| Decision | omit public `emit()` |
| Reason | preserve lifecycle event integrity |
| Alternatives Considered | consumer-defined custom event support |
| Tradeoffs | package is less emitter-like |
| Future Impact | stronger semantic guarantees |
| Rejected Alternatives | public event emission |

### ADR-005: `dispose()` Over `destroy()`

| Field | Record |
| --- | --- |
| Decision | use `dispose()` as terminal teardown |
| Reason | clearer lifecycle ownership semantics |
| Alternatives Considered | `destroy()` |
| Tradeoffs | slightly less familiar to some users |
| Future Impact | aligns well with library-style resource cleanup |
| Rejected Alternatives | `destroy()` |

## 13. API Evolution Policy

### New APIs

New public APIs should be additive by default and introduced only when they preserve the mental model of explicit lifecycle ownership.

### Deprecation Policy

Deprecations should be announced in documentation first, then maintained for at least one stable minor or major planning cycle before removal depending on severity and ecosystem cost.

### Breaking Changes

Breaking changes should be rare and reserved for incorrect semantics, unsustainable naming, or severe correctness issues.

### Experimental APIs

Experimental APIs should be clearly marked, capability-gated where relevant, and excluded from the stable core mental model.

### Versioning Strategy

Use SemVer with conservative interpretation of lifecycle semantics. Event name or payload changes should be treated with the same seriousness as method changes.

### Long-Term Stability Goals

- preserve instance ownership model
- preserve event names once stabilized
- preserve snapshot readability
- preserve framework-neutral design

## 14. Public API Checklist

| Checklist Item | Status | Notes |
| --- | --- | --- |
| Simple | pass | default path remains small |
| Predictable | pass | methods have single responsibilities |
| Discoverable | pass | clear factory and event methods |
| Type Safe | pass | named types and event inference expected |
| Tree Shakeable | pass | narrow entrypoint and minimal helpers |
| Framework Agnostic | pass | no framework runtime assumptions |
| Minimal | pass | unnecessary methods omitted |
| Backward Compatible | pass with caution | event and snapshot shape must evolve conservatively |

If a future API fails this checklist, it should be redesigned before adoption.

## Comparison Table

| Question | Chosen Direction | Rejected Direction |
| --- | --- | --- |
| entrypoint | factory | class constructor |
| lifecycle stop | `stop()` | `pause()` / `resume()` pair |
| teardown | `dispose()` | `destroy()` |
| state read | `getSnapshot()` | mutable `state` property |
| extensibility | `use(plugin)` | `plugin()` / `register()` surface |
| events | package-owned named events | public `emit()` |

## Final Review

### Can a New Developer Learn It in 10 Minutes?

Yes, if the default docs focus on:

- `createBrowserLifecycle()`
- `getSnapshot()`
- `on()`
- `subscribe()`
- `dispose()`

### Is Any Method Unnecessary?

The proposed kept surface is appropriately small. The omitted methods such as `pause()`, `resume()`, `destroy()`, `status()`, `state()`, and `emit()` should remain omitted unless real implementation evidence proves otherwise.

### Is Any Configuration Overly Complex?

Not yet, but cross-tab and idle options are the most likely place for future bloat. Those should stay tightly scoped.

### Are There Naming Inconsistencies?

The main naming risk is mixing "lifecycle", "session", "status", and "state" too loosely. Version 1 should consistently use `BrowserLifecycle`, lifecycle-oriented event names, and `getSnapshot()` for current state reads.

### Would This API Still Make Sense Five Years From Now?

Yes, because it relies on explicit ownership, small verbs, and clear state boundaries instead of framework trends.

### Would This Version 1 Publish with Confidence?

Yes, with two caveats:

- event payload and snapshot naming must remain conservative
- plugin scope must stay additive and not leak internal mutation rights

### Recommendations Before Implementation Begins

- keep `stop()` and `dispose()` semantics sharply distinct
- preserve the omission of public `emit()` and emitter-style helper methods
- avoid expanding configuration until real implementation pressure appears
- validate the example workflows against the later architecture and event documents before coding begins
