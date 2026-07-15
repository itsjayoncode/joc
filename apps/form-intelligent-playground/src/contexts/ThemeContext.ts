import { createContext } from "react";

import type { ResolvedTheme, ThemePreference } from "../services/theme-preferences.js";

export interface ThemeContextValue {
  readonly preference: ThemePreference;
  readonly resolvedTheme: ResolvedTheme;
  setPreference: (value: ThemePreference) => void;
  togglePreference: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
