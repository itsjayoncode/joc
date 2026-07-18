import { readStoredPreference, writeStoredPreference } from "./preferences-storage.js";

export type ThemePreference = "dark" | "light" | "system";
export type ResolvedTheme = Exclude<ThemePreference, "system">;

export const THEME_STORAGE_KEY = "theme-preference";

export function isThemePreference(value: string): value is ThemePreference {
  return value === "dark" || value === "light" || value === "system";
}

export function resolveTheme(preference: ThemePreference, prefersDarkMode: boolean): ResolvedTheme {
  if (preference === "system") {
    return prefersDarkMode ? "dark" : "light";
  }

  return preference;
}

export function readThemePreference(): ThemePreference {
  const value = readStoredPreference(THEME_STORAGE_KEY, "light");

  return isThemePreference(value) ? value : "light";
}

export function writeThemePreference(value: ThemePreference): void {
  writeStoredPreference(THEME_STORAGE_KEY, value);
}
