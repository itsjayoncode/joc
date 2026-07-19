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

/**
 * JOC Documentation Standard sidebar for Form Intelligence.
 * @see packages/form-intelligence/engineering/010-documentation-standard.md
 */
export function createFormIntelligenceSidebar(
  pkgBase: string,
  versionLabel: string,
): DefaultTheme.SidebarItem[] {
  const base = pkgBase.replace(/\/$/, "");

  return [
    {
      text: navPackageLabel("Form Intelligence", versionLabel),
      items: [{ text: "Overview", link: `${base}/overview` }],
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
        { text: "Entrypoints", link: `${base}/modules/entrypoints` },
        { text: "UI projection", link: `${base}/modules/ui-projection` },
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
        { text: "Performance", link: `${base}/modules/performance` },
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
          link: playgroundRoute("form-intelligence", "examples"),
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
          text: "Open sandbox ↗",
          link: playgroundRoute("form-intelligence"),
          target: "_blank",
          rel: "noreferrer",
        },
        {
          text: "Validation ↗",
          link: playgroundRoute("form-intelligence", "validation"),
          target: "_blank",
          rel: "noreferrer",
        },
        {
          text: "Rules ↗",
          link: playgroundRoute("form-intelligence", "rules"),
          target: "_blank",
          rel: "noreferrer",
        },
        {
          text: "Submission ↗",
          link: playgroundRoute("form-intelligence", "submission"),
          target: "_blank",
          rel: "noreferrer",
        },
        {
          text: "Workflow ↗",
          link: playgroundRoute("form-intelligence", "workflow"),
          target: "_blank",
          rel: "noreferrer",
        },
        {
          text: "Calculations ↗",
          link: playgroundRoute("form-intelligence", "calculations"),
          target: "_blank",
          rel: "noreferrer",
        },
        {
          text: "State ↗",
          link: playgroundRoute("form-intelligence", "state"),
          target: "_blank",
          rel: "noreferrer",
        },
        {
          text: "DevTools ↗",
          link: playgroundRoute("form-intelligence", "devtools"),
          target: "_blank",
          rel: "noreferrer",
        },
        {
          text: "Performance ↗",
          link: playgroundRoute("form-intelligence", "performance"),
          target: "_blank",
          rel: "noreferrer",
        },
        {
          text: "Dashboard ↗",
          link: playgroundRoute("form-intelligence", "dashboard"),
          target: "_blank",
          rel: "noreferrer",
        },
        {
          text: "Playground hub",
          link: "/playground/",
        },
      ],
    },
  ];
}

export function createFormIntelligenceSidebarMap(
  pkgBase: string,
  versionLabel: string,
  archives: ReadonlyArray<{ version: string; label: string }> = [],
): Record<string, DefaultTheme.SidebarItem[]> {
  return buildVersionedSidebarMap(pkgBase, versionLabel, archives, createFormIntelligenceSidebar);
}
