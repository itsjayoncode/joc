# Storage

`@jayoncode/storage` — policy-driven client persistence with explicit adapters.

**Status:** Public `0.2.0` · sync core + `/async` + `/cross-tab` **Stable**

## Learning path

Canonical paths live in [overview.md](./overview.md) (**Pick your path** + Documentation map). Summary:

1. [Overview](./overview.md) — choose Beginner / Shipping / Advanced
2. **Beginner:** [Tutorial](./getting-started.md) → [Concepts](./concepts.md) → [Recipes](./recipes.md)
3. **Shipping:** [Core](./core.md) → [Errors](./errors.md) → [Best practices](./best-practices.md)
4. **Advanced:** [Maintenance](./maintenance.md) → … → [Async](./async.md) · [Cross-tab](./cross-tab.md)
5. Support: [FAQ](./faq.md) · [Browser support](./browser-support.md) · [Security](./security.md)

## Playground

```bash
pnpm storage-playground:dev
```

Lab covers adapters, TTL, policies, migrate dry-run, quota sim, cleanup, snapshots, observe, cross-tab notify, diagnostics, and transactions. IndexedDB is documented under `/async` (not the sync Lab adapter chips).
