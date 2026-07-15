import DefaultTheme from "vitepress/theme";

import type { Theme } from "vitepress";

import HomeBelowFold from "./components/HomeBelowFold.vue";
import HomeFx from "./components/HomeFx.vue";
import HomePackageCatalog from "./components/HomePackageCatalog.vue";
import "./brand.css";
import "./custom.css";

const theme: Theme = {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component("HomeBelowFold", HomeBelowFold);
    app.component("HomeFx", HomeFx);
    app.component("HomePackageCatalog", HomePackageCatalog);
  },
};

export default theme;
