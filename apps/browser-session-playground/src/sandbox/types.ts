export type InspectorTab =
  "runtime" | "events" | "snapshot" | "performance" | "capabilities" | "code";

export type WorkspaceTab = "dashboard" | "timeline" | "snapshot" | "overview";

export type ConsoleSeverity = "info" | "warn" | "error" | "success";

export interface SandboxModules {
  readonly visibility: boolean;
  readonly focus: boolean;
  readonly connectivity: boolean;
  readonly idle: boolean;
  readonly lifecycle: boolean;
  readonly crossTab: boolean;
  /** Opt-in Session Intelligence / Insights factories (sandbox wiring). */
  readonly activity: boolean;
  readonly presence: boolean;
  readonly timeline: boolean;
  readonly metrics: boolean;
  readonly reports: boolean;
}

export interface SandboxIdleOptions {
  readonly timeoutMs: number;
  readonly debounceMs: number;
  readonly useDefaultEvents: boolean;
}

export interface SandboxCrossTabOptions {
  readonly channelName: string;
  readonly heartbeatInterval: number;
  readonly leaderTimeout: number;
}

export interface SandboxDiagnostics {
  readonly eventLogging: boolean;
  readonly performanceLogging: boolean;
  readonly debug: boolean;
  readonly snapshotLogging: boolean;
}

export interface SandboxConfig {
  readonly autoStart: boolean;
  readonly emitInitialState: boolean;
  readonly modules: SandboxModules;
  readonly idle: SandboxIdleOptions;
  readonly crossTab: SandboxCrossTabOptions;
  readonly diagnostics: SandboxDiagnostics;
  readonly loggerPlugin: boolean;
  readonly mockSimulation: boolean;
  readonly eventBufferSize: number;
}

export type SandboxConfigPatch = Partial<
  Omit<SandboxConfig, "modules" | "idle" | "crossTab" | "diagnostics">
> & {
  readonly modules?: Partial<SandboxConfig["modules"]>;
  readonly idle?: Partial<SandboxConfig["idle"]>;
  readonly crossTab?: Partial<SandboxConfig["crossTab"]>;
  readonly diagnostics?: Partial<SandboxConfig["diagnostics"]>;
};

export const DEFAULT_SANDBOX_CONFIG: SandboxConfig = {
  autoStart: true,
  emitInitialState: true,
  modules: {
    visibility: true,
    focus: true,
    connectivity: true,
    idle: true,
    lifecycle: true,
    crossTab: true,
    activity: false,
    presence: false,
    timeline: false,
    metrics: false,
    reports: false,
  },
  idle: {
    timeoutMs: 15_000,
    debounceMs: 250,
    useDefaultEvents: true,
  },
  crossTab: {
    channelName: "jayoncode:browser-lifecycle:sandbox",
    heartbeatInterval: 1000,
    leaderTimeout: 3000,
  },
  diagnostics: {
    eventLogging: true,
    performanceLogging: true,
    debug: true,
    snapshotLogging: false,
  },
  loggerPlugin: true,
  mockSimulation: true,
  eventBufferSize: 100,
};

export interface SandboxConsoleEntry {
  readonly id: string;
  readonly at: string;
  readonly level: ConsoleSeverity;
  readonly module: string;
  readonly message: string;
  readonly payload?: string;
}

export interface SandboxEventEntry {
  readonly id: string;
  readonly seq: number;
  readonly at: string;
  readonly timestamp: number;
  readonly type: string;
  readonly source: string;
  readonly summary: string;
  readonly payload: string;
}

export interface TimelineEntry {
  readonly id: string;
  readonly at: string;
  readonly label: string;
  readonly type: string;
}

export interface SimulatedBrowserState {
  readonly visibility: "visible" | "hidden" | null;
  readonly attention: "focused" | "unfocused" | null;
  readonly connectivity: "online" | "offline" | null;
  readonly lifecycle: "active" | "frozen" | null;
}
