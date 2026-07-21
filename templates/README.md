# Templates

Reusable starter templates for the JOC ecosystem. Prefer scaffolding via the maintainer CLI:

```bash
pnpm joc new package <kebab-name>
pnpm joc new playground <kebab-name> [--package <kebab-name>]
pnpm joc help
```

## Assets

| Template               | Purpose                                                    |
| ---------------------- | ---------------------------------------------------------- |
| `package-template/`    | Standard structure for every future `@jayoncode/*` package |
| `playground-template/` | Minimal Vite + React lab wired to one package              |

## Standards (do not fork here)

Generators encode existing rules — they are not a second product:

- `engineering/008-package-architecture.md`
- `engineering/016-package-checklist.md`
- `engineering/012-documentation-standards.md`
- Package admission: `engineering/ecosystem/governance.md` + `engineering/ecosystem/briefs/`

## After scaffolding

1. Write / accept a Phase 8 package brief under `engineering/ecosystem/briefs/` before deep investment (Storage: `briefs/storage.md` is Accepted)
2. `pnpm package:blueprint` and `pnpm package:integrity`
3. Keep scaffolds `private: true` until publish-ready (`pnpm joc new package … --public` only when intentional)
4. Register docs versioning before first public release (`engineering/014-versioning-policy.md`)
5. Do **not** create `packages/shared` unless `engineering/ecosystem/shared-candidates.md` marks Extract
