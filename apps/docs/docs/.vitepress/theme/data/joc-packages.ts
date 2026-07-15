export type JocPackageStatus = "live" | "coming-soon" | "internal";

export interface JocPackage {
  id: string;
  name: string;
  npmName: string;
  tagline: string;
  status: JocPackageStatus;
  docsLink: string;
  accent: "cyan" | "violet" | "blue" | "amber" | "emerald";
  icon: string;
}

export const jocPackages: JocPackage[] = [
  {
    id: "browser-lifecycle",
    name: "Browser Lifecycle Manager",
    npmName: "@jayoncode/browser-lifecycle",
    tagline:
      "Typed session lifecycle for visibility, focus, connectivity, idle state, and cross-tab sync.",
    status: "live",
    docsLink: "/packages/browser-lifecycle/",
    accent: "cyan",
    icon: "◎",
  },
  {
    id: "object-diff",
    name: "Object Difference Engine",
    npmName: "@jayoncode/object-diff",
    tagline:
      "Deep object comparison and structural diffing for state snapshots and change tracking.",
    status: "live",
    docsLink: "/packages/object-diff/",
    accent: "violet",
    icon: "≠",
  },
  {
    id: "request",
    name: "Smart Request Engine",
    npmName: "@jayoncode/request",
    tagline: "Request orchestration, retries, and networking primitives for resilient data flows.",
    status: "coming-soon",
    docsLink: "/packages/request/",
    accent: "blue",
    icon: "↗",
  },
  {
    id: "keyboard",
    name: "Keyboard Shortcut Engine",
    npmName: "@jayoncode/keyboard",
    tagline: "Composable shortcut registration, scopes, and conflict-safe keyboard interaction.",
    status: "coming-soon",
    docsLink: "/packages/keyboard/",
    accent: "amber",
    icon: "⌨",
  },
  {
    id: "theme",
    name: "Theme Engine",
    npmName: "@jayoncode/theme",
    tagline: "Design tokens, dark mode, and theme switching without framework lock-in.",
    status: "coming-soon",
    docsLink: "/packages/theme/",
    accent: "violet",
    icon: "◑",
  },
  {
    id: "scroll",
    name: "Scroll Intelligence",
    npmName: "@jayoncode/scroll",
    tagline: "Scroll position, direction, and intersection primitives for responsive UX.",
    status: "coming-soon",
    docsLink: "/packages/scroll/",
    accent: "cyan",
    icon: "⇳",
  },
  {
    id: "responsive",
    name: "Responsive State Engine",
    npmName: "@jayoncode/responsive",
    tagline: "Breakpoint-aware state, media queries, and viewport signals in one API.",
    status: "coming-soon",
    docsLink: "/packages/responsive/",
    accent: "blue",
    icon: "⬚",
  },
  {
    id: "audit",
    name: "Audit Trail Engine",
    npmName: "@jayoncode/audit",
    tagline: "Structured audit events and observability hooks for user and system actions.",
    status: "coming-soon",
    docsLink: "/packages/audit/",
    accent: "emerald",
    icon: "☰",
  },
  {
    id: "form-intelligent",
    name: "Form Intelligent",
    npmName: "@jayoncode/form-intelligent",
    tagline:
      "A headless form workflow engine — validation, submission, autosave, and wizards without UI lock-in.",
    status: "live",
    docsLink: "/packages/form-intelligent/",
    accent: "amber",
    icon: "▤",
  },
  {
    id: "layers",
    name: "Layer Manager",
    npmName: "@jayoncode/layers",
    tagline: "Overlay stacking, focus traps, and z-index orchestration for modals and drawers.",
    status: "coming-soon",
    docsLink: "/packages/layers/",
    accent: "violet",
    icon: "▦",
  },
  {
    id: "workflow",
    name: "Workflow Engine",
    npmName: "@jayoncode/workflow",
    tagline: "Multi-step workflow state machines for wizards, onboarding, and guided flows.",
    status: "coming-soon",
    docsLink: "/packages/workflow/",
    accent: "cyan",
    icon: "⤳",
  },
  {
    id: "permissions",
    name: "Permissions Engine",
    npmName: "@jayoncode/permissions",
    tagline: "Role, capability, and authorization modeling for client-side access control.",
    status: "coming-soon",
    docsLink: "/packages/permissions/",
    accent: "blue",
    icon: "⛨",
  },
];

export const livePackageCount = jocPackages.filter((pkg) => pkg.status === "live").length;
export const upcomingPackageCount = jocPackages.filter(
  (pkg) => pkg.status === "coming-soon",
).length;
