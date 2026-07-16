export type JocPackageStatus = "live" | "coming-soon" | "internal";

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
    versionLabel: "v0.1.3",
  },
  {
    id: "form-intelligent",
    name: "Form Intelligent",
    npmName: "@jayoncode/form-intelligent",
    tagline: "Headless form workflow engine — validation, submission, and orchestration.",
    purpose: "Headless forms",
    problem: "Form logic becomes complex as validation, drafts, and wizards grow",
    status: "live",
    statusLabel: "In development",
    docsLink: "/packages/form-intelligent/",
    accent: "amber",
    icon: "▤",
    capabilities: ["Validation", "Workflow", "Wizard", "Autosave", "Offline"],
    featured: true,
    versionLabel: "v0.1.1",
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
    versionLabel: "v0.1.0",
  },
  {
    id: "keyboard",
    name: "Keyboard",
    npmName: "@jayoncode/keyboard",
    tagline: "Modern keyboard shortcut engine with scopes and conflict-safe registration.",
    purpose: "Keyboard engine",
    problem: "Keyboard shortcuts are repetitive and hard to compose safely",
    status: "coming-soon",
    statusLabel: "Planned",
    docsLink: "/packages/keyboard/",
    accent: "amber",
    icon: "⌨",
    capabilities: ["Shortcuts", "Sequences", "Recorder", "Commands"],
    featured: false,
  },
  {
    id: "theme",
    name: "Theme",
    npmName: "@jayoncode/theme",
    tagline: "Cross-framework theme engine — tokens, dark mode, and persistence.",
    purpose: "Theme engine",
    problem: "Themes differ across frameworks and lose system preference sync",
    status: "coming-soon",
    statusLabel: "Planned",
    docsLink: "/packages/theme/",
    accent: "emerald",
    icon: "◑",
    capabilities: ["Dark mode", "Light mode", "System", "Persistence"],
    featured: false,
  },
  {
    id: "request",
    name: "Smart Request",
    npmName: "@jayoncode/request",
    tagline: "Request orchestration, retries, and networking primitives for resilient data flows.",
    purpose: "Networking",
    problem: "Retries, cancellation, and request orchestration are reinvented per app",
    status: "coming-soon",
    statusLabel: "Planned",
    docsLink: "/packages/request/",
    accent: "blue",
    icon: "↗",
    capabilities: ["Retries", "Cancel", "Orchestration"],
    featured: false,
  },
  {
    id: "scroll",
    name: "Scroll Intelligence",
    npmName: "@jayoncode/scroll",
    tagline: "Scroll position, direction, and intersection primitives for responsive UX.",
    purpose: "Scroll",
    problem: "Scroll and intersection logic is duplicated across components",
    status: "coming-soon",
    statusLabel: "Planned",
    docsLink: "/packages/scroll/",
    accent: "cyan",
    icon: "⇳",
    capabilities: ["Position", "Direction", "Intersection"],
    featured: false,
  },
  {
    id: "responsive",
    name: "Responsive State",
    npmName: "@jayoncode/responsive",
    tagline: "Breakpoint-aware state, media queries, and viewport signals in one API.",
    purpose: "Responsive state",
    problem: "Breakpoint and media-query state is scattered across UI code",
    status: "coming-soon",
    statusLabel: "Planned",
    docsLink: "/packages/responsive/",
    accent: "blue",
    icon: "⬚",
    capabilities: ["Breakpoints", "Media", "Viewport"],
    featured: false,
  },
  {
    id: "audit",
    name: "Audit Trail",
    npmName: "@jayoncode/audit",
    tagline: "Structured audit events and observability hooks for user and system actions.",
    purpose: "Audit trail",
    problem: "Audit and observability events lack a shared client model",
    status: "coming-soon",
    statusLabel: "Planned",
    docsLink: "/packages/audit/",
    accent: "emerald",
    icon: "☰",
    capabilities: ["Events", "Hooks", "Trail"],
    featured: false,
  },
  {
    id: "layers",
    name: "Layer Manager",
    npmName: "@jayoncode/layers",
    tagline: "Overlay stacking, focus traps, and z-index orchestration for modals and drawers.",
    purpose: "Overlays",
    problem: "Modal and drawer stacking fights the rest of the UI stack",
    status: "coming-soon",
    statusLabel: "Planned",
    docsLink: "/packages/layers/",
    accent: "violet",
    icon: "▦",
    capabilities: ["Stacking", "Focus trap", "Z-index"],
    featured: false,
  },
  {
    id: "workflow",
    name: "Workflow Engine",
    npmName: "@jayoncode/workflow",
    tagline: "Multi-step workflow state machines for wizards, onboarding, and guided flows.",
    purpose: "Workflows",
    problem: "Multi-step flows reinvent state machines in every product",
    status: "coming-soon",
    statusLabel: "Planned",
    docsLink: "/packages/workflow/",
    accent: "cyan",
    icon: "⤳",
    capabilities: ["Steps", "Guards", "Machines"],
    featured: false,
  },
  {
    id: "permissions",
    name: "Permissions Engine",
    npmName: "@jayoncode/permissions",
    tagline: "Role, capability, and authorization modeling for client-side access control.",
    purpose: "Permissions",
    problem: "Client authorization checks diverge from server capability models",
    status: "coming-soon",
    statusLabel: "Planned",
    docsLink: "/packages/permissions/",
    accent: "blue",
    icon: "⛨",
    capabilities: ["Roles", "Capabilities", "Guards"],
    featured: false,
  },
];

export const featuredPackages = jocPackages.filter((pkg) => pkg.featured);
export const livePackages = jocPackages.filter((pkg) => pkg.status === "live");
export const livePackageCount = livePackages.length;
export const upcomingPackageCount = jocPackages.filter(
  (pkg) => pkg.status === "coming-soon",
).length;
