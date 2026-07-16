/** Package name + small version tag for nav/sidebar labels (rendered via v-html). */
export function navPackageLabel(name: string, version: string): string {
  return `${name} <span class="joc-pkg-version-tag">${version}</span>`;
}
