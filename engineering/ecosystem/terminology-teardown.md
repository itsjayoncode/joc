# Lifecycle teardown naming (`destroy` vs `dispose`)

**Status:** Accepted (terminology hygiene — Phase 4)  
**Scope:** Cross-package documentation; no mass API rename in this note

---

## Decision

JOC packages use **domain-appropriate** teardown names. Do **not** force a single method name across the ecosystem.

| Package / surface              | Preferred teardown                        | Notes                                                                                               |
| ------------------------------ | ----------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `@jayoncode/form-intelligence` | `form.destroy()`                          | Form instance + plugins + DOM detach                                                                |
| `@jayoncode/browser-lifecycle` | `lifecycle.dispose()`                     | Session / signal observers                                                                          |
| Framework adapters (BL)        | Often `destroy()` / framework `onDestroy` | Adapters wrap `dispose()` on **owned** sessions; adopted sessions are never disposed by the adapter |
| Object Diff                    | N/A (pure functions)                      | No long-lived instance to tear down                                                                 |

## Guidance for docs and examples

- Document the **actual** public method for that package.
- When composing packages in one snippet, call each package’s teardown explicitly:

```ts
lifecycle.dispose();
form.destroy();
```

- Adapter `.destroy()` that owns a Browser Lifecycle session should be described as “adapter cleanup,” which may call `lifecycle.dispose()` internally for **owned** sessions only.

## Why not unify now?

Renaming either API is a **breaking SemVer** change for little user benefit. Patterns (always tear down what you own) matter more than identical identifiers ([ecosystem ADR-0001](./adr/0001-package-independence.md); patterns over forced API uniformity).

## Future

If a shared teardown helper is ever extracted, it may wrap both — it must **not** rename public package APIs without an explicit breaking release plan.
