# 011 Design Decisions

## Why This Document Exists

This document records the key architectural decisions for Browser Lifecycle in ADR-style form so future contributors understand not only what was chosen, but why.

Related documents:

- [000 Product Vision](./000-product-vision.md)
- [003 System Architecture](./003-system-architecture.md)
- [004 Public API Design](./004-public-api-design.md)
- [010 Non-Goals](./010-non-goals.md)

## ADR 001: Use visibility as the primary lifecycle pivot

- Status: accepted
- Decision: treat page visibility as the primary lifecycle pivot for the public model
- Reason:
  - visibility more closely answers "can the user currently see this page?"
  - modern guidance treats hidden as a strong transition point
- Alternatives considered:
  - focus and blur as the primary lifecycle signal
  - pagehide as the primary session-end signal
- Tradeoffs:
  - visibility still does not explain every lifecycle cause
  - some edge cases remain unobservable
- Future impact:
  - event naming and snapshot semantics remain centered on visible and hidden states

## ADR 002: Separate visibility from attention

- Status: accepted
- Decision: model visibility and focus as separate concerns
- Reason:
  - a page can be visible without having input focus
  - a blur event does not mean the page is hidden
- Alternatives considered:
  - collapse both into one "active" field
- Tradeoffs:
  - snapshot model becomes slightly richer
  - consumers need to learn two related concepts instead of one
- Future impact:
  - better semantic clarity for editors, dashboards, and multi-window usage

## ADR 003: Keep idle detection optional

- Status: accepted
- Decision: idle detection is opt-in through configuration
- Reason:
  - idle is heuristic and application-sensitive
  - defaulting it on would surprise consumers who only need visibility or focus
- Alternatives considered:
  - enable idle detection by default
- Tradeoffs:
  - some users need one extra configuration step
- Future impact:
  - the package stays conservative by default and more adaptable across app types

## ADR 004: Use feature detection instead of browser-brand detection

- Status: accepted
- Decision: capability detection should drive behavior
- Reason:
  - browser-brand logic is brittle
  - the web platform evolves by feature support, not reliable browser identity
- Alternatives considered:
  - browser-specific allowlists and blocklists
- Tradeoffs:
  - some compatibility decisions move from config time to runtime
- Future impact:
  - lower maintenance burden as browser support changes

## ADR 005: Expose both events and snapshots

- Status: accepted
- Decision: the public contract includes named events plus a current snapshot reader
- Reason:
  - some consumers need reactive updates
  - others need immediate reads or test assertions
- Alternatives considered:
  - event-only API
  - store-only API
- Tradeoffs:
  - implementation must keep ordering and snapshot consistency tight
- Future impact:
  - the package becomes easier to adapt into frameworks without forcing one consumption style

## ADR 006: Require explicit instance ownership

- Status: accepted
- Decision: Browser Lifecycle uses `createBrowserLifecycle()` and explicit instances rather than a hidden global singleton
- Reason:
  - clearer lifecycle ownership
  - better testing and predictable teardown
- Alternatives considered:
  - package-level singleton
- Tradeoffs:
  - a small amount of setup is required in simple apps
- Future impact:
  - multi-instance tests and host-controlled startup remain straightforward

## ADR 007: Prefer `BroadcastChannel` with storage fallback for cross-tab coordination

- Status: accepted
- Decision: cross-tab coordination should use a layered transport model
- Reason:
  - BroadcastChannel is the better same-origin communication primitive when available
  - storage events provide a practical fallback
- Alternatives considered:
  - BroadcastChannel only
  - storage only
  - no v1 cross-tab support
- Tradeoffs:
  - transport abstraction adds some complexity
- Future impact:
  - cross-tab behavior can remain useful on more browsers without coupling the public API to one transport

## ADR 008: Keep plugins additive and observational

- Status: accepted
- Decision: plugins may observe normalized session behavior, but not redefine core session truth
- Reason:
  - core lifecycle semantics must stay stable
  - plugin mutation of core state would make behavior difficult to reason about
- Alternatives considered:
  - middleware-style plugins that can intercept and rewrite transitions
- Tradeoffs:
  - plugin power is intentionally limited
- Future impact:
  - package behavior remains debuggable and safer to evolve

## ADR 009: Use conservative lifecycle naming

- Status: accepted
- Decision: prefer names such as `page:suspend` over `device:suspend`
- Reason:
  - the browser does not reliably expose true device power lifecycle
  - public names should not overclaim certainty
- Alternatives considered:
  - more dramatic or user-friendly names that imply stronger guarantees
- Tradeoffs:
  - names may feel slightly less ambitious
- Future impact:
  - reduced chance of semantic breaking changes later

## ADR 010: Keep the v1 package free of framework adapters

- Status: accepted
- Decision: framework wrappers belong in separate packages later
- Reason:
  - the core problem is browser semantics, not framework integration
  - adapters would expand scope before the base contract is proven
- Alternatives considered:
  - shipping React or Vue helpers in v1
- Tradeoffs:
  - framework users write a small amount of glue code initially
- Future impact:
  - the core package stays lean and reusable across environments

## ADR 011: Remain a product, not a composition platform

- Status: accepted
- Decision: keep `createBrowserLifecycle()` batteries-included for the six core observers; do not require `withVisibility()`-style installers for core
- Reason:
  - the six observers define what “browser lifecycle” means
  - ~11 kB gzip with zero dependencies is already lean
  - product DX beats premature platform complexity
- Alternatives considered:
  - TanStack-style module composition for every observer
- Tradeoffs:
  - unused observers still ship in the factory graph today
  - runtime gating still prevents listener/timer work when disabled
- Future impact:
  - optional intelligence (Timeline, Metrics, …) uses separate boundaries; core stays one product until proven too large

## ADR 012: Core observes; optional modules interpret

- Status: accepted
- Decision: core attaches browser listeners and normalizes snapshot/events; optional layers only derive from that state
- Reason:
  - prevents analytics/BI creep in core
  - keeps performance predictable
  - gives a durable place for Activity facade, Timeline, Metrics, Reports, Wait, Resilience
- Alternatives considered:
  - growing session with always-on Timeline/Metrics
- Tradeoffs:
  - some features require an opt-in step
- Future impact:
  - every proposal must answer: observe vs derive?

## ADR 013: Lazy plugin runtime

- Status: accepted
- Decision: allocate `PluginRuntime` only when plugins are configured or `use()` is called
- Reason:
  - default `createBrowserLifecycle()` should not pay plugin bookkeeping
  - cleaner lifecycle and tests when plugins are unused
- Alternatives considered:
  - always construct an empty plugin manager
- Tradeoffs:
  - slightly more null-checks in session coordination
- Future impact:
  - same public plugin API; better default runtime cost

## ADR 014: Local presence naming; no second Snapshot module

- Status: accepted
- Decision:
  - evolve `getSnapshot()` in place; never add a parallel Snapshot module
  - any future presence feature means **local page availability**, not multi-user presence
- Reason:
  - snapshot is already core
  - multi-user presence is an explicit non-goal
- Alternatives considered:
  - Snapshot as a future milestone; “Presence” as collaboration feature
- Tradeoffs:
  - naming must stay careful in docs and APIs
- Future impact:
  - clearer roadmap and fewer semantic collisions

## Review

These decisions form a coherent design philosophy: honest browser semantics, small public surface, layered capability use, and strict scope control. Core is frozen as a product. Growth happens in optional interpret layers that must not tax browsers or bundles by default.
