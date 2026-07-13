/* v8 ignore file */
import type { TypedEventEmitter } from "../../events/index.js";
import type {
  BrowserLifecycleCapabilities,
  BrowserLifecyclePlugin,
  DeepReadonly,
  PlainObject,
  ResolvedBrowserLifecycleConfig,
} from "../../types/index.js";

/**
 * Public lifecycle phases exposed by the Session Core.
 */
export type BrowserLifecyclePhase = "created" | "disposed" | "running" | "stopped";

/**
 * Normalized visibility state placeholder for current and future modules.
 */
export type BrowserLifecycleVisibilityState = "hidden" | "unknown" | "visible";

/**
 * Normalized attention state placeholder for current and future modules.
 */
export type BrowserLifecycleAttentionState = "focused" | "unknown" | "unfocused";

/**
 * Normalized activity state placeholder for current and future modules.
 */
export type BrowserLifecycleActivityState = "active" | "idle" | "unknown";

/**
 * Normalized advisory connectivity state placeholder for current and future modules.
 */
export type BrowserLifecycleConnectivityState = "offline" | "online" | "unknown";

/**
 * Normalized lifecycle state placeholder for current and future modules.
 */
export type BrowserLifecyclePageState =
  | "active"
  | "discarded"
  | "frozen"
  | "hidden"
  | "passive"
  | "terminated"
  | "unknown";

/**
 * Normalized tab role placeholder for current and future modules.
 */
export type BrowserLifecycleTabState = "primary" | "secondary" | "single" | "unknown";

/**
 * Public event source categories.
 */
export type BrowserLifecycleEventSource =
  | "activity"
  | "connectivity"
  | "focus"
  | "internal"
  | "lifecycle"
  | "plugin"
  | "transport"
  | "visibility";

/**
 * Timestamp metadata exposed in snapshot reads.
 */
export interface BrowserLifecycleTimestamps {
  readonly createdAt: number;
  readonly disposedAt?: number;
  readonly lastEventAt?: number;
  readonly startedAt?: number;
  readonly stoppedAt?: number;
  readonly updatedAt: number;
}

/**
 * Public snapshot shape returned by the Session Core.
 */
export interface BrowserLifecycleSnapshot {
  readonly activity: BrowserLifecycleActivityState;
  readonly attention: BrowserLifecycleAttentionState;
  readonly capabilities: BrowserLifecycleCapabilities;
  readonly connectivity: BrowserLifecycleConnectivityState;
  readonly lifecycle: BrowserLifecyclePageState;
  readonly phase: BrowserLifecyclePhase;
  readonly tab: BrowserLifecycleTabState;
  readonly timestamps: BrowserLifecycleTimestamps;
  readonly visibility: BrowserLifecycleVisibilityState;
}

/**
 * Public event names reserved by Browser Lifecycle Manager.
 */
export type BrowserLifecycleEventName =
  | "connection:offline"
  | "connection:online"
  | "page:hidden"
  | "page:resume"
  | "page:suspend"
  | "page:visible"
  | "plugin:error"
  | "plugin:registered"
  | "plugin:removed"
  | "session:active"
  | "session:idle"
  | "session:restored"
  | "session:started"
  | "session:stopped"
  | "tab:primary"
  | "tab:secondary"
  | "window:blur"
  | "window:focus";

/**
 * Shared event payload contract for normalized public events.
 */
export interface BrowserLifecycleEvent<
  TType extends BrowserLifecycleEventName,
  TCurrent,
  TPrevious,
  TMetadata extends PlainObject | undefined = PlainObject | undefined,
> {
  readonly current: TCurrent;
  readonly metadata: TMetadata;
  readonly previous: TPrevious;
  readonly snapshot: BrowserLifecycleSnapshot;
  readonly source: BrowserLifecycleEventSource;
  readonly timestamp: number;
  readonly type: TType;
}

/**
 * Public event payload map used by the Session Core event API.
 */
export interface BrowserLifecycleEventMap {
  readonly "connection:offline": BrowserLifecycleEvent<
    "connection:offline",
    "offline",
    BrowserLifecycleConnectivityState,
    { readonly advisory: true } | undefined
  >;
  readonly "connection:online": BrowserLifecycleEvent<
    "connection:online",
    "online",
    BrowserLifecycleConnectivityState,
    { readonly advisory: true } | undefined
  >;
  readonly "page:hidden": BrowserLifecycleEvent<
    "page:hidden",
    "hidden",
    BrowserLifecycleVisibilityState
  >;
  readonly "page:resume": BrowserLifecycleEvent<
    "page:resume",
    "active",
    BrowserLifecyclePageState
  >;
  readonly "page:suspend": BrowserLifecycleEvent<
    "page:suspend",
    "hidden" | "frozen" | "terminated",
    BrowserLifecyclePageState
  >;
  readonly "page:visible": BrowserLifecycleEvent<
    "page:visible",
    "visible",
    BrowserLifecycleVisibilityState
  >;
  readonly "plugin:error": BrowserLifecycleEvent<
    "plugin:error",
    "error",
    "ready" | "registered" | undefined,
    { readonly hook?: string; readonly pluginId: string } | undefined
  >;
  readonly "plugin:registered": BrowserLifecycleEvent<
    "plugin:registered",
    "registered",
    undefined,
    { readonly pluginId: string } | undefined
  >;
  readonly "plugin:removed": BrowserLifecycleEvent<
    "plugin:removed",
    "removed",
    "registered" | undefined,
    { readonly pluginId: string; readonly reason?: string } | undefined
  >;
  readonly "session:active": BrowserLifecycleEvent<
    "session:active",
    "active",
    BrowserLifecycleActivityState
  >;
  readonly "session:idle": BrowserLifecycleEvent<
    "session:idle",
    "idle",
    BrowserLifecycleActivityState
  >;
  readonly "session:restored": BrowserLifecycleEvent<
    "session:restored",
    "running" | "stopped",
    BrowserLifecyclePhase
  >;
  readonly "session:started": BrowserLifecycleEvent<
    "session:started",
    "running",
    BrowserLifecyclePhase,
    { readonly autoStart: boolean } | undefined
  >;
  readonly "session:stopped": BrowserLifecycleEvent<
    "session:stopped",
    "stopped",
    BrowserLifecyclePhase,
    { readonly reason: "dispose" | "manual-stop" } | undefined
  >;
  readonly "tab:primary": BrowserLifecycleEvent<
    "tab:primary",
    "primary",
    BrowserLifecycleTabState
  >;
  readonly "tab:secondary": BrowserLifecycleEvent<
    "tab:secondary",
    "secondary",
    BrowserLifecycleTabState
  >;
  readonly "window:blur": BrowserLifecycleEvent<
    "window:blur",
    "unfocused",
    BrowserLifecycleAttentionState
  >;
  readonly "window:focus": BrowserLifecycleEvent<
    "window:focus",
    "focused",
    BrowserLifecycleAttentionState
  >;
}

/**
 * Named event listener used by the public BrowserLifecycle object.
 */
export type BrowserLifecycleEventListener<TEventName extends BrowserLifecycleEventName> = (
  event: DeepReadonly<BrowserLifecycleEventMap[TEventName]>,
) => void;

/**
 * Full event feed subscriber used for logging and adapter layers.
 */
export type BrowserLifecycleSubscriber = (
  event: DeepReadonly<BrowserLifecycleEventMap[BrowserLifecycleEventName]>,
  snapshot: DeepReadonly<BrowserLifecycleSnapshot>,
) => void;

/**
 * Public BrowserLifecycle runtime contract.
 */
export interface BrowserLifecycle {
  dispose(): void;
  getCapabilities(): Readonly<BrowserLifecycleCapabilities>;
  getSnapshot(): Readonly<BrowserLifecycleSnapshot>;
  isRunning(): boolean;
  off<TEventName extends BrowserLifecycleEventName>(
    event: TEventName,
    listener: BrowserLifecycleEventListener<TEventName>,
  ): void;
  on<TEventName extends BrowserLifecycleEventName>(
    event: TEventName,
    listener: BrowserLifecycleEventListener<TEventName>,
  ): () => void;
  once<TEventName extends BrowserLifecycleEventName>(
    event: TEventName,
    listener: BrowserLifecycleEventListener<TEventName>,
  ): () => void;
  start(): void;
  stop(): void;
  subscribe(listener: BrowserLifecycleSubscriber): () => void;
  use(plugin: BrowserLifecyclePlugin): void;
}

/**
 * Internal logger placeholder exposed through session context.
 */
export interface SessionLogger {
  debug(message: string, details?: PlainObject): void;
  error(message: string, details?: PlainObject): void;
  warn(message: string, details?: PlainObject): void;
}

/**
 * Internal session events reserved for Session Core orchestration.
 */
export interface InternalSessionEventMap {
  readonly "internal:lifecycle-transition": {
    readonly nextPhase: BrowserLifecyclePhase;
    readonly previousPhase: BrowserLifecyclePhase;
    readonly snapshot: BrowserLifecycleSnapshot;
  };
  readonly "internal:module-registered": {
    readonly moduleId: string;
  };
  readonly "internal:module-unregistered": {
    readonly moduleId: string;
  };
}

/**
 * Internal session context shared with future modules.
 */
export interface SessionContext {
  readonly capabilities: BrowserLifecycleCapabilities;
  readonly configuration: ResolvedBrowserLifecycleConfig;
  readonly events: TypedEventEmitter<InternalSessionEventMap>;
  readonly logger: SessionLogger;
  getSnapshot(): Readonly<BrowserLifecycleSnapshot>;
  updateSnapshot(
    updater: (snapshot: Readonly<BrowserLifecycleSnapshot>) => BrowserLifecycleSnapshot,
  ): Readonly<BrowserLifecycleSnapshot>;
}

/**
 * Internal module contract used by the Session Core registry.
 */
export interface SessionModule {
  readonly id: string;
  readonly order?: number;
  destroy?(context: SessionContext): void;
  initialize?(context: SessionContext): void;
  start?(context: SessionContext): void;
  stop?(context: SessionContext): void;
}

/**
 * Internal constructor options used by tests to control time and capabilities safely.
 */
export interface BrowserLifecycleSessionOptions {
  readonly capabilities?: BrowserLifecycleCapabilities;
  readonly timeProvider?: () => number;
}
