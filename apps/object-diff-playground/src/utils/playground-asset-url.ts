/** Resolves a public-folder asset for the configured Vite `base` (e.g. GitHub Pages subpaths). */
export function playgroundAssetUrl(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}
