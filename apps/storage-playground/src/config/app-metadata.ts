import { findNavigationItemByPath } from "../constants/navigation.js";

import type { NavigationItem } from "../types/navigation.js";

export interface PlaygroundVersions {
  readonly storage: string;
  readonly playground: string;
}

export interface PlaygroundEnvironment {
  readonly enableDebugTools: boolean;
  readonly mode: "development" | "production" | "test";
  readonly supportUrl: string;
  readonly supportLabel: string;
}

export interface PlaygroundMetadata {
  readonly applicationName: string;
  readonly packageName: "@jayoncode/storage";
  readonly environment: PlaygroundEnvironment;
  readonly versions: PlaygroundVersions;
}

export function getPlaygroundMetadata(): PlaygroundMetadata {
  return {
    applicationName: "Storage Playground",
    packageName: "@jayoncode/storage",
    environment: {
      enableDebugTools: import.meta.env.VITE_PLAYGROUND_ENABLE_DEBUG_TOOLS === "true",
      mode:
        import.meta.env.MODE === "development" ||
        import.meta.env.MODE === "production" ||
        import.meta.env.MODE === "test"
          ? import.meta.env.MODE
          : "development",
      supportLabel: import.meta.env.VITE_PLAYGROUND_SUPPORT_LABEL ?? "Report an issue on GitHub",
      supportUrl:
        import.meta.env.VITE_PLAYGROUND_SUPPORT_URL ?? "https://github.com/itsjayoncode/joc/issues",
    },
    versions: {
      storage: __STORAGE_VERSION__,
      playground: __PLAYGROUND_VERSION__,
    },
  };
}

export function getCurrentPageLabel(pathname: string): string {
  return findNavigationItemByPath(pathname)?.label ?? "Not Found";
}

export function createBreadcrumbs(pathname: string): readonly string[] {
  const currentItem = findNavigationItemByPath(pathname);

  if (!currentItem || currentItem.path === "/") {
    return ["Dashboard"];
  }

  return ["Dashboard", currentItem.label];
}

export function getPageSummary(pathname: string): NavigationItem | undefined {
  return findNavigationItemByPath(pathname);
}
