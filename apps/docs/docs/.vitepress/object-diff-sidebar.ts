import { navPackageLabel } from "./nav-package-label.js";
import { resolvePlaygroundPath } from "./seo.js";
import { buildVersionedSidebarMap } from "./versioned-sidebar.js";

import type { DefaultTheme } from "vitepress";

export function createObjectDiffSidebar(
  pkgBase: string,
  versionLabel: string,
): DefaultTheme.SidebarItem[] {
  const base = pkgBase.replace(/\/$/, "");

  return [
    {
      text: navPackageLabel("Object Diff", versionLabel),
      items: [
        { text: "Overview", link: `${base}/overview` },
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
        { text: "4. Engines", link: `${base}/modules/engines` },
        { text: "5. Merge", link: `${base}/modules/merge` },
        { text: "6. Query", link: `${base}/modules/query` },
        { text: "7. Integrations", link: `${base}/modules/integrations` },
        { text: "8. Performance", link: `${base}/modules/performance` },
        { text: "9. DX", link: `${base}/modules/dx` },
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
  ];
}

export function createObjectDiffSidebarMap(
  pkgBase: string,
  versionLabel: string,
  archives: ReadonlyArray<{ version: string; label: string }> = [],
): Record<string, DefaultTheme.SidebarItem[]> {
  return buildVersionedSidebarMap(pkgBase, versionLabel, archives, createObjectDiffSidebar);
}
