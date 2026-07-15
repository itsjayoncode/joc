import DefaultTheme from "vitepress/theme";

import BrowserLifecycleVersion from "./components/BrowserLifecycleVersion.vue";
import HomeBelowFold from "./components/HomeBelowFold.vue";
import HomeFx from "./components/HomeFx.vue";
import HomePackageCatalog from "./components/HomePackageCatalog.vue";
import Layout from "./Layout.vue";

import type { Theme } from "vitepress";
import "./brand.css";
import "./custom.css";

const theme: Theme = {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component("BrowserLifecycleVersion", BrowserLifecycleVersion);
    app.component("HomeBelowFold", HomeBelowFold);
    app.component("HomeFx", HomeFx);
    app.component("HomePackageCatalog", HomePackageCatalog);
  },
};

export default theme;
