import { Navigate, useRoutes } from "react-router-dom";

import { AppShell } from "../layouts/AppShell.js";
import { AboutPage } from "../pages/AboutPage.js";
import { AdaptersPage } from "../pages/AdaptersPage.js";
import { CalculationsPage } from "../pages/CalculationsPage.js";
import { DashboardPage } from "../pages/DashboardPage.js";
import { DependenciesPage } from "../pages/DependenciesPage.js";
import { DevToolsPage } from "../pages/DevToolsPage.js";
import { ExamplesPage } from "../pages/ExamplesPage.js";
import { FormatterPage } from "../pages/FormatterPage.js";
import { IntegrationsPage } from "../pages/IntegrationsPage.js";
import { NotFoundPage } from "../pages/NotFoundPage.js";
import { PerformancePage } from "../pages/PerformancePage.js";
import { PluginsPage } from "../pages/PluginsPage.js";
import { RulesPage } from "../pages/RulesPage.js";
import { SandboxPage } from "../pages/SandboxPage.js";
import { SettingsPage } from "../pages/SettingsPage.js";
import { StateExplorerPage } from "../pages/StateExplorerPage.js";
import { SubmissionPage } from "../pages/SubmissionPage.js";
import { UiProjectionPage } from "../pages/UiProjectionPage.js";
import { ValidationPage } from "../pages/ValidationPage.js";
import { WorkflowPage } from "../pages/WorkflowPage.js";

import type { RouteObject } from "react-router-dom";

export const APP_ROUTE_PATHS = [
  "/",
  "/dashboard",
  "/validation",
  "/submission",
  "/ui",
  "/workflow",
  "/state",
  "/devtools",
  "/formatters",
  "/plugins",
  "/performance",
  "/adapters",
  "/rules",
  "/dependencies",
  "/calculations",
  "/integrations",
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
      { element: <SandboxPage />, index: true },
      { element: <DashboardPage />, path: "dashboard" },
      { element: <ValidationPage />, path: "validation" },
      { element: <SubmissionPage />, path: "submission" },
      { element: <UiProjectionPage />, path: "ui" },
      { element: <WorkflowPage />, path: "workflow" },
      { element: <StateExplorerPage />, path: "state" },
      { element: <DevToolsPage />, path: "devtools" },
      { element: <FormatterPage />, path: "formatters" },
      { element: <PluginsPage />, path: "plugins" },
      { element: <PerformancePage />, path: "performance" },
      { element: <AdaptersPage />, path: "adapters" },
      { element: <RulesPage />, path: "rules" },
      { element: <DependenciesPage />, path: "dependencies" },
      { element: <CalculationsPage />, path: "calculations" },
      { element: <IntegrationsPage />, path: "integrations" },
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
