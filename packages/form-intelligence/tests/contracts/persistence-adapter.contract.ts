import { expect } from "vitest";

import { isPersistenceAdapter } from "../../src/adapters/index.js";

import type { PersistenceAdapter, SyncPersistenceAdapter } from "../../src/adapters/index.js";

/**
 * Shared PersistenceAdapter contract — round-trip load/save/clear.
 */
export async function runPersistenceAdapterContract(
  adapter: PersistenceAdapter | SyncPersistenceAdapter,
  key = "contract:draft",
): Promise<void> {
  expect(isPersistenceAdapter(adapter)).toBe(true);

  const payload = { email: "a@b.com", nested: { n: 1 } };
  await Promise.resolve(adapter.save(key, payload));
  const loaded = await Promise.resolve(adapter.load(key));
  expect(loaded).toEqual(payload);

  await Promise.resolve(adapter.clear(key));
  expect(await Promise.resolve(adapter.load(key))).toBeNull();
}
