/**
 * Map VitePress page paths to editable GitHub sources.
 *
 * Generated sync output under apps/docs/docs/packages/<pkg>/{modules,playground,api}
 * is gitignored — edit links must target package / playground sources instead.
 *
 * Keep this function free of outer-scope references. VitePress may serialize
 * theme editLink.pattern via Function.toString() for the client.
 */

export function resolveGithubEditUrl(page: { filePath?: string; relativePath?: string }): string {
  const GITHUB_EDIT_BASE = "https://github.com/itsjayoncode/joc/edit/master";
  const PLAYGROUND_DOC_SOURCES: Record<string, string> = {
    "browser-lifecycle": "apps/browser-session-playground/docs",
    "object-diff": "apps/object-diff-playground/docs",
    "form-intelligence": "apps/form-intelligence-playground/docs",
  };

  let path = (page.filePath || page.relativePath || "").replace(/\\/g, "/");
  if (path.startsWith("./")) path = path.slice(2);
  if (path.startsWith("/")) path = path.slice(1);
  // Defensive: some tooling prefixes the docs app path.
  if (path.startsWith("apps/docs/docs/")) path = path.slice("apps/docs/docs/".length);

  let match = path.match(
    /^packages\/(browser-lifecycle|object-diff|form-intelligence)\/modules\/(.+)$/,
  );
  if (match?.[1] !== undefined && match[2] !== undefined) {
    return `${GITHUB_EDIT_BASE}/packages/${match[1]}/docs/${match[2]}`;
  }

  match = path.match(
    /^packages\/(browser-lifecycle|object-diff|form-intelligence)\/v[^/]+\/modules\/(.+)$/,
  );
  if (match?.[1] !== undefined && match[2] !== undefined) {
    return `${GITHUB_EDIT_BASE}/packages/${match[1]}/docs/${match[2]}`;
  }

  match = path.match(
    /^packages\/(browser-lifecycle|object-diff|form-intelligence)\/playground\/(.+)$/,
  );
  if (match?.[1] !== undefined && match[2] !== undefined) {
    const sourceRoot = PLAYGROUND_DOC_SOURCES[match[1]];
    if (sourceRoot !== undefined) {
      return `${GITHUB_EDIT_BASE}/${sourceRoot}/${match[2]}`;
    }
  }

  match = path.match(
    /^packages\/(browser-lifecycle|object-diff|form-intelligence)\/(index|overview)\.md$/,
  );
  if (match?.[1] !== undefined && match[2] !== undefined) {
    return `${GITHUB_EDIT_BASE}/packages/${match[1]}/docs/${match[2]}.md`;
  }

  match = path.match(
    /^packages\/(browser-lifecycle|object-diff|form-intelligence)\/changelog\.md$/,
  );
  if (match?.[1] !== undefined) {
    return `${GITHUB_EDIT_BASE}/packages/${match[1]}/CHANGELOG.md`;
  }

  if (path === "packages/browser-lifecycle/examples/index.md") {
    return `${GITHUB_EDIT_BASE}/examples`;
  }

  match = path.match(/^packages\/(browser-lifecycle|object-diff|form-intelligence)\/api\//);
  if (match?.[1] !== undefined) {
    return `${GITHUB_EDIT_BASE}/packages/${match[1]}/README.md`;
  }

  return `${GITHUB_EDIT_BASE}/apps/docs/docs/${path}`;
}
