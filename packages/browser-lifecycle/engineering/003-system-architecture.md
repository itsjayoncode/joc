# 003 System Architecture

## Why This Document Exists

This document defines the high-level shape of Browser Lifecycle: the modules it needs, how they communicate, and which responsibilities belong where.

Related documents:

- [002 Browser Platform Research](./002-browser-platform-research.md)
- [004 Public API Design](./004-public-api-design.md)
- [005 Event Specification](./005-event-specification.md)
- [008 Folder Architecture](./008-folder-architecture.md)

## Architectural Goals

- one clear public entrypoint
- explicit separation between raw browser observation and derived session state
- event-first design with a stable snapshot API
- progressive enhancement for advanced browser features
- no framework dependencies
- easy teardown and restart

## Architectural Overview

Browser Lifecycle should be organized as a layered system:

```text
Consumer
  |
  v
Public API layer
  |
  v
Session orchestrator
  |
  +--> Observer modules
  |      - visibility observer
  |      - focus observer
  |      - activity observer
  |      - connectivity observer
  |      - lifecycle observer
  |      - cross-tab observer
  |
  +--> Derived state modules
  |      - idle state
  |      - primary tab state
  |      - resume / restore state
  |
  +--> Event bus
  |
  +--> Snapshot store
  |
  +--> Plugin host
```

## Core Modules

### Public API Layer

This layer exposes:

- `createBrowserLifecycle()`
- a `BrowserLifecycle` instance contract
- subscription APIs
- snapshot access
- lifecycle control methods such as start, stop, and dispose

It should stay intentionally thin.

### Session Orchestrator

The orchestrator is the package brain. It should:

- own startup and shutdown sequencing
- wire browser observers
- update internal state
- emit normalized public events
- coordinate plugins
- enforce ordering guarantees

The orchestrator should not become a grab bag of browser-specific logic. It coordinates modules; it should not replace them.

### Observer Modules

Each observer should translate one browser concern into normalized internal signals.

#### Visibility observer

Reads page visibility state and emits internal visibility transitions.

#### Focus observer

Tracks focus and blur separately from visibility.

#### Activity observer

Tracks user interaction timestamps and drives idle heuristics.

#### Connectivity observer

Consumes `online` and `offline` hints while preserving their advisory nature.

#### Lifecycle observer

Handles `pagehide`, `pageshow`, and progressive lifecycle enhancements such as freeze or resume where supported.

#### Cross-tab observer

Coordinates same-origin tab communication and primary-tab election using a transport abstraction.

## Derived State Modules

Derived state should not live inside individual observers because it usually depends on multiple raw signals.

### Idle state module

Combines activity inputs, visibility, and timeout policy into `active` and `idle` transitions.

### Primary tab module

Combines transport messages, timestamps, visibility, and leadership policy into `primary` and `secondary` state.

### Resume and restore module

Synthesizes restoration signals from pageshow, persisted navigation, discard awareness, and startup conditions.

## Event Bus

Browser Lifecycle should use an internal event bus that:

- isolates raw observers from public subscribers
- centralizes ordering
- supports plugin hooks without exposing internal implementation details

The public event system should be built on top of this internal bus, not directly on browser targets.

## Snapshot Store

The package should keep one internal snapshot object representing the current known state:

- visibility
- focus
- activity
- connectivity hint
- lifecycle phase
- tab role
- timestamps and metadata

Consumers should be able to read this snapshot without subscribing.

## Plugin Host

Plugins should be optional and strictly additive. The plugin host should allow:

- observing normalized events
- reading current snapshot state
- reacting to lifecycle changes
- contributing diagnostics or side effects

Plugins should not be able to mutate core package invariants directly.

## Dependency Flow

Dependency direction should remain one-way:

```text
browser APIs --> observers --> orchestrator --> snapshot/event bus --> public API/plugins
```

Forbidden direction:

```text
plugin --> observer internals
public API --> browser globals directly
observer --> public subscriber registry directly
```

## State Flow

```text
Raw browser signal
  -> observer normalizes signal
  -> orchestrator validates and sequences it
  -> snapshot store updates
  -> internal event emitted
  -> public event emitted
  -> plugins notified
```

This flow is important because it makes snapshot reads and event payloads consistent with each other.

## Start and Stop Lifecycle

### Startup

1. validate environment and configuration
2. compute initial snapshot
3. initialize transports and observers
4. publish initial ready state
5. begin live observation

### Stop

1. stop emitting public events
2. detach observers and transports
3. flush any pending internal cleanup
4. keep final snapshot readable if configured

### Dispose

Dispose should be terminal. A disposed instance should not be restarted.

## Extension Points

Planned extension points:

- plugin hooks
- cross-tab transport abstraction
- optional debug or diagnostics mode

Non-extension points:

- public event naming
- core state machine semantics
- lifecycle ordering guarantees

## Key Architectural Boundaries

### Browser observation versus session semantics

The package should separate "the browser fired X" from "the session means Y". This is how the package avoids exposing raw browser inconsistency as the public contract.

### Strong signals versus heuristic signals

Visibility and explicit lifecycle transitions are stronger than idle or online hints. The architecture should preserve that distinction in payload metadata.

### Core versus plugins

Core owns the package contract. Plugins can react, but they should not redefine session truth.

## Risks and Mitigations

| Risk                               | Mitigation                                       |
| ---------------------------------- | ------------------------------------------------ |
| too much logic in one orchestrator | keep observers and derived-state modules narrow  |
| ambiguous event ordering           | centralize sequencing through the orchestrator   |
| advanced API overreach             | progressive enhancement behind capability checks |
| plugin feature creep               | additive hooks only, no core mutation            |

## Review

This architecture stays small enough for a v1 package while leaving room for growth. The main future improvement area is transport abstraction detail for cross-tab coordination, which should be validated carefully once implementation begins. The current design correctly keeps that concern modular rather than letting it leak into the whole package.
