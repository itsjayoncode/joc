import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitepress";

import {
  buildOrganizationJsonLd,
  buildSoftwarePackageJsonLd,
  defaultKeywords,
  docsPlaygroundUrl,
  docsSiteUrl,
  resolvePublicAssetUrl,
  siteName,
  siteTagline,
} from "./seo.js";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");
const browserLifecycleVersion = (
  JSON.parse(
    readFileSync(path.join(repoRoot, "packages/browser-lifecycle/package.json"), "utf8"),
  ) as { version: string }
).version;
const browserLifecycleVersionLabel = `v${browserLifecycleVersion}`;

const docsBase = process.env.VITE_DOCS_BASE ?? "/";
const PLAYGROUND_URL = docsPlaygroundUrl;
const ogImageUrl = resolvePublicAssetUrl("logo.png");
const sitemapHostname = docsSiteUrl.endsWith("/") ? docsSiteUrl : `${docsSiteUrl}/`;

const packageItems = [
  { text: "Browser Lifecycle", link: "/packages/browser-lifecycle/" },
  { text: "Request", link: "/packages/request/" },
  { text: "Scroll", link: "/packages/scroll/" },
  { text: "Keyboard", link: "/packages/keyboard/" },
  { text: "Responsive", link: "/packages/responsive/" },
  { text: "Theme", link: "/packages/theme/" },
  { text: "Forms", link: "/packages/forms/" },
  { text: "Layers", link: "/packages/layers/" },
  { text: "Audit", link: "/packages/audit/" },
  { text: "Permissions", link: "/packages/permissions/" },
  { text: "Workflow", link: "/packages/workflow/" },
  { text: "Object Diff", link: "/packages/object-diff/" },
];

const browserLifecycleGuides = [
  { text: "Quick Start", link: "/guides/browser-lifecycle/quick-start" },
  { text: "Usage", link: "/guides/browser-lifecycle/usage" },
  { text: "Configuration", link: "/guides/browser-lifecycle/configuration" },
  { text: "Browser Support", link: "/guides/browser-lifecycle/browser-support" },
  { text: "SSR", link: "/guides/browser-lifecycle/ssr" },
  { text: "Error Handling", link: "/guides/browser-lifecycle/error-handling" },
  { text: "Deployment", link: "/guides/browser-lifecycle/deployment" },
];

const browserLifecycleModules = [
  { text: "Core Infrastructure", link: "/packages/browser-lifecycle/modules/core-infrastructure" },
  { text: "Session Core", link: "/packages/browser-lifecycle/modules/session-core" },
  { text: "Events", link: "/packages/browser-lifecycle/modules/events" },
  { text: "Visibility", link: "/packages/browser-lifecycle/modules/visibility" },
];

const playgroundItems = [
  { text: "Overview", link: "/playground/playground" },
  { text: "Visibility", link: "/playground/visibility-playground" },
  { text: "Focus", link: "/playground/focus-playground" },
  { text: "Connectivity", link: "/playground/connectivity-playground" },
  { text: "Idle", link: "/playground/idle-playground" },
  { text: "Lifecycle", link: "/playground/lifecycle-playground" },
  { text: "Cross Tab", link: "/playground/cross-tab-playground" },
  { text: "Plugins", link: "/playground/plugin-playground" },
  { text: "Events", link: "/playground/event-explorer" },
  { text: "State", link: "/playground/state-explorer" },
  { text: "Configuration", link: "/playground/configuration-playground" },
  { text: "Performance", link: "/playground/performance-playground" },
  { text: "Developer Tools", link: "/playground/developer-tools" },
];

const tutorialItems = [
  { text: "Beginner", link: "/tutorials/beginner" },
  { text: "Intermediate", link: "/tutorials/intermediate" },
  { text: "Advanced", link: "/tutorials/advanced" },
];

const bestPracticeItems = [
  { text: "Overview", link: "/best-practices/" },
  { text: "Session Lifecycle", link: "/best-practices/session-lifecycle" },
  { text: "Memory Management", link: "/best-practices/memory-management" },
  { text: "Event Cleanup", link: "/best-practices/event-cleanup" },
  { text: "Performance", link: "/best-practices/performance" },
  { text: "Configuration", link: "/best-practices/configuration" },
  { text: "Cross-Tab", link: "/best-practices/cross-tab" },
  { text: "Idle Detection", link: "/best-practices/idle-detection" },
  { text: "Visibility Handling", link: "/best-practices/visibility-handling" },
  { text: "Framework Integration", link: "/best-practices/framework-integration" },
  { text: "Plugin Development", link: "/best-practices/plugin-development" },
  { text: "SSR Safety", link: "/best-practices/ssr-safety" },
  { text: "Security", link: "/best-practices/security" },
  { text: "Accessibility", link: "/best-practices/accessibility" },
  { text: "Testing", link: "/best-practices/testing" },
  { text: "Debugging", link: "/best-practices/debugging" },
];

const patternItems = [
  { text: "Overview", link: "/patterns/" },
  { text: "Auto Save", link: "/patterns/auto-save" },
  { text: "Analytics", link: "/patterns/analytics" },
  { text: "Presence Detection", link: "/patterns/presence-detection" },
  { text: "Session Timeout", link: "/patterns/session-timeout" },
  { text: "Background Sync", link: "/patterns/background-sync" },
  { text: "Offline First", link: "/patterns/offline-first" },
  { text: "Polling", link: "/patterns/polling" },
  { text: "Page Tracking", link: "/patterns/page-tracking" },
  { text: "Visibility Pause", link: "/patterns/visibility-pause" },
  { text: "Focus Resume", link: "/patterns/focus-resume" },
  { text: "Shared WebSocket", link: "/patterns/shared-websocket" },
  { text: "Leader Election", link: "/patterns/leader-election" },
  { text: "Plugin Architecture", link: "/patterns/plugin-architecture" },
  { text: "State Synchronization", link: "/patterns/state-synchronization" },
];

const faqItems = [
  { text: "Overview", link: "/faq/" },
  { text: "Getting Started", link: "/faq/getting-started" },
  { text: "Installation", link: "/faq/installation" },
  { text: "Configuration", link: "/faq/configuration" },
  { text: "Visibility", link: "/faq/visibility" },
  { text: "Focus", link: "/faq/focus" },
  { text: "Connectivity", link: "/faq/connectivity" },
  { text: "Idle", link: "/faq/idle" },
  { text: "Lifecycle", link: "/faq/lifecycle" },
  { text: "Cross Tab", link: "/faq/cross-tab" },
  { text: "Plugins", link: "/faq/plugins" },
  { text: "Events", link: "/faq/events" },
  { text: "Performance", link: "/faq/performance" },
  { text: "Debugging", link: "/faq/debugging" },
  { text: "Browser Support", link: "/faq/browser-support" },
  { text: "Frameworks", link: "/faq/frameworks" },
  { text: "Deployment", link: "/faq/deployment" },
  { text: "SSR", link: "/faq/ssr" },
];

export default defineConfig({
  base: docsBase,
  title: siteName,
  titleTemplate: ":title | JOC",
  description: siteTagline,
  lang: "en-US",
  srcDir: ".",
  cleanUrls: true,
  lastUpdated: true,
  sitemap: {
    hostname: sitemapHostname,
  },
  head: [
    ["link", { rel: "icon", href: "/favicon.png", type: "image/png" }],
    ["link", { rel: "canonical", href: docsSiteUrl }],
    ["meta", { name: "theme-color", content: "#111827" }],
    ["meta", { name: "author", content: "JayOnCode" }],
    ["meta", { name: "robots", content: "index, follow" }],
    ["meta", { name: "keywords", content: defaultKeywords }],
    ["meta", { name: "application-name", content: "JOC" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:site_name", content: siteName }],
    ["meta", { property: "og:title", content: siteName }],
    ["meta", { property: "og:description", content: siteTagline }],
    ["meta", { property: "og:url", content: docsSiteUrl }],
    ["meta", { property: "og:image", content: ogImageUrl }],
    ["meta", { property: "og:locale", content: "en_US" }],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:title", content: siteName }],
    ["meta", { name: "twitter:description", content: siteTagline }],
    ["meta", { name: "twitter:image", content: ogImageUrl }],
    ["script", { type: "application/ld+json" }, buildOrganizationJsonLd(docsSiteUrl)],
    ["script", { type: "application/ld+json" }, buildSoftwarePackageJsonLd(docsSiteUrl)],
  ],
  themeConfig: {
    logo: {
      alt: "JOC",
      light: "/logo.png",
      dark: "/logo.png",
    },
    siteTitle: "JOC",
    search: {
      provider: "local",
    },
    nav: [
      { text: "Getting Started", link: "/getting-started/introduction" },
      {
        text: "Browser Lifecycle",
        items: [
          { text: "Overview", link: "/packages/browser-lifecycle/" },
          { text: "Quick Start", link: "/guides/browser-lifecycle/quick-start" },
          { text: "Usage Guide", link: "/guides/browser-lifecycle/usage" },
          { text: "API Reference", link: "/api/browser-lifecycle/" },
          { text: "Playground Docs", link: "/playground/playground" },
        ],
      },
      { text: "Guides", link: "/guides/browser-lifecycle/usage" },
      { text: "API", link: "/api/" },
      { text: "Examples", link: "/examples/" },
      { text: "FAQ", link: "/faq/" },
      {
        text: browserLifecycleVersionLabel,
        items: [
          {
            text: `${browserLifecycleVersionLabel} (current)`,
            link: "/packages/browser-lifecycle/",
          },
          { text: "Migration", link: "/migration/" },
          { text: "Changelog", link: "/changelog/" },
        ],
      },
      { text: "Playground", link: PLAYGROUND_URL },
    ],
    sidebar: {
      "/getting-started/": [
        {
          text: "Getting Started",
          items: [
            { text: "Introduction", link: "/getting-started/introduction" },
            { text: "Installation", link: "/getting-started/installation" },
            { text: "Philosophy", link: "/getting-started/philosophy" },
            { text: "Ecosystem", link: "/getting-started/ecosystem" },
          ],
        },
      ],
      "/guides/browser-lifecycle/": [
        {
          text: "Browser Lifecycle",
          items: browserLifecycleGuides,
        },
      ],
      "/guides/": [
        {
          text: "Contributor Guides",
          items: [
            { text: "First Package", link: "/guides/first-package" },
            { text: "Monorepo", link: "/guides/monorepo" },
            { text: "Contribution", link: "/guides/contribution" },
            { text: "Architecture", link: "/guides/architecture" },
            { text: "Package Standards", link: "/guides/package-standards" },
            { text: "Release Engineering", link: "/guides/release-engineering" },
          ],
        },
        {
          text: "Browser Lifecycle",
          items: browserLifecycleGuides,
        },
      ],
      "/packages/browser-lifecycle/": [
        {
          text: "Browser Lifecycle",
          items: [
            { text: "Overview", link: "/packages/browser-lifecycle/" },
            { text: "Installation", link: "/packages/browser-lifecycle/installation" },
            ...browserLifecycleGuides,
          ],
        },
        {
          text: "Modules",
          items: browserLifecycleModules,
        },
        {
          text: "Reference",
          items: [
            { text: "API", link: "/api/browser-lifecycle/" },
            { text: "Tutorials", link: "/tutorials/beginner" },
            { text: "Best Practices", link: "/best-practices/" },
            { text: "Patterns", link: "/patterns/" },
            { text: "FAQ", link: "/faq/" },
            { text: "Troubleshooting", link: "/troubleshooting/" },
            { text: "Migration", link: "/migration/" },
          ],
        },
      ],
      "/packages/": [
        {
          text: "Packages",
          items: packageItems,
        },
      ],
      "/api/": [
        {
          text: "API",
          items: [
            { text: "Overview", link: "/api/" },
            { text: "Browser Lifecycle", link: "/api/browser-lifecycle/" },
          ],
        },
      ],
      "/tutorials/": [
        {
          text: "Tutorials",
          items: tutorialItems,
        },
      ],
      "/best-practices/": [
        {
          text: "Best Practices",
          items: bestPracticeItems,
        },
      ],
      "/patterns/": [
        {
          text: "Patterns",
          items: patternItems,
        },
      ],
      "/faq/": [
        {
          text: "FAQ",
          items: faqItems,
        },
      ],
      "/examples/": [
        {
          text: "Examples",
          items: [{ text: "Framework Examples", link: "/examples/" }],
        },
      ],
      "/playground/": [
        {
          text: "Playground",
          items: playgroundItems,
        },
      ],
      "/troubleshooting/": [
        {
          text: "Troubleshooting",
          items: [{ text: "Common Issues", link: "/troubleshooting/" }],
        },
      ],
      "/migration/": [
        {
          text: "Migration",
          items: [{ text: "Migration Guide", link: "/migration/" }],
        },
      ],
      "/roadmap/": [
        {
          text: "Roadmap",
          items: [{ text: "Product Roadmap", link: "/roadmap/" }],
        },
      ],
      "/changelog/": [
        {
          text: "Changelog",
          items: [{ text: "Repository Changelog", link: "/changelog/" }],
        },
      ],
    },
    socialLinks: [{ icon: "github", link: "https://github.com/itsjayoncode/joc" }],
    editLink: {
      pattern: "https://github.com/itsjayoncode/joc/edit/master/apps/docs/docs/:path",
      text: "Edit this page on GitHub",
    },
    footer: {
      message:
        "Browser Lifecycle documentation is synchronized with source through TypeDoc and sync scripts.",
      copyright: "MIT Licensed. Built for the JayOnCode ecosystem.",
    },
    outline: {
      level: [2, 3],
      label: "On this page",
    },
    docFooter: {
      prev: "Previous page",
      next: "Next page",
    },
  },
  vite: {
    server: {
      host: "127.0.0.1",
      port: 4175,
    },
  },
});
