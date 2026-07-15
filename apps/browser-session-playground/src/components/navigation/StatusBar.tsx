import { findNavigationItemByPath } from "../../constants/navigation.js";
import { usePlaygroundUi } from "../../hooks/usePlaygroundUi.js";
import { useTheme } from "../../hooks/useTheme.js";
import { getBrowserLifecycleIntegrationSummary } from "../../lib/browser-lifecycle.js";

export interface StatusBarProps {
  readonly classNames: {
    readonly statusBar: string;
    readonly statusChip: string;
    readonly statusChipAccent: string;
  };
}

export function StatusBar({ classNames }: StatusBarProps) {
  const { currentPath, recentRoutes } = usePlaygroundUi();
  const { resolvedTheme } = useTheme();
  const integrationSummary = getBrowserLifecycleIntegrationSummary();
  const currentRoute = findNavigationItemByPath(currentPath)?.label ?? "Not Found";

  return (
    <div className={classNames.statusBar}>
      <span className={classNames.statusChipAccent}>
        <strong>{currentRoute}</strong>
      </span>
      <span className={classNames.statusChip}>
        Theme <strong>{resolvedTheme}</strong>
      </span>
      <span className={classNames.statusChip}>
        Recent <strong>{recentRoutes.length}</strong>
      </span>
      <span className={classNames.statusChip}>
        <strong>{integrationSummary.entryPoint}</strong>
      </span>
    </div>
  );
}
