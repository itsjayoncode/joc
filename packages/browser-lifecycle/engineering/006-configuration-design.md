# 006 Configuration Design

## Why This Document Exists

This document defines the configuration system for Browser Lifecycle Manager. It explains what can be configured, what should remain fixed, how defaults and overrides interact, how validation behaves, and how the configuration model should evolve over time without becoming noisy or unstable.

Related documents:

- [004 Public API Design](./004-public-api-design.md)
- [005 Event Specification](./005-event-specification.md)
- [007 Runtime Compatibility](./007-runtime-compatibility.md)
- [011 Design Decisions](./011-design-decisions.md)

## 1. Configuration Philosophy

### Why Browser Lifecycle Manager Uses Configuration

Browser Lifecycle Manager observes real browser behavior, but different applications have different needs around startup timing, idle handling, diagnostics, plugin registration, and optional cross-tab coordination. Configuration exists to let consumers tune those policies without changing the core lifecycle model.

### Configuration Principles

- defaults should carry most use cases
- options should be optional whenever possible
- configuration should tune policy, not expose internal implementation detail
- capability differences should degrade behavior rather than explode configuration size
- the root object should stay small and readable

### Configuration Goals

- easy first-run experience
- low cognitive overhead
- predictable merging and validation
- strong forward compatibility
- no framework-specific assumptions

### What Should Be Configurable

- whether observation starts immediately
- whether initial state is emitted as events
- whether idle detection is enabled
- which activity sources count toward idle behavior
- whether cross-tab coordination is enabled
- whether diagnostics are enabled
- which plugins register at startup

### What Should Not Be Configurable

- raw internal module wiring
- event ordering semantics
- low-level observer classes
- browser sniffing behavior
- per-browser compatibility hacks as public options

### When Defaults Should Be Preferred Over Options

Defaults should be preferred whenever:

- one behavior is clearly the safest general-purpose baseline
- adding an option would mostly expose implementation detail
- a feature is better modeled as optional capability rather than a policy knob

### Avoiding Configuration Overload

The package should resist:

- nested option trees without clear value
- one-off debug toggles that are not generally reusable
- separate enable/disable flags for every public event
- transport-specific low-level tuning unless there is a clear product need

## 2. Default Configuration

### Default Configuration Overview

The intended default consumer experience is:

```text
createBrowserLifecycle({
  autoStart: true,
  emitInitialState: false,
  idleTimeout: false,
  activityEvents: "default",
  activityDebounce: 250,
  crossTab: false,
  debug: false,
  eventBufferSize: 0,
  plugins: []
})
```

### Default Option Table

| Option             | Purpose                              | Default     | Why This Default Exists                        | Expected Behavior                                    | When to Override                                            |
| ------------------ | ------------------------------------ | ----------- | ---------------------------------------------- | ---------------------------------------------------- | ----------------------------------------------------------- |
| `autoStart`        | start observation immediately        | `true`      | lowest-friction default                        | instance starts observing on creation                | when host lifecycle must control start timing               |
| `emitInitialState` | emit startup state as events         | `false`     | avoids noisy startup events                    | initial state is available through snapshot only     | when explicit startup transition replay is desired          |
| `idleTimeout`      | enable idle detection                | `false`     | idle is heuristic and should be opt-in         | no idle events by default                            | when inactivity behavior matters                            |
| `activityEvents`   | choose activity inputs               | `"default"` | sensible baseline for common input patterns    | default user activity set is used if idle is enabled | when app wants narrower or broader activity rules           |
| `activityDebounce` | smooth noisy activity signals        | `250`       | balances responsiveness and event noise        | repeated activity is coalesced modestly              | when input behavior is unusually noisy or latency-sensitive |
| `crossTab`         | enable cross-tab coordination        | `false`     | optional feature with transport caveats        | no leadership or tab-role events by default          | when primary-tab semantics matter                           |
| `debug`            | enable richer diagnostics            | `false`     | keeps public behavior minimal and lightweight  | no extra diagnostic surface by default               | when testing or integrating deeply                          |
| `eventBufferSize`  | retain event history for diagnostics | `0`         | no memory overhead unless explicitly requested | no retained debug event history                      | when debug inspection is needed                             |
| `plugins`          | register startup plugins             | `[]`        | additive extension should be explicit          | no plugins unless supplied                           | when lifecycle behavior needs extension                     |

### Developer Expectations

Developers should be able to:

- call `createBrowserLifecycle()` with no options
- get useful lifecycle behavior immediately
- avoid reading the full configuration doc for common use cases

## 3. Configuration Hierarchy

### Configuration Layers

```text
Library Defaults
  -> Developer Configuration
  -> Runtime Overrides
  -> Internal Computed Values
```

### Precedence

Highest precedence should be:

1. internal computed values derived from validated configuration and capability checks
2. runtime overrides if the public API allows them in the future
3. developer configuration
4. library defaults

### Merge Strategy

- root configuration uses shallow merge by default
- nested option objects, if present, should merge predictably by object key
- arrays such as `plugins` should replace, not merge by concatenation, unless explicitly documented otherwise

### Override Rules

- explicit developer values override defaults
- invalid overrides do not silently fall back; they fail validation
- capability-driven computed values may weaken effective behavior without changing the original user-provided config

### Conflict Resolution

Examples:

- `idleTimeout: false` makes `activityEvents` and `activityDebounce` effectively irrelevant but not invalid
- `debug: false` with `eventBufferSize > 0` is allowed if the package chooses to preserve buffered inspection, but should be documented clearly
- `crossTab: false` ignores transport-specific nested options if such options are not active

### Configuration Flow Diagram

```text
defaults
  -> apply developer config
  -> validate
  -> capability checks
  -> compute effective config
  -> runtime behavior
```

## 4. Validation Rules

### Validation Philosophy

Validation should be eager, explicit, and precise. Invalid configuration should fail before live observation begins.

### Required Values

No top-level option should be required for ordinary use.

### Optional Values

All top-level options should remain optional when possible.

### Allowed and Invalid Values

| Option             | Allowed Values                             | Invalid Values                                                      |
| ------------------ | ------------------------------------------ | ------------------------------------------------------------------- |
| `autoStart`        | boolean                                    | non-boolean                                                         |
| `emitInitialState` | boolean                                    | non-boolean                                                         |
| `idleTimeout`      | `false` or positive finite integer         | negative numbers, `0`, `Infinity`, `NaN`, non-numeric truthy values |
| `activityEvents`   | `"default"` or non-empty allowlisted array | empty arrays, unknown event names, duplicate-only arrays            |
| `activityDebounce` | integer `>= 0`                             | negative, `Infinity`, `NaN`, non-integer                            |
| `crossTab`         | boolean or valid config object             | malformed object, invalid numeric fields, empty `channelName`       |
| `debug`            | boolean                                    | non-boolean                                                         |
| `eventBufferSize`  | integer `>= 0`                             | negative, `Infinity`, `NaN`, non-integer                            |
| `plugins`          | array of valid plugin objects              | duplicate ids, malformed plugin metadata, non-array values          |

### Range Validation

Examples:

- `idleTimeout` must be a positive finite integer when enabled
- `activityDebounce` must be an integer greater than or equal to zero
- `heartbeatInterval` must be a positive finite integer
- `leaderTimeout` must be greater than `heartbeatInterval`

### Dependency Validation

Examples:

- `activityEvents` matters only when idle is enabled
- `activityDebounce` matters only when idle is enabled
- cross-tab transport tuning matters only when `crossTab` is enabled

### Mutually Exclusive or Suspicious Options

There are no hard mutually exclusive top-level options in Version 1, but some combinations should warn or normalize:

- `debug: false` with a large `eventBufferSize`
- `crossTab: false` with nested cross-tab tuning data

### Default Fallbacks

Defaults should apply only when a value is absent, not when it is invalid.

### Validation Behavior

- invalid config throws
- weak but tolerable config may warn in debug mode
- capability loss should not itself fail validation unless the consumer explicitly opts into unsupported required behavior in a future version

## 5. Runtime Configuration

### Runtime Mutability Philosophy

Browser Lifecycle Manager should keep configuration largely immutable after instance creation. This preserves predictability and avoids partial hot-reconfiguration bugs in observer-heavy code.

### Runtime Configuration Table

| Area                   | Mutable After Start? | Notes                                                                          |
| ---------------------- | -------------------- | ------------------------------------------------------------------------------ |
| `autoStart`            | no                   | creation-time policy only                                                      |
| `emitInitialState`     | no                   | startup policy only                                                            |
| `idleTimeout`          | no in v1             | changing later would affect timer semantics and event meaning                  |
| module enablement      | no in v1             | enabling visibility, idle, or cross-tab later complicates lifecycle guarantees |
| plugin registration    | no after start       | aligns with public API design                                                  |
| `debug`                | no in v1             | keep debug model predictable                                                   |
| effective capabilities | read-only            | computed from runtime environment                                              |

### Restart Required Behavior

If future versions allow reconfiguration, the default assumption should be that most meaningful changes require instance recreation rather than in-place mutation.

### Hot Reload Support

Not a stable core concern. Development tools may recreate instances instead of mutating configuration live.

## 6. Feature Configuration

### Module Configuration Philosophy

Feature configuration should stay policy-oriented. The package should avoid exposing raw browser observer toggles unless a consumer-facing need is clear.

### Visibility

| Mode            | Meaning                              | Interaction with Session Core          |
| --------------- | ------------------------------------ | -------------------------------------- |
| automatic       | enabled whenever supported           | core visibility model remains active   |
| disabled        | not recommended for v1 public config | would undermine core purpose           |
| custom behavior | not exposed as public v1 config      | belongs in future advanced design only |

### Focus

| Mode            | Meaning                                   | Interaction with Session Core         |
| --------------- | ----------------------------------------- | ------------------------------------- |
| automatic       | attention tracking enabled when supported | secondary layer to visibility         |
| disabled        | not recommended as public v1 option       | weakens default lifecycle readability |
| custom behavior | not exposed in v1                         | not enough value yet                  |

### Connectivity

| Mode            | Meaning                                       | Interaction with Session Core                  |
| --------------- | --------------------------------------------- | ---------------------------------------------- |
| automatic       | advisory connectivity enabled when supported  | enriches snapshot and connectivity events      |
| disabled        | plausible future option, but not needed in v1 | omit advisory context                          |
| custom behavior | not exposed in v1                             | real reachability belongs outside core package |

### Idle

| Mode            | Meaning                             | Interaction with Session Core                  |
| --------------- | ----------------------------------- | ---------------------------------------------- |
| disabled        | default                             | no idle-derived transitions                    |
| enabled         | `idleTimeout` positive              | enables activity observer and idle transitions |
| custom behavior | activity source and debounce tuning | affects derived activity heuristics only       |

### Lifecycle

| Mode            | Meaning                                                             | Interaction with Session Core                |
| --------------- | ------------------------------------------------------------------- | -------------------------------------------- |
| automatic       | baseline lifecycle and restoration semantics enabled when supported | core lifecycle refinement                    |
| disabled        | not recommended as public v1 option                                 | would obscure real lifecycle value           |
| custom behavior | not public in v1                                                    | should remain internal and capability-driven |

### Cross Tab

| Mode            | Meaning        | Interaction with Session Core      |
| --------------- | -------------- | ---------------------------------- |
| disabled        | default        | no primary/secondary role modeling |
| enabled         | boolean `true` | uses default transport preference  |
| custom behavior | object config  | tunes channel name and timing      |

### Plugins

| Mode       | Meaning          | Interaction with Session Core |
| ---------- | ---------------- | ----------------------------- |
| none       | default          | no extension behavior         |
| configured | array of plugins | plugins register before start |

## 7. Plugin Configuration

### Plugin Registration

Plugins should be registerable either:

- through the `plugins` configuration array during creation
- through `use()` before startup

### Plugin Options

Plugin-specific options should live inside the plugin object, not as top-level core configuration keys.

### Plugin Defaults

The core package should not invent plugin defaults beyond accepting an empty plugin set.

### Plugin Validation

Plugins must provide:

- stable non-empty `id`
- valid lifecycle hooks if declared
- no duplicate ids within one instance

### Plugin Isolation

One plugin's configuration should not mutate another plugin's effective configuration implicitly.

### Plugin Lifecycle

Plugin configuration is creation-time and startup-time oriented, not hot-swappable in v1.

### Configuration Inheritance

Plugins may read effective lifecycle configuration through a readonly plugin context, but they should not inherit mutable write access to core configuration.

## 8. Error Handling

### Error Philosophy

Configuration errors should be sharp and actionable. Unsupported optional browser features should normally degrade behavior, not become configuration failures.

### Invalid Configuration

Throw immediately with clear field-level error messages.

### Unknown Properties

Version 1 should reject unknown properties rather than silently ignore them. Silent ignore hides mistakes and weakens developer trust.

### Deprecated Properties

Deprecated properties should:

- warn clearly
- document the replacement
- remain temporarily supported only when migration cost justifies it

### Unsupported Browser Features

Unsupported optional features should:

- degrade when possible
- surface through capabilities
- optionally warn in debug mode

### Conflicting Options

Conflicts should either:

- throw when they create ambiguity
- normalize clearly when the stronger rule is obvious

### Warnings vs Errors

| Situation                   | Warning           | Error        |
| --------------------------- | ----------------- | ------------ |
| typo or unknown config key  | no                | yes          |
| invalid numeric range       | no                | yes          |
| missing optional capability | yes in debug mode | no           |
| deprecated property         | yes               | no initially |
| duplicate plugin id         | no                | yes          |

### Recovery Strategy

Recovery should be explicit. The package should not secretly repair invalid user intent beyond narrow normalization such as deduplicating activity event names.

## 9. TypeScript Experience

### Configuration Type Goals

- strong autocomplete
- optional keys for common use
- readonly effective config views where exposed
- future-safe additive evolution

### Developer Ergonomics

Consumers should be able to:

- discover keys through editor hints
- understand defaults from docs without reading implementation
- compose config objects incrementally without generic complexity

### Type Design Expectations

- top-level config object is easy to write inline
- nested config objects are small and purpose-specific
- plugin arrays remain strongly typed but not cumbersome

## 10. Configuration Evolution

### Adding New Options

New options should be added only when:

- they solve a repeated real-world need
- defaults cannot address the need cleanly
- the option passes the configuration checklist

### Deprecating Options

Deprecations should be documented clearly and remain compatible long enough for a realistic migration path.

### Renaming Options

Renames should be rare. Prefer keeping old names with deprecation warnings until a major version if the old name is already public.

### Removing Options

Option removal should be treated as a serious compatibility event and generally reserved for major versions.

### Migration Strategy

Every deprecation or rename should include:

- reason
- replacement
- transition example
- semver impact

### Versioning Considerations

Changing default behavior can be as meaningful as changing option names. Default shifts should be treated conservatively.

## 11. Usage Examples

### Minimal

```ts
createBrowserLifecycle();
```

### Enterprise Dashboard

```ts
createBrowserLifecycle({
  crossTab: true,
});
```

### POS System

```ts
createBrowserLifecycle({
  autoStart: true,
  debug: false,
});
```

### PWA

```ts
createBrowserLifecycle({
  idleTimeout: 5 * 60 * 1000,
});
```

### Electron

```ts
createBrowserLifecycle({
  debug: true,
  eventBufferSize: 100,
});
```

### Custom Plugin

```ts
createBrowserLifecycle({
  plugins: [analyticsBridgePlugin],
});
```

### Debug Mode

```ts
createBrowserLifecycle({
  debug: true,
  eventBufferSize: 200,
});
```

## 12. Design Decisions

### ADR-001: Small Root Configuration

| Field                 | Record                                              |
| --------------------- | --------------------------------------------------- |
| Decision              | keep the root config object intentionally small     |
| Reason                | first-use readability and long-term maintainability |
| Alternatives          | deep nested module trees                            |
| Tradeoffs             | fewer fine-grained tuning knobs in v1               |
| Future Impact         | easier stable evolution                             |
| Rejected Alternatives | per-module deep configuration by default            |

### ADR-002: Defaults Over Options

| Field                 | Record                                              |
| --------------------- | --------------------------------------------------- |
| Decision              | prefer strong defaults over extensive toggles       |
| Reason                | cleaner developer experience                        |
| Alternatives          | expose most internal policies as options            |
| Tradeoffs             | some advanced consumers may want more control later |
| Future Impact         | lower configuration entropy                         |
| Rejected Alternatives | highly tunable v1 surface                           |

### ADR-003: Mostly Immutable Runtime Configuration

| Field                 | Record                                                  |
| --------------------- | ------------------------------------------------------- |
| Decision              | keep configuration effectively immutable after creation |
| Reason                | avoids unstable hot-reconfiguration semantics           |
| Alternatives          | mutable live config                                     |
| Tradeoffs             | instance recreation may be needed for major changes     |
| Future Impact         | clearer lifecycle guarantees                            |
| Rejected Alternatives | broad runtime mutability                                |

### ADR-004: Reject Unknown Keys

| Field                 | Record                               |
| --------------------- | ------------------------------------ |
| Decision              | reject unknown configuration keys    |
| Reason                | fail fast on mistakes                |
| Alternatives          | silent ignore, warning-only behavior |
| Tradeoffs             | slightly stricter upgrades           |
| Future Impact         | stronger API trust                   |
| Rejected Alternatives | silent tolerance for typos           |

## 13. Configuration Checklist

| Requirement                | Status                | Notes                                           |
| -------------------------- | --------------------- | ----------------------------------------------- |
| Optional whenever possible | pass                  | no required top-level options                   |
| Has a sensible default     | pass                  | every top-level option has a documented default |
| Strongly typed             | pass in design intent | top-level and nested options remain narrow      |
| Easy to understand         | pass                  | root shape stays small                          |
| Backward compatible        | pass with caution     | default changes must be conservative            |
| Future extensible          | pass                  | additive growth remains possible                |
| Framework agnostic         | pass                  | no framework-specific config model              |

If a future option fails this checklist, it should be redesigned or omitted.

## Final Review

### Can a Developer Get Started Without Reading the Full Documentation?

Yes. `createBrowserLifecycle()` should work for many users with no options at all.

### Are There Too Many Options?

Not yet. The main future growth pressure will come from idle and cross-tab tuning. Those areas should remain tightly constrained.

### Can Common Use Cases Work With Defaults?

Yes. The default profile supports the core lifecycle model without requiring consumers to tune anything.

### Would This Configuration Still Feel Clean Five Years From Now?

Yes, if the package preserves a small root shape and resists turning every browser quirk into a user-facing option.

### Unnecessary Options

At present, no top-level option appears unnecessary. The main options to watch are `eventBufferSize` and future cross-tab tuning growth.

### Recommendations Before Implementation Begins

- keep module toggles minimal
- preserve the no-required-options rule
- avoid introducing runtime mutability unless implementation pressure is overwhelming
- document effective capability-driven degradation clearly so users do not try to configure around unsupported browser behavior
