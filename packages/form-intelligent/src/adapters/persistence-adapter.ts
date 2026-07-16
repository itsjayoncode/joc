/**
 * Persist form values for drafts and autosave.
 * Implementations may be sync (localStorage) or async (IndexedDB, remote).
 */
export interface PersistenceAdapter<
  TValues extends Record<string, unknown> = Record<string, unknown>,
> {
  readonly name?: string;
  load(key: string): TValues | null | Promise<TValues | null>;
  save(key: string, values: TValues): void | Promise<void>;
  clear(key: string): void | Promise<void>;
}

/**
 * Sync persistence surface used by draft workflow today.
 * Compatible with {@link PersistenceAdapter} when methods are synchronous.
 */
export interface SyncPersistenceAdapter<
  TValues extends Record<string, unknown> = Record<string, unknown>,
> {
  readonly name?: string;
  load(key: string): TValues | null;
  save(key: string, values: TValues): void;
  clear(key: string): void;
}

export function isPersistenceAdapter(value: unknown): value is PersistenceAdapter {
  return (
    typeof value === "object" &&
    value !== null &&
    "load" in value &&
    "save" in value &&
    "clear" in value &&
    typeof (value as PersistenceAdapter).load === "function" &&
    typeof (value as PersistenceAdapter).save === "function" &&
    typeof (value as PersistenceAdapter).clear === "function"
  );
}
