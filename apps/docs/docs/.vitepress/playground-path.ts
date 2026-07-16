/**
 * VitePress-internal path to a bundled playground SPA.
 * Do not prepend VITE_DOCS_BASE — VitePress `withBase()` adds it for sidebar and markdown links.
 */
export function resolvePlaygroundPath(playgroundName: string): string {
  const slug = playgroundName.replace(/^\/|\/$/g, "");
  return `/playground/${slug}/`;
}
