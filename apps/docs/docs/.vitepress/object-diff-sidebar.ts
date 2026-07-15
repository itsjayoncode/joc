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
          { text: "Getting Started", link: `${pkgBase}/modules/getting-started` },
        ],
      },
      {
        text: "API Modules",
        items: [
          { text: "diff()", link: `${pkgBase}/modules/diff` },
          { text: "patch()", link: `${pkgBase}/modules/patch` },
          { text: "serialize()", link: `${pkgBase}/modules/serialize` },
        ],
      },
      {
        text: "API Reference",
        items: [{ text: "TypeDoc", link: `${pkgBase}/api/` }],
      },
      {
        text: "Playground",
        items: [{ text: "Overview", link: `${pkgBase}/playground/playground` }],
      },
    ],
  };
}
