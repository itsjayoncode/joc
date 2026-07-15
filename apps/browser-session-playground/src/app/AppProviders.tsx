import { BrowserRouter } from "react-router-dom";

import { PlaygroundUiProvider } from "../providers/PlaygroundUiProvider.js";
import { ThemeProvider } from "../providers/ThemeProvider.js";

import type { PropsWithChildren } from "react";

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, "") || undefined;

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <BrowserRouter {...(routerBasename ? { basename: routerBasename } : {})}>
      <ThemeProvider>
        <PlaygroundUiProvider>{children}</PlaygroundUiProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
