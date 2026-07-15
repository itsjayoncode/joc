import { Navigate, useRoutes } from "react-router-dom";

import { AppShell } from "../layouts/AppShell.js";
import { AboutPage } from "../pages/AboutPage.js";
import { DashboardPage } from "../pages/DashboardPage.js";
import { DiffPage } from "../pages/DiffPage.js";
import { ExamplesPage } from "../pages/ExamplesPage.js";
import { JsonPage } from "../pages/JsonPage.js";
import { NotFoundPage } from "../pages/NotFoundPage.js";
import { PatchPage } from "../pages/PatchPage.js";
import { PerformancePage } from "../pages/PerformancePage.js";
import { SettingsPage } from "../pages/SettingsPage.js";

import type { RouteObject } from "react-router-dom";

export const APP_ROUTE_PATHS = [
  "/",
  "/diff",
  "/patch",
  "/json",
  "/performance",
  "/examples",
  "/about",
  "/settings",
  "/not-found",
] as const;

const routeObjects: RouteObject[] = [
  {
    element: <AppShell />,
    path: "/",
    children: [
      { element: <DashboardPage />, index: true },
      { element: <DiffPage />, path: "diff" },
      { element: <PatchPage />, path: "patch" },
      { element: <JsonPage />, path: "json" },
      { element: <PerformancePage />, path: "performance" },
      { element: <ExamplesPage />, path: "examples" },
      { element: <AboutPage />, path: "about" },
      { element: <SettingsPage />, path: "settings" },
      { element: <NotFoundPage />, path: "not-found" },
      { element: <Navigate replace to="/not-found" />, path: "*" },
    ],
  },
];

export function AppRoutes() {
  return useRoutes(routeObjects);
}
