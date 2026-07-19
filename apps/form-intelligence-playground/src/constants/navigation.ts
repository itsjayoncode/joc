import {
  CompassIcon,
  DashboardIcon,
  EventsIcon,
  InfoIcon,
  PerformanceIcon,
  SettingsIcon,
  ToolsIcon,
} from "../icons/AppIcons.js";

import type { NavigationGroup } from "../types/navigation.js";

export const APP_NAVIGATION_GROUPS: readonly NavigationGroup[] = [
  {
    description: "Entry points and product overview.",
    id: "overview",
    label: "Overview",
    order: 10,
    items: [
      {
        description: "Interactive developer sandbox — configure, inspect, and debug forms live.",
        groupId: "overview",
        icon: DashboardIcon,
        id: "sandbox",
        intent: "current",
        keywords: ["sandbox", "lab", "devtools", "playground", "home"],
        label: "Sandbox",
        path: "/",
      },
      {
        description: "Package philosophy, versions, and quick links to every explorer.",
        groupId: "overview",
        icon: InfoIcon,
        id: "dashboard",
        intent: "current",
        keywords: ["overview", "dashboard"],
        label: "Dashboard",
        path: "/dashboard",
      },
    ],
  },
  {
    description: "Interactive form workflow workspaces with live inspectors.",
    id: "modules",
    label: "Explorers",
    order: 20,
    items: [
      {
        description: "Built-in validators, async checks, cross-field rules, and timing controls.",
        groupId: "modules",
        icon: CompassIcon,
        id: "validation",
        intent: "current",
        keywords: ["validation", "errors", "email", "async"],
        label: "Validation",
        path: "/validation",
      },
      {
        description:
          "Hard submissionGuard(), form.ui.canSubmit, flaky API, offline queue, double-submit.",
        groupId: "modules",
        icon: ToolsIcon,
        id: "submission",
        intent: "current",
        keywords: ["submit", "retry", "loading", "offline", "guard", "canSubmit"],
        label: "Submission",
        path: "/submission",
      },
      {
        description: "Autosave debounce, draft restore, wizard steps, and conditional fields.",
        groupId: "modules",
        icon: PerformanceIcon,
        id: "workflow",
        intent: "current",
        keywords: ["workflow", "wizard", "autosave", "draft"],
        label: "Workflow",
        path: "/workflow",
      },
      {
        description: "Values tree, field flags, snapshot timeline, and object-diff view.",
        groupId: "modules",
        icon: EventsIcon,
        id: "state",
        intent: "current",
        keywords: ["state", "json", "explorer", "diff"],
        label: "State Explorer",
        path: "/state",
      },
      {
        description: "Active forms, validation log, workflow timeline, and state snapshots.",
        groupId: "modules",
        icon: EventsIcon,
        id: "devtools",
        intent: "current",
        keywords: ["devtools", "inspector", "debug", "timeline"],
        label: "DevTools",
        path: "/devtools",
      },
      {
        description: "Phone, currency, slug, and custom format vs stored value preview.",
        groupId: "modules",
        icon: ToolsIcon,
        id: "formatters",
        intent: "current",
        keywords: ["format", "phone", "currency", "parse"],
        label: "Formatters",
        path: "/formatters",
      },
      {
        description: "Register plugins and inspect lifecycle hook events.",
        groupId: "modules",
        icon: EventsIcon,
        id: "plugins",
        intent: "current",
        keywords: ["plugins", "hooks", "events"],
        label: "Plugins",
        path: "/plugins",
      },
      {
        description: "Validation, autosave, and submit microbenchmarks in the browser.",
        groupId: "modules",
        icon: PerformanceIcon,
        id: "performance",
        intent: "current",
        keywords: ["performance", "benchmark", "latency", "memory"],
        label: "Performance",
        path: "/performance",
      },
      {
        description: "HTML binding today; React adapter live; Zod and other bridges mapped.",
        groupId: "modules",
        icon: InfoIcon,
        id: "adapters",
        intent: "current",
        keywords: ["adapters", "react", "zod", "rhf"],
        label: "Adapters",
        path: "/adapters",
      },
      {
        description: "when() show/hide/require and disableSubmit — inspect fieldUi live.",
        groupId: "modules",
        icon: CompassIcon,
        id: "rules",
        intent: "current",
        keywords: ["rules", "conditional", "when", "business"],
        label: "Rules",
        path: "/rules",
      },
      {
        description: "Country → province populate via when().changes() (async options).",
        groupId: "modules",
        icon: PerformanceIcon,
        id: "dependencies",
        intent: "current",
        keywords: ["dependencies", "populate", "select"],
        label: "Dependencies",
        path: "/dependencies",
      },
      {
        description: "form.calculate() derived totals — watch recomputes in the inspector.",
        groupId: "modules",
        icon: ToolsIcon,
        id: "calculations",
        intent: "current",
        keywords: ["calculate", "derived", "total"],
        label: "Calculations",
        path: "/calculations",
      },
      {
        description: "Draft save, keyboard shortcuts, browser lifecycle, analytics snapshot.",
        groupId: "modules",
        icon: EventsIcon,
        id: "integrations",
        intent: "current",
        keywords: ["keyboard", "session", "visibility", "analytics"],
        label: "Integrations",
        path: "/integrations",
      },
      {
        description: "Copy-paste snippets; prefer Sandbox Generated Code for live configs.",
        groupId: "modules",
        icon: InfoIcon,
        id: "examples",
        intent: "current",
        keywords: ["examples", "snippets"],
        label: "Examples",
        path: "/examples",
      },
    ],
  },
  {
    description: "Shell controls and documentation.",
    id: "workspace",
    label: "Workspace",
    order: 30,
    items: [
      {
        description: "Theme and layout preferences.",
        groupId: "workspace",
        icon: SettingsIcon,
        id: "settings",
        intent: "current",
        keywords: ["preferences", "theme"],
        label: "Settings",
        path: "/settings",
      },
      {
        description: "Product positioning and playground architecture.",
        groupId: "workspace",
        icon: InfoIcon,
        id: "about",
        intent: "current",
        keywords: ["about", "docs"],
        label: "About",
        path: "/about",
      },
    ],
  },
] as const;

export const APP_NAVIGATION_ITEMS = APP_NAVIGATION_GROUPS.flatMap((group) => group.items);

export const CURRENT_NAVIGATION_ITEMS = APP_NAVIGATION_ITEMS.filter(
  (item) => item.intent === "current" && !item.disabled,
);

export const ROUTABLE_NAVIGATION_ITEMS = CURRENT_NAVIGATION_ITEMS.filter(
  (item): item is (typeof CURRENT_NAVIGATION_ITEMS)[number] & { path: string } =>
    item.path !== undefined,
);

export const APP_ROUTE_PATHS = ROUTABLE_NAVIGATION_ITEMS.map((item) => item.path);

export function findNavigationItemByPath(pathname: string) {
  return ROUTABLE_NAVIGATION_ITEMS.find((item) => item.path === pathname);
}
