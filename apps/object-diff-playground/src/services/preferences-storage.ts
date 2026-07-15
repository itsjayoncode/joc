const STORAGE_KEY_PREFIX = "joc.object-diff-playground";

function getStorage(): Storage | undefined {
  if (typeof globalThis.localStorage === "undefined") {
    return undefined;
  }

  return globalThis.localStorage;
}

function buildStorageKey(key: string): string {
  return `${STORAGE_KEY_PREFIX}.${key}`;
}

export function readStoredPreference<TValue extends string | boolean>(
  key: string,
  fallback: TValue,
): TValue {
  const storage = getStorage();

  if (!storage) {
    return fallback;
  }

  const value = storage.getItem(buildStorageKey(key));

  if (value === null) {
    return fallback;
  }

  if (typeof fallback === "boolean") {
    return (value === "true") as TValue;
  }

  return value as TValue;
}

export function writeStoredPreference(key: string, value: string | boolean): void {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  storage.setItem(buildStorageKey(key), String(value));
}
