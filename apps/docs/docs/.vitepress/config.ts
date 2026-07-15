import { defineConfig } from "vitepress";

import { browserLifecycleMeta } from "./browser-lifecycle-meta.js";
import {
  buildOrganizationJsonLd,
  buildSoftwarePackageJsonLd,
  defaultKeywords,
  docsPlaygroundUrl,
  docsSiteUrl,
  resolvePublicAssetUrl,
  resolveDocsBasePath,
  siteName,
  siteTagline,
} from "./seo.js";

const docsBase = process.env.VITE_DOCS_BASE ?? "/";
const PLAYGROUND_URL = docsPlaygroundUrl;
const ogImageUrl = resolvePublicAssetUrl("logo.png");
const sitemapHostname = docsSiteUrl.endsWith("/") ? docsSiteUrl : `${docsSiteUrl}/`;

const PKG = "/packages/browser-lifecycle";
const browserLifecycleVersionLabel = browserLifecycleMeta.versionLabel;
const browserLifecycleMenuLabel = `Browser Lifecycle · ${browserLifecycleVersionLabel}`;

const packageItems = [
  { text: "All Packages", link: "/packages/" },
  { text: browserLifecycleMenuLabel, link: `${PKG}/` },
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
  { text: "Quick Start", link: `${PKG}/guides/quick-start` },
  { text: "Usage", link: `${PKG}/guides/usage` },
  { text: "Configuration", link: `${PKG}/guides/configuration` },
  { text: "Browser Support", link: `${PKG}/guides/browser-support` },
  { text: "SSR", link: `${PKG}/guides/ssr` },
  { text: "Error Handling", link: `${PKG}/guides/error-handling` },
  { text: "Deployment", link: `${PKG}/guides/deployment` },
];

const browserLifecycleModules = [
  { text: "Core Infrastructure", link: `${PKG}/modules/core-infrastructure` },
  { text: "Session Core", link: `${PKG}/modules/session-core` },
  { text: "Events", link: `${PKG}/modules/events` },
  { text: "Visibility", link: `${PKG}/modules/visibility` },
];

const playgroundItems = [
  { text: "Overview", link: `${PKG}/playground/playground` },
  { text: "Visibility", link: `${PKG}/playground/visibility-playground` },
  { text: "Focus", link: `${PKG}/playground/focus-playground` },
  { text: "Connectivity", link: `${PKG}/playground/connectivity-playground` },
  { text: "Idle", link: `${PKG}/playground/idle-playground` },
  { text: "Lifecycle", link: `${PKG}/playground/lifecycle-playground` },
  { text: "Cross Tab", link: `${PKG}/playground/cross-tab-playground` },
  { text: "Plugins", link: `${PKG}/playground/plugin-playground` },
  { text: "Events", link: `${PKG}/playground/event-explorer` },
  { text: "State", link: `${PKG}/playground/state-explorer` },
  { text: "Configuration", link: `${PKG}/playground/configuration-playground` },
  { text: "Performance", link: `${PKG}/playground/performance-playground` },
  { text: "Developer Tools", link: `${PKG}/playground/developer-tools` },
];

const tutorialItems = [
  { text: "Beginner", link: `${PKG}/tutorials/beginner` },
  { text: "Intermediate", link: `${PKG}/tutorials/intermediate` },
  { text: "Advanced", link: `${PKG}/tutorials/advanced` },
];

const bestPracticeItems = [
  { text: "Overview", link: `${PKG}/best-practices/` },
  { text: "Session Lifecycle", link: `${PKG}/best-practices/session-lifecycle` },
  { text: "Memory Management", link: `${PKG}/best-practices/memory-management` },
  { text: "Event Cleanup", link: `${PKG}/best-practices/event-cleanup` },
  { text: "Performance", link: `${PKG}/best-practices/performance` },
  { text: "Configuration", link: `${PKG}/best-practices/configuration` },
  { text: "Cross-Tab", link: `${PKG}/best-practices/cross-tab` },
  { text: "Idle Detection", link: `${PKG}/best-practices/idle-detection` },
  { text: "Visibility Handling", link: `${PKG}/best-practices/visibility-handling` },
  { text: "Framework Integration", link: `${PKG}/best-practices/framework-integration` },
  { text: "Plugin Development", link: `${PKG}/best-practices/plugin-development` },
  { text: "SSR Safety", link: `${PKG}/best-practices/ssr-safety` },
  { text: "Security", link: `${PKG}/best-practices/security` },
  { text: "Accessibility", link: `${PKG}/best-practices/accessibility` },
  { text: "Testing", link: `${PKG}/best-practices/testing` },
  { text: "Debugging", link: `${PKG}/best-practices/debugging` },
];

const patternItems = [
  { text: "Overview", link: `${PKG}/patterns/` },
  { text: "Auto Save", link: `${PKG}/patterns/auto-save` },
  { text: "Analytics", link: `${PKG}/patterns/analytics` },
  { text: "Presence Detection", link: `${PKG}/patterns/presence-detection` },
  { text: "Session Timeout", link: `${PKG}/patterns/session-timeout` },
  { text: "Background Sync", link: `${PKG}/patterns/background-sync` },
  { text: "Offline First", link: `${PKG}/patterns/offline-first` },
  { text: "Polling", link: `${PKG}/patterns/polling` },
  { text: "Page Tracking", link: `${PKG}/patterns/page-tracking` },
  { text: "Visibility Pause", link: `${PKG}/patterns/visibility-pause` },
  { text: "Focus Resume", link: `${PKG}/patterns/focus-resume` },
  { text: "Shared WebSocket", link: `${PKG}/patterns/shared-websocket` },
  { text: "Leader Election", link: `${PKG}/patterns/leader-election` },
  { text: "Plugin Architecture", link: `${PKG}/patterns/plugin-architecture` },
  { text: "State Synchronization", link: `${PKG}/patterns/state-synchronization` },
];

const faqItems = [
  { text: "Overview", link: `${PKG}/faq/` },
  { text: "Getting Started", link: `${PKG}/faq/getting-started` },
  { text: "Installation", link: `${PKG}/faq/installation` },
  { text: "Configuration", link: `${PKG}/faq/configuration` },
  { text: "Visibility", link: `${PKG}/faq/visibility` },
  { text: "Focus", link: `${PKG}/faq/focus` },
  { text: "Connectivity", link: `${PKG}/faq/connectivity` },
  { text: "Idle", link: `${PKG}/faq/idle` },
  { text: "Lifecycle", link: `${PKG}/faq/lifecycle` },
  { text: "Cross Tab", link: `${PKG}/faq/cross-tab` },
  { text: "Plugins", link: `${PKG}/faq/plugins` },
  { text: "Events", link: `${PKG}/faq/events` },
  { text: "Performance", link: `${PKG}/faq/performance` },
  { text: "Debugging", link: `${PKG}/faq/debugging` },
  { text: "Browser Support", link: `${PKG}/faq/browser-support` },
  { text: "Frameworks", link: `${PKG}/faq/frameworks` },
  { text: "Deployment", link: `${PKG}/faq/deployment` },
  { text: "SSR", link: `${PKG}/faq/ssr` },
];

const browserLifecycleSidebar = [
  {
    text: browserLifecycleMenuLabel,
    items: [
      { text: "Overview", link: `${PKG}/` },
      { text: "Installation", link: `${PKG}/installation` },
      ...browserLifecycleGuides,
    ],
  },
  {
    text: "Modules",
    items: browserLifecycleModules,
  },
  {
    text: "API",
    items: [{ text: "API Reference", link: `${PKG}/api/` }],
  },
  {
    text: "Examples",
    items: [{ text: "Framework Examples", link: `${PKG}/examples/` }],
  },
  {
    text: "Tutorials",
    items: tutorialItems,
  },
  {
    text: "Best Practices",
    items: bestPracticeItems,
  },
  {
    text: "Patterns",
    items: patternItems,
  },
  {
    text: "FAQ",
    items: faqItems,
  },
  {
    text: "Playground",
    items: playgroundItems,
  },
  {
    text: "Support",
    items: [
      { text: "Troubleshooting", link: `${PKG}/troubleshooting/` },
      { text: "Migration", link: `${PKG}/migration/` },
      { text: "Changelog", link: "/changelog/" },
    ],
  },
];

export default defineConfig({
  base: docsBase,
  title: siteName,
  titleTemplate: ":title | JOC",
  description: siteTagline,
  lang: "en-US",
  srcDir: ".",
  cleanUrls: true,
  appearance: {
    // @ts-expect-error VitePress types only document `dark`; `light` is supported at runtime.
    initialValue: "light",
  },
  lastUpdated: true,
  sitemap: {
    hostname: sitemapHostname,
  },
  head: [
    ["link", { rel: "icon", href: resolveDocsBasePath("logo.png"), type: "image/png" }],
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
        text: "Packages",
        items: packageItems,
      },
      {
        text: "Contribute",
        link: "/guides/contribution",
      },
      { text: "Roadmap", link: "/roadmap/" },
      { text: "Changelog", link: "/changelog/" },
      { text: "Playground", link: PLAYGROUND_URL },
    ],
    sidebar: {
      "/getting-started/": [
        {
          text: "JayOnCode Monorepo",
          items: [
            { text: "Introduction", link: "/getting-started/introduction" },
            { text: "Installation", link: "/getting-started/installation" },
            { text: "Philosophy", link: "/getting-started/philosophy" },
            { text: "Ecosystem", link: "/getting-started/ecosystem" },
            { text: "Package Catalog", link: "/packages/" },
          ],
        },
      ],
      "/packages/": [
        {
          text: "Packages",
          items: packageItems,
        },
        {
          text: "Monorepo",
          items: [
            { text: "Introduction", link: "/getting-started/introduction" },
            { text: "Contributor Guides", link: "/guides/contribution" },
            { text: "Roadmap", link: "/roadmap/" },
            { text: "Changelog", link: "/changelog/" },
          ],
        },
      ],
      [`${PKG}/`]: browserLifecycleSidebar,
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
        "JOC is a JayOnCode monorepo of @jayoncode/* packages. Docs sync from source via TypeDoc and sync scripts.",
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
