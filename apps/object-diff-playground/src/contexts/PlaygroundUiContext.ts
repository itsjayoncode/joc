import { createContext } from "react";

export interface RecentRouteEntry {
  readonly label: string;
  readonly path: string;
  readonly timestampLabel: string;
}

export interface PlaygroundUiContextValue {
  readonly currentPath: string;
  readonly mobileSidebarOpen: boolean;
  readonly recentRoutes: readonly RecentRouteEntry[];
  readonly sidebarCollapsed: boolean;
  closeMobileSidebar: () => void;
  openMobileSidebar: () => void;
  toggleMobileSidebar: () => void;
  toggleSidebarCollapsed: () => void;
}

export const PlaygroundUiContext = createContext<PlaygroundUiContextValue | undefined>(undefined);
