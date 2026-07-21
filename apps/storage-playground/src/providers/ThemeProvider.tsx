import { useEffect, useMemo, useState } from "react";

import { ThemeContext } from "../contexts/ThemeContext.js";
import { useMediaQuery } from "../hooks/useMediaQuery.js";
import {
  readThemePreference,
  resolveTheme,
  type ThemePreference,
  writeThemePreference,
} from "../services/theme-preferences.js";

import type { PropsWithChildren } from "react";

export function ThemeProvider({ children }: PropsWithChildren) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [preference, setPreferenceState] = useState<ThemePreference>(() => readThemePreference());
  const resolvedTheme = useMemo(
    () => resolveTheme(preference, prefersDarkMode),
    [preference, prefersDarkMode],
  );

  useEffect(() => {
    const runtime = globalThis as {
      readonly document?: Document;
    };
    const root = runtime.document?.documentElement;

    if (root === undefined) {
      return;
    }

    root.dataset.theme = resolvedTheme;
    root.dataset.themePreference = preference;
    root.style.colorScheme = resolvedTheme;
  }, [preference, resolvedTheme]);

  const value = useMemo(
    () => ({
      preference,
      resolvedTheme,
      setPreference(nextValue: ThemePreference) {
        setPreferenceState(nextValue);
        writeThemePreference(nextValue);
      },
      togglePreference() {
        const nextValue =
          preference === "light" ? "dark" : preference === "dark" ? "system" : "light";

        setPreferenceState(nextValue);
        writeThemePreference(nextValue);
      },
    }),
    [preference, resolvedTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
