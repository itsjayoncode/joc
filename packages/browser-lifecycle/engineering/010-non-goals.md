# 010 Non-Goals

## Why This Document Exists

This document protects Browser Lifecycle from feature creep by defining what the package is not meant to become.

Related documents:

- [000 Product Vision](./000-product-vision.md)
- [001 Problem Research](./001-problem-research.md)
- [011 Design Decisions](./011-design-decisions.md)

## Core Scope Reminder

Browser Lifecycle exists to normalize browser lifecycle and session-adjacent signals. It does not exist to become a full application platform.

## Explicit Non-Goals

### Authentication

Browser Lifecycle should not manage user identity, login state, token refresh, or authentication session validity.

### Analytics

The package may expose lifecycle signals that analytics systems can consume, but it should not become an analytics client, beacon wrapper, or event ingestion library.

### Global State Management

The package should expose a snapshot and event stream, not a complete application state container.

### Cookies and Storage Management

Cross-tab coordination may use storage as a fallback transport, but the package should not become a cookie helper, storage abstraction, or persistence library.

### Routing and Navigation Frameworks

Browser Lifecycle may observe lifecycle around navigation, but it should not become a router, navigation abstraction, or SPA transition manager.

### HTTP Requests

The package should not perform polling, transport retries, API health checks, or request orchestration. Consumers may use session signals to control those behaviors in their own code.

### Framework Hooks

The core package should not ship React hooks, Vue composables, or other framework-specific wrappers in v1. Those can be separate adapter packages later.

### Device Power Management

The package should not claim full device sleep or wake detection. It may infer page suspension or restoration from browser signals, but it does not own the operating system lifecycle.

### Background Task Scheduling

The package can inform scheduling decisions, but it should not become a general job scheduler or task queue.

### Presence and Collaboration

Cross-tab awareness is in scope; multi-user presence or collaborative session coordination is not.

### Security Policy

The package should not enforce CSP, permissions, or browser security configuration. It may document constraints, but it is not a security framework.

## Features That Must Stay Out of v1

- automatic backend reachability probing
- transport-specific public APIs for BroadcastChannel or storage
- persistence and rehydration helpers
- plugin marketplaces or complex plugin ordering rules
- per-framework bundles

## Boundary Test

If a proposed feature cannot be explained as one of these:

- lifecycle observation
- session state normalization
- cross-tab session coordination
- additive plugin observation

then it probably does not belong in Browser Lifecycle core.

## Review

The non-goals are intentionally strict, which is healthy for a first package. The biggest future risk is pressure to absorb application concerns once the package proves useful. This document should be revisited only when a new feature clearly fits the product vision rather than merely sitting nearby.
