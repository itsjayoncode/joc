import { navPackageLabel } from "./nav-package-label.js";
import { resolvePlaygroundPath } from "./seo.js";

import type { DefaultTheme } from "vitepress";

function playgroundRoute(slug: string, route = ""): string {
  const base = resolvePlaygroundPath(slug);
  if (!route) {
    return base;
  }

  return `${base}${route.replace(/^\//, "")}`;
}

/**
 * JOC Documentation Standard sidebar for Form Intelligent.
 * @see packages/form-intelligent/engineering/010-documentation-standard.md
 */
export function createFormIntelligentSidebarMap(
  pkgBase: string,
  versionLabel: string,
): Record<string, DefaultTheme.SidebarItem[]> {
  const base = pkgBase.replace(/\/$/, "");

  return {
    [`${base}/`]: [
      {
        text: navPackageLabel("Form Intelligent", versionLabel),
        items: [{ text: "Overview", link: `${base}/` }],
      },
      {
        text: "Getting Started",
        items: [{ text: "Tutorial", link: `${base}/modules/getting-started` }],
      },
      {
        text: "Core Concepts",
        items: [
          { text: "Core concepts", link: `${base}/modules/concepts` },
          { text: "Capabilities", link: `${base}/modules/capabilities` },
        ],
      },
      {
        text: "Guides",
        items: [
          { text: "Validation", link: `${base}/modules/validation` },
          { text: "Submission", link: `${base}/modules/submission` },
          { text: "State", link: `${base}/modules/state` },
          { text: "Workflow", link: `${base}/modules/workflow` },
          { text: "Rules", link: `${base}/modules/rules` },
          { text: "Calculations", link: `${base}/modules/calculations` },
          { text: "Formatters", link: `${base}/modules/formatters` },
        ],
      },
      {
        text: "Integrations",
        items: [
          { text: "Integrations", link: `${base}/modules/integrations` },
          { text: "Adapters", link: `${base}/modules/adapters` },
        ],
      },
      {
        text: "Advanced",
        items: [
          { text: "Plugins", link: `${base}/modules/plugins` },
          { text: "Patterns", link: `${base}/modules/patterns` },
        ],
      },
      {
        text: "Support",
        items: [
          { text: "Migration", link: `${base}/modules/migration` },
          { text: "Changelog", link: `${base}/changelog` },
        ],
      },
      {
        text: "Reference",
        items: [
          { text: "API (TypeDoc)", link: `${base}/api/` },
          { text: "Playground guide", link: `${base}/playground/playground` },
          {
            text: "Examples",
            link: playgroundRoute("form-intelligent", "examples"),
            target: "_blank",
            rel: "noreferrer",
          },
        ],
      },
      {
        text: "Interactive",
        collapsed: false,
        items: [
          {
            text: "Open playground ↗",
            link: playgroundRoute("form-intelligent"),
            target: "_blank",
            rel: "noreferrer",
          },
          {
            text: "Validation ↗",
            link: playgroundRoute("form-intelligent", "validation"),
            target: "_blank",
            rel: "noreferrer",
          },
          {
            text: "Rules ↗",
            link: playgroundRoute("form-intelligent", "rules"),
            target: "_blank",
            rel: "noreferrer",
          },
          {
            text: "Submission ↗",
            link: playgroundRoute("form-intelligent", "submission"),
            target: "_blank",
            rel: "noreferrer",
          },
          {
            text: "Workflow ↗",
            link: playgroundRoute("form-intelligent", "workflow"),
            target: "_blank",
            rel: "noreferrer",
          },
          {
            text: "DevTools ↗",
            link: playgroundRoute("form-intelligent", "devtools"),
            target: "_blank",
            rel: "noreferrer",
          },
          {
            text: "Performance ↗",
            link: playgroundRoute("form-intelligent", "performance"),
            target: "_blank",
            rel: "noreferrer",
          },
          {
            text: "Playground hub",
            link: "/playground/",
          },
        ],
      },
    ],
  };
}
