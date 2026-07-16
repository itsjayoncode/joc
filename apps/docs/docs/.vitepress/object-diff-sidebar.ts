import { navPackageLabel } from "./nav-package-label.js";
import { resolvePlaygroundPath } from "./seo.js";

import type { DefaultTheme } from "vitepress";

export function createObjectDiffSidebarMap(
  pkgBase: string,
  versionLabel: string,
): Record<string, DefaultTheme.SidebarItem[]> {
  const base = pkgBase.replace(/\/$/, "");

  return {
    [`${base}/`]: [
      {
        text: navPackageLabel("Object Diff", versionLabel),
        items: [
          { text: "Overview", link: `${base}/` },
          { text: "Core concepts", link: `${base}/modules/concepts` },
          { text: "Tutorial", link: `${base}/modules/getting-started` },
        ],
      },
      {
        text: "Build your workflow",
        items: [
          { text: "1. Diffing", link: `${base}/modules/diff` },
          { text: "2. Patching", link: `${base}/modules/patch` },
          { text: "3. Serialization", link: `${base}/modules/serialize` },
        ],
      },
      {
        text: "Support",
        items: [{ text: "Changelog", link: `${base}/changelog` }],
      },
      {
        text: "Reference",
        items: [
          { text: "API (TypeDoc)", link: `${base}/api/` },
          { text: "Playground guide", link: `${base}/playground/playground` },
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
