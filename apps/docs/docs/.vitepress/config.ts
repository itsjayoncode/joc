import { defineConfig } from "vitepress";

import { browserLifecycleMeta } from "./browser-lifecycle-meta.js";
import { createBrowserLifecycleSidebarMap } from "./browser-lifecycle-sidebar.js";
import { browserLifecycleDocVersions } from "./browser-lifecycle-versions.js";
import { objectDiffMeta } from "./object-diff-meta.js";
import { createObjectDiffSidebarMap } from "./object-diff-sidebar.js";
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

const PKG = browserLifecycleDocVersions.basePath;
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

const browserLifecycleSidebar = createBrowserLifecycleSidebarMap(
  PKG,
  browserLifecycleVersionLabel,
  browserLifecycleDocVersions.archives,
);

const OBJECT_DIFF_PKG = "/packages/object-diff/";
const objectDiffVersionLabel = objectDiffMeta.versionLabel;
const objectDiffSidebar = createObjectDiffSidebarMap(OBJECT_DIFF_PKG, objectDiffVersionLabel);

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
      ...browserLifecycleSidebar,
      ...objectDiffSidebar,
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
