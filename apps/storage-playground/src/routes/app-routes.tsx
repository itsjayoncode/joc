import { Navigate, useRoutes } from "react-router-dom";

import { AppShell } from "../layouts/AppShell.js";
import { AboutPage } from "../pages/AboutPage.js";
import { AdaptersPage } from "../pages/AdaptersPage.js";
import { DashboardPage } from "../pages/DashboardPage.js";
import { ExamplesPage } from "../pages/ExamplesPage.js";
import { LabPage } from "../pages/LabPage.js";
import { NotFoundPage } from "../pages/NotFoundPage.js";
import { SettingsPage } from "../pages/SettingsPage.js";
import { TtlPage } from "../pages/TtlPage.js";

import type { RouteObject } from "react-router-dom";

export const APP_ROUTE_PATHS = [
  "/",
  "/dashboard",
  "/adapters",
  "/ttl",
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
      { element: <LabPage />, index: true },
      { element: <DashboardPage />, path: "dashboard" },
      { element: <AdaptersPage />, path: "adapters" },
      { element: <TtlPage />, path: "ttl" },
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
