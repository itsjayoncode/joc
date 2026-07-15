# 007 Runtime Compatibility

## Why This Document Exists

This document defines the runtime and platform compatibility policy for Browser Lifecycle Manager. It establishes where the package is fully supported, partially supported, experimental, or intentionally unsupported, and explains how graceful degradation should work when browser capabilities differ.

Related documents:

- [002 Browser Platform Research](./002-browser-platform-research.md)
- [005 Event Specification](./005-event-specification.md)
- [006 Configuration Design](./006-configuration-design.md)
- [011 Design Decisions](./011-design-decisions.md)

## 1. Compatibility Philosophy

### Why Compatibility Matters

Browser Lifecycle Manager sits directly on top of uneven browser behavior. A vague compatibility story would undermine the package more than limited support would. Compatibility policy matters because lifecycle correctness depends on knowing when the package can speak confidently and when it must degrade conservatively.

### Supported Philosophy

Support should mean:

- documented behavior
- tested behavior
- predictable degradation
- realistic lifecycle semantics

### Unsupported Philosophy

Unsupported should mean:

- the package will not pretend to work correctly
- documentation clearly tells the developer what to expect
- failure or no-op behavior is intentional rather than accidental

### Progressive Enhancement

The package should establish a strong core contract on widely available capabilities, then layer richer behavior where optional capabilities are present.

### Graceful Degradation

When optional capabilities are absent, the package should:

- keep the core instance usable
- suppress events it cannot support honestly
- expose missing capabilities through status or capability reporting
- avoid throwing unless the environment cannot support the core contract at all

### Future Compatibility Goals

- keep the support story stable across modern browser evolution
- add capability-based enhancements without forcing major rewrites
- avoid binding the public contract to one engine's behavior

### Why Modern Browsers Instead of Legacy Browsers

Browser Lifecycle Manager targets modern browsers because lifecycle correctness depends on APIs and semantics that are not portable to legacy environments without severe distortion. Supporting fewer runtimes well is better than claiming wide support with misleading guarantees.

## 2. Supported Runtimes

### Runtime Matrix

| Runtime               | Support Level                | Reasoning                                                              | Notes                                         |
| --------------------- | ---------------------------- | ---------------------------------------------------------------------- | --------------------------------------------- |
| Chrome                | Fully Supported              | strongest modern lifecycle surface                                     | primary validation target                     |
| Firefox               | Fully Supported              | strong baseline support with some lifecycle nuance differences         | validate background behavior carefully        |
| Safari Desktop        | Partially Supported          | supported core contract, reduced lifecycle nuance                      | conservative lifecycle semantics recommended  |
| Edge                  | Fully Supported              | Chromium-based with enterprise relevance                               | treat close to Chrome with enterprise caution |
| Electron Renderer     | Partially Supported          | browser-like renderer with host-specific window behavior               | document caveats clearly                      |
| Progressive Web Apps  | Partially Supported          | useful and supported, but OS lifecycle remains outside package control | mobile caveats remain important               |
| Server Side Rendering | Unsupported for live runtime | no browser globals or lifecycle surface                                | import-safe behavior required                 |
| Hybrid Frameworks     | Partially Supported          | browser runtime support depends on client-only usage                   | hydration timing matters                      |
| Embedded WebViews     | Experimental                 | behavior varies heavily by host and version                            | capability validation required                |

## 3. Chrome

### Supported Browser APIs

Chrome provides strong support for:

- Page Visibility API
- focus and blur
- pagehide and pageshow
- BroadcastChannel
- storage events
- navigator.onLine
- AbortController
- requestAnimationFrame

### Known Browser Quirks

- background throttling changes timer precision
- discard and restoration semantics may vary by lifecycle path
- platform guidance is rich, but should not be mistaken for universal browser behavior

### Performance Considerations

- strong baseline for visible-state scheduling
- hidden-state timer assumptions still need caution

### Recommended Support Strategy

- treat Chrome as the reference implementation target
- validate that no Chrome-specific optimizations leak into required semantics

### Minimum Browser Version Recommendation

Support should follow a modern evergreen philosophy rather than a hard-coded old-version promise. The package should target current maintained Chrome releases and re-evaluate minimum versions only when a required baseline capability changes.

### Future Considerations

- Chrome may adopt new lifecycle features earlier than others; they should remain optional until portable enough for public guarantees

## 4. Firefox

### Browser Support

Firefox supports the core lifecycle surface needed for Version 1.

### Lifecycle Behavior

- visibility, focus, and navigation-adjacent lifecycle behavior are strong enough for baseline support
- some lifecycle refinements differ from Chromium-oriented guidance

### Feature Differences

- advanced lifecycle nuance should not be assumed to match Chromium
- timing behavior in background conditions may differ

### Limitations

- cross-browser lifecycle parity should not be assumed from successful Chromium tests

### Recommended Handling

- treat Firefox as a first-class supported runtime
- validate background throttling and restore behavior separately from Chrome

## 5. Safari

### Desktop Safari

Desktop Safari should be treated as supported for the core contract, with conservative assumptions around advanced lifecycle nuance.

### Mobile Safari

Mobile Safari should be treated as partially supported because app switching, background suspension, and process termination can truncate lifecycle event chains more aggressively.

### Known Lifecycle Limitations

- reduced visibility into advanced lifecycle phases
- less uniform restoration nuance than Chromium guidance implies
- more abrupt background or process interruption behavior

### Background Tab Behavior

Background tabs may suspend work more aggressively and reduce event predictability.

### Visibility Behavior

Visibility remains valuable, but hidden may be the last strong signal before interruption.

### Known Browser Inconsistencies

- focus and lifecycle timing may differ from Chromium
- some advanced lifecycle-related features remain partial or absent

### Recommended Browser Lifecycle Manager Behavior

- treat visibility as the strongest signal
- avoid overclaiming suspend and restore precision
- preserve a conservative event model

### Fallback Strategy

- baseline visibility plus pagehide/pageshow semantics
- omit advanced lifecycle events when support is not strong enough

## 6. Edge

### Support Level

Edge should be treated as fully supported under the same evergreen philosophy as modern Chromium browsers.

### Compatibility with Chromium

Most Chromium-oriented baseline behavior should translate well, but the package should still validate enterprise-use scenarios and not assume identical deployment environments.

### Known Differences

- enterprise environments may pin versions longer
- policy-managed installations may expose more conservative rollout constraints

### Enterprise Considerations

Documentation should avoid tying the package to one exact fast-moving Chrome behavior when Edge enterprise users may update more slowly.

## 7. Electron

### Supported APIs

Electron renderer contexts usually expose the core browser APIs the package needs, depending on embedded Chromium version and host configuration.

### Lifecycle Behavior

- browser lifecycle signals are still useful in renderer windows
- host application lifecycle is not the same as page lifecycle

### Window Behavior

Window focus, blur, visibility, and multi-window behavior may be influenced by the Electron host application.

### Background Behavior

Background behavior can differ from ordinary browser tabs, especially in desktop-window patterns.

### Multi-Window Considerations

Cross-window and multi-window coordination may be useful, but the package should stay centered on browser-like semantics rather than Electron host orchestration.

### Plugin Opportunities

Electron is a strong candidate for plugin-based integrations that bridge renderer lifecycle with host application context.

### Recommendations

- support Electron renderer usage with caveats
- document host-specific lifecycle differences clearly
- avoid claiming host-app lifecycle control

## 8. Progressive Web Apps

### Background Execution

PWAs still obey browser and OS lifecycle constraints. Installation mode does not make the package omnipotent.

### Offline Support

Advisory connectivity remains useful, but offline-first behavior belongs partly to application architecture rather than package guarantees.

### Wake Behavior

Wake and restore semantics remain best-effort and environment-dependent.

### Lifecycle Behavior

Visibility, pagehide/pageshow, and optional restoration semantics remain relevant in installed app contexts.

### Installation Mode

Installed display mode affects user expectations but does not erase browser lifecycle caveats.

### Foreground and Background Transitions

These transitions can feel more application-like, but the package should still model them conservatively.

### Recommendations

- treat PWAs as supported with caveats
- emphasize graceful degradation and restoration uncertainty

## 9. Server Side Rendering

### SSR Philosophy

Browser Lifecycle Manager should not run as a live lifecycle engine on the server.

### Should It Run on the Server?

No.

### How Should It Behave During Hydration?

- import should remain safe if browser-only work is deferred
- initialization should happen on the client, after browser globals are available

### When Should Browser Lifecycle Manager Initialize?

Only in a client-capable runtime after the relevant document and window surfaces exist.

### How Should Unsupported Browser Globals Be Handled?

- no implicit access at import time
- runtime guard behavior should prevent accidental server-side startup

### Expected Developer Experience

Developers should be able to import the package in SSR-capable codebases as long as actual instance creation is client-only.

## 10. Feature Detection Policy

### Browser Capability Detection

The package must use capability detection, not browser sniffing.

### Recommended Feature Detection Patterns

- check API presence directly
- verify writable storage instead of assuming storage exists because the global exists
- gate advanced lifecycle semantics by actual support, not engine name

### Fallback Hierarchy

```text
preferred capability
  -> fallback capability
  -> no-op or degraded behavior
```

### Optional Browser Features

- advanced lifecycle nuance
- BroadcastChannel
- storage fallback transport
- requestAnimationFrame optimization
- advisory connectivity

### Required Browser Features

For the core useful runtime contract, the environment should provide:

- window-like runtime
- document visibility support or a clearly documented reduced baseline
- basic event target support
- enough browser APIs to maintain snapshot and event semantics honestly

## 11. Unsupported Environments

### Intentionally Unsupported Environments

| Environment        | Why Unsupported                                                | Expected Behavior        | Developer Guidance                                  |
| ------------------ | -------------------------------------------------------------- | ------------------------ | --------------------------------------------------- |
| Legacy browsers    | lifecycle guarantees become too weak or too costly to preserve | unsupported              | use a more basic solution or accept lack of support |
| Node-only runtime  | no browser lifecycle surface                                   | do not run live instance | create only in browser/client runtime               |
| Service Workers    | no window/document lifecycle contract                          | unsupported              | use specialized worker-oriented tooling             |
| Cloudflare Workers | same as service-worker-style runtime                           | unsupported              | do not instantiate there                            |
| Deno without DOM   | no browser lifecycle surface                                   | unsupported              | browser-only usage                                  |
| Bun without DOM    | no browser lifecycle surface                                   | unsupported              | browser-only usage                                  |

## 12. Fallback Strategy

### Capability Fallback Table

| Capability           | Preferred Implementation                          | Fallback Implementation                              | No-op Behavior                                                      | Graceful Degradation             | Developer Notification | Throw?                                 |
| -------------------- | ------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------- | -------------------------------- | ---------------------- | -------------------------------------- |
| visibility           | Page Visibility API                               | reduced focus/pagehide interpretation only if needed | unsupported core semantics if no meaningful visibility basis exists | weaker lifecycle confidence      | capability reporting   | only if core contract cannot be honest |
| lifecycle refinement | pagehide/pageshow plus advanced lifecycle signals | pagehide/pageshow only                               | omit suspend/resume detail                                          | keep baseline lifecycle          | capability reporting   | no                                     |
| focus                | window focus/blur                                 | none                                                 | omit attention detail                                               | visibility-only model            | capability reporting   | no                                     |
| connectivity         | navigator.onLine and related events               | none                                                 | omit connectivity hint                                              | no advisory events               | debug warning optional | no                                     |
| cross-tab            | BroadcastChannel                                  | storage events                                       | disable cross-tab features                                          | no primary/secondary role events | capability reporting   | no                                     |
| idle                 | configured activity observer                      | reduced activity set                                 | disable idle events                                                 | no derived activity transitions  | config clarity         | no                                     |
| diagnostics          | debug buffer and optional scheduling              | minimal diagnostics                                  | no retained debug features                                          | core still works                 | none by default        | no                                     |

### When Browser Lifecycle Manager Should Silently Continue

- optional capability missing
- optional transport unavailable
- advisory connectivity unavailable

### When Browser Lifecycle Manager Should Throw

- environment cannot support an honest core lifecycle instance
- invalid consumer assumptions are encoded in configuration in a future version

## 13. Compatibility Matrix

| Platform                   | Visibility                       | Lifecycle                         | Focus       | Connectivity     | Cross Tab                     | Idle                   | Plugins                 | Status              | Notes                           |
| -------------------------- | -------------------------------- | --------------------------------- | ----------- | ---------------- | ----------------------------- | ---------------------- | ----------------------- | ------------------- | ------------------------------- |
| Chrome                     | strong                           | strong with optional enhancements | strong      | advisory         | strong with optional fallback | strong when configured | supported               | stable              | primary target                  |
| Firefox                    | strong                           | good with caveats                 | strong      | advisory         | good                          | strong when configured | supported               | stable              | validate background differences |
| Safari Desktop             | strong                           | partial                           | good        | advisory         | partial                       | best-effort            | supported               | stable with caveats | conservative lifecycle modeling |
| Safari iOS / Mobile Safari | strong but sometimes last signal | partial                           | partial     | advisory         | partial                       | best-effort            | supported with caveats  | stable with caveats | mobile suspension risk          |
| Edge                       | strong                           | strong with optional enhancements | strong      | advisory         | strong                        | strong when configured | supported               | stable              | enterprise note                 |
| Electron Renderer          | good                             | good with host caveats            | good        | advisory         | environment-dependent         | good when configured   | plugin-friendly         | stable with caveats | host lifecycle differs          |
| PWA                        | good                             | partial to good                   | good        | advisory         | environment-dependent         | best-effort            | supported               | stable with caveats | OS lifecycle still applies      |
| SSR                        | unsupported live runtime         | unsupported                       | unsupported | unsupported      | unsupported                   | unsupported            | config/import safe only | unsupported runtime | client-only init required       |
| Embedded WebViews          | variable                         | variable                          | variable    | advisory at best | variable                      | variable               | experimental            | experimental        | capability validation required  |

## 14. Version Support Policy

### Minimum Supported Browser Philosophy

Support policy should target current maintained modern browsers rather than promising historical long-tail coverage.

### Handling Browser Changes

- re-evaluate support assumptions as browsers evolve
- keep new capabilities optional until stable enough
- avoid tying public guarantees to experimental platform features

### Policy for Dropping Old Browsers

Drops should be conservative and justified by maintenance burden or loss of correctness. Such changes should be treated with semver seriousness.

### Policy for Introducing New Browser Capabilities

New capabilities should begin as optional or experimental if support is uneven.

### Semantic Versioning Implications

- dropping support for a previously documented supported runtime is a significant compatibility change
- redefining fallback behavior may also require careful versioning communication

## 15. Testing Strategy

### Runtimes That Must Be Tested

- Chrome or Chromium
- Firefox
- Safari
- one mobile Safari or equivalent mobile browser path where feasible
- Electron renderer path if officially documented as supported with caveats

### Manual Testing

Manual validation should cover:

- tab switching
- hidden-state behavior
- restore paths
- multiple tabs
- browser shutdown-like conditions where observable

### Automated Testing

Automated tests should verify:

- normalized event ordering
- snapshot correctness
- capability gating
- fallback behavior

### Browser Matrix

The release process should validate at least one representative browser per support tier.

### Electron Testing

Electron should be tested in renderer-focused scenarios if it remains an official caveated target.

### SSR Testing

SSR tests should verify import safety and client-only startup behavior.

### PWA Testing

PWA testing should emphasize backgrounding, foreground return, and install-mode caveats where feasible.

### Regression Strategy

Compatibility regressions should be tracked by platform and capability, not just by generic package failure.

## 16. Design Decisions

### ADR-001: Modern Browsers First

| Field                 | Record                                                     |
| --------------------- | ---------------------------------------------------------- |
| Decision              | target modern evergreen browsers instead of legacy breadth |
| Reason                | correctness over nominal coverage                          |
| Alternatives          | legacy-browser broad support                               |
| Tradeoffs             | smaller supported set                                      |
| Future Impact         | more honest long-term maintenance                          |
| Rejected Alternatives | legacy-first support strategy                              |

### ADR-002: Capability Detection Over Browser Sniffing

| Field                 | Record                                                          |
| --------------------- | --------------------------------------------------------------- |
| Decision              | use capability detection exclusively in the compatibility model |
| Reason                | future-proofing and correctness                                 |
| Alternatives          | user-agent branching                                            |
| Tradeoffs             | more careful capability gating needed                           |
| Future Impact         | better resilience to browser evolution                          |
| Rejected Alternatives | browser-name-based support matrix logic                         |

### ADR-003: Graceful Degradation for Optional Features

| Field                 | Record                                                   |
| --------------------- | -------------------------------------------------------- |
| Decision              | degrade optional behavior instead of throwing            |
| Reason                | stable core experience across uneven capability surfaces |
| Alternatives          | fail-fast on optional gaps                               |
| Tradeoffs             | consumers must inspect capabilities for advanced paths   |
| Future Impact         | easier adoption                                          |
| Rejected Alternatives | strict fail-fast optional support model                  |

### ADR-004: Unsupported Means Documented Refusal

| Field                 | Record                                             |
| --------------------- | -------------------------------------------------- |
| Decision              | explicitly refuse unsupported runtime expectations |
| Reason                | avoid misleading support claims                    |
| Alternatives          | unofficial soft support everywhere                 |
| Tradeoffs             | fewer claimed runtimes                             |
| Future Impact         | stronger trust in docs                             |
| Rejected Alternatives | ambiguous support posture                          |

## 17. Compatibility Checklist

| Runtime           | Stable               | Well Tested            | Predictable | Documented | Gracefully Degraded | Recommended Status       |
| ----------------- | -------------------- | ---------------------- | ----------- | ---------- | ------------------- | ------------------------ |
| Chrome            | yes                  | yes                    | yes         | yes        | yes                 | fully supported          |
| Firefox           | yes                  | yes                    | yes         | yes        | yes                 | fully supported          |
| Safari Desktop    | mostly               | should be strengthened | mostly      | yes        | yes                 | partially supported      |
| Safari Mobile     | mixed                | should be strengthened | mixed       | yes        | yes                 | partially supported      |
| Edge              | yes                  | yes                    | yes         | yes        | yes                 | fully supported          |
| Electron Renderer | mixed                | should be strengthened | mostly      | yes        | yes                 | partially supported      |
| PWA               | mixed                | should be strengthened | mostly      | yes        | yes                 | partially supported      |
| SSR               | n/a for live runtime | yes for import safety  | yes         | yes        | yes                 | unsupported live runtime |
| Embedded WebViews | no                   | no                     | no          | partial    | partial             | experimental             |

## Final Review

### Is Browser Lifecycle Manager Targeting Too Many Runtimes?

No, provided the documentation remains disciplined about what is fully supported versus caveated versus unsupported.

### Should Support Be Reduced?

Possibly for Electron or WebViews if implementation-time testing cannot keep up. Those should remain caveated rather than over-promised.

### Are Fallbacks Realistic?

Yes, if they remain conservative and capability-driven rather than trying to emulate unsupported browser behavior too aggressively.

### Are Unsupported Platforms Clearly Documented?

Yes. The package should continue to be explicit about SSR, worker-style runtimes, and Node-only use.

### Would This Policy Still Make Sense Five Years From Now?

Yes, because it is built around modern-browser philosophy, capability detection, and graceful degradation rather than hard-coded vendor assumptions.

### Recommendations Before Implementation Begins

- strengthen Safari and mobile validation expectations early
- keep Electron and WebView support clearly caveated until tested deeply
- document unsupported live runtimes prominently in the package README
- keep compatibility guarantees tied to tested capability sets rather than browser marketing names
