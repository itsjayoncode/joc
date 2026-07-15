# 005 Event Specification

## Why This Document Exists

This document defines the complete event model for Browser Lifecycle Manager. It establishes naming, payload expectations, ordering, priorities, relationships, plugin event behavior, and future extension rules so the package can ship a durable event system without inventing semantics during implementation.

Related documents:

- [004 Public API Design](./004-public-api-design.md)
- [006 Configuration Design](./006-configuration-design.md)
- [007 Runtime Compatibility](./007-runtime-compatibility.md)
- [011 Design Decisions](./011-design-decisions.md)

## 1. Event Philosophy

### Why Browser Lifecycle Manager Is Event-Driven

Browser lifecycle is fundamentally temporal. The package exists to tell consumers when meaningful state transitions occur, not only what the latest snapshot happens to be. Events are the most direct fit for that problem because they let consumers react to transitions while the package preserves a normalized lifecycle model internally.

### Why Events Instead of Callbacks

One-off callbacks do not scale well to a system with many event categories, optional capabilities, and multiple independent consumers. Events allow:

- multiple listeners for the same transition
- framework-neutral composition
- plugin hooks without custom callback plumbing
- additive growth over time

### Why Events Instead of Polling

Polling is wasteful, imprecise, and often wrong for browser lifecycle behavior. It also makes background throttling harder to reason about. The package should emit normalized events from real browser signals, then let consumers read a snapshot when they need current state.

### Design Principles

- event names must describe real lifecycle meaning, not implementation detail
- the package owns event emission
- payloads must be minimal but sufficient
- state updates happen before public delivery
- heuristics must be named and documented honestly
- new events should be additive and namespace-safe

### Consistency Rules

- event names use `namespace:event`
- names should prefer stable nouns and verbs over browser-engine jargon
- payload structure should be consistent across event families
- current and previous state should be represented in the same way whenever possible
- no public event should exist without a clear consumer-facing use case

### Naming Philosophy

The system should separate:

- page visibility and suspend behavior
- window attention behavior
- session-level derived activity behavior
- connectivity hints
- cross-tab coordination
- plugin lifecycle

### Versioning Philosophy

- public event names are part of the stable API
- payload additions should be additive where possible
- payload meaning changes should be treated as serious breaking changes
- internal events may evolve more freely than public events

## 2. Event Naming Convention

### Naming Standard

Public events use a `namespace:event` format.

Examples:

- `page:hidden`
- `page:visible`
- `window:focus`
- `window:blur`
- `connection:online`
- `connection:offline`
- `session:idle`
- `session:active`
- `page:suspend`
- `page:resume`
- `tab:primary`
- `tab:secondary`
- `plugin:registered`
- `plugin:removed`

### Why `namespace:event` Was Chosen

This format keeps the system:

- easy to scan
- easy to group
- easy to extend
- predictable in editor autocomplete
- compatible with common event-listener mental models

### Naming Rules

- namespaces must be singular, short, and domain-oriented
- event names must describe the transition, not the implementation
- avoid overloaded words like `change` unless the event would otherwise become vague
- prefer present-tense outcome names over raw browser callback names

### Reserved Namespaces

- `page`
- `window`
- `session`
- `connection`
- `tab`
- `plugin`
- `internal` for non-public system use only
- `diagnostic` for future optional debug events only

### Future Extensibility

New events should land in the narrowest honest namespace. If a future capability cannot fit an existing namespace without ambiguity, a new namespace is preferable to overloading an old one.

### Rules for Introducing New Events

- the event must represent a meaningful transition
- the event must not duplicate an existing event with slightly different wording
- the event must have a stable payload contract
- the event must pass the event checklist in this document

## 3. Event Catalog

### Version 1 Event Catalog

| Name                 | Description                                                     | Category     | Public | Internal | Experimental              | Deprecated Future Risk |
| -------------------- | --------------------------------------------------------------- | ------------ | ------ | -------- | ------------------------- | ---------------------- |
| `session:started`    | instance begins live observation                                | session      | yes    | no       | no                        | low                    |
| `session:stopped`    | instance stops live observation                                 | session      | yes    | no       | no                        | low                    |
| `page:visible`       | page becomes visible                                            | page         | yes    | no       | no                        | low                    |
| `page:hidden`        | page becomes hidden                                             | page         | yes    | no       | no                        | low                    |
| `window:focus`       | window gains attention while relevant                           | window       | yes    | no       | no                        | low                    |
| `window:blur`        | window loses attention                                          | window       | yes    | no       | no                        | low                    |
| `session:active`     | session returns from idle to active                             | session      | yes    | no       | no                        | low                    |
| `session:idle`       | session crosses idle threshold                                  | session      | yes    | no       | no                        | low                    |
| `connection:online`  | connectivity hint changes to online                             | connectivity | yes    | no       | no                        | medium                 |
| `connection:offline` | connectivity hint changes to offline                            | connectivity | yes    | no       | no                        | medium                 |
| `page:suspend`       | page enters a suspend-like path                                 | lifecycle    | yes    | no       | yes, capability-dependent | medium                 |
| `page:resume`        | page resumes from a suspend-like path                           | lifecycle    | yes    | no       | yes, capability-dependent | medium                 |
| `session:restored`   | page context is restored after navigation or discard-aware path | lifecycle    | yes    | no       | yes, capability-dependent | medium                 |
| `tab:primary`        | current context becomes primary tab                             | cross-tab    | yes    | no       | yes, optional feature     | medium                 |
| `tab:secondary`      | current context loses primary tab role                          | cross-tab    | yes    | no       | yes, optional feature     | medium                 |
| `plugin:registered`  | plugin registration completed                                   | plugin       | yes    | no       | yes, optional surface     | medium                 |
| `plugin:removed`     | plugin cleanup completed                                        | plugin       | yes    | no       | yes, optional surface     | medium                 |
| `plugin:error`       | plugin hook failure was isolated                                | plugin       | yes    | no       | yes, optional surface     | medium                 |

### Internal Event Families

These should remain implementation-owned and not be part of the stable public API:

- observer raw signal events
- transport heartbeat events
- internal scheduling events
- diagnostic buffering events

### Future Event Families

Potential later events include:

- performance-sensitive diagnostic events
- richer navigation-related events
- resource pressure events
- extended idle-depth events

## 4. Event Payloads

### Payload Philosophy

Payloads should be:

- small enough to reason about quickly
- rich enough to avoid immediate snapshot re-reads for common cases
- consistent across categories
- additive-safe for future growth

### Common Payload Contract

Every public event should conceptually carry:

| Field       | Meaning                                           | Required |
| ----------- | ------------------------------------------------- | -------- |
| `type`      | event name                                        | yes      |
| `timestamp` | normalized event time                             | yes      |
| `source`    | primary signal source category                    | yes      |
| `current`   | current lifecycle-relevant value                  | yes      |
| `previous`  | previous lifecycle-relevant value when meaningful | usually  |
| `snapshot`  | current normalized snapshot                       | yes      |
| `metadata`  | event-specific extras                             | optional |

### Payload Source Values

Allowed source categories:

- `visibility`
- `focus`
- `activity`
- `connectivity`
- `lifecycle`
- `transport`
- `plugin`
- `internal`

### Page Event Payloads

| Event          | Purpose                        | Required Properties                                              | Optional Properties                              | Example Metadata                      |
| -------------- | ------------------------------ | ---------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------- |
| `page:visible` | visible transition             | `type`, `timestamp`, `source`, `current`, `previous`, `snapshot` | `metadata.reason`                                | `restored`, `focusKnown`              |
| `page:hidden`  | hidden transition              | same                                                             | `metadata.reason`                                | `visibilityState`, `likelyLastSignal` |
| `page:suspend` | suspend/freeze-like transition | same                                                             | `metadata.persisted`, `metadata.lifecycleSignal` | `freeze`, `pagehide-persisted`        |
| `page:resume`  | resume from suspend-like path  | same                                                             | `metadata.resumeSource`, `metadata.persisted`    | `pageshow`, `resume`                  |

### Window Event Payloads

| Event          | Purpose        | Required Properties                                              | Optional Properties        | Example Metadata  |
| -------------- | -------------- | ---------------------------------------------------------------- | -------------------------- | ----------------- |
| `window:focus` | attention gain | `type`, `timestamp`, `source`, `current`, `previous`, `snapshot` | `metadata.visibilityState` | `documentVisible` |
| `window:blur`  | attention loss | same                                                             | `metadata.visibilityState` | `stillVisible`    |

### Session Event Payloads

| Event              | Purpose                    | Required Properties                                              | Optional Properties                                                     | Example Metadata               |
| ------------------ | -------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------ |
| `session:started`  | observation begins         | `type`, `timestamp`, `source`, `current`, `snapshot`             | `metadata.autoStart`                                                    | `startupMode`                  |
| `session:stopped`  | observation ends           | `type`, `timestamp`, `source`, `current`, `snapshot`             | `metadata.reason`                                                       | `manual-stop`                  |
| `session:active`   | session exits idle         | `type`, `timestamp`, `source`, `current`, `previous`, `snapshot` | `metadata.activitySource`, `metadata.idleDuration`                      | `pointerdown`                  |
| `session:idle`     | session enters idle        | same                                                             | `metadata.idleTimeout`, `metadata.lastActivityAt`                       | configured timeout             |
| `session:restored` | restored lifecycle context | same                                                             | `metadata.persisted`, `metadata.wasDiscarded`, `metadata.restoreSource` | `pageshow`, `startup-detected` |

### Connectivity Event Payloads

| Event                | Purpose                     | Required Properties                                              | Optional Properties | Example Metadata   |
| -------------------- | --------------------------- | ---------------------------------------------------------------- | ------------------- | ------------------ |
| `connection:online`  | advisory online transition  | `type`, `timestamp`, `source`, `current`, `previous`, `snapshot` | `metadata.advisory` | `navigator.onLine` |
| `connection:offline` | advisory offline transition | same                                                             | `metadata.advisory` | `platform-offline` |

### Cross-Tab Event Payloads

| Event           | Purpose               | Required Properties                                              | Optional Properties                     | Example Metadata    |
| --------------- | --------------------- | ---------------------------------------------------------------- | --------------------------------------- | ------------------- |
| `tab:primary`   | tab becomes leader    | `type`, `timestamp`, `source`, `current`, `previous`, `snapshot` | `metadata.transport`, `metadata.term`   | `broadcast-channel` |
| `tab:secondary` | tab loses leader role | same                                                             | `metadata.transport`, `metadata.reason` | `timeout-loss`      |

### Plugin Event Payloads

| Event               | Purpose                  | Required Properties                                  | Optional Properties                                       | Example Metadata |
| ------------------- | ------------------------ | ---------------------------------------------------- | --------------------------------------------------------- | ---------------- |
| `plugin:registered` | plugin accepted          | `type`, `timestamp`, `source`, `current`, `snapshot` | `metadata.pluginId`                                       | plugin metadata  |
| `plugin:removed`    | plugin cleanup completed | same                                                 | `metadata.pluginId`, `metadata.reason`                    | stop/dispose     |
| `plugin:error`      | plugin failure isolated  | same                                                 | `metadata.pluginId`, `metadata.hook`, `metadata.severity` | isolated error   |

### Error Cases

Payloads should never contain:

- live mutable references to internal state
- functions
- browser-specific implementation objects unless absolutely necessary
- excessive diagnostic noise by default

### Future Compatibility Rules

- add optional metadata fields rather than changing required ones
- prefer adding new events over radically changing existing event meaning
- avoid renaming `current` and `previous` semantics after stabilization

## 5. Event Ordering

### Ordering Model

```text
browser signal
  -> feature detection and gating
  -> module observation
  -> internal state normalization
  -> snapshot update
  -> plugin hooks
  -> public event emission
  -> developer callback
  -> post-delivery cleanup
```

### Ordering Rules

1. snapshot updates happen before public event delivery
2. one normalized event is fully processed before the next public event is emitted
3. when one browser signal implies multiple public transitions, they emit in semantic order
4. plugin hooks observe the normalized state before public user callbacks

### Transition Rules

- visibility transitions outrank attention transitions when both occur together
- lifecycle suspend and resume semantics occur after baseline visibility truth is established
- session activity and idle events occur after the underlying snapshot changes

### Priority Rules

- higher-priority lifecycle corrections can prevent lower-priority derived events from emitting stale state
- duplicate already-current state events should be suppressed unless explicitly allowed

### Guarantees

- public callbacks observe the updated snapshot
- event names map to stable semantics
- named listeners and `subscribe()` see the same normalized event ordering

### Non-Guarantees

- the package cannot guarantee identical browser-native event order across all environments
- the package cannot guarantee every lifecycle path emits a final termination-style event
- the package cannot guarantee wall-clock precision for idle in heavily throttled states

### Potential Race Conditions

- rapid visibility and focus changes
- transport heartbeats arriving during hidden-state transitions
- restoration signals overlapping with fresh activity signals
- connectivity changes while suspended or hidden

### Browser Inconsistencies

- mobile browsers can truncate event chains
- background tabs distort timer precision
- Safari and embedded contexts can expose partial lifecycle nuance

### How Browser Lifecycle Manager Resolves Them

- prefer stronger signals over weaker heuristics
- keep event semantics conservative
- suppress impossible or contradictory transitions
- document uncertainty rather than invent certainty

## 6. Event Priority

### Why Priority Exists

The package must resolve collisions between browser signals and derived events. Priority helps the system decide which transitions represent stronger truth.

### Priority Levels

| Priority      | Meaning                                 | Examples                                                                         |
| ------------- | --------------------------------------- | -------------------------------------------------------------------------------- |
| Critical      | package lifecycle and invariant control | `session:started`, `session:stopped`                                             |
| Lifecycle     | visibility and suspend/resume truth     | `page:hidden`, `page:visible`, `page:suspend`, `page:resume`, `session:restored` |
| Connectivity  | advisory network changes                | `connection:online`, `connection:offline`                                        |
| Visibility    | explicit page visibility                | `page:hidden`, `page:visible`                                                    |
| Focus         | attention-only transitions              | `window:focus`, `window:blur`                                                    |
| Idle          | derived activity heuristics             | `session:idle`, `session:active`                                                 |
| Plugin        | plugin lifecycle notifications          | `plugin:registered`, `plugin:removed`, `plugin:error`                            |
| Informational | future diagnostics                      | debug or diagnostic families                                                     |

### When Events Can Interrupt Others

High-priority state correction may prevent a lower-priority event from emitting if the lower-priority event would no longer describe the final normalized state honestly.

### Simultaneous Browser Events

The package should process simultaneous-looking events through a deterministic queue and resolve them by:

1. signal strength
2. lifecycle relevance
3. actual browser callback order when still semantically valid

### Priority Resolution Strategy

- visibility truth before focus truth
- lifecycle restoration truth before derived idle or active transitions
- plugin notifications never redefine core lifecycle order

## 7. State Transitions

### State Transition Philosophy

Events should represent valid changes in normalized state, not every raw browser callback.

### Visibility and Lifecycle Flow

```text
visible
  -> hidden
  -> suspended
  -> resumed
  -> visible
```

### Attention and Activity Flow

```text
focused
  -> blurred
  -> active
  -> idle
  -> active
```

### Connectivity Flow

```text
unknown
  -> online
  -> offline
  -> online
```

### Cross-Tab Flow

```text
unknown
  -> primary
  -> secondary
  -> primary
```

### Allowed Transitions

- visible to hidden
- hidden to visible
- hidden to suspend-like state
- suspend-like state to resume or restored
- active to idle
- idle to active
- primary to secondary and secondary to primary

### Invalid Transitions

- visible to visible repeated without meaningful change
- idle to idle repeated without a new active interval
- primary to primary repeated without a new leadership term
- restored without any restoration evidence

### Ignored Transitions

- lower-value signals that contradict stronger current state
- duplicate browser callbacks that do not change normalized state
- noisy signals suppressed by debounce or capability gating

## 8. Edge Cases

| Edge Case                 | Expected Behavior                                                           | Priority | Fallback                                | Developer Expectation                 |
| ------------------------- | --------------------------------------------------------------------------- | -------- | --------------------------------------- | ------------------------------------- |
| Rapid tab switching       | visibility remains primary; duplicate churn suppressed                      | high     | snapshot correction                     | stable visible/hidden semantics       |
| Offline while hidden      | connectivity changes remain advisory and independent                        | medium   | keep hidden state unchanged             | no false session-end claims           |
| Focus without visibility  | focus should not imply visible                                              | medium   | ignore impossible attention promotion   | attention stays conservative          |
| Multiple tabs             | leadership events only emit when optional cross-tab mode is enabled         | medium   | single-tab semantics                    | no hidden global coordination         |
| Sleep during idle         | idle timing may drift; lifecycle truth remains conservative                 | high     | best-effort restore logic               | no precision promises                 |
| Resume after freeze       | `page:resume` and possibly `session:restored` emit if justified             | high     | visible transition only                 | restoration stays capability-driven   |
| Browser crash             | no synthetic terminal event promised                                        | high     | rely on next startup evidence           | package does not fake crash detection |
| Back/Forward Cache        | use persisted restoration semantics when available                          | high     | pagehide/pageshow refinement            | restoration may be explicit           |
| Private browsing          | storage fallback may be unavailable                                         | medium   | disable storage transport               | cross-tab features may degrade        |
| Battery saver             | timers and frames slow further                                              | medium   | degrade idle precision                  | no false precision                    |
| Mobile browser suspension | hidden may be the last strong signal                                        | high     | hidden-only lifecycle path              | termination remains uncertain         |
| Iframe embedding          | focus and visibility semantics may differ from standalone page expectations | medium   | capability-gated, conservative handling | avoid overclaiming attention state    |

## 9. Event Relationships

### Common Relationship Patterns

```text
page:hidden
  -> page:suspend (when supported)
```

```text
page:visible
  -> window:focus (when attention also returns)
```

```text
window:focus
  -> session:active (when idle state is reset)
```

```text
connection:offline
  -> no automatic session:idle
```

```text
page:resume
  -> session:restored (when restore semantics are justified)
```

### Dependencies

- `session:active` depends on activity heuristics or visibility-related reactivation policy
- `session:restored` depends on restoration evidence rather than any single raw callback
- `tab:primary` depends on transport-backed coordination when enabled

### Ordering

- visibility before focus when both shift together
- state update before plugin and public event delivery
- plugin lifecycle notifications after the relevant registration or cleanup operation is normalized

### Grouping

Grouped transitions may occur during:

- tab return from background
- history restoration
- leadership change

### Aggregation

The package should aggregate raw browser signals into one normalized public transition rather than emit one public event per raw signal source.

## 10. Plugin Events

### Plugin Responsibilities

Plugins may observe normalized lifecycle behavior, record diagnostics, add side effects, or integrate external systems. They must not redefine core lifecycle truth.

### Plugin Lifecycle Events

| Event               | Purpose                      | Public | Notes                                             |
| ------------------- | ---------------------------- | ------ | ------------------------------------------------- |
| `plugin:registered` | plugin accepted by instance  | yes    | optional surface                                  |
| `plugin:removed`    | plugin cleanup completed     | yes    | stop or dispose path                              |
| `plugin:error`      | plugin hook failure isolated | yes    | should not crash core unless configured otherwise |

### Plugin Event Order

```text
consumer registers plugin
  -> plugin validation
  -> plugin:registered
  -> core lifecycle events occur
  -> plugin observes normalized event
  -> plugin cleanup
  -> plugin:removed
```

### Plugin Isolation

- plugin failures should be isolated from core lifecycle correctness whenever possible
- plugin error signaling should not corrupt the public lifecycle snapshot
- one plugin should not be able to suppress another plugin's registration event

## 11. Error Events

### Error Event Philosophy

The package should not become a generic emitter of noisy `error`, `warning`, `debug`, or `diagnostic` events by default. Most invalid consumer actions should throw directly. Most optional-capability issues should degrade quietly or warn through opt-in diagnostics.

### Should the Package Emit `error` Events?

Not as a generic public default. Generic `error` events create ambiguity with thrown errors and are easy to misuse.

### Should the Package Emit `warning` Events?

Not as part of the stable core event model. Warnings are better suited to opt-in diagnostics.

### Should the Package Emit `debug` or `diagnostic` Events?

Potentially in the future, but not as Version 1 core public events.

### When Errors Should Throw Instead

- invalid configuration
- invalid event names
- plugin registration contract violations
- invalid lifecycle method usage after disposal

### When Event-Based Error Reporting Is Preferable

- isolated plugin errors through `plugin:error`
- optional future diagnostic channels when debug mode is explicitly enabled

## 12. Event Lifecycle

### Complete Event Lifecycle

```text
browser event
  -> feature detection
  -> module processing
  -> session core normalization
  -> state update
  -> plugin hooks
  -> public event
  -> developer callback
  -> cleanup
```

### Sequence Diagram

```text
browser -> observer
observer -> capability gate
capability gate -> session core
session core -> snapshot update
session core -> plugin hooks
session core -> public event queue
public event queue -> named listeners
public event queue -> subscribe listeners
session core -> cleanup
```

### Lifecycle Notes

- feature detection may suppress a raw signal from becoming a public event
- module processing may merge multiple raw signals into one normalized event
- cleanup happens after delivery, not before snapshot visibility

## 13. Future Events

| Event               | Reason Excluded from V1                                      | Potential Future Version | Requirements                                     |
| ------------------- | ------------------------------------------------------------ | ------------------------ | ------------------------------------------------ |
| `network:slow`      | connectivity hint quality is too weak for reliable semantics | 2.x                      | stronger network strategy and support validation |
| `battery:low`       | not core lifecycle truth                                     | 2.x or plugin            | capability research and privacy review           |
| `memory:pressure`   | weak cross-browser portability                               | future experimental      | browser support and semantics study              |
| `navigation:change` | navigation modeling belongs in later design work             | 2.x                      | clearer navigation strategy                      |
| `screen:lock`       | web platform does not expose a strong universal signal       | future experimental      | reliable capability basis                        |
| `screen:unlock`     | same reason as lock                                          | future experimental      | reliable capability basis                        |
| `idle:extended`     | v1 idle should stay simple                                   | 2.x                      | proven consumer demand                           |
| `diagnostic:*`      | debug surface should remain opt-in                           | 2.x                      | dedicated diagnostics design                     |

## 14. Design Decisions

### ADR-001: Namespace-Based Event Names

| Field         | Record                                    |
| ------------- | ----------------------------------------- |
| Decision      | use `namespace:event` public naming       |
| Reason        | predictable grouping and discoverability  |
| Alternatives  | flat names, browser-native callback names |
| Tradeoffs     | slightly longer strings                   |
| Future Impact | easy additive growth                      |

### ADR-002: No Public `emit()`

| Field         | Record                       |
| ------------- | ---------------------------- |
| Decision      | package owns event emission  |
| Reason        | preserve event integrity     |
| Alternatives  | public custom event emission |
| Tradeoffs     | package is less emitter-like |
| Future Impact | stronger semantic stability  |

### ADR-003: Visibility Over Focus

| Field         | Record                                                             |
| ------------- | ------------------------------------------------------------------ |
| Decision      | visibility transitions outrank focus transitions                   |
| Reason        | visibility is the stronger platform truth                          |
| Alternatives  | treat focus as equal to visibility                                 |
| Tradeoffs     | focus-driven apps must reason through separate attention semantics |
| Future Impact | prevents misleading lifecycle claims                               |

### ADR-004: Plugin Errors Stay Isolated

| Field         | Record                                                                                                 |
| ------------- | ------------------------------------------------------------------------------------------------------ |
| Decision      | plugin failures produce isolated plugin error signaling rather than collapse the core lifecycle engine |
| Reason        | core lifecycle truth must remain stable                                                                |
| Alternatives  | fail-fast plugin model                                                                                 |
| Tradeoffs     | some plugin failures become softer than thrown errors                                                  |
| Future Impact | safer extension ecosystem                                                                              |

### ADR-005: Minimal Core Event Set

| Field         | Record                                                  |
| ------------- | ------------------------------------------------------- |
| Decision      | ship a compact Version 1 public event catalog           |
| Reason        | reduces redundancy and semantic drift                   |
| Alternatives  | emit many fine-grained internal events publicly         |
| Tradeoffs     | some advanced consumers may want more granularity later |
| Future Impact | easier long-term compatibility                          |

## 15. Event Checklist

| Requirement          | Status                | Notes                                        |
| -------------------- | --------------------- | -------------------------------------------- |
| Consistent Naming    | pass                  | namespace-based event system                 |
| Predictable Ordering | pass                  | deterministic normalization rules            |
| Strongly Typed       | pass in design intent | payload families map cleanly to named events |
| Framework Agnostic   | pass                  | no framework runtime assumptions             |
| Version Safe         | pass with caution     | payload growth must stay additive            |
| Backward Compatible  | pass with caution     | event names should stabilize early           |
| Minimal Payload      | pass                  | payloads stay small and snapshot-oriented    |
| Easy to Understand   | pass                  | catalog remains compact and namespaced       |

If a future event fails any requirement, it should be redesigned or excluded.

## Final Review

### Is the Naming Consistent?

Yes. The namespace-based structure is consistent and clear, and the chosen names separate page, window, session, connection, tab, and plugin concerns cleanly.

### Could Developers Predict Events Without Documentation?

Mostly yes. Names like `page:hidden`, `window:focus`, and `session:idle` are predictable, though lifecycle restoration events still benefit from explicit documentation.

### Are Payloads Minimal?

Yes, provided the implementation keeps metadata additive and resists diagnostic bloat in the stable public contract.

### Are There Redundant Events?

The Version 1 set is compact. The main future redundancy risk would come from adding too many lifecycle-specific sub-events that overlap with visibility or restoration.

### Can New Events Be Added Without Breaking Existing Ones?

Yes, if they remain additive, use reserved namespaces carefully, and do not redefine the meaning of existing events.

### Would This Event System Still Be Elegant Five Years From Now?

Yes, if the package preserves its conservative naming and resists becoming a generic event bus for every browser nuance.

### Recommendations Before Implementation Begins

- keep public event names stable once implementation starts
- preserve the distinction between strong lifecycle truth and heuristics
- ensure plugin events stay optional and do not crowd the core event model
- validate ordering behavior against the architecture and browser-platform research documents before coding begins
