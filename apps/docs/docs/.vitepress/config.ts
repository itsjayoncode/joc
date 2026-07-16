import { defineConfig } from "vitepress";

import { browserLifecycleMeta } from "./browser-lifecycle-meta.js";
import { createBrowserLifecycleSidebarMap } from "./browser-lifecycle-sidebar.js";
import { browserLifecycleDocVersions } from "./browser-lifecycle-versions.js";
import { formIntelligentMeta } from "./form-intelligent-meta.js";
import { createFormIntelligentSidebarMap } from "./form-intelligent-sidebar.js";
import { formIntelligentDocVersions } from "./form-intelligent-versions.js";
import { navPackageLabel } from "./nav-package-label.js";
import { objectDiffMeta } from "./object-diff-meta.js";
import { createObjectDiffSidebarMap } from "./object-diff-sidebar.js";
import { objectDiffDocVersions } from "./object-diff-versions.js";
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
import { createDocsVitePlugins, docsPublicAssetsDir } from "./vite-dev-fix.js";

const docsBase = process.env.VITE_DOCS_BASE ?? "/";
const ogImageUrl = resolvePublicAssetUrl("jayoncode-logo-512.png");
const sitemapHostname = docsSiteUrl.endsWith("/") ? docsSiteUrl : `${docsSiteUrl}/`;
const _canonicalPlaygroundUrl = docsPlaygroundUrl;
const docsGaId = process.env.VITE_DOCS_GA_ID ?? "G-7EG7FB1SL4";

const PKG = browserLifecycleDocVersions.basePath;
const browserLifecycleVersionLabel = browserLifecycleMeta.versionLabel;
const objectDiffVersionLabel = objectDiffMeta.versionLabel;
const formIntelligentVersionLabel = formIntelligentMeta.versionLabel;

const packageItems = [
  { text: "All Packages", link: "/packages/" },
  { text: navPackageLabel("Browser Lifecycle", browserLifecycleVersionLabel), link: `${PKG}/` },
  { text: navPackageLabel("Object Diff", objectDiffVersionLabel), link: "/packages/object-diff/" },
  {
    text: navPackageLabel("Form Intelligent", formIntelligentVersionLabel),
    link: "/packages/form-intelligent/",
  },
];

const browserLifecycleSidebar = createBrowserLifecycleSidebarMap(
  PKG,
  browserLifecycleVersionLabel,
  browserLifecycleDocVersions.archives,
);

const OBJECT_DIFF_PKG = "/packages/object-diff";
const objectDiffSidebar = createObjectDiffSidebarMap(
  OBJECT_DIFF_PKG,
  objectDiffVersionLabel,
  objectDiffDocVersions.archives,
);

const FORM_INTELLIGENT_PKG = "/packages/form-intelligent";
const formIntelligentSidebar = createFormIntelligentSidebarMap(
  FORM_INTELLIGENT_PKG,
  formIntelligentVersionLabel,
  formIntelligentDocVersions.archives,
);

export default defineConfig({
  base: docsBase,
  title: siteName,
  titleTemplate: ":title | JOC",
  description: siteTagline,
  lang: "en-US",
  srcDir: ".",
  cleanUrls: true,
  // Playground SPAs are copied into dist after `vitepress build` (see bundle-playground-into-docs.mjs).
  ignoreDeadLinks: [/^\/playground\//],
  appearance: {
    // @ts-expect-error VitePress types only document `dark`; `light` is supported at runtime.
    initialValue: "light",
  },
  lastUpdated: true,
  sitemap: {
    hostname: sitemapHostname,
  },
  head: [
    ["link", { rel: "icon", href: resolveDocsBasePath("favicon.png"), type: "image/png" }],
    ["link", { rel: "apple-touch-icon", href: resolveDocsBasePath("apple-touch-icon.png") }],
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
    ["script", { async: "", src: `https://www.googletagmanager.com/gtag/js?id=${docsGaId}` }],
    [
      "script",
      {},
      `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${docsGaId}');`,
    ],
  ],
  themeConfig: {
    logo: {
      alt: "JOC",
      light: "/jayoncode-logo-official.png",
      dark: "/jayoncode-logo-official.png",
    },
    siteTitle: false,
    search: {
      provider: "local",
    },
    nav: [
      { text: "Getting Started", link: "/getting-started/introduction" },
      {
        text: "Packages",
        items: packageItems,
      },
      { text: "Playground", link: "/playground/" },
      { text: "Roadmap", link: "/roadmap/" },
      {
        text: "Contribute",
        link: "/guides/contribution",
      },
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
            { text: "Playground", link: "/playground/" },
          ],
        },
      ],
      ...browserLifecycleSidebar,
      ...objectDiffSidebar,
      ...formIntelligentSidebar,
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
      "/playground/": [
        {
          text: "Playground",
          items: [
            { text: "All playgrounds", link: "/playground/" },
            {
              text: "Browser Lifecycle ↗",
              link: "/playground/browser-lifecycle/",
              target: "_blank",
              rel: "noreferrer",
            },
            {
              text: "Object Diff ↗",
              link: "/playground/object-diff/",
              target: "_blank",
              rel: "noreferrer",
            },
            {
              text: "Form Intelligent ↗",
              link: "/playground/form-intelligent/",
              target: "_blank",
              rel: "noreferrer",
            },
          ],
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
    plugins: createDocsVitePlugins(),
    server: {
      host: "127.0.0.1",
      port: 4175,
      watch: {
        // Logo/favicon regeneration in public/ should not trigger vue HMR (refresh manually).
        ignored: [`${docsPublicAssetsDir}/**`],
      },
    },
  },
});
