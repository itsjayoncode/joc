import DefaultTheme from "vitepress/theme";

import ArchivedDocsBanner from "./components/ArchivedDocsBanner.vue";
import BrowserLifecycleVersion from "./components/BrowserLifecycleVersion.vue";
import DocsVersionSwitcher from "./components/DocsVersionSwitcher.vue";
import HomeBelowFold from "./components/HomeBelowFold.vue";
import HomeFx from "./components/HomeFx.vue";
import HomePackageCatalog from "./components/HomePackageCatalog.vue";
import PackageLanding from "./components/PackageLanding.vue";
import PlaygroundCatalog from "./components/PlaygroundCatalog.vue";
import Layout from "./Layout.vue";
import { installPlaygroundNewTabLinks } from "./playground-new-tab.js";

import type { Theme } from "vitepress";
import "./brand.css";
import "./custom.css";

const theme: Theme = {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component("BrowserLifecycleVersion", BrowserLifecycleVersion);
    app.component("DocsVersionSwitcher", DocsVersionSwitcher);
    app.component("ArchivedDocsBanner", ArchivedDocsBanner);
    app.component("HomeBelowFold", HomeBelowFold);
    app.component("HomeFx", HomeFx);
    app.component("HomePackageCatalog", HomePackageCatalog);
    app.component("PackageLanding", PackageLanding);
    app.component("PlaygroundCatalog", PlaygroundCatalog);

    if (typeof window !== "undefined") {
      installPlaygroundNewTabLinks();
    }
  },
};

export default theme;
