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
    description: "Primary engineering laboratory.",
    id: "overview",
    label: "Laboratory",
    order: 10,
    items: [
      {
        description: "Interactive Object Diff Laboratory — configure, compare, inspect, benchmark.",
        groupId: "overview",
        icon: ToolsIcon,
        id: "lab",
        intent: "current",
        keywords: ["lab", "sandbox", "home", "playground"],
        label: "Object Diff Lab",
        path: "/",
      },
      {
        description: "Package overview and sample quick-diff.",
        groupId: "overview",
        icon: DashboardIcon,
        id: "dashboard",
        intent: "current",
        keywords: ["overview", "dashboard"],
        label: "Dashboard",
        path: "/dashboard",
      },
    ],
  },
  {
    description: "Focused deep-dive explorers.",
    id: "modules",
    label: "Explorers",
    order: 20,
    items: [
      {
        description: "Focused before/after JSON comparison workspace.",
        groupId: "modules",
        icon: CompassIcon,
        id: "diff",
        intent: "current",
        keywords: ["diff", "compare", "changes"],
        label: "Diff Explorer",
        path: "/diff",
      },
      {
        description: "Generate, apply, and revert JSON Patch operations.",
        groupId: "modules",
        icon: ToolsIcon,
        id: "patch",
        intent: "current",
        keywords: ["patch", "apply", "revert"],
        label: "Patch Explorer",
        path: "/patch",
      },
      {
        description: "Inspect JSON values with expandable tree navigation.",
        groupId: "modules",
        icon: EventsIcon,
        id: "json",
        intent: "current",
        keywords: ["json", "tree", "viewer"],
        label: "JSON Viewer",
        path: "/json",
      },
      {
        description: "Benchmark comparison performance with preset fixtures.",
        groupId: "modules",
        icon: PerformanceIcon,
        id: "performance",
        intent: "current",
        keywords: ["performance", "benchmark"],
        label: "Performance",
        path: "/performance",
      },
      {
        description: "Integration examples and usage snippets.",
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
        description: "Architecture notes and product positioning.",
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
