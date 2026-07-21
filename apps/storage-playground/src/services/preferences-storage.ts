import {
  createLocalStorageAdapter,
  createStorage,
  type JayOnCodeStorage,
} from "@jayoncode/storage";

const LEGACY_PREFIX = "joc.storage-playground.";

/** Dogfood: shell prefs persist via `@jayoncode/storage` + the `preferences` policy. */
const playgroundPrefs: JayOnCodeStorage<string | boolean> = createStorage({
  namespace: "playground-prefs",
  adapter: createLocalStorageAdapter(),
  schemaVersion: "1",
  policies: {
    preferences: { ttl: { days: 365 } },
  },
});

function readLegacyRaw(key: string): string | null {
  if (typeof globalThis.localStorage === "undefined") {
    return null;
  }
  try {
    return globalThis.localStorage.getItem(`${LEGACY_PREFIX}${key}`);
  } catch {
    return null;
  }
}

function removeLegacyRaw(key: string): void {
  if (typeof globalThis.localStorage === "undefined") {
    return;
  }
  try {
    globalThis.localStorage.removeItem(`${LEGACY_PREFIX}${key}`);
  } catch {
    // ignore
  }
}

function coercePreference<TValue extends string | boolean>(
  value: string | boolean,
  fallback: TValue,
): TValue | null {
  if (typeof fallback === "boolean") {
    if (typeof value === "boolean") {
      return value as TValue;
    }
    if (value === "true" || value === "false") {
      return (value === "true") as TValue;
    }
    return null;
  }

  if (typeof value === "string") {
    return value as TValue;
  }

  return null;
}

export function readStoredPreference<TValue extends string | boolean>(
  key: string,
  fallback: TValue,
): TValue {
  try {
    const stored = playgroundPrefs.get(key);
    if (stored !== null) {
      const coerced = coercePreference(stored, fallback);
      if (coerced !== null) {
        return coerced;
      }
    }
  } catch {
    // fall through to legacy / fallback
  }

  const legacy = readLegacyRaw(key);
  if (legacy === null) {
    return fallback;
  }

  const coerced = coercePreference(legacy, fallback);
  if (coerced === null) {
    return fallback;
  }

  try {
    playgroundPrefs.set(key, coerced, { policy: "preferences" });
    removeLegacyRaw(key);
  } catch {
    // keep returning coerced even if migrate write fails
  }

  return coerced;
}

export function writeStoredPreference(key: string, value: string | boolean): void {
  try {
    playgroundPrefs.set(key, value, { policy: "preferences" });
    removeLegacyRaw(key);
  } catch {
    // SSR / blocked storage — ignore like the previous raw helper
  }
}

/** Exposed for Lab / docs demos — same instance as shell prefs. */
export function getPlaygroundPrefsStorage(): JayOnCodeStorage<string | boolean> {
  return playgroundPrefs;
}
