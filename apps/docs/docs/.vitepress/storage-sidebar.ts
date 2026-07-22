import { navPackageLabel } from "./nav-package-label.js";
import { resolvePlaygroundPath } from "./seo.js";
import { buildVersionedSidebarMap } from "./versioned-sidebar.js";

import type { DefaultTheme } from "vitepress";

function playgroundRoute(slug: string, route = ""): string {
  const base = resolvePlaygroundPath(slug);
  if (!route) {
    return base;
  }

  return `${base}${route.replace(/^\//, "")}`;
}

function spaItem(text: string, slug: string, route = ""): DefaultTheme.SidebarItem {
  return {
    text: `${text} ↗`,
    link: playgroundRoute(slug, route),
    target: "_blank",
    rel: "noreferrer",
  };
}

export function createStorageSidebar(
  pkgBase: string,
  versionLabel: string,
): DefaultTheme.SidebarItem[] {
  const base = pkgBase.replace(/\/$/, "");

  return [
    {
      text: navPackageLabel("Storage", versionLabel),
      items: [
        { text: "Overview", link: `${base}/overview` },
        { text: "Tutorial", link: `${base}/modules/getting-started` },
        { text: "Core concepts", link: `${base}/modules/concepts` },
      ],
    },
    {
      text: "Build your workflow",
      items: [
        { text: "1. Core", link: `${base}/modules/core` },
        { text: "2. Errors", link: `${base}/modules/errors` },
        { text: "3. Maintenance", link: `${base}/modules/maintenance` },
        { text: "4. Snapshots", link: `${base}/modules/snapshots` },
        { text: "5. Observable", link: `${base}/modules/observable` },
        { text: "6. Diagnostics", link: `${base}/modules/diagnostics` },
        { text: "7. Transactions", link: `${base}/modules/transactions` },
        { text: "8. Async / IndexedDB", link: `${base}/modules/async` },
        { text: "9. Cross-tab", link: `${base}/modules/cross-tab` },
        { text: "10. Composition", link: `${base}/modules/composition` },
        { text: "11. Recipes", link: `${base}/modules/recipes` },
        { text: "12. Best practices", link: `${base}/modules/best-practices` },
      ],
    },
    {
      text: "Support",
      items: [
        { text: "FAQ", link: `${base}/modules/faq` },
        { text: "Browser support", link: `${base}/modules/browser-support` },
        { text: "Security", link: `${base}/modules/security` },
        { text: "Changelog", link: `${base}/changelog` },
      ],
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
        spaItem("Open lab", "storage"),
        spaItem("Adapters", "storage", "adapters"),
        spaItem("TTL", "storage", "ttl"),
        spaItem("Examples", "storage", "examples"),
        spaItem("Dashboard", "storage", "dashboard"),
        { text: "Playground hub", link: "/playground/" },
      ],
    },
  ];
}

export function createStorageSidebarMap(
  pkgBase: string,
  versionLabel: string,
  archives: ReadonlyArray<{ version: string; label: string }> = [],
): Record<string, DefaultTheme.SidebarItem[]> {
  return buildVersionedSidebarMap(pkgBase, versionLabel, archives, createStorageSidebar);
}
