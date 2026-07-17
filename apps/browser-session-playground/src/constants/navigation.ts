import {
  ActivityIcon,
  CompassIcon,
  DashboardIcon,
  EventsIcon,
  FocusIcon,
  InfoIcon,
  LifecycleIcon,
  PerformanceIcon,
  PluginsIcon,
  SettingsIcon,
  SupportIcon,
  ToolsIcon,
  WifiIcon,
} from "../icons/AppIcons.js";

import type { NavigationGroup, NavigationItem } from "../types/navigation.js";

export const APP_NAVIGATION_GROUPS: readonly NavigationGroup[] = [
  {
    description: "Primary engineering laboratory.",
    id: "overview",
    label: "Laboratory",
    order: 10,
    items: [
      {
        description:
          "Interactive Browser Lifecycle Developer Sandbox — configure, observe, simulate, inspect.",
        groupId: "overview",
        icon: ToolsIcon,
        id: "sandbox",
        intent: "current",
        keywords: ["sandbox", "lab", "home", "devtools"],
        label: "Lifecycle Sandbox",
        path: "/",
      },
      {
        description: "Operational overview, readiness notes, and shell-level diagnostics.",
        groupId: "overview",
        icon: DashboardIcon,
        id: "dashboard",
        intent: "current",
        keywords: ["overview", "dashboard", "readiness"],
        label: "Dashboard",
        path: "/dashboard",
      },
    ],
  },
  {
    description: "Focused module explorers for deep dives.",
    id: "modules",
    label: "Explorers",
    order: 20,
    items: [
      {
        description: "Visibility diagnostics, state transitions, and browser event tracing.",
        groupId: "modules",
        icon: CompassIcon,
        id: "visibility",
        intent: "current",
        keywords: ["document", "hidden", "visible"],
        label: "Visibility",
        path: "/visibility",
      },
      {
        description: "Focus and blur transitions for attention-aware runtime behavior.",
        groupId: "modules",
        icon: FocusIcon,
        id: "focus",
        intent: "current",
        keywords: ["focus", "blur", "attention"],
        label: "Focus",
        path: "/focus",
      },
      {
        description: "Connectivity state inspection, offline simulation, and event traces.",
        groupId: "modules",
        icon: WifiIcon,
        id: "connectivity",
        intent: "current",
        keywords: ["online", "offline", "network"],
        label: "Connectivity",
        path: "/connectivity",
      },
      {
        description: "Idle timers, interaction thresholds, and user activity observations.",
        groupId: "modules",
        icon: ActivityIcon,
        id: "idle",
        intent: "current",
        keywords: ["idle", "activity", "timers"],
        label: "Idle",
        path: "/idle",
      },
      {
        description: "Lifecycle state changes, ordering, and transition event auditing.",
        groupId: "modules",
        icon: LifecycleIcon,
        id: "lifecycle",
        intent: "current",
        keywords: ["lifecycle", "state", "session"],
        label: "Lifecycle",
        path: "/lifecycle",
      },
      {
        description: "Cross-tab coordination, leadership state, and shared session behavior.",
        groupId: "modules",
        icon: LifecycleIcon,
        id: "cross-tab",
        intent: "current",
        keywords: ["cross-tab", "leadership", "shared"],
        label: "Cross Tab",
        path: "/cross-tab",
      },
      {
        description: "Plugin registration, instrumentation hooks, and integration probes.",
        groupId: "modules",
        icon: PluginsIcon,
        id: "plugins",
        intent: "current",
        keywords: ["plugins", "extensions", "hooks"],
        label: "Plugins",
        path: "/plugins",
      },
      {
        description: "Event timelines, payload inspection, and subscription debugging.",
        groupId: "modules",
        icon: EventsIcon,
        id: "events",
        intent: "current",
        keywords: ["events", "stream", "timeline"],
        label: "Events",
        path: "/events",
      },
      {
        description: "Runtime snapshot inspection, module state cards, history, and diffs.",
        groupId: "modules",
        icon: ToolsIcon,
        id: "state",
        intent: "current",
        keywords: ["state", "snapshot", "diff"],
        label: "State",
        path: "/state",
      },
      {
        description: "Configuration presets, option toggles, and runtime setup validation.",
        groupId: "modules",
        icon: SettingsIcon,
        id: "configuration",
        intent: "current",
        keywords: ["config", "options", "presets"],
        label: "Configuration",
        path: "/configuration",
      },
      {
        description: "Performance counters, observer timing, and throughput benchmarks.",
        groupId: "modules",
        icon: PerformanceIcon,
        id: "performance",
        intent: "current",
        keywords: ["performance", "timing", "benchmark"],
        label: "Performance",
        path: "/performance",
      },
      {
        description: "Developer-centric automation, debug flags, and inspection tooling.",
        groupId: "modules",
        icon: ToolsIcon,
        id: "developer-tools",
        intent: "current",
        keywords: ["developer", "debug", "tools"],
        label: "Developer Tools",
        path: "/developer-tools",
        shortLabel: "Dev Tools",
      },
    ],
  },
  {
    description: "Shell controls, documentation, and support surfaces for the playground.",
    id: "workspace",
    label: "Workspace",
    order: 30,
    items: [
      {
        description: "Application preferences, layout controls, and developer defaults.",
        groupId: "workspace",
        icon: SettingsIcon,
        id: "settings",
        intent: "current",
        keywords: ["preferences", "theme", "layout"],
        label: "Settings",
        path: "/settings",
      },
      {
        description: "Architecture notes, shell rationale, and product positioning.",
        groupId: "workspace",
        icon: InfoIcon,
        id: "about",
        intent: "current",
        keywords: ["docs", "architecture", "about"],
        label: "About",
        path: "/about",
      },
      {
        badge: { label: "Disabled", tone: "warning" },
        description: "Support workflows, issue intake, and contribution guidance.",
        disabled: true,
        groupId: "workspace",
        icon: SupportIcon,
        id: "support",
        intent: "planned",
        keywords: ["support", "help", "issues"],
        label: "Support",
        path: "/support",
      },
    ],
  },
] as const;

export const APP_NAVIGATION_ITEMS: readonly NavigationItem[] = APP_NAVIGATION_GROUPS.flatMap(
  (group) => group.items,
);

export const CURRENT_NAVIGATION_ITEMS: readonly NavigationItem[] = APP_NAVIGATION_ITEMS.filter(
  (item) => item.intent === "current" && !item.disabled,
);

export const FUTURE_PLAYGROUND_ITEMS: readonly NavigationItem[] = APP_NAVIGATION_ITEMS.filter(
  (item) => item.groupId === "modules" && item.intent === "planned",
);

export const ROUTABLE_NAVIGATION_ITEMS: readonly NavigationItem[] = CURRENT_NAVIGATION_ITEMS.filter(
  (item): item is NavigationItem & { readonly path: string } => item.path !== undefined,
);

export const APP_ROUTE_PATHS = ROUTABLE_NAVIGATION_ITEMS.map(
  (item) => item.path,
) as readonly string[];

export function findNavigationItemByPath(pathname: string): NavigationItem | undefined {
  return ROUTABLE_NAVIGATION_ITEMS.find((item) => item.path === pathname);
}
