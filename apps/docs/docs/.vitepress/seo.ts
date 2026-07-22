const DEFAULT_SITE_URL = "https://itsjayoncode.github.io/joc";
const DEFAULT_PLAYGROUND_URL = "https://itsjayoncode.github.io/joc/playground/browser-lifecycle/";

export const docsSiteUrl = (process.env.VITE_DOCS_SITE_URL ?? DEFAULT_SITE_URL).replace(/\/$/, "");
export const docsPlaygroundUrl = process.env.VITE_DOCS_PLAYGROUND_URL ?? DEFAULT_PLAYGROUND_URL;

export const siteName = "JayOnCode";
/** Public brand / owner site for the JOC Ecosystem. */
export const ownerWebsiteUrl = "https://www.jayoncode.com/";
export const siteTagline =
  "JOC Ecosystem — independent, headless TypeScript libraries for modern web apps. Framework-agnostic, thoroughly documented, with interactive playgrounds.";

export const defaultKeywords = [
  "JOC",
  "JOC Ecosystem",
  "JayOnCode",
  "form intelligence",
  "headless forms",
  "object diff",
  "browser lifecycle",
  "browser session",
  "storage",
  "TypeScript",
  "JavaScript",
  "page visibility API",
  "idle detection",
  "cross-tab",
  "npm package",
  "framework agnostic",
  "SSR safe",
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

import { resolvePlaygroundPath } from "./playground-path.js";

export { resolvePlaygroundPath };

export function buildOrganizationJsonLd(siteUrl: string): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "JayOnCode",
    alternateName: ["JOC", "JOC Ecosystem"],
    description:
      "An ecosystem of independent, headless TypeScript libraries engineered for modern web applications. Every package is framework-agnostic, thoroughly documented, and backed by interactive playgrounds for a consistent developer experience.",
    url: ownerWebsiteUrl,
    sameAs: [
      ownerWebsiteUrl,
      siteUrl,
      "https://github.com/itsjayoncode",
      "https://www.npmjs.com/~jayoncode",
    ],
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
