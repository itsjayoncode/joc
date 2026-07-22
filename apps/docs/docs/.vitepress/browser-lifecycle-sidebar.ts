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

function spaItem(text: string, route = ""): DefaultTheme.SidebarItem {
  return {
    text: `${text} ↗`,
    link: playgroundRoute("browser-lifecycle", route),
    target: "_blank",
    rel: "noreferrer",
  };
}

const browserLifecycleGuides = (pkgBase: string) => [
  { text: "Quick Start", link: `${pkgBase}/guides/quick-start` },
  { text: "Usage", link: `${pkgBase}/guides/usage` },
  { text: "Configuration", link: `${pkgBase}/guides/configuration` },
  { text: "Browser Support", link: `${pkgBase}/guides/browser-support` },
  { text: "SSR", link: `${pkgBase}/guides/ssr` },
  { text: "Error Handling", link: `${pkgBase}/guides/error-handling` },
  { text: "Deployment", link: `${pkgBase}/guides/deployment` },
];

const playgroundItems = (pkgBase: string) => [
  { text: "Overview", link: `${pkgBase}/playground/playground` },
  { text: "Visibility", link: `${pkgBase}/playground/visibility-playground` },
  { text: "Focus", link: `${pkgBase}/playground/focus-playground` },
  { text: "Connectivity", link: `${pkgBase}/playground/connectivity-playground` },
  { text: "Idle", link: `${pkgBase}/playground/idle-playground` },
  { text: "Lifecycle", link: `${pkgBase}/playground/lifecycle-playground` },
  { text: "Cross Tab", link: `${pkgBase}/playground/cross-tab-playground` },
  { text: "Plugins", link: `${pkgBase}/playground/plugin-playground` },
  { text: "Events", link: `${pkgBase}/playground/event-explorer` },
  { text: "State", link: `${pkgBase}/playground/state-explorer` },
  { text: "Configuration", link: `${pkgBase}/playground/configuration-playground` },
  { text: "Performance", link: `${pkgBase}/playground/performance-playground` },
  { text: "Developer Tools", link: `${pkgBase}/playground/developer-tools` },
];

const tutorialItems = (pkgBase: string) => [
  { text: "Beginner", link: `${pkgBase}/tutorials/beginner` },
  { text: "Intermediate", link: `${pkgBase}/tutorials/intermediate` },
  { text: "Advanced", link: `${pkgBase}/tutorials/advanced` },
];

const bestPracticeItems = (pkgBase: string) => [
  { text: "Overview", link: `${pkgBase}/best-practices/` },
  { text: "Session Lifecycle", link: `${pkgBase}/best-practices/session-lifecycle` },
  { text: "Memory Management", link: `${pkgBase}/best-practices/memory-management` },
  { text: "Event Cleanup", link: `${pkgBase}/best-practices/event-cleanup` },
  { text: "Performance", link: `${pkgBase}/best-practices/performance` },
  { text: "Configuration", link: `${pkgBase}/best-practices/configuration` },
  { text: "Cross-Tab", link: `${pkgBase}/best-practices/cross-tab` },
  { text: "Idle Detection", link: `${pkgBase}/best-practices/idle-detection` },
  { text: "Visibility Handling", link: `${pkgBase}/best-practices/visibility-handling` },
  { text: "Framework Integration", link: `${pkgBase}/best-practices/framework-integration` },
  { text: "Plugin Development", link: `${pkgBase}/best-practices/plugin-development` },
  { text: "SSR Safety", link: `${pkgBase}/best-practices/ssr-safety` },
  { text: "Security", link: `${pkgBase}/best-practices/security` },
  { text: "Accessibility", link: `${pkgBase}/best-practices/accessibility` },
  { text: "Testing", link: `${pkgBase}/best-practices/testing` },
  { text: "Debugging", link: `${pkgBase}/best-practices/debugging` },
];

const patternItems = (pkgBase: string) => [
  { text: "Overview", link: `${pkgBase}/patterns/` },
  { text: "Auto Save", link: `${pkgBase}/patterns/auto-save` },
  { text: "Gate Analytics", link: `${pkgBase}/patterns/analytics` },
  { text: "Presence Detection", link: `${pkgBase}/patterns/presence-detection` },
  { text: "Session Timeout", link: `${pkgBase}/patterns/session-timeout` },
  { text: "Background Sync", link: `${pkgBase}/patterns/background-sync` },
  { text: "Offline First", link: `${pkgBase}/patterns/offline-first` },
  { text: "Polling", link: `${pkgBase}/patterns/polling` },
  { text: "Page Tracking", link: `${pkgBase}/patterns/page-tracking` },
  { text: "Visibility Pause", link: `${pkgBase}/patterns/visibility-pause` },
  { text: "Focus Resume", link: `${pkgBase}/patterns/focus-resume` },
  { text: "Shared WebSocket", link: `${pkgBase}/patterns/shared-websocket` },
  { text: "Leader Election", link: `${pkgBase}/patterns/leader-election` },
  { text: "Plugin Architecture", link: `${pkgBase}/patterns/plugin-architecture` },
  { text: "State Synchronization", link: `${pkgBase}/patterns/state-synchronization` },
];

const faqItems = (pkgBase: string) => [
  { text: "Overview", link: `${pkgBase}/faq/` },
  { text: "Getting Started", link: `${pkgBase}/faq/getting-started` },
  { text: "Installation", link: `${pkgBase}/faq/installation` },
  { text: "Configuration", link: `${pkgBase}/faq/configuration` },
  { text: "Visibility", link: `${pkgBase}/faq/visibility` },
  { text: "Focus", link: `${pkgBase}/faq/focus` },
  { text: "Connectivity", link: `${pkgBase}/faq/connectivity` },
  { text: "Idle", link: `${pkgBase}/faq/idle` },
  { text: "Lifecycle", link: `${pkgBase}/faq/lifecycle` },
  { text: "Cross Tab", link: `${pkgBase}/faq/cross-tab` },
  { text: "Plugins", link: `${pkgBase}/faq/plugins` },
  { text: "Understand & React", link: `${pkgBase}/modules/intelligence` },
  { text: "Events", link: `${pkgBase}/faq/events` },
  { text: "Performance", link: `${pkgBase}/faq/performance` },
  { text: "Debugging", link: `${pkgBase}/faq/debugging` },
  { text: "Browser Support", link: `${pkgBase}/faq/browser-support` },
  { text: "Frameworks", link: `${pkgBase}/faq/frameworks` },
  { text: "Deployment", link: `${pkgBase}/faq/deployment` },
  { text: "SSR", link: `${pkgBase}/faq/ssr` },
];

export function createBrowserLifecycleSidebar(
  pkgBase: string,
  versionLabel: string,
): DefaultTheme.SidebarItem[] {
  return [
    {
      text: navPackageLabel("Browser Lifecycle", versionLabel),
      items: [
        { text: "Overview", link: `${pkgBase}/overview` },
        { text: "Core concepts", link: `${pkgBase}/modules/concepts` },
        { text: "Tutorial", link: `${pkgBase}/modules/getting-started` },
        { text: "Installation", link: `${pkgBase}/installation` },
      ],
    },
    {
      text: "Build your session",
      items: [
        { text: "1. Visibility", link: `${pkgBase}/modules/visibility` },
        { text: "2. Focus", link: `${pkgBase}/modules/focus` },
        { text: "3. Idle", link: `${pkgBase}/modules/idle` },
        { text: "4. Connectivity", link: `${pkgBase}/modules/connectivity` },
        { text: "5. Cross-tab", link: `${pkgBase}/modules/cross-tab` },
        { text: "6. Page lifecycle", link: `${pkgBase}/modules/lifecycle` },
        { text: "7. Events", link: `${pkgBase}/modules/events` },
        { text: "8. Session core", link: `${pkgBase}/modules/session-core` },
        { text: "9. Plugins", link: `${pkgBase}/modules/plugins` },
        { text: "10. Core infrastructure", link: `${pkgBase}/modules/core-infrastructure` },
      ],
    },
    {
      text: "Understand & React",
      items: [
        { text: "Overview", link: `${pkgBase}/modules/intelligence` },
        { text: "Activity", link: `${pkgBase}/modules/activity` },
        { text: "Presence", link: `${pkgBase}/modules/presence` },
        { text: "Timeline", link: `${pkgBase}/modules/timeline` },
        { text: "Metrics", link: `${pkgBase}/modules/metrics` },
        { text: "Reports", link: `${pkgBase}/modules/reports` },
        { text: "Wait helpers", link: `${pkgBase}/modules/wait` },
        { text: "Conditions", link: `${pkgBase}/modules/conditions` },
        { text: "Resilience", link: `${pkgBase}/modules/resilience` },
      ],
    },
    {
      text: "Framework adapters",
      items: [{ text: "Adapters", link: `${pkgBase}/modules/adapters` }],
    },
    {
      text: "Guides",
      collapsed: true,
      items: browserLifecycleGuides(pkgBase),
    },
    {
      text: "Reference",
      items: [
        { text: "API (TypeDoc)", link: `${pkgBase}/api/` },
        { text: "Framework examples", link: `${pkgBase}/examples/` },
      ],
    },
    {
      text: "Tutorials",
      collapsed: true,
      items: tutorialItems(pkgBase),
    },
    {
      text: "Best Practices",
      collapsed: true,
      items: bestPracticeItems(pkgBase),
    },
    {
      text: "Patterns",
      collapsed: true,
      items: patternItems(pkgBase),
    },
    {
      text: "FAQ",
      collapsed: true,
      items: faqItems(pkgBase),
    },
    {
      text: "Playground",
      items: playgroundItems(pkgBase),
    },
    {
      text: "Interactive",
      collapsed: false,
      items: [
        spaItem("Open sandbox"),
        spaItem("Visibility", "visibility"),
        spaItem("Events", "events"),
        spaItem("Lifecycle", "lifecycle"),
        spaItem("Configuration", "configuration"),
        spaItem("Plugins", "plugins"),
        spaItem("Developer tools", "developer-tools"),
        { text: "Playground hub", link: "/playground/" },
      ],
    },
    {
      text: "Support",
      items: [
        { text: "Troubleshooting", link: `${pkgBase}/troubleshooting/` },
        { text: "Migration", link: `${pkgBase}/migration/` },
        { text: "Changelog", link: `${pkgBase}/changelog` },
      ],
    },
  ];
}

export function createBrowserLifecycleSidebarMap(
  pkgBase: string,
  currentVersionLabel: string,
  archives: ReadonlyArray<{ version: string; label: string }>,
): Record<string, DefaultTheme.SidebarItem[]> {
  return buildVersionedSidebarMap(
    pkgBase,
    currentVersionLabel,
    archives,
    createBrowserLifecycleSidebar,
  );
}
