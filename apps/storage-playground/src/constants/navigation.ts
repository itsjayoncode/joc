import {
  CompassIcon,
  DashboardIcon,
  EventsIcon,
  InfoIcon,
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
        description: "Interactive Storage Laboratory — adapters, TTL, envelope inspection.",
        groupId: "overview",
        icon: ToolsIcon,
        id: "lab",
        intent: "current",
        keywords: ["lab", "sandbox", "home", "playground"],
        label: "Storage Lab",
        path: "/",
      },
      {
        description: "Package overview and quick sample write/read.",
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
        description: "Compare memory, localStorage, and sessionStorage adapters.",
        groupId: "modules",
        icon: CompassIcon,
        id: "adapters",
        intent: "current",
        keywords: ["adapter", "localStorage", "sessionStorage", "memory"],
        label: "Adapters",
        path: "/adapters",
      },
      {
        description: "Inspect TTL expiry and storage envelopes.",
        groupId: "modules",
        icon: EventsIcon,
        id: "ttl",
        intent: "current",
        keywords: ["ttl", "envelope", "expiry", "peek"],
        label: "TTL & Envelope",
        path: "/ttl",
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
