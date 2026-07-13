import { defineConfig } from "vitepress";

const packageItems = [
  { text: "Browser Session", link: "/packages/browser-session/" },
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

export default defineConfig({
  title: "JOC",
  description: "Documentation and contributor guidance for the JayOnCode ecosystem.",
  lang: "en-US",
  srcDir: ".",
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ["link", { rel: "icon", href: "/logo.svg" }],
    ["meta", { name: "theme-color", content: "#111827" }],
    [
      "meta",
      {
        name: "keywords",
        content: "JOC, JayOnCode, monorepo, TypeScript libraries, open source, documentation",
      },
    ],
    [
      "meta",
      {
        property: "og:title",
        content: "JOC Developer Experience Platform",
      },
    ],
    [
      "meta",
      {
        property: "og:description",
        content: "Professional documentation and contributor guidance for the JOC ecosystem.",
      },
    ],
  ],
  themeConfig: {
    logo: "/logo.svg",
    siteTitle: "JOC",
    search: {
      provider: "local",
    },
    nav: [
      { text: "Getting Started", link: "/getting-started/introduction" },
      { text: "Guides", link: "/guides/first-package" },
      { text: "Packages", link: "/packages/browser-session/" },
      { text: "API", link: "/api/" },
      { text: "Roadmap", link: "/roadmap/" },
      { text: "Changelog", link: "/changelog/" },
      { text: "Playground", link: "http://127.0.0.1:4173" },
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
      "/guides/": [
        {
          text: "Guides",
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
      "/packages/": [
        {
          text: "Packages",
          items: packageItems,
        },
      ],
      "/api/": [
        {
          text: "API",
          items: [{ text: "Overview", link: "/api/" }],
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
    socialLinks: [{ icon: "github", link: "https://github.com/JayOnCode/joc" }],
    editLink: {
      pattern: "https://github.com/JayOnCode/joc/edit/main/apps/docs/docs/:path",
      text: "Edit this page on GitHub",
    },
    footer: {
      message: "JOC is building its documentation foundation before package releases.",
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
