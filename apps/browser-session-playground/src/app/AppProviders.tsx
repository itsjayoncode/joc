import { BrowserRouter } from "react-router-dom";

import { PlaygroundUiProvider } from "../providers/PlaygroundUiProvider.js";
import { ThemeProvider } from "../providers/ThemeProvider.js";

import type { PropsWithChildren } from "react";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <PlaygroundUiProvider>{children}</PlaygroundUiProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
