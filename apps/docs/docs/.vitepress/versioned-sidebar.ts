import type { DefaultTheme } from "vitepress";

export function buildVersionedSidebarMap(
  pkgBase: string,
  currentVersionLabel: string,
  archives: ReadonlyArray<{ version: string; label: string }>,
  createSidebar: (pkgBase: string, versionLabel: string) => DefaultTheme.SidebarItem[],
): Record<string, DefaultTheme.SidebarItem[]> {
  const base = pkgBase.replace(/\/$/, "");
  const sidebar: Record<string, DefaultTheme.SidebarItem[]> = {
    [`${base}/`]: createSidebar(base, currentVersionLabel),
  };

  for (const archive of archives) {
    const archiveBase = `${base}/v${archive.version}`;
    sidebar[`${archiveBase}/`] = createSidebar(archiveBase, archive.label);
  }

  return sidebar;
}
