# Integrations

Use Object Diff from other packages and apps through the **public API only**. Core never depends on consumers.

**Previous:** [Plugins](/packages/object-diff/modules/plugins) · **Next:** [Performance](/packages/object-diff/modules/performance)

## Principles

1. Import from `@jayoncode/object-diff` or documented subpaths (`/core`, `/patch`, `/merge`, `/query`, `/stats`, `/formatter`, `/plugins`, `/view`).
2. No hard coupling into core — adapters and audit packages live elsewhere.
3. Prefer docs + examples first; dedicated adapter packages only when a framework needs lifecycle wrappers.
4. Zero new peer dependencies on the core package.

## Consumer map

| Consumer                                 | Typical APIs                      | Notes                     |
| ---------------------------------------- | --------------------------------- | ------------------------- |
| Forms / `@jayoncode/form-intelligence`   | `hasChanges`, `diff`, `serialize` | Dirty check + audit trail |
| Session / `@jayoncode/browser-lifecycle` | `diff`, `hasChanges`              | Optional snapshot compare |
| Audit / logging                          | `diff`, `serialize`, `/stats`     | Change records as events  |
| Collaboration / sync                     | `/merge`, `patch`, `applyPatch`   | Conflict-aware merge      |
| React / Vue / Angular                    | Root + thin adapters later        | Not in core               |
| Node.js services                         | Same core                         | No DOM assumptions        |

## Form dirty check + audit

```ts
import { diff, hasChanges, serialize } from "@jayoncode/object-diff";

async function auditForm(saved: unknown, draft: unknown, log: (msg: string) => Promise<void>) {
  if (!hasChanges(saved, draft)) {
    return;
  }

  await log(serialize(diff(saved, draft), "markdown"));
}
```

Runnable sketch: `packages/object-diff/examples/form-dirty-audit.ts`.

**Form Intelligence end-to-end recipe** (plugin + `form.diffFrom*`): [FI Patterns → Dirty audit / patch](/packages/form-intelligence/modules/patterns#composition-dirty-audit--patch-object-diff).

## Session snapshot diffs

Compare last persisted session state to the current snapshot (e.g. after a tab focus or idle restore):

```ts
import { diff, hasChanges } from "@jayoncode/object-diff";

function sessionChanged(previous: unknown, current: unknown): boolean {
  return hasChanges(previous, current);
}

function sessionChangelog(previous: unknown, current: unknown) {
  return diff(previous, current).changes;
}
```

Runnable sketch: `packages/object-diff/examples/session-snapshot.ts`.

## Audit events

Map change records into your event bus — Object Diff stays a pure producer:

```ts
import { diff } from "@jayoncode/object-diff";

type AuditEvent = {
  readonly type: "object-diff.change";
  readonly path: string;
  readonly changeType: string;
  readonly previous?: unknown;
  readonly current?: unknown;
};

function toAuditEvents(before: unknown, after: unknown): AuditEvent[] {
  return diff(before, after).changes.map((change) => ({
    type: "object-diff.change",
    path: change.path,
    changeType: change.type,
    ...(change.previous !== undefined ? { previous: change.previous } : {}),
    ...(change.current !== undefined ? { current: change.current } : {}),
  }));
}
```

Runnable sketch: `packages/object-diff/examples/audit-events.ts`.

## Collaboration merge

```ts
import { merge } from "@jayoncode/object-diff/merge";

const result = merge(localDraft, remoteDraft, {
  base: lastSynced,
  strategy: "latest-wins",
});

if (result.conflicts.length > 0) {
  // surface conflicts in UI; value is still a usable merge
}
```

Runnable sketch: `packages/object-diff/examples/merge-collaboration.ts`.

## Optional plugin host

Only when you need matchers, custom formatters, or hooks:

```ts
import { createEngine } from "@jayoncode/object-diff/plugins";

const engine = createEngine({ plugins: [/* … */] });
engine.diff(saved, draft);
```

Core free functions remain the default path — `createEngine` is optional. Full plugin contract (matchers, formatters, merge strategies, hooks): [Plugins](/packages/object-diff/modules/plugins).

## Anti-patterns

| Avoid                                 | Prefer                                |
| ------------------------------------- | ------------------------------------- |
| Importing walker / internal modules   | Public entrypoints only               |
| Putting form/UI lifecycle inside core | Separate adapter packages             |
| Auto-registering plugins on import    | Explicit `createEngine({ plugins })`  |
| Coupling to DOM / framework globals   | Plain snapshots in, plain results out |

## Examples

See `packages/object-diff/examples/` and the [playground](/playground/object-diff/).
