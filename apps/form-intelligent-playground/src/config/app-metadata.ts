import { findNavigationItemByPath } from "../constants/navigation.js";

import type { NavigationItem } from "../types/navigation.js";

export interface PlaygroundVersions {
  readonly formIntelligence: string;
  readonly formIntelligentReact: string;
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
  readonly formIntelligentPackageName: "@jayoncode/form-intelligent";
  readonly formIntelligentReactPackageName: "@jayoncode/form-intelligent-react";
  readonly environment: PlaygroundEnvironment;
  readonly versions: PlaygroundVersions;
}

export function getPlaygroundMetadata(): PlaygroundMetadata {
  return {
    applicationName: "Form Intelligent Playground",
    formIntelligentPackageName: "@jayoncode/form-intelligent",
    formIntelligentReactPackageName: "@jayoncode/form-intelligent-react",
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
      formIntelligence: import.meta.env.VITE_FORM_INTELLIGENT_VERSION,
      formIntelligentReact: import.meta.env.VITE_FORM_INTELLIGENT_REACT_VERSION,
      playground: import.meta.env.VITE_PLAYGROUND_VERSION,
    },
  };
}

export function getCurrentPageLabel(pathname: string): string {
  return findNavigationItemByPath(pathname)?.label ?? "Not Found";
}

export function createBreadcrumbs(pathname: string): readonly string[] {
  const currentItem = findNavigationItemByPath(pathname);

  if (!currentItem || currentItem.path === "/") {
    return ["Sandbox"];
  }

  return ["Sandbox", currentItem.label];
}

export function getPageSummary(pathname: string): NavigationItem | undefined {
  return findNavigationItemByPath(pathname);
}
