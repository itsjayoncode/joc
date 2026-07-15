import { Navigate, useRoutes } from "react-router-dom";

import { AppShell } from "../layouts/AppShell.js";
import { AboutPage } from "../pages/AboutPage.js";
import { ConfigurationPage } from "../pages/ConfigurationPage.js";
import { ConnectivityPage } from "../pages/ConnectivityPage.js";
import { CrossTabPage } from "../pages/CrossTabPage.js";
import { DashboardPage } from "../pages/DashboardPage.js";
import { DeveloperToolsPage } from "../pages/DeveloperToolsPage.js";
import { EventsPage } from "../pages/EventsPage.js";
import { FocusPage } from "../pages/FocusPage.js";
import { IdlePage } from "../pages/IdlePage.js";
import { LifecyclePage } from "../pages/LifecyclePage.js";
import { NotFoundPage } from "../pages/NotFoundPage.js";
import { PerformancePage } from "../pages/PerformancePage.js";
import { PluginsPage } from "../pages/PluginsPage.js";
import { SettingsPage } from "../pages/SettingsPage.js";
import { StatePage } from "../pages/StatePage.js";
import { VisibilityPage } from "../pages/VisibilityPage.js";

import type { RouteObject } from "react-router-dom";

export const APP_ROUTE_PATHS = [
  "/",
  "/about",
  "/settings",
  "/visibility",
  "/focus",
  "/connectivity",
  "/idle",
  "/lifecycle",
  "/cross-tab",
  "/plugins",
  "/events",
  "/state",
  "/configuration",
  "/performance",
  "/developer-tools",
  "/not-found",
] as const;

const routeObjects: RouteObject[] = [
  {
    element: <AppShell />,
    path: "/",
    children: [
      {
        element: <DashboardPage />,
        index: true,
      },
      {
        element: <AboutPage />,
        path: "about",
      },
      {
        element: <SettingsPage />,
        path: "settings",
      },
      {
        element: <VisibilityPage />,
        path: "visibility",
      },
      {
        element: <FocusPage />,
        path: "focus",
      },
      {
        element: <ConnectivityPage />,
        path: "connectivity",
      },
      {
        element: <IdlePage />,
        path: "idle",
      },
      {
        element: <LifecyclePage />,
        path: "lifecycle",
      },
      {
        element: <CrossTabPage />,
        path: "cross-tab",
      },
      {
        element: <PluginsPage />,
        path: "plugins",
      },
      {
        element: <EventsPage />,
        path: "events",
      },
      {
        element: <StatePage />,
        path: "state",
      },
      {
        element: <ConfigurationPage />,
        path: "configuration",
      },
      {
        element: <PerformancePage />,
        path: "performance",
      },
      {
        element: <DeveloperToolsPage />,
        path: "developer-tools",
      },
      {
        element: <NotFoundPage />,
        path: "not-found",
      },
      {
        element: <Navigate replace to="/not-found" />,
        path: "*",
      },
    ],
  },
];

export function AppRoutes() {
  return useRoutes(routeObjects);
}
