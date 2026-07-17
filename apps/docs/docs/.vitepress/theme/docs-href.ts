import { withBase } from "vitepress";

/**
 * Resolve an internal docs path for GitHub Pages (`/joc/`) and local preview (`/`).
 *
 * Plain `<a href="/packages/...">` in custom theme Vue skips VitePress base rewriting.
 * Always pass site-root paths through this helper (or use `<DocsLink>`).
 */
export function docsHref(path: string): string {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(path)) {
    return path;
  }

  return withBase(path);
}
