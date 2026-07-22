# Errors

Typed failures for `@jayoncode/storage`. Prefer `instanceof` / `code` over matching `message`.

**Previous:** [Core](/packages/storage/modules/core) · **Next:** [Maintenance](/packages/storage/modules/maintenance)

## Hierarchy

| Class                | `code`                | Typical cause                                             |
| -------------------- | --------------------- | --------------------------------------------------------- |
| `ConfigurationError` | `configuration_error` | Bad namespace/key, unknown policy, `clear` without `keys` |
| `SerializationError` | `serialization_error` | JSON failure, non-envelope payload                        |
| `MigrationError`     | `migration_error`     | Version mismatch without hook / bad migrate return        |
| `QuotaExceededError` | `quota_exceeded`      | Browser/Lab hard quota, or soft guard (`/quota`) over max |
| `AdapterError`       | `adapter_error`       | Unavailable Storage or other I/O                          |

Optional `cause` and `details` may be present.

## Soft `null` (not errors)

- Missing key
- Expired key (lazy-deleted on peek/get/has)
- `migrate` returned `null` (key removed)

## Guidance

```ts
try {
  storage.set("prefs", value, { policy: "preferences" });
} catch (error) {
  if (error instanceof QuotaExceededError || isQuotaExceededError(error)) {
    // free space / drop cache keys
  } else if (error instanceof ConfigurationError) {
    throw error; // fix the call site
  } else {
    throw error;
  }
}
```

`has` / `peek` do not run migrations (they will not throw `MigrationError` for version mismatch). Call `get` to migrate.

::: info Playground
Enable **Simulate quota on set** for hard adapter failures, or **Soft max bytes** for [`enableQuotaGuard`](/packages/storage/modules/quota).
:::

## Next

[Maintenance](/packages/storage/modules/maintenance) · [FAQ](/packages/storage/modules/faq) · [Best practices](/packages/storage/modules/best-practices)
