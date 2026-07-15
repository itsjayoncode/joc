import { resolvePlaygroundPath } from "./seo.js";

import type { DefaultTheme } from "vitepress";

export function createObjectDiffSidebarMap(
  pkgBase: string,
  versionLabel: string,
): Record<string, DefaultTheme.SidebarItem[]> {
  return {
    [pkgBase]: [
      {
        text: `Object Diff · ${versionLabel}`,
        items: [
          { text: "Overview", link: `${pkgBase}/` },
          { text: "Core concepts", link: `${pkgBase}/modules/concepts` },
          { text: "Tutorial", link: `${pkgBase}/modules/getting-started` },
        ],
      },
      {
        text: "Build your workflow",
        items: [
          { text: "1. Diffing", link: `${pkgBase}/modules/diff` },
          { text: "2. Patching", link: `${pkgBase}/modules/patch` },
          { text: "3. Serialization", link: `${pkgBase}/modules/serialize` },
        ],
      },
      {
        text: "Reference",
        items: [
          { text: "API (TypeDoc)", link: `${pkgBase}/api/` },
          { text: "Playground guide", link: `${pkgBase}/playground/playground` },
        ],
      },
      {
        text: "Interactive",
        collapsed: false,
        items: [
          {
            text: "Open playground ↗",
            link: resolvePlaygroundPath("object-diff"),
            target: "_blank",
            rel: "noreferrer",
          },
        ],
      },
    ],
  };
}
