# 002 Browser Platform Research

## Why This Document Exists

This document is the browser-platform research baseline for Browser Lifecycle Manager. It identifies which browser capabilities are stable enough for Version 1, which require fallbacks, which are risky, and which should remain future-facing. Its purpose is to let later architecture and API design proceed from researched platform constraints rather than assumptions.

Related documents:

- [000 Product Vision](./000-product-vision.md)
- [001 Problem Research](./001-problem-research.md)
- [003 System Architecture](./003-system-architecture.md)
- [007 Runtime Compatibility](./007-runtime-compatibility.md)

## Scope

This document covers the browser capabilities most relevant to lifecycle observation:

- Page Visibility API
- Page Lifecycle related events and states
- window focus and navigation events
- connectivity hints
- cross-tab communication primitives
- scheduling primitives
- cleanup primitives

It does not define implementation code or final public APIs.

## Research Principles

- prefer capability detection over browser sniffing
- distinguish strong signals from heuristic signals
- treat graceful degradation as a first-class requirement
- optimize for correctness before convenience
- avoid APIs that weaken bfcache behavior or long-term portability
- keep Version 1 dependent on stable, widely available platform features

## Architecture Context

Browser Lifecycle Manager needs to normalize multiple browser signals into one internal lifecycle model.

```text
Browser signals
  -> capability detection
  -> observer layer
  -> normalization layer
  -> lifecycle state model
  -> consumer-facing events and snapshots
```

The package should never assume that one browser event equals one reliable product truth. It must instead combine signals conservatively.

## Facts, Recommendations, and Future Ideas

To keep this document usable long term:

- `Facts` describe platform behavior or widely accepted browser constraints.
- `Recommendations` describe what Browser Lifecycle Manager should do.
- `Design decisions` describe conclusions appropriate for current package planning.
- `Future ideas` describe capabilities that should not be central to Version 1.

## API Summary

| Capability                    | Primary Role                             | Reliability         | Fallback Need | V1 Recommendation                 |
| ----------------------------- | ---------------------------------------- | ------------------- | ------------- | --------------------------------- |
| Page Visibility API           | visible and hidden state                 | high                | low           | required                          |
| Page Lifecycle related events | suspend, restore, termination refinement | medium              | medium        | optional enhancement              |
| focus and blur                | attention state                          | medium              | low           | required as secondary layer       |
| pagehide and pageshow         | navigation and bfcache refinement        | medium              | medium        | required as secondary layer       |
| beforeunload                  | user warning escape hatch only           | low                 | n/a           | avoid for core                    |
| unload                        | legacy termination event                 | low                 | n/a           | do not use                        |
| navigator.onLine              | connectivity hint                        | low to medium       | low           | optional advisory signal          |
| BroadcastChannel              | preferred cross-tab transport            | high when available | medium        | optional but strongly recommended |
| storage event                 | cross-tab fallback transport             | medium              | medium        | optional fallback                 |
| requestAnimationFrame         | visible-state scheduling                 | medium              | medium        | optional internal tool            |
| requestIdleCallback           | low-priority background work             | low                 | high          | future or optional only           |
| AbortController               | cleanup and cancellation                 | high                | low           | required internal primitive       |

## Practical Examples

```text
Example A: analytics-heavy dashboard
  visible -> polling remains active
  hidden -> polling slows or pauses
  restored -> dashboard refreshes stale data conservatively
```

```text
Example B: multi-tab admin panel
  BroadcastChannel available -> one primary tab owns expensive background work
  BroadcastChannel unavailable -> storage fallback may coordinate coarsely
  storage unavailable -> cross-tab ownership disabled rather than faked
```

## 1. Page Visibility API

### Overview

The Page Visibility API provides document-level visibility state through `document.visibilityState`, `document.hidden`, and the `visibilitychange` event. It is the strongest broadly available signal for whether the page is meaningfully visible to the user.

### Purpose

It answers a core lifecycle question: is the document visible or hidden from the user's perspective?

### How It Works

The browser exposes document visibility through `document.visibilityState` and `document.hidden`, then emits `visibilitychange` when that state changes.

### Lifecycle Interaction

Visibility is usually the first strong signal that a page is no longer in the active foreground. It often precedes or accompanies throttling, suspension, or later navigation-related lifecycle changes.

### Primary Use Cases

- pause background polling when hidden
- reduce rendering or analytics work
- separate visible from hidden states before layering attention or idle logic
- detect likely end-of-active-view transitions on mobile or tab switch

### Advantages

- broadly supported
- semantically close to the actual lifecycle question
- more trustworthy than focus as a visibility signal
- aligns well with browser throttling behavior

### Limitations

- does not explain why the page became hidden
- does not indicate input focus
- does not guarantee a final termination callback after hidden
- does not directly expose freeze, discard, or restore semantics

### Browser Support

High across modern desktop and mobile browsers.

### Browser Differences

- Safari and mobile browsers may move to hidden before app switch or task suspension without later termination events.
- Some environments expose visibility transitions more reliably than focus transitions.
- Embedded contexts can have surprising visibility relationships with parent browsing contexts.

### Security Considerations

- low direct security sensitivity
- should not be treated as proof that the user abandoned a sensitive workflow
- should not drive auth or security-critical expiration by itself

### Performance Considerations

- low overhead
- often the correct trigger for reducing timers, heartbeats, and expensive observers
- should be preferred over polling visibility-like state

### Edge Cases

- page becomes hidden and is later discarded without another event
- minimized window versus tab switch may look similar at the visibility layer
- iframe and embedded cases can differ from developer expectations

### Common Mistakes

- treating visibility as identical to focus
- treating hidden as guaranteed termination
- assuming visible means the user is active

### Feature Detection Strategy

Check for `document.visibilityState` and support for `visibilitychange`. Avoid browser-name branching.

### Fallback Strategy

Fallback to a weaker model based on focus, blur, and `pagehide` if necessary. Document the loss of semantic strength.

### Should Browser Lifecycle Manager Depend on This?

Yes. This should be a foundational signal.

### Implementation Priority

Highest.

### Version Recommendation

Required for V1.

### Questions Answered

When should Browser Lifecycle Manager listen to it?

- always, when available
- as the primary signal for visible and hidden transitions

When should it ignore it?

- it should not infer user activity or focus from visibility alone
- it should not treat hidden as guaranteed termination

What events should eventually be emitted?

- a visible transition class
- a hidden transition class
- lifecycle state changes derived from visibility when combined with stronger evidence

What browser quirks exist?

- hidden may be the last reliable signal before discard
- mobile app switching may not yield a neat follow-up event chain

### Facts

- Visibility is one of the strongest lifecycle signals available on the open web.

### Recommendations

- make visibility the primary lifecycle pivot for Version 1.

### Design Decision

- Browser Lifecycle Manager should treat visibility as stronger than focus and stronger than idle.

## 2. Page Lifecycle API

### Overview

The Page Lifecycle family includes concepts and events associated with page freezing, resuming, termination, history restoration, and discard-aware behavior. In practice, Browser Lifecycle Manager will rely most on `pagehide`, `pageshow`, `freeze`, `resume`, and discard-related state where available.

### Purpose

Refine the package model beyond visible versus hidden by describing transitions such as freeze, resume, restore, and terminate-adjacent behavior.

### Lifecycle Transitions

This capability family helps interpret transitions such as:

- visible to hidden
- hidden to frozen-like behavior
- hidden or frozen to restored
- active session to terminated or discarded outcomes

### Primary Use Cases

- detect bfcache-related restoration
- distinguish hidden from frozen-like behavior
- treat page restoration differently from first load
- improve lifecycle nuance for long-lived apps

### Advantages

- gives more lifecycle detail than visibility alone
- helps model modern browser memory and navigation behavior
- supports better restoration semantics

### Limitations

- uneven support across engines
- some concepts are better documented than uniformly exposed
- discard is often only detectable after the fact
- event ordering differs by browser and scenario

### Browser Support

Partial. `pagehide` and `pageshow` are broadly useful. `freeze`, `resume`, and discard-aware signals are more uneven.

### Browser Differences

- Chromium-family browsers expose more lifecycle nuance.
- Safari and Firefox support useful subsets but not identical semantics.
- discard-related detection is not symmetrical across browsers.

### Relationship with Visibility API

Visibility describes whether the page is shown. Lifecycle APIs describe what may happen to the page process or navigation state around that visibility change.

### Security Considerations

- low direct security sensitivity
- should not be used as a security boundary
- restoration logic should avoid assuming uninterrupted continuity

### Performance Considerations

- can improve performance by helping apps stop work earlier
- relying too heavily on unsupported lifecycle branches can create unnecessary complexity

### Edge Cases

- page is hidden, then frozen, then restored from bfcache
- page is discarded with no pre-discard callback
- pageshow persisted behavior differs from a fresh navigation

### Feature Detection Strategy

Check for event support and relevant document properties such as discard-related state. Enable advanced lifecycle branches only when actually supported.

### Fallback Strategy

Fallback to visibility plus `pagehide` and `pageshow`. Treat `freeze` and discard-aware enhancements as optional.

### Should Browser Lifecycle Manager Depend on This?

Partially. It should depend on the broadly available parts and progressively enhance advanced branches.

### Implementation Priority

High for `pagehide` and `pageshow`; medium for `freeze`, `resume`, and discard-aware enhancements.

### Version Recommendation

`pagehide` and `pageshow`: Required for V1.

Advanced lifecycle signals: Optional in V1.

### How Does It Differ from Visibility?

- visibility answers whether the page is seen
- lifecycle answers whether the page is suspended, restored, terminated, or preserved in history

### What Fallbacks Are Needed?

- visibility plus focus for baseline lifecycle
- `pagehide` and `pageshow` for restoration refinement
- startup inspection for discard-aware hints where possible

### Should Browser Lifecycle Manager Abstract Lifecycle States?

Yes, but conservatively. It should expose normalized lifecycle semantics only when it can justify them from real signals.

### Recommended Abstraction

Treat visibility as the baseline state model and layer lifecycle refinements on top only when the browser provides real evidence for suspend, restore, or discard-like behavior.

### Facts

- lifecycle detail beyond visibility is valuable but inconsistently exposed.

### Recommendations

- use the broadly available lifecycle events in Version 1 and keep advanced states capability-gated.

### Design Decision

- lifecycle enhancements should never be required for package correctness.

## 3. Window Events

### Overview

Window-level events relevant to lifecycle include `focus`, `blur`, `beforeunload`, `pagehide`, `pageshow`, and `unload`. These events vary widely in reliability and purpose.

### Purpose

They provide attention changes, navigation-adjacent transitions, and some legacy escape hatches.

### Primary Use Cases

- distinguish attention from visibility
- refine restoration or navigation handling
- support user-warning flows outside the core package contract

### Advantages

- widely known
- relatively easy to subscribe to
- useful when kept within their actual semantic limits

### Limitations

- event ordering is not always intuitive
- attention is not visibility
- legacy unload-era events harm bfcache compatibility
- some events are unsuitable as primary lifecycle truth

### Browser Support

Broad, but quality and semantics differ by event.

### Browser Differences

- focus and blur timing can differ between desktop and mobile
- pagehide and pageshow are more reliable than unload for modern navigation handling
- beforeunload behavior is deliberately restricted by browsers

### Browser Behavior

These events represent a mix of attention signals, history-navigation refinements, and legacy unload-era behavior. They should be classified by role rather than grouped as one unified lifecycle layer.

### Security Considerations

- beforeunload is user-interaction-sensitive and should not be used as a hidden tracking mechanism
- lifecycle transitions should not be relied on to secure or clear secrets by themselves

### Performance Considerations

- focus and blur are cheap
- beforeunload and unload can interfere with optimal browser behavior
- legacy event reliance can worsen performance indirectly by reducing bfcache opportunities

### Edge Cases

- window loses focus but remains visible
- mobile browsers do not emit a clean unload path
- history navigation restores a page without a full reload

### Feature Detection Strategy

Use only the events needed for the specific lifecycle layer. Avoid assuming all window events are equally available or equally valuable.

### Fallback Strategy

Use visibility as the fallback base. Keep window events secondary, especially for attention and restore semantics.

### Should Browser Lifecycle Manager Depend on This?

- `focus` and `blur`: yes, as a secondary attention layer
- `pagehide` and `pageshow`: yes, as lifecycle refinement
- `beforeunload`: no for core lifecycle
- `unload`: no

### Implementation Priority

- `focus` and `blur`: high
- `pagehide` and `pageshow`: high
- `beforeunload`: future escape hatch only
- `unload`: do not use

### Version Recommendation

- `focus` and `blur`: Required for V1
- `pagehide` and `pageshow`: Required for V1
- `beforeunload`: Future
- `unload`: Do Not Use

### Event Ordering

There is no universal ordering guarantee across every scenario, but common patterns include:

- visibility transitions often precede or accompany focus changes
- `pagehide` may follow a hidden transition
- `pageshow` may occur on history restoration with persisted state information

### Known Issues

- blur can fire without actual page hide
- unload is unreliable and actively discouraged
- beforeunload prompts are restricted and not a session-end primitive

### Best Practices

- model focus and blur separately from visibility
- prefer `pagehide` over `unload`
- treat `pageshow` as restoration-related context

### Recommended Usage

- use focus and blur for attention
- use pagehide and pageshow for restoration refinement

### When Browser Lifecycle Manager Should Use These Events

- when distinguishing attention from visibility
- when refining restore and navigation semantics
- when detecting bfcache-related state through supported signals

### When Browser Lifecycle Manager Should Avoid These Events

- when trying to infer true session end from unload-era behavior
- when substituting focus loss for visibility loss
- when relying on beforeunload as a general lifecycle primitive

### Deprecated Usage

- do not use unload as a core lifecycle signal

### Facts

- not all window events deserve equal status in the lifecycle model

### Recommendations

- make focus and blur secondary, and reject unload-era assumptions

### Design Decision

- Browser Lifecycle Manager should be bfcache-friendly by default.

## 4. Navigator.onLine

### Overview

`navigator.onLine` plus the `online` and `offline` events provide a broad network hint, not a real connectivity guarantee.

### Purpose

Expose advisory connectivity state that can inform UX and secondary lifecycle behavior.

### Primary Use Cases

- show online or offline hints
- reduce unnecessary retry work
- tag lifecycle snapshots with advisory connectivity context

### Advantages

- easy to access
- broadly available
- useful as a low-cost signal

### Limitations

- false positives are common
- false negatives exist
- does not verify backend reachability
- platform heuristics vary significantly

### Browser Support

Broad.

### Browser Differences

- browser and OS network stack behavior influence accuracy
- captive portals, LAN-only connections, and offline-first states can distort meaning

### Security Considerations

- should not be used to infer trust or actual server reachability

### Performance Considerations

- negligible direct cost
- risk comes from overreacting to a weak signal

### Edge Cases

- "online" while the backend is unreachable
- "offline" during transient network transitions
- connectivity changes after wake or network handoff

### Feature Detection Strategy

Check for `navigator.onLine` and the relevant events, but keep the public semantics soft.

### Fallback Strategy

If unavailable, omit connectivity hints entirely rather than faking them.

### Fallback Strategies

- omit connectivity state if unavailable
- allow consumers to combine advisory hints with application-level reachability checks outside the core package

### Should Browser Lifecycle Manager Depend on This?

No for correctness, yes as an optional advisory signal.

### Implementation Priority

Medium.

### Version Recommendation

Optional in V1.

### Accuracy

Useful enough for hints, not strong enough for guarantees.

### False Positives

- local network available but backend unreachable
- captive portal situations

### False Negatives

- transient network stack confusion
- platform-specific offline reporting behavior

### Offline-First Considerations

Offline-first apps may still function meaningfully while the online hint reports false or stale state. The package should not conflate "offline" with "app unusable".

### Facts

- connectivity hinting is useful but inherently weak.

### Recommendations

- expose connectivity only as advisory lifecycle context.

### Design Decision

- Browser Lifecycle Manager should never present onLine as proof of network health.

## 5. BroadcastChannel

### Overview

BroadcastChannel is the best general-purpose browser primitive for same-origin cross-tab communication when supported.

### Purpose

Coordinate lifecycle state, primary-tab ownership, and cross-tab metadata between browsing contexts.

### Primary Use Cases

- primary and secondary tab election
- cross-tab active-state coordination
- shared lifecycle notifications
- diagnostic and heartbeat messaging

### Practical Example

```text
tab A acquires leadership
tab B observes leadership heartbeat
tab A becomes hidden or closes
tab B promotes itself after timeout-based confirmation
```

### Advantages

- clean same-origin messaging model
- avoids same-tab echo semantics by default
- better ergonomics than storage-based messaging
- works across multiple contexts of the same origin

### Limitations

- not universal in all environments
- structured cloning rules apply
- requires naming discipline and cleanup

### Browser Support

Good across modern browsers, but not universal in older or constrained environments.

### Browser Differences

- older browsers and unusual webviews may lack support
- lifecycle timing around suspended tabs can affect message delivery expectations

### Security Considerations

- same-origin only, but still requires careful channel naming and payload discipline
- should not carry sensitive data without a clear need

### Performance Considerations

- generally efficient for lightweight coordination
- not appropriate for high-volume state replication

### Edge Cases

- sender does not receive its own message
- message ordering is transport-local but still subject to scheduling realities
- channel leaks can keep coordination logic alive longer than intended

### Feature Detection Strategy

Check for `BroadcastChannel` presence and instantiate only when supported.

### Fallback Strategy

Fallback to storage-based signaling for simple coordination if needed.

### Should Browser Lifecycle Manager Depend on This?

Only for optional cross-tab features, not for core lifecycle correctness.

### Implementation Priority

Medium to high for cross-tab mode.

### Version Recommendation

Optional in V1.

### Message Ordering

Ordering is usually sufficient for coordination, but it should not be treated as a transactional transport.

### Serialization

Structured clone semantics apply. Payloads should remain simple and bounded.

### Lifecycle and Cleanup

Channels should be created lazily, closed explicitly, and isolated per package instance.

### Leader Election and Primary Tab Detection

BroadcastChannel is a strong basis for these features, but the package should still tolerate channel loss, tab suspension, and delayed heartbeats.

### Facts

- BroadcastChannel is the strongest portable cross-tab primitive available for this use case.

### Recommendations

- prefer BroadcastChannel for optional cross-tab coordination whenever supported.

### Design Decision

- cross-tab coordination should be transport-based, not hard-wired to one API.

## 6. Storage Events

### Overview

`localStorage` plus the `storage` event provide a fallback cross-tab signaling path.

### Purpose

Offer a lower-fidelity transport when BroadcastChannel is unavailable.

### Primary Use Cases

- fallback heartbeat coordination
- last-writer signaling
- lightweight leadership metadata exchange

### Advantages

- widely available
- same-origin cross-tab reach
- suitable for simple coordination

### Limitations

- not evented in the same tab that writes
- depends on storage availability
- requires serialization, cleanup, and overwrite strategy
- weaker ergonomics and higher accidental complexity than BroadcastChannel

### Browser Support

Broad, but private browsing and restrictive environments may affect behavior.

### Browser Differences

- storage quotas and privacy restrictions vary
- embedded browsers and webviews may have unusual storage behavior

### Known Browser Issues

- private browsing may reduce or block usable storage behavior
- storage can appear present but be effectively unavailable for writes
- some environments apply aggressive storage restrictions or quota behavior

### Security Considerations

- storage persistence and inspection make it inappropriate for sensitive content
- coordination payloads should be minimal and non-sensitive

### Performance Considerations

- slower and noisier than BroadcastChannel
- excessive write frequency can degrade performance

### Edge Cases

- storage unavailable or blocked
- stale leadership entries
- conflicting tabs writing rapidly

### Feature Detection Strategy

Test both storage presence and actual writability. Presence alone is insufficient.

### Fallback Strategy

If storage transport is unavailable, disable cross-tab features rather than simulate them poorly.

### Should Browser Lifecycle Manager Depend on This?

Only as a fallback transport for optional coordination features.

### Implementation Priority

Medium.

### Version Recommendation

Optional in V1.

### Cross-Tab Synchronization

Useful for coarse synchronization, not for high-precision shared state.

### Ordering

Good enough for simple coordination with timestamps and term identifiers, not strict sequencing.

### Recommended Use

Use for fallback coordination only. Keep payloads tiny and bounded.

### When Storage Events Are Preferable

- when BroadcastChannel is unavailable
- when only coarse same-origin tab coordination is needed
- when portability matters more than transport elegance

### When BroadcastChannel Is Preferable

- when supported and cross-tab coordination is an important feature
- when transport ergonomics and lower accidental complexity matter
- when message semantics should avoid storage persistence side effects

### Facts

- storage events are useful mainly because of their availability, not because of their elegance.

### Recommendations

- prefer BroadcastChannel first and use storage only as a degraded transport.

### Design Decision

- storage transport should be optional and isolated from the core lifecycle model.

## 7. requestAnimationFrame

### Overview

`requestAnimationFrame` is a paint-aligned scheduling primitive that is useful only when a page is actively rendering.

### Purpose

Support visible-state scheduling, UI-aligned batching, or coalesced updates during active rendering periods.

### Scheduling

`requestAnimationFrame` schedules work relative to the browser's rendering loop.

### Rendering Synchronization

It is strongest when the package wants non-critical internal work to align with paint-driven activity.

### Frame Throttling

Frame cadence slows or pauses significantly in hidden or backgrounded states.

### Hidden Tab Behavior

This API becomes unreliable as a timing source once the page is hidden.

### Battery Optimization

Browsers often reduce frame cadence specifically to conserve resources, which is helpful for efficiency but makes the API unsuitable as lifecycle truth.

### Primary Use Cases

- flush visible-state work
- batch low-latency activity updates
- align observation work with rendering

### Advantages

- synchronized with paint
- naturally reduced in hidden contexts
- familiar and widely supported

### Limitations

- not useful as hidden-state truth
- frame throttling changes behavior across visibility states
- unsuitable for required lifecycle correctness

### Browser Support

Broad.

### Browser Differences

- background throttling behavior varies
- mobile and battery-sensitive environments may reduce cadence

### Security Considerations

- no special security concerns

### Performance Considerations

- good for visual alignment
- bad if used as a heartbeat or timer replacement across hidden states

### Edge Cases

- hidden tabs pause or severely throttle frames
- browser power-saving modes reduce frame cadence

### Feature Detection Strategy

Check for the API directly and keep it optional.

### Fallback Strategy

Fallback to timers for non-critical batching, or skip the optimization.

### Should Browser Lifecycle Manager Depend on This?

No for correctness. Yes for optional visible-state scheduling.

### Implementation Priority

Low to medium.

### Version Recommendation

Optional in V1.

### When Browser Lifecycle Manager Should Use It

- visible-state batching
- non-critical UI-aligned internal work

### When Browser Lifecycle Manager Should Avoid It

- hidden-state tracking
- idle timeout correctness
- cross-tab coordination

### Facts

- requestAnimationFrame is useful as an optimization, not as lifecycle truth.

### Recommendations

- use it only in optional internal scheduling paths.

### Design Decision

- Version 1 should not depend on frame cadence for correctness.

## 8. requestIdleCallback

### Overview

`requestIdleCallback` is a best-effort low-priority scheduling primitive. It is useful for optional work, not for required lifecycle behavior.

### Purpose

Schedule deferred, non-critical background work.

### Scheduling

This API provides a best-effort window for low-priority work rather than a predictable execution schedule.

### Primary Use Cases

- optional debug buffer cleanup
- low-priority bookkeeping
- deferred diagnostics

### Advantages

- good fit for deferrable work
- can reduce contention with urgent tasks

### Limitations

- uneven support
- timing is intentionally soft
- unsuitable for required lifecycle transitions

### Browser Support

Partial.

### Browser Differences

- support remains less universal than stronger core primitives
- background execution timing varies substantially

### Compatibility Concerns

The API remains too uneven and soft-timed to be part of the package's required lifecycle model.

### Security Considerations

- no special security concerns

### Performance Considerations

- can help defer low-value work
- overreliance creates correctness and predictability problems

### Edge Cases

- callback delayed far longer than expected
- no useful idle period in busy or constrained contexts

### Feature Detection Strategy

Check for the API directly and treat it as opportunistic.

### Fallback Strategy

Fallback to timeout-based low-priority scheduling or skip the behavior.

### Background Work

This API is acceptable only for work that can be delayed substantially or dropped without affecting lifecycle correctness.

### Should Browser Lifecycle Manager Depend on This?

No.

### Implementation Priority

Low.

### Version Recommendation

Future or optional only.

### IdleDeadline and Timeout

Useful for optional scheduling decisions, but not strong enough to define lifecycle behavior.

### When It Should Be Optional

- always

### Facts

- this API is appropriate only for non-essential work.

### Recommendations

- do not rely on requestIdleCallback for Version 1 lifecycle correctness.

### Design Decision

- keep it out of the critical path.

## 9. AbortController

### Overview

AbortController and AbortSignal provide a modern cleanup and cancellation primitive well suited to lifecycle-driven systems.

### Purpose

Coordinate teardown of event listeners, timers, transports, and asynchronous work.

### Cancellation

AbortController provides a common cancellation channel for long-lived observers and restartable work.

### Cleanup

It allows one lifecycle owner to shut down related listeners and tasks coherently.

### Memory Management

It reduces the risk of stale observers and forgotten cleanup branches.

### Event Listener Cleanup

It fits especially well with event-target listener registration and grouped teardown.

### Primary Use Cases

- observer cleanup
- restart-safe teardown
- cancellation of pending internal work
- memory leak prevention

### Advantages

- explicit and composable
- increasingly standard across browser APIs
- improves teardown correctness

### Limitations

- not itself a lifecycle signal
- older environments may require internal fallback abstractions

### Browser Support

High across modern browsers.

### Browser Differences

- older browsers and some constrained environments may support less of the broader abort ecosystem, but the core primitive is now widely usable

### Security Considerations

- no direct security concern

### Performance Considerations

- low overhead
- reduces leak and stale-listener risk

### Edge Cases

- mixing abort-driven cleanup with legacy manual teardown can create duplication if not disciplined

### Feature Detection Strategy

Check for AbortController and keep a minimal internal fallback abstraction only if required.

### Fallback Strategy

Use explicit unsubscribe and cleanup collections in environments that cannot support it.

### Should Browser Lifecycle Manager Depend on This?

Yes, as an internal implementation primitive.

### Implementation Priority

High.

### Version Recommendation

Required for V1 internal design, with a fallback only if compatibility policy demands it.

### Cleanup Patterns

Abort-driven teardown fits the package's explicit ownership model well and helps avoid long-lived observer leaks.

### Memory Leak Prevention

This is one of the strongest platform primitives for maintaining cleanup discipline.

### Recommended Usage Throughout Browser Lifecycle Manager

- observer registration
- transport lifecycle management
- optional scheduled work cancellation

### Facts

- AbortController is a strong fit for the package's lifecycle ownership model.

### Recommendations

- standardize internal cleanup around abort semantics where supported.

### Design Decision

- teardown discipline should be a core implementation requirement.

## Cross-API Comparison

### Decision Table

| Capability                      | Reliability         | Browser Support | Performance           | Ease of Use | Complexity     | Fallback Availability | Recommended for V1 | Recommended for Future |
| ------------------------------- | ------------------- | --------------- | --------------------- | ----------- | -------------- | --------------------- | ------------------ | ---------------------- |
| Page Visibility API             | high                | high            | high                  | high        | low            | medium                | yes                | yes                    |
| Page Lifecycle advanced signals | medium              | medium          | medium                | medium      | medium to high | medium                | partial            | yes                    |
| focus and blur                  | medium              | high            | high                  | high        | low            | medium                | yes                | yes                    |
| pagehide and pageshow           | medium              | high            | high                  | medium      | medium         | medium                | yes                | yes                    |
| navigator.onLine                | low to medium       | high            | high                  | high        | low            | high                  | optional           | yes                    |
| BroadcastChannel                | high when supported | medium to high  | medium to high        | medium      | medium         | medium                | optional           | yes                    |
| storage event                   | medium              | high            | medium                | medium      | medium         | high                  | optional           | yes                    |
| requestAnimationFrame           | medium              | high            | high for visible work | high        | low            | high                  | optional           | yes                    |
| requestIdleCallback             | low                 | medium          | medium                | medium      | low            | high                  | no                 | yes                    |
| AbortController                 | high                | high            | high                  | high        | low            | medium                | yes                | yes                    |

### Comparison Conclusions

- strongest V1 foundations: visibility, focus and blur, pagehide and pageshow, AbortController
- strongest optional V1 enhancement: BroadcastChannel with storage fallback
- weakest correctness primitive: requestIdleCallback
- most misleading "simple" primitive: navigator.onLine

## 10. Feature Detection Strategy

### Detection Philosophy

Browser Lifecycle Manager should never rely on browser sniffing. It should detect concrete capabilities and then enable the smallest compatible behavior set for the current environment.

### Rules

- detect APIs, not brands
- distinguish presence from real usability where needed
- avoid silent downgrade of semantics
- expose weaker semantics honestly when fallbacks are active

### Good Approaches

- check for `document.visibilityState` before enabling visibility observer logic
- check that storage is writable before enabling storage transport
- check for BroadcastChannel before enabling that transport

### Bad Approaches

- assuming Safari means no useful lifecycle features
- assuming Chromium means all advanced lifecycle paths work identically
- using user-agent parsing as the primary branching mechanism

### Recommended Patterns

- capability-gated observer activation
- explicit downgrade of semantics when stronger APIs are absent
- transport abstraction so BroadcastChannel and storage fallback stay swappable

### Future-Proof Strategies

- keep advanced lifecycle features opt-in or capability-gated
- isolate browser-specific caveats in compatibility logic rather than public semantics
- revisit support assumptions before each release candidate

### Acceptable

- capability-gated branches with environment notes for known engine differences

### Poor

- assuming Safari means no useful lifecycle features
- assuming Chromium means all advanced lifecycle paths work identically

### Unacceptable

- user agent parsing as the primary compatibility strategy
- shipping one browser-specific code path as the default truth model

### Design Decision

- package behavior should be defined by detected capability sets, not browser identity.

## 11. Browser Compatibility Matrix

Legend:

- `Supported`: broadly usable for the intended purpose
- `Partial`: usable with important caveats
- `Experimental`: not strong enough for default reliance
- `Unsupported`: should not be expected

| Capability                 | Chrome    | Edge      | Firefox   | Safari    | Safari iOS | Android Chrome | Electron  | PWA Context | Known Issues                                                        |
| -------------------------- | --------- | --------- | --------- | --------- | ---------- | -------------- | --------- | ----------- | ------------------------------------------------------------------- |
| Page Visibility API        | Supported | Supported | Supported | Supported | Supported  | Supported      | Supported | Supported   | hidden may be the last reliable signal before discard               |
| focus and blur             | Supported | Supported | Supported | Supported | Partial    | Supported      | Supported | Partial     | attention is not equal to visibility                                |
| pagehide and pageshow      | Supported | Supported | Supported | Supported | Supported  | Supported      | Supported | Supported   | restore semantics still vary by environment                         |
| advanced lifecycle signals | Partial   | Partial   | Partial   | Partial   | Partial    | Partial        | Partial   | Partial     | support and nuance are engine-dependent                             |
| navigator.onLine           | Supported | Supported | Supported | Supported | Supported  | Supported      | Supported | Supported   | false positives and false negatives are common                      |
| BroadcastChannel           | Supported | Supported | Supported | Partial   | Partial    | Supported      | Supported | Partial     | webviews and constrained environments may lag                       |
| storage event              | Supported | Supported | Supported | Supported | Partial    | Supported      | Supported | Partial     | storage availability may be limited in private or embedded contexts |
| requestAnimationFrame      | Supported | Supported | Supported | Supported | Supported  | Supported      | Supported | Supported   | hidden tabs throttle or pause frame cadence                         |
| requestIdleCallback        | Supported | Supported | Partial   | Partial   | Partial    | Supported      | Supported | Partial     | timing is too soft for correctness work                             |
| AbortController            | Supported | Supported | Supported | Supported | Supported  | Supported      | Supported | Supported   | fallback may still be needed for legacy policy targets              |

Notes:

- mobile and PWA contexts are heavily affected by backgrounding and process management rules
- BroadcastChannel and storage behavior can be weaker in restrictive or embedded environments
- advanced lifecycle nuance should be assumed partial unless proved otherwise

## 12. Known Browser Quirks

| Environment                    | Issue                                                                             | Impact                                        | Mitigation                                          | Recommended Browser Lifecycle Manager Behavior   |
| ------------------------------ | --------------------------------------------------------------------------------- | --------------------------------------------- | --------------------------------------------------- | ------------------------------------------------ |
| Safari                         | restoration and lifecycle nuance are less uniform than Chromium guidance suggests | overconfident lifecycle states become brittle | capability-gate advanced lifecycle semantics        | keep Safari behavior conservative                |
| Firefox                        | some lifecycle refinements differ from Chromium-oriented examples                 | borrowed assumptions may not port cleanly     | rely on broadly supported events first              | prioritize visibility plus pagehide and pageshow |
| Mobile browsers                | app switching and task killing can truncate event chains                          | missing "final" events                        | treat hidden as likely last reliable signal         | never promise clean termination                  |
| Background tabs                | timers and frames are throttled or paused                                         | idle logic and heartbeats drift               | use explicit caveat-aware heuristics                | avoid precision claims                           |
| Battery saving mode            | scheduling slows further                                                          | delayed transitions or stale heartbeats       | allow degraded behavior                             | keep coordination tolerant of delay              |
| Private browsing               | storage availability may be constrained                                           | fallback transport may fail                   | probe writability before enabling storage transport | disable storage fallback if unavailable          |
| Embedded browsers and webviews | browser support may diverge from full browsers                                    | compatibility assumptions weaken              | capability-detect everything                        | keep feature set minimal by default              |

## 13. Engineering Recommendations

| Capability                 | Use             | Avoid               | Wrap                                     | Treat as Optional | Replace with Another Approach                        | Why                                                       |
| -------------------------- | --------------- | ------------------- | ---------------------------------------- | ----------------- | ---------------------------------------------------- | --------------------------------------------------------- |
| Page Visibility API        | yes             | no                  | yes                                      | no                | no                                                   | strongest baseline visibility signal                      |
| focus and blur             | yes             | no                  | yes                                      | no                | no                                                   | useful attention layer when kept distinct from visibility |
| pagehide and pageshow      | yes             | no                  | yes                                      | no                | no                                                   | needed for restoration and navigation refinement          |
| advanced lifecycle signals | yes selectively | no                  | yes                                      | yes               | no                                                   | valuable but uneven                                       |
| navigator.onLine           | yes selectively | no                  | yes                                      | yes               | yes when hard network truth is required              | only valid as advisory connectivity context               |
| BroadcastChannel           | yes selectively | no                  | yes                                      | yes               | storage fallback when unavailable                    | best optional transport for cross-tab coordination        |
| storage event              | yes as fallback | no                  | yes                                      | yes               | BroadcastChannel when supported                      | broad but weaker fallback transport                       |
| requestAnimationFrame      | yes selectively | no                  | yes                                      | yes               | timers or no-op optimization path in hidden contexts | optimization tool, not core truth                         |
| requestIdleCallback        | no for core     | yes for correctness | yes if added later                       | yes               | timeout-based low-priority scheduling                | too weak for required behavior                            |
| AbortController            | yes             | no                  | yes                                      | no                | explicit cleanup collections for legacy targets      | strong cleanup and cancellation primitive                 |
| unload                     | no              | yes                 | no                                       | no                | pagehide and visibility-based reasoning              | harmful legacy assumption and poor modern fit             |
| beforeunload               | no for core     | yes for core        | maybe for future consumer escape hatches | yes               | explicit consumer-owned unsaved-work handling        | user-warning escape hatch only                            |

### Recommendation Summary

Version 1 should center on:

- Page Visibility API
- focus and blur
- pagehide and pageshow
- AbortController

Version 1 may optionally add:

- advanced lifecycle enhancements
- advisory connectivity
- BroadcastChannel cross-tab coordination
- storage fallback transport
- requestAnimationFrame internal optimization

Version 1 should avoid relying on:

- unload
- beforeunload as lifecycle truth
- requestIdleCallback for correctness

## 14. Version 1 Decisions

| Capability                         | Classification | Justification                                                                   |
| ---------------------------------- | -------------- | ------------------------------------------------------------------------------- |
| Page Visibility API                | Required       | strongest and most portable visibility baseline                                 |
| focus and blur                     | Required       | necessary secondary attention layer when kept distinct from visibility          |
| pagehide and pageshow              | Required       | needed for restoration and navigation refinement in modern browsers             |
| AbortController                    | Required       | strongest cleanup and cancellation primitive for disciplined internal ownership |
| advanced lifecycle signals         | Optional       | useful where supported, but too uneven for required correctness                 |
| navigator.onLine                   | Optional       | useful advisory context, but too weak for guarantees                            |
| BroadcastChannel                   | Optional       | best cross-tab transport, but not universal enough to make core                 |
| storage event                      | Optional       | valuable fallback for coordination, but lower fidelity than BroadcastChannel    |
| requestAnimationFrame              | Optional       | internal optimization tool, not a lifecycle truth source                        |
| requestIdleCallback                | Future         | appropriate only for non-essential deferred work                                |
| Idle Detection API                 | Experimental   | support and permission posture make it unsuitable for V1 reliance               |
| Navigation API                     | Experimental   | promising but still too emerging for core lifecycle dependence                  |
| unload                             | Rejected       | discouraged, unreliable, and harmful to modern browser behavior                 |
| beforeunload as lifecycle detector | Rejected       | inappropriate for lifecycle truth and heavily restricted by browsers            |

### Decision Records

- Required capabilities define the minimum reliable lifecycle substrate.
- Optional capabilities improve coverage or ergonomics but must not change correctness guarantees when absent.
- Future and experimental capabilities belong behind separate follow-up design work.
- Rejected capabilities should stay out of the core package unless the product scope changes substantially.

## Future Browser APIs

| API                     | Purpose                                 | Current Support Posture           | Why It Should or Should Not Be Considered                                                           | Potential Roadmap Version        |
| ----------------------- | --------------------------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------- | -------------------------------- |
| Idle Detection API      | stronger device and user idle awareness | partial and permission-sensitive  | too heavy and too support-sensitive for Version 1 core, but valuable for future enhancement         | 2.x experimental                 |
| Navigation API          | richer navigation lifecycle modeling    | emerging                          | promising for future navigation-aware lifecycle refinement, but not mature enough for core reliance | 2.x or later                     |
| Scheduler API           | more advanced task prioritization       | emerging                          | useful for internal optimization, not for V1 correctness                                            | 2.x experimental                 |
| Screen Wake Lock API    | keep device awake intentionally         | partial                           | adjacent to lifecycle use cases but not part of lifecycle observation                               | out of scope unless plugin-based |
| Network Information API | richer connectivity hints               | uneven                            | too inconsistent for core connectivity semantics                                                    | future optional research only    |
| View Transition API     | visual transition coordination          | growing but not lifecycle-centric | useful for UX, not lifecycle truth                                                                  | out of scope                     |

### Future Ideas

- diagnostics plugin that consumes Performance API and optional scheduler features
- advanced idle module that optionally integrates permissioned or experimental APIs
- richer transport plugins for cross-context coordination

## Final Review

### Stable APIs

- Page Visibility API
- focus and blur
- pagehide and pageshow
- AbortController
- requestAnimationFrame as an optimization primitive

### Risky APIs

- navigator.onLine when treated too strongly
- storage event if treated as a precise coordination channel
- advanced lifecycle signals when assumed uniform

### Experimental or Support-Sensitive APIs

- requestIdleCallback for portable correctness
- richer lifecycle enhancements beyond broadly available events
- future scheduling and navigation APIs

### Deprecated or Discouraged APIs

- unload
- beforeunload as a lifecycle detector

### Browser Inconsistencies

- mobile truncates lifecycle event chains
- Safari and embedded environments require conservative assumptions
- background throttling disrupts timer precision

### Performance Risks

- noisy activity observation
- storage-based heartbeat chatter
- assuming visible-state scheduling works in hidden states

### Maintenance Risks

- browser support assumptions aging without regular review
- optional capability branches growing more complicated than the required core
- documentation drifting away from actual tested browser behavior

### Potential Technical Debt

- overpromising lifecycle certainty
- coupling the package too tightly to one engine's lifecycle story
- blending optional transports into the required core

### Exact Version 1 Inclusion Recommendation

Include in Version 1:

- Page Visibility API
- focus and blur
- pagehide and pageshow
- AbortController

Include as optional Version 1 enhancements:

- advanced lifecycle signals when capability-detected
- BroadcastChannel transport
- storage fallback transport
- advisory connectivity hinting
- requestAnimationFrame-based internal optimization

Exclude from Version 1 correctness requirements:

- requestIdleCallback
- unload
- beforeunload-based lifecycle truth
- experimental future APIs

## Critical Review

This document supports a layered Version 1 strategy and keeps the package honest about uncertainty. Its main strength is that it distinguishes strong signals from weak hints and cleanly separates required foundations from optional enhancements. Its main risk is that browser support language may drift over time, so this document should be re-reviewed before the first public release candidate.

## Suggested Improvements

- Recheck the compatibility matrix before implementation begins if browser targets change.
- Add concrete test-scenario mapping once the architecture phase formalizes observer boundaries.
- Keep future APIs in separate experimental tracks so they do not leak into the core lifecycle model.
