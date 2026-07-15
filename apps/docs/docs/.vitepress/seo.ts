const DEFAULT_SITE_URL = "https://itsjayoncode.github.io/joc";
const DEFAULT_PLAYGROUND_URL = "https://itsjayoncode.github.io/joc/playground/browser-lifecycle/";

export const docsSiteUrl = (process.env.VITE_DOCS_SITE_URL ?? DEFAULT_SITE_URL).replace(/\/$/, "");
export const docsPlaygroundUrl = process.env.VITE_DOCS_PLAYGROUND_URL ?? DEFAULT_PLAYGROUND_URL;

export const siteName = "JOC by JayOnCode";
export const siteTagline =
  "TypeScript browser libraries, documentation, and interactive tooling for session lifecycle, visibility, idle detection, and cross-tab coordination.";

export const defaultKeywords = [
  "JOC",
  "JayOnCode",
  "browser lifecycle",
  "browser session",
  "TypeScript",
  "JavaScript",
  "page visibility API",
  "idle detection",
  "cross-tab",
  "BroadcastChannel",
  "npm package",
  "framework agnostic",
  "SSR safe",
  "web app lifecycle",
].join(", ");

export function resolvePublicAssetUrl(assetPath: string): string {
  const normalizedAsset = assetPath.replace(/^\//, "");
  return `${docsSiteUrl}/${normalizedAsset}`;
}

/** Site-relative path for public assets (respects VITE_DOCS_BASE on GitHub Pages). */
export function resolveDocsBasePath(assetPath: string): string {
  const normalizedAsset = assetPath.replace(/^\//, "");
  const base = process.env.VITE_DOCS_BASE ?? "/";
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;

  return normalizedBase === "/" ? `/${normalizedAsset}` : `${normalizedBase}${normalizedAsset}`;
}

/** Site-relative live playground URL (opens as a separate SPA, not a VitePress route). */
export function resolvePlaygroundPath(playgroundName: string): string {
  const slug = playgroundName.replace(/^\/|\/$/g, "");
  return resolveDocsBasePath(`playground/${slug}/`);
}

export function buildOrganizationJsonLd(siteUrl: string): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "JayOnCode",
    alternateName: "JOC",
    url: siteUrl,
    sameAs: ["https://github.com/itsjayoncode", "https://www.npmjs.com/~jayoncode"],
  });
}

export function buildSoftwarePackageJsonLd(siteUrl: string): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "@jayoncode/browser-lifecycle",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    url: `${siteUrl}/packages/browser-lifecycle/`,
    downloadUrl: "https://www.npmjs.com/package/@jayoncode/browser-lifecycle",
    programmingLanguage: "TypeScript",
  });
}
