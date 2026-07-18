import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import { APP_NAVIGATION_ITEMS } from "../constants/navigation.js";
import { PlaygroundUiContext } from "../contexts/PlaygroundUiContext.js";
import { readStoredPreference, writeStoredPreference } from "../services/preferences-storage.js";

import type { RecentRouteEntry } from "../contexts/PlaygroundUiContext.js";
import type { PropsWithChildren } from "react";

const SIDEBAR_STORAGE_KEY = "sidebar-collapsed";
const MAX_RECENT_ROUTES = 5;

export function PlaygroundUiProvider({ children }: PropsWithChildren) {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() =>
    readStoredPreference(SIDEBAR_STORAGE_KEY, false),
  );
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [recentRoutes, setRecentRoutes] = useState<readonly RecentRouteEntry[]>([]);

  useEffect(() => {
    setMobileSidebarOpen(false);

    const matchedItem = APP_NAVIGATION_ITEMS.find((item) => item.path === location.pathname);
    const nextEntry: RecentRouteEntry = {
      label: matchedItem?.label ?? "Not Found",
      path: location.pathname,
      timestampLabel: new Date().toLocaleTimeString(),
    };

    setRecentRoutes((currentValue) => {
      const filteredValue = currentValue.filter((entry) => entry.path !== nextEntry.path);

      return [nextEntry, ...filteredValue].slice(0, MAX_RECENT_ROUTES);
    });
  }, [location.pathname]);

  const value = useMemo(
    () => ({
      currentPath: location.pathname,
      mobileSidebarOpen,
      recentRoutes,
      sidebarCollapsed,
      closeMobileSidebar() {
        setMobileSidebarOpen(false);
      },
      openMobileSidebar() {
        setMobileSidebarOpen(true);
      },
      toggleMobileSidebar() {
        setMobileSidebarOpen((currentValue) => !currentValue);
      },
      toggleSidebarCollapsed() {
        setSidebarCollapsed((currentValue) => {
          const nextValue = !currentValue;

          writeStoredPreference(SIDEBAR_STORAGE_KEY, nextValue);
          return nextValue;
        });
      },
    }),
    [location.pathname, mobileSidebarOpen, recentRoutes, sidebarCollapsed],
  );

  return <PlaygroundUiContext.Provider value={value}>{children}</PlaygroundUiContext.Provider>;
}
