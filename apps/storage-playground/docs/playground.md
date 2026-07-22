# Storage Playground

Learn the API by **doing** — the home route is an **Interactive Storage Laboratory**, not a demo page.

[Open playground →](/playground/storage/)

## Storage Lab (`/`)

Multi-panel engineering workspace for policy-driven client persistence:

| Area         | Role                                                                                      |
| ------------ | ----------------------------------------------------------------------------------------- |
| Lab shell    | Adapters, TTL countdown, named policies, migrate dry-run, quota simulation                |
| Capabilities | Cleanup / maintenance, snapshots export-import, observe events, diagnostics, transactions |
| Side pages   | Adapters explorer, TTL focus, examples, dashboard overview                                |

Everything updates live — no page refresh.

## Match docs to playground

| Docs guide                                             | Playground route                          | What to try                           |
| ------------------------------------------------------ | ----------------------------------------- | ------------------------------------- |
| [Overview](/packages/storage/overview)                 | [/](/playground/storage/)                 | Lab templates + first `createStorage` |
| [Tutorial](/packages/storage/modules/getting-started)  | [/](/playground/storage/)                 | set / get / peek                      |
| [Core](/packages/storage/modules/core)                 | [/](/playground/storage/)                 | set / get / peek / policies           |
| [Errors](/packages/storage/modules/errors)             | Lab + quota simulation                    | QuotaExceeded / MigrationError paths  |
| [Recipes](/packages/storage/modules/recipes)           | [/examples](/playground/storage/examples) | Preferences, cache, list-as-array     |
| [Maintenance](/packages/storage/modules/maintenance)   | Lab cleanup                               | Expired key sweep                     |
| [Snapshots](/packages/storage/modules/snapshots)       | Lab snapshots                             | Export / import                       |
| [Observable](/packages/storage/modules/observable)     | Lab observe                               | In-process events                     |
| [Diagnostics](/packages/storage/modules/diagnostics)   | Lab diagnostics                           | Report / stats / activity             |
| [Transactions](/packages/storage/modules/transactions) | Lab transactions                          | Batched writes + rollback             |
| [Async / IndexedDB](/packages/storage/modules/async)   | Docs (async API)                          | `createAsyncStorage` + IDB            |
| [Cross-tab](/packages/storage/modules/cross-tab)       | Lab cross-tab checkbox                    | Open two tabs; prefer Local           |
| [Adapters](/packages/storage/modules/core#adapters)    | [/adapters](/playground/storage/adapters) | Memory / local / session              |
| [TTL](/packages/storage/modules/core)                  | [/ttl](/playground/storage/ttl)           | Countdown + expiry                    |

## Run locally

```bash
pnpm storage-playground:dev
```

Open [http://127.0.0.1:4280](http://127.0.0.1:4280).

## All routes

| Route        | Focus                     |
| ------------ | ------------------------- |
| `/`          | **Storage Lab** (primary) |
| `/dashboard` | Package overview          |
| `/adapters`  | Adapter explorer          |
| `/ttl`       | TTL countdown focus       |
| `/examples`  | Usage snippets            |
| `/about`     | About the playground      |
| `/settings`  | Playground preferences    |

[Back to package overview →](/packages/storage/)
