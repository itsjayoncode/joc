import { Navigate, useRoutes } from "react-router-dom";

import { AppShell } from "../layouts/AppShell.js";
import { AboutPage } from "../pages/AboutPage.js";
import { AdaptersPage } from "../pages/AdaptersPage.js";
import { DashboardPage } from "../pages/DashboardPage.js";
import { ExamplesPage } from "../pages/ExamplesPage.js";
import { FormatterPage } from "../pages/FormatterPage.js";
import { NotFoundPage } from "../pages/NotFoundPage.js";
import { PluginsPage } from "../pages/PluginsPage.js";
import { SettingsPage } from "../pages/SettingsPage.js";
import { StateExplorerPage } from "../pages/StateExplorerPage.js";
import { SubmissionPage } from "../pages/SubmissionPage.js";
import { ValidationPage } from "../pages/ValidationPage.js";
import { WorkflowPage } from "../pages/WorkflowPage.js";

import type { RouteObject } from "react-router-dom";

export const APP_ROUTE_PATHS = [
  "/",
  "/validation",
  "/submission",
  "/workflow",
  "/state",
  "/formatters",
  "/plugins",
  "/adapters",
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
      { element: <ValidationPage />, path: "validation" },
      { element: <SubmissionPage />, path: "submission" },
      { element: <WorkflowPage />, path: "workflow" },
      { element: <StateExplorerPage />, path: "state" },
      { element: <FormatterPage />, path: "formatters" },
      { element: <PluginsPage />, path: "plugins" },
      { element: <AdaptersPage />, path: "adapters" },
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
