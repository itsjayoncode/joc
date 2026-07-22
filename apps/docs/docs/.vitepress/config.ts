import { defineConfig } from "vitepress";

import { browserLifecycleMeta } from "./browser-lifecycle-meta.js";
import { createBrowserLifecycleSidebarMap } from "./browser-lifecycle-sidebar.js";
import { browserLifecycleDocVersions } from "./browser-lifecycle-versions.js";
import { formIntelligenceMeta } from "./form-intelligence-meta.js";
import { createFormIntelligenceSidebarMap } from "./form-intelligence-sidebar.js";
import { formIntelligenceDocVersions } from "./form-intelligence-versions.js";
import { navPackageLabel } from "./nav-package-label.js";
import { objectDiffMeta } from "./object-diff-meta.js";
import { createObjectDiffSidebarMap } from "./object-diff-sidebar.js";
import { objectDiffDocVersions } from "./object-diff-versions.js";
import { resolveGithubEditUrl } from "./resolve-github-edit-url.js";
import {
  isArchivedDocsPath,
  resolveIndexScopeLabel,
  splitPageIntoScopedSections,
} from "./search-index.js";
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
  ownerWebsiteUrl,
} from "./seo.js";
import { storageMeta } from "./storage-meta.js";
import { createStorageSidebarMap } from "./storage-sidebar.js";
import { storageDocVersions } from "./storage-versions.js";
import { createDocsVitePlugins, docsPublicAssetsDir } from "./vite-dev-fix.js";

const docsBase = process.env.VITE_DOCS_BASE ?? "/";
const ogImageUrl = resolvePublicAssetUrl("jayoncode-profile-logo-opt.png");
const sitemapHostname = docsSiteUrl.endsWith("/") ? docsSiteUrl : `${docsSiteUrl}/`;
const _canonicalPlaygroundUrl = docsPlaygroundUrl;
const docsGaId = process.env.VITE_DOCS_GA_ID ?? "G-7EG7FB1SL4";

const PKG = browserLifecycleDocVersions.basePath;
const browserLifecycleVersionLabel = browserLifecycleMeta.versionLabel;
const objectDiffVersionLabel = objectDiffMeta.versionLabel;
const formIntelligenceVersionLabel = formIntelligenceMeta.versionLabel;
const storageVersionLabel = storageMeta.versionLabel;

const packageItems = [
  { text: "All Packages", link: "/packages/" },
  { text: navPackageLabel("Browser Lifecycle", browserLifecycleVersionLabel), link: `${PKG}/` },
  { text: navPackageLabel("Object Diff", objectDiffVersionLabel), link: "/packages/object-diff/" },
  {
    text: navPackageLabel("Form Intelligence", formIntelligenceVersionLabel),
    link: "/packages/form-intelligence/",
  },
  { text: navPackageLabel("Storage", storageVersionLabel), link: "/packages/storage/" },
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

const FORM_INTELLIGENCE_PKG = "/packages/form-intelligence";
const formIntelligenceSidebar = createFormIntelligenceSidebarMap(
  FORM_INTELLIGENCE_PKG,
  formIntelligenceVersionLabel,
  formIntelligenceDocVersions.archives,
);

const STORAGE_PKG = "/packages/storage";
const storageSidebar = createStorageSidebarMap(
  STORAGE_PKG,
  storageVersionLabel,
  storageDocVersions.archives,
);

export default defineConfig({
  base: docsBase,
  title: siteName,
  titleTemplate: ":title | JOC Ecosystem",
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
    [
      "link",
      {
        rel: "icon",
        href: resolveDocsBasePath("jayoncode-profile-logo-opt.png"),
        type: "image/png",
      },
    ],
    [
      "link",
      { rel: "apple-touch-icon", href: resolveDocsBasePath("jayoncode-profile-logo-opt.png") },
    ],
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
      light: "/jayoncode-profile-logo-opt.png",
      dark: "/jayoncode-profile-logo-opt.png",
    },
    siteTitle: false,
    search: {
      provider: "local",
      options: {
        detailedView: true,
        translations: {
          button: {
            buttonText: "Search docs",
            buttonAriaLabel: "Search JOC docs, APIs, and packages",
          },
          modal: {
            displayDetails: "Show detailed list",
            resetButtonTitle: "Clear search",
            backButtonTitle: "Close search",
            noResultsText: "No results for",
            footer: {
              selectText: "to select",
              navigateText: "to navigate",
              closeText: "to close",
            },
          },
        },
        miniSearch: {
          searchOptions: {
            fuzzy: 0.2,
            prefix: true,
            boost: { title: 5, text: 1, titles: 3 },
          },
          *_splitIntoSections(filePath: string, html: string) {
            const scopeLabel = resolveIndexScopeLabel(filePath.replace(/\\/g, "/"));
            yield* splitPageIntoScopedSections(html, scopeLabel);
          },
        },
        async _render(src, env, md) {
          const renderer = md as typeof md & {
            renderAsync?: (source: string, env: unknown) => Promise<string>;
          };
          const html = renderer.renderAsync
            ? await renderer.renderAsync(src, env)
            : md.render(src, env);
          if (env.frontmatter?.search === false) {
            return "";
          }
          const relativePath = typeof env.relativePath === "string" ? env.relativePath : "";
          if (isArchivedDocsPath(relativePath)) {
            return "";
          }
          return html;
        },
      },
    },
    nav: [
      { component: "SponsorCta", props: { placement: "nav" } },
      { text: "Getting Started", link: "/getting-started/introduction" },
      {
        text: "Packages",
        items: packageItems,
      },
      {
        text: "Resources",
        items: [
          { text: "Playground", link: "/playground/" },
          { text: "Roadmap", link: "/roadmap/" },
          { text: "Contribute", link: "/guides/contribution" },
        ],
      },
    ],
    sidebar: {
      "/getting-started/": [
        {
          text: "JOC Ecosystem",
          items: [
            { text: "Introduction", link: "/getting-started/introduction" },
            { text: "Installation", link: "/getting-started/installation" },
            { text: "Philosophy", link: "/getting-started/philosophy" },
            { text: "JOC Ecosystem", link: "/getting-started/ecosystem" },
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
      ...formIntelligenceSidebar,
      ...storageSidebar,
      "/guides/": [
        {
          text: "Contributor Guides",
          items: [
            { text: "First Package", link: "/guides/first-package" },
            { text: "Composition", link: "/guides/composition" },
            { text: "Monorepo", link: "/guides/monorepo" },
            { text: "Contribution", link: "/guides/contribution" },
            { text: "Architecture", link: "/guides/architecture" },
            { text: "Ecosystem governance", link: "/guides/ecosystem-governance" },
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
              text: "Form Intelligence ↗",
              link: "/playground/form-intelligence/",
              target: "_blank",
              rel: "noreferrer",
            },
            {
              text: "Storage ↗",
              link: "/playground/storage/",
              target: "_blank",
              rel: "noreferrer",
            },
          ],
        },
      ],
    },
    socialLinks: [
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>',
        },
        link: ownerWebsiteUrl,
        ariaLabel: "JayOnCode website",
      },
      { icon: "npm", link: "https://www.npmjs.com/~jayoncode", ariaLabel: "npm" },
      { icon: "github", link: "https://github.com/itsjayoncode/joc", ariaLabel: "GitHub" },
    ],
    editLink: {
      // Self-contained resolver (no outer closures) so VitePress client
      // serialization via Function.toString keeps the mapping working.
      pattern: resolveGithubEditUrl,
      text: "Edit this page on GitHub",
    },
    footer: {
      message:
        "An ecosystem of independent, headless TypeScript libraries engineered for modern web development. Every package includes interactive playgrounds and documentation that evolves alongside the code.",
      copyright: `MIT Licensed · Built by <a href="${ownerWebsiteUrl}" target="_blank" rel="noopener noreferrer">JayOnCode</a>`,
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
    // esbuild 0.28+ refuses to lower destructuring for safari14 (Safari 14.0 engine bug).
    // Vite's default `modules` target includes safari14; bump to 14.1 so native destructuring is kept.
    // See https://github.com/evanw/esbuild/issues/4436
    build: {
      target: ["es2020", "edge88", "firefox78", "chrome87", "safari14.1"],
    },
    esbuild: {
      supported: {
        destructuring: true,
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        supported: {
          destructuring: true,
        },
      },
    },
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
