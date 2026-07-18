export type JocPackageStatus = "live" | "internal";

export type JocPackageAccent = "cyan" | "violet" | "blue" | "amber" | "emerald";

export interface JocPackage {
  id: string;
  name: string;
  npmName: string;
  tagline: string;
  purpose: string;
  problem: string;
  status: JocPackageStatus;
  /** Short label for comparison tables */
  statusLabel: string;
  docsLink: string;
  accent: JocPackageAccent;
  icon: string;
  /** Capability chips for package showcase */
  capabilities: string[];
  /** Featured on the homepage ecosystem grid */
  featured: boolean;
  versionLabel?: string;
}

export const jocPackages: JocPackage[] = [
  {
    id: "browser-lifecycle",
    name: "Browser Lifecycle",
    npmName: "@jayoncode/browser-lifecycle",
    tagline: "Observe browser session lifecycle with a unified typed API.",
    purpose: "Browser lifecycle",
    problem: "Browser lifecycle is inconsistent across APIs and frameworks",
    status: "live",
    statusLabel: "Released",
    docsLink: "/packages/browser-lifecycle/",
    accent: "cyan",
    icon: "◎",
    capabilities: ["Visibility", "Focus", "Idle", "Cross-tab", "Lifecycle"],
    featured: true,
    versionLabel: "v0.3.0",
  },
  {
    id: "form-intelligence",
    name: "Form Intelligence",
    npmName: "@jayoncode/form-intelligence",
    tagline:
      "Headless form workflows — conditional rules, drafts, wizards, submit without UI lock-in.",
    purpose: "Headless forms",
    problem: "Conditional fields, drafts, and submit races turn into effect spaghetti in every app",
    status: "live",
    statusLabel: "Released",
    docsLink: "/packages/form-intelligence/",
    accent: "amber",
    icon: "▤",
    capabilities: ["Validation", "Workflow", "Wizard", "Autosave", "Offline"],
    featured: true,
    versionLabel: "v3.3.1",
  },
  {
    id: "object-diff",
    name: "Object Diff",
    npmName: "@jayoncode/object-diff",
    tagline: "Fast deep comparison, change records, and JSON Patch generation.",
    purpose: "Object comparison",
    problem: "Object comparison and patching is verbose and error-prone",
    status: "live",
    statusLabel: "Released",
    docsLink: "/packages/object-diff/",
    accent: "blue",
    icon: "≠",
    capabilities: ["Diff", "Patch", "Serialize", "Snapshots"],
    featured: true,
    versionLabel: "v0.3.0",
  },
];

export const featuredPackages = jocPackages.filter((pkg) => pkg.featured);
export const livePackages = jocPackages.filter((pkg) => pkg.status === "live");
export const livePackageCount = livePackages.length;
