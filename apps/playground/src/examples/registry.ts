import * as browserLifecycleModule from "@jayoncode/browser-lifecycle";
import * as sharedModule from "@jayoncode/shared";

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
    summary:
      "Reserved for future browser lifecycle manager experiments and browser-driven debugging.",
    packageName: "@jayoncode/browser-lifecycle",
    status: "ready-for-wiring",
    details: [
      "Use this area to verify future browser lifecycle APIs before package release.",
      "Intended for manual testing, demos, and scenario exploration.",
    ],
    moduleShape: describeModuleShape(browserLifecycleModule),
  },
  {
    id: "shared",
    name: "Shared Workspace Probe",
    summary:
      "Confirms the internal shared workspace package can be consumed locally by the playground.",
    packageName: "@jayoncode/shared",
    status: "ready-for-wiring",
    details: [
      "Internal workspace code should remain private while still being usable across the repo.",
      "This placeholder confirms local import plumbing before shared utilities exist.",
    ],
    moduleShape: describeModuleShape(sharedModule),
  },
  {
    id: "future-examples",
    name: "Future Example Surface",
    summary:
      "Reserved for request, theme, scroll, and forms package demos once implementation work begins.",
    packageName: "examples/*",
    status: "placeholder",
    details: [
      "This area will grow into focused usage examples once package features exist.",
      "The playground is intentionally simple so examples stay easy to add and maintain.",
    ],
    moduleShape: "Placeholder only",
  },
];
