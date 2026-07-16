import { useData } from "vitepress";

/**
 * VitePress `route.path` may include `site.base` on some runtimes (e.g. GitHub Pages
 * with `/joc/`). Local `docs:dev` usually uses `/`. Normalize to a site-root path
 * like `/packages/browser-lifecycle/` so matchers work in both environments.
 */
export function useDocsPath() {
  const { site } = useData();

  function normalizeDocsPath(pathname: string): string {
    let path = pathname.split("?")[0]?.split("#")[0] ?? pathname;
    path = path.replace(/\/index\.html$/i, "/").replace(/\.html$/i, "");

    const base = site.value.base || "/";
    if (base !== "/") {
      const baseNoTrailing = base.endsWith("/") ? base.slice(0, -1) : base;
      if (path === baseNoTrailing || path === `${baseNoTrailing}/`) {
        return "/";
      }
      if (path.startsWith(`${baseNoTrailing}/`)) {
        path = path.slice(baseNoTrailing.length);
      }
    }

    if (!path.startsWith("/")) {
      path = `/${path}`;
    }

    return path;
  }

  return { normalizeDocsPath };
}
