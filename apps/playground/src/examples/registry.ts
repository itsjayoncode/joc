import * as browserLifecycleModule from "@jayoncode/browser-lifecycle";
import * as formIntelligentModule from "@jayoncode/form-intelligence";
import * as objectDiffModule from "@jayoncode/object-diff";

export type PlaygroundExample = {
  id: string;
  name: string;
  summary: string;
  packageName: string;
  status: "ready-for-wiring" | "placeholder";
  details: string[];
  moduleShape: string;
};

const describeModuleShape = (moduleValue: object): string => {
  const keys = Object.keys(moduleValue);

  return keys.length > 0 ? keys.join(", ") : "No exports yet";
};

export const playgroundExamples: PlaygroundExample[] = [
  {
    id: "browser-lifecycle",
    name: "Browser Lifecycle Sandbox",
    summary: "Explore browser session lifecycle APIs locally before shipping changes.",
    packageName: "@jayoncode/browser-lifecycle",
    status: "ready-for-wiring",
    details: [
      "Use this area to verify browser lifecycle APIs before package release.",
      "Intended for manual testing, demos, and scenario exploration.",
    ],
    moduleShape: describeModuleShape(browserLifecycleModule),
  },
  {
    id: "form-intelligent",
    name: "Form Intelligence Sandbox",
    summary: "Probe headless form workflows, validation, and rules in the workspace.",
    packageName: "@jayoncode/form-intelligence",
    status: "ready-for-wiring",
    details: [
      "Wire createForm() experiments without leaving the monorepo.",
      "Useful for validating adapters and workflow options quickly.",
    ],
    moduleShape: describeModuleShape(formIntelligentModule),
  },
  {
    id: "object-diff",
    name: "Object Diff Sandbox",
    summary: "Try deep comparison, patch generation, and serialization helpers.",
    packageName: "@jayoncode/object-diff",
    status: "ready-for-wiring",
    details: [
      "Compare structured snapshots and inspect change records.",
      "Generate patches for optimistic UI and audit-style reviews.",
    ],
    moduleShape: describeModuleShape(objectDiffModule),
  },
];
