import { resolvePlaygroundPath } from "./seo.js";

import type { DefaultTheme } from "vitepress";

export function createFormIntelligentSidebarMap(
  pkgBase: string,
  versionLabel: string,
): Record<string, DefaultTheme.SidebarItem[]> {
  return {
    [pkgBase]: [
      {
        text: `Form Intelligent · ${versionLabel}`,
        items: [
          { text: "Overview", link: `${pkgBase}/` },
          { text: "Core concepts", link: `${pkgBase}/modules/concepts` },
          { text: "Tutorial", link: `${pkgBase}/modules/getting-started` },
        ],
      },
      {
        text: "Build your form",
        items: [
          { text: "1. Validation", link: `${pkgBase}/modules/validation` },
          { text: "2. Submission", link: `${pkgBase}/modules/submission` },
          { text: "3. Workflow", link: `${pkgBase}/modules/workflow` },
        ],
      },
      {
        text: "Go further",
        items: [
          { text: "Formatters", link: `${pkgBase}/modules/formatters` },
          { text: "Plugins", link: `${pkgBase}/modules/plugins` },
          { text: "Adapters", link: `${pkgBase}/modules/adapters` },
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
            link: resolvePlaygroundPath("form-intelligent"),
            target: "_blank",
            rel: "noreferrer",
          },
        ],
      },
    ],
  };
}
