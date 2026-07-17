/* v8 ignore next */
import { ModuleRegistry } from "./module-registry.js";
import { createSessionContext } from "./session-context.js";
import { SessionStateStore } from "./session-state.js";
import { detectBrowserLifecycleCapabilities } from "../../browser/features/index.js";
import { InitializationError, LifecycleError, PluginError } from "../../errors/index.js";
import { TypedEventEmitter } from "../../events/index.js";
import { createConnectivityModule } from "../../modules/connectivity/index.js";
import { createCrossTabModule } from "../../modules/cross-tab/index.js";
import { createFocusModule } from "../../modules/focus/index.js";
import { createIdleModule } from "../../modules/idle/index.js";
import { createLifecycleModule } from "../../modules/lifecycle/index.js";
import { createVisibilityModule } from "../../modules/visibility/index.js";
import { PluginRuntime } from "../../plugins/index.js";
import { createBrowserLifecycleConfig } from "../config/index.js";

import type {
  BrowserLifecycle,
  BrowserLifecycleEventListener,
  BrowserLifecycleEventMap,
  BrowserLifecycleEventName,
  BrowserLifecyclePhase,
  BrowserLifecycleSessionOptions,
  BrowserLifecycleSnapshot,
  BrowserLifecycleSubscriber,
  InternalSessionEventMap,
  SessionContext,
  SessionModule,
} from "./types.js";
import type { BrowserLifecycleRuntimeDiagnostics } from "../../diagnostics/types.js";
import type { EventDefinition } from "../../events/index.js";
import type {
  BrowserLifecycleCapabilities,
  BrowserLifecycleConfig,
  BrowserLifecyclePlugin,
  DeepReadonly,
  ResolvedBrowserLifecycleConfig,
} from "../../types/index.js";

const PUBLIC_EVENT_DEFINITIONS: readonly EventDefinition<BrowserLifecycleEventName>[] = [
  { name: "session:started", public: true },
  { name: "session:stopped", public: true },
  { name: "page:visible", public: true },
  { name: "page:hidden", public: true },
  { name: "window:focus", public: true },
  { name: "window:blur", public: true },
  { name: "session:active", public: true },
  { name: "session:idle", public: true },
  { name: "activity:detected", public: true },
  { name: "activity:reset", public: true },
  { name: "connection:online", public: true },
  { name: "connection:offline", public: true },
  { name: "connection:reconnect", public: true },
  { name: "page:suspend", public: true },
  { name: "page:resume", public: true },
  { name: "session:restored", public: true },
  { name: "tab:primary", public: true },
  { name: "tab:secondary", public: true },
  { name: "tab:message", public: true },
  { name: "plugin:registered", public: true },
  { name: "plugin:removed", public: true },
  { name: "plugin:error", public: true },
];

const VALID_PUBLIC_EVENTS = new Set<BrowserLifecycleEventName>(
  PUBLIC_EVENT_DEFINITIONS.map((definition) => definition.name),
);

/**
 * Internal Session Core implementation behind the public BrowserLifecycle factory.
 */
export class BrowserLifecycleSession implements BrowserLifecycle {
  private readonly capabilities: Readonly<BrowserLifecycleCapabilities>;
  private readonly context: SessionContext;
  private readonly internalEvents = new TypedEventEmitter<InternalSessionEventMap>();
  private readonly modules = new ModuleRegistry();
  private readonly publicEvents: TypedEventEmitter<BrowserLifecycleEventMap>;
  private readonly resolvedConfig: ResolvedBrowserLifecycleConfig;
  private readonly state: SessionStateStore;
  private readonly subscribers = new Set<BrowserLifecycleSubscriber>();
  private readonly timeProvider: () => number;
  private readonly pendingVisibilityEvents: InternalSessionEventMap["internal:visibility-changed"][] =
    [];
  private readonly pendingFocusEvents: InternalSessionEventMap["internal:focus-changed"][] = [];
  private readonly pendingConnectivityEvents: InternalSessionEventMap["internal:connectivity-changed"][] =
    [];
  private readonly pendingActivityEvents: InternalSessionEventMap["internal:activity-changed"][] =
    [];
  private readonly pendingLifecycleEvents: InternalSessionEventMap["internal:lifecycle-changed"][] =
    [];
  private readonly pendingCrossTabEvents: InternalSessionEventMap["internal:cross-tab-changed"][] =
    [];
  private lastOfflineAt: number | undefined;
  private initialized = false;
  /** Created only when plugins are configured or `use()` is called. */
  private pluginRuntime: PluginRuntime | undefined;

  public constructor(
    config: BrowserLifecycleConfig = {},
    options: BrowserLifecycleSessionOptions = {},
  ) {
    this.timeProvider = options.timeProvider ?? Date.now;
    this.resolvedConfig = createBrowserLifecycleConfig(config);
    this.capabilities = options.capabilities ?? detectBrowserLifecycleCapabilities();
    this.state = new SessionStateStore(this.capabilities, this.timeProvider());
    this.publicEvents = new TypedEventEmitter<BrowserLifecycleEventMap>({
      definitions: PUBLIC_EVENT_DEFINITIONS,
      timeProvider: this.timeProvider,
    });
    this.context = createSessionContext({
      capabilities: this.capabilities,
      configuration: this.resolvedConfig,
      events: this.internalEvents,
      getSnapshot: (): Readonly<BrowserLifecycleSnapshot> => this.state.getSnapshot(),
      updateSnapshot: (
        updater: (snapshot: Readonly<BrowserLifecycleSnapshot>) => BrowserLifecycleSnapshot,
      ): Readonly<BrowserLifecycleSnapshot> => this.state.update(updater, this.timeProvider()),
    });
    this.internalEvents.on("internal:visibility-changed", (payload) => {
      this.handleVisibilityChanged(payload);
    });
    this.internalEvents.on("internal:focus-changed", (payload) => {
      this.handleFocusChanged(payload);
    });
    this.internalEvents.on("internal:connectivity-changed", (payload) => {
      this.handleConnectivityChanged(payload);
    });
    this.internalEvents.on("internal:activity-changed", (payload) => {
      this.handleActivityChanged(payload);
    });
    this.internalEvents.on("internal:activity-detected", (payload) => {
      this.handleActivityDetected(payload);
    });
    this.internalEvents.on("internal:activity-reset", (payload) => {
      this.handleActivityReset(payload);
    });
    this.internalEvents.on("internal:lifecycle-changed", (payload) => {
      this.handleLifecyclePageChanged(payload);
    });
    this.internalEvents.on("internal:cross-tab-changed", (payload) => {
      this.handleCrossTabChanged(payload);
    });
    this.internalEvents.on("internal:cross-tab-message", (payload) => {
      this.handleCrossTabMessage(payload);
    });
    this.registerModule(
      createVisibilityModule({
        timeProvider: this.timeProvider,
      }),
    );
    this.registerModule(
      createFocusModule({
        timeProvider: this.timeProvider,
      }),
    );
    this.registerModule(
      createConnectivityModule({
        timeProvider: this.timeProvider,
      }),
    );
    this.registerModule(
      createIdleModule({
        timeProvider: this.timeProvider,
      }),
    );
    this.registerModule(
      createLifecycleModule({
        timeProvider: this.timeProvider,
      }),
    );
    this.registerModule(
      createCrossTabModule({
        timeProvider: this.timeProvider,
      }),
    );

    for (const plugin of this.resolvedConfig.plugins) {
      this.ensurePluginRuntime().register(plugin);
    }

    if (this.resolvedConfig.autoStart) {
      this.startInternal(true);
    }
  }

  /**
   * Starts live observation and module coordination.
   */
  public start(): void {
    this.startInternal(false);
  }

  /**
   * Stops live observation while preserving the latest snapshot.
   */
  public stop(): void {
    const phase = this.state.getPhase();

    if (phase === "disposed") {
      throw new LifecycleError("Cannot stop a disposed BrowserLifecycle instance.");
    }

    if (phase !== "running") {
      return;
    }

    this.modules.stopAll(this.context);
    this.pluginRuntime?.stopAll("manual-stop");

    const timestamp = this.timeProvider();
    const { previousPhase, snapshot } = this.state.transitionPhase("stopped", timestamp);

    this.emitInternalLifecycleTransition(previousPhase, "stopped", snapshot);
    this.emitPublicEvent("session:stopped", {
      current: "stopped",
      metadata: {
        reason: "manual-stop",
      },
      previous: previousPhase,
      snapshot,
      source: "lifecycle",
      timestamp,
      type: "session:stopped",
    });
  }

  /**
   * Performs terminal teardown and clears event listeners and subscribers.
   */
  public dispose(): void {
    const phase = this.state.getPhase();

    if (phase === "disposed") {
      return;
    }

    if (phase === "running") {
      this.modules.stopAll(this.context);
      this.pluginRuntime?.stopAll("dispose");

      const stoppedTimestamp = this.timeProvider();
      this.emitPublicEvent("session:stopped", {
        current: "stopped",
        metadata: {
          reason: "dispose",
        },
        previous: phase,
        snapshot: this.state.getSnapshot(),
        source: "lifecycle",
        timestamp: stoppedTimestamp,
        type: "session:stopped",
      });
    }

    this.modules.destroyAll(this.context);
    this.pluginRuntime?.destroyAll();
    this.pluginRuntime = undefined;

    const timestamp = this.timeProvider();
    const { previousPhase, snapshot } = this.state.transitionPhase("disposed", timestamp);

    this.emitInternalLifecycleTransition(previousPhase, "disposed", snapshot);
    this.subscribers.clear();
    this.publicEvents.destroy();
    this.internalEvents.destroy();
  }

  /**
   * Returns the current readonly snapshot.
   */
  public getSnapshot(): Readonly<BrowserLifecycleSnapshot> {
    return this.state.getSnapshot();
  }

  /**
   * Returns the detected capability snapshot.
   */
  public getCapabilities(): Readonly<BrowserLifecycleCapabilities> {
    return this.capabilities;
  }

  /**
   * Returns whether the Session Core is currently running.
   */
  public isRunning(): boolean {
    return this.state.getPhase() === "running";
  }

  /**
   * Registers a typed named listener.
   */
  public on<TEventName extends BrowserLifecycleEventName>(
    event: TEventName,
    listener: BrowserLifecycleEventListener<TEventName>,
  ): () => void {
    this.ensureActiveForListeners();
    this.ensureKnownPublicEvent(event);

    const subscription = this.publicEvents.on(event, (payload) => {
      listener(payload as DeepReadonly<BrowserLifecycleEventMap[TEventName]>);
    });

    return (): void => {
      subscription.unsubscribe();
    };
  }

  /**
   * Removes one named listener registration.
   */
  public off<TEventName extends BrowserLifecycleEventName>(
    event: TEventName,
    listener: BrowserLifecycleEventListener<TEventName>,
  ): void {
    if (this.state.getPhase() === "disposed") {
      return;
    }

    this.ensureKnownPublicEvent(event);
    this.publicEvents.off(event, listener as never);
  }

  /**
   * Registers a typed one-time named listener.
   */
  public once<TEventName extends BrowserLifecycleEventName>(
    event: TEventName,
    listener: BrowserLifecycleEventListener<TEventName>,
  ): () => void {
    this.ensureActiveForListeners();
    this.ensureKnownPublicEvent(event);

    const subscription = this.publicEvents.once(event, (payload) => {
      listener(payload as DeepReadonly<BrowserLifecycleEventMap[TEventName]>);
    });

    return (): void => {
      subscription.unsubscribe();
    };
  }

  /**
   * Subscribes to the full normalized public event feed.
   */
  public subscribe(listener: BrowserLifecycleSubscriber): () => void {
    this.ensureActiveForListeners();
    this.subscribers.add(listener);

    return (): void => {
      this.subscribers.delete(listener);
    };
  }

  /**
   * Registers plugin metadata before startup begins.
   */
  public use(plugin: BrowserLifecyclePlugin): void {
    if (this.state.getPhase() === "disposed") {
      throw new LifecycleError("Cannot register a plugin on a disposed BrowserLifecycle instance.");
    }

    if (this.state.getPhase() === "running") {
      throw new PluginError("Plugins must be registered before BrowserLifecycle starts.");
    }

    const runtime = this.ensurePluginRuntime();

    if (runtime.has(plugin.id)) {
      throw new PluginError(`A plugin with id "${plugin.id}" is already registered.`);
    }

    runtime.register(plugin);
  }

  /**
   * Registers an internal module for Session Core coordination.
   */
  public registerModule(module: SessionModule): void {
    if (this.state.getPhase() === "disposed") {
      throw new LifecycleError("Cannot register a module on a disposed BrowserLifecycle instance.");
    }

    this.modules.register(module);
    this.internalEvents.emit("internal:module-registered", {
      moduleId: module.id,
    });

    if (!this.initialized) {
      return;
    }

    module.initialize?.(this.context);

    if (this.isRunning()) {
      module.start?.(this.context);
    }
  }

  /**
   * Unregisters an internal module by id.
   */
  public unregisterModule(id: string): boolean {
    if (this.state.getPhase() === "disposed") {
      return false;
    }

    const module = this.modules.list().find((entry) => entry.id === id);

    if (!module) {
      return false;
    }

    if (this.isRunning()) {
      module.stop?.(this.context);
    }

    module.destroy?.(this.context);

    const removed = this.modules.unregister(id);

    if (removed) {
      this.internalEvents.emit("internal:module-unregistered", {
        moduleId: id,
      });
    }

    return removed;
  }

  /**
   * Returns the number of registered internal modules.
   */
  public moduleCount(): number {
    return this.modules.size();
  }

  /**
   * Returns the shared internal Session Context.
   */
  public getContext(): SessionContext {
    return this.context;
  }

  /**
   * Returns the registered plugin ids for diagnostics and tests.
   */
  public getPluginIds(): readonly string[] {
    return this.pluginRuntime?.getPluginIds() ?? [];
  }

  /**
   * Returns plugin diagnostics for debugging and playground tooling.
   */
  public getPlugins(): ReturnType<PluginRuntime["getDiagnostics"]> {
    return this.pluginRuntime?.getDiagnostics() ?? [];
  }

  /**
   * Returns recorded plugin hook executions.
   */
  public getPluginHookLog(): ReturnType<PluginRuntime["getHookLog"]> {
    return this.pluginRuntime?.getHookLog() ?? [];
  }

  /**
   * Enables or disables plugin event hooks at runtime.
   */
  public setPluginEnabled(pluginId: string, enabled: boolean): void {
    if (!this.pluginRuntime) {
      throw new PluginError(`Plugin "${pluginId}" is not registered.`);
    }

    this.pluginRuntime.setEnabled(pluginId, enabled);
  }

  /**
   * Returns runtime diagnostics for performance and developer tooling.
   */
  public getRuntimeDiagnostics(): BrowserLifecycleRuntimeDiagnostics {
    const eventStats = PUBLIC_EVENT_DEFINITIONS.map((definition) => {
      const stats = this.publicEvents.stats(definition.name);
      return {
        emissionCount: stats.emissionCount,
        errorCount: stats.errorCount,
        event: definition.name,
        listenerCount: stats.listenerCount,
        ...(stats.lastDispatchedAt === undefined
          ? {}
          : { lastDispatchedAt: stats.lastDispatchedAt }),
      };
    });

    return {
      capabilities: this.capabilities,
      debug: this.resolvedConfig.debug,
      eventBufferSize: this.resolvedConfig.eventBufferSize,
      eventStats,
      isRunning: this.isRunning(),
      moduleCount: this.moduleCount(),
      phase: this.state.getPhase(),
      pluginCount: this.getPluginIds().length,
      subscriberCount: this.subscribers.size,
      totalEmissionCount: eventStats.reduce((total, stat) => total + stat.emissionCount, 0),
      totalListenerCount: eventStats.reduce((total, stat) => total + stat.listenerCount, 0),
    };
  }

  private ensurePluginRuntime(): PluginRuntime {
    if (this.pluginRuntime) {
      return this.pluginRuntime;
    }

    this.pluginRuntime = new PluginRuntime(
      {
        capabilities: this.capabilities,
        configuration: this.resolvedConfig,
        getSnapshot: (): Readonly<BrowserLifecycleSnapshot> => this.state.getSnapshot(),
      },
      (event, payload) => {
        this.publicEvents.emit(event, payload);
        for (const subscriber of this.subscribers) {
          subscriber(payload, this.state.getSnapshot());
        }
      },
      this.timeProvider,
    );

    return this.pluginRuntime;
  }

  private emitInternalLifecycleTransition(
    previousPhase: BrowserLifecycleSnapshot["phase"],
    nextPhase: BrowserLifecycleSnapshot["phase"],
    snapshot: Readonly<BrowserLifecycleSnapshot>,
  ): void {
    this.internalEvents.emit("internal:lifecycle-transition", {
      nextPhase,
      previousPhase,
      snapshot,
    });
  }

  private emitPublicEvent<TEventName extends BrowserLifecycleEventName>(
    event: TEventName,
    payload: BrowserLifecycleEventMap[TEventName],
  ): void {
    this.publicEvents.emit(event, payload);

    for (const subscriber of this.subscribers) {
      subscriber(payload, this.state.getSnapshot());
    }

    if (!event.startsWith("plugin:")) {
      this.pluginRuntime?.dispatchEvent(event, payload);
    }
  }

  private ensureActiveForListeners(): void {
    if (this.state.getPhase() === "disposed") {
      throw new LifecycleError(
        "Cannot interact with listeners on a disposed BrowserLifecycle instance.",
      );
    }
  }

  private ensureKnownPublicEvent(event: BrowserLifecycleEventName): void {
    if (!VALID_PUBLIC_EVENTS.has(event)) {
      throw new LifecycleError(`Unknown Browser Lifecycle event "${event}".`);
    }
  }

  private startInternal(autoStart: boolean): void {
    const phase = this.state.getPhase();

    if (phase === "disposed") {
      throw new LifecycleError("Cannot start a disposed BrowserLifecycle instance.");
    }

    if (phase === "running") {
      return;
    }

    try {
      if (!this.initialized) {
        this.modules.initializeAll(this.context);
        this.pluginRuntime?.initializeAll();
        this.initialized = true;
      }

      this.modules.startAll(this.context);
      this.pluginRuntime?.startAll();
    } catch (error) {
      throw new InitializationError("Failed to start BrowserLifecycle.", {
        cause: error,
      });
    }

    const timestamp = this.timeProvider();
    const { previousPhase, snapshot } = this.state.transitionPhase("running", timestamp);

    this.emitInternalLifecycleTransition(previousPhase, "running", snapshot);
    this.emitPublicEvent("session:started", {
      current: "running",
      metadata: {
        autoStart,
      },
      previous: previousPhase,
      snapshot,
      source: "lifecycle",
      timestamp,
      type: "session:started",
    });
    this.flushPendingVisibilityEvents();
    this.flushPendingFocusEvents();
    this.flushPendingConnectivityEvents();
    this.flushPendingActivityEvents();
    this.flushPendingLifecycleEvents();
    this.flushPendingCrossTabEvents();
  }

  private flushPendingActivityEvents(): void {
    const queuedEvents = [...this.pendingActivityEvents];
    this.pendingActivityEvents.length = 0;
    for (const payload of queuedEvents) {
      this.emitActivityEvent(payload);
    }
  }

  private flushPendingLifecycleEvents(): void {
    const queuedEvents = [...this.pendingLifecycleEvents];
    this.pendingLifecycleEvents.length = 0;
    for (const payload of queuedEvents) {
      this.emitLifecyclePageEvent(payload);
    }
  }

  private flushPendingCrossTabEvents(): void {
    const queuedEvents = [...this.pendingCrossTabEvents];
    this.pendingCrossTabEvents.length = 0;
    for (const payload of queuedEvents) {
      this.emitCrossTabEvent(payload);
    }
  }

  private flushPendingConnectivityEvents(): void {
    const queuedEvents = [...this.pendingConnectivityEvents];

    this.pendingConnectivityEvents.length = 0;

    for (const payload of queuedEvents) {
      this.emitConnectivityEvent(payload);
    }
  }

  private flushPendingFocusEvents(): void {
    const queuedEvents = [...this.pendingFocusEvents];

    this.pendingFocusEvents.length = 0;

    for (const payload of queuedEvents) {
      this.emitFocusEvent(payload);
    }
  }

  private flushPendingVisibilityEvents(): void {
    const queuedEvents = [...this.pendingVisibilityEvents];

    this.pendingVisibilityEvents.length = 0;

    for (const payload of queuedEvents) {
      this.emitVisibilityEvent(payload);
    }
  }

  private handleVisibilityChanged(
    payload: InternalSessionEventMap["internal:visibility-changed"],
  ): void {
    this.state.update(
      (snapshot) => ({
        ...snapshot,
        visibility: payload.current,
        timestamps: {
          ...snapshot.timestamps,
          lastEventAt: payload.timestamp,
        },
      }),
      payload.timestamp,
    );

    if (this.state.getPhase() !== "running") {
      this.pendingVisibilityEvents.push(payload);
      return;
    }

    this.emitVisibilityEvent(payload);
  }

  private emitVisibilityEvent(
    payload: InternalSessionEventMap["internal:visibility-changed"],
  ): void {
    const snapshot = this.state.getSnapshot();

    if (payload.type === "page:hidden") {
      this.emitPublicEvent("page:hidden", {
        current: "hidden",
        metadata: payload.metadata,
        previous: payload.previous,
        snapshot,
        source: "visibility",
        timestamp: payload.timestamp,
        type: payload.type,
      });
      return;
    }

    this.emitPublicEvent("page:visible", {
      current: "visible",
      metadata: payload.metadata,
      previous: payload.previous,
      snapshot,
      source: "visibility",
      timestamp: payload.timestamp,
      type: payload.type,
    });
  }

  private handleFocusChanged(payload: InternalSessionEventMap["internal:focus-changed"]): void {
    this.state.update(
      (snapshot) => ({
        ...snapshot,
        attention: payload.current,
        timestamps: {
          ...snapshot.timestamps,
          lastEventAt: payload.timestamp,
        },
      }),
      payload.timestamp,
    );

    if (this.state.getPhase() !== "running") {
      this.pendingFocusEvents.push(payload);
      return;
    }

    this.emitFocusEvent(payload);
  }

  private emitFocusEvent(payload: InternalSessionEventMap["internal:focus-changed"]): void {
    const snapshot = this.state.getSnapshot();

    if (payload.type === "window:blur") {
      this.emitPublicEvent("window:blur", {
        current: "unfocused",
        metadata: payload.metadata,
        previous: payload.previous,
        snapshot,
        source: "focus",
        timestamp: payload.timestamp,
        type: payload.type,
      });
      return;
    }

    this.emitPublicEvent("window:focus", {
      current: "focused",
      metadata: payload.metadata,
      previous: payload.previous,
      snapshot,
      source: "focus",
      timestamp: payload.timestamp,
      type: payload.type,
    });
  }

  private handleConnectivityChanged(
    payload: InternalSessionEventMap["internal:connectivity-changed"],
  ): void {
    this.state.update(
      (snapshot) => ({
        ...snapshot,
        connectivity: payload.current,
        timestamps: {
          ...snapshot.timestamps,
          lastEventAt: payload.timestamp,
        },
      }),
      payload.timestamp,
    );

    if (this.state.getPhase() !== "running") {
      this.pendingConnectivityEvents.push(payload);
      return;
    }

    this.emitConnectivityEvent(payload);
  }

  private emitConnectivityEvent(
    payload: InternalSessionEventMap["internal:connectivity-changed"],
  ): void {
    const snapshot = this.state.getSnapshot();

    if (payload.type === "connection:offline") {
      this.lastOfflineAt = payload.timestamp;
      this.emitPublicEvent("connection:offline", {
        current: "offline",
        metadata: payload.metadata,
        previous: payload.previous,
        snapshot,
        source: "connectivity",
        timestamp: payload.timestamp,
        type: payload.type,
      });
      return;
    }

    this.emitPublicEvent("connection:online", {
      current: "online",
      metadata: payload.metadata,
      previous: payload.previous,
      snapshot,
      source: "connectivity",
      timestamp: payload.timestamp,
      type: payload.type,
    });

    if (payload.previous === "offline" && this.lastOfflineAt !== undefined) {
      this.emitPublicEvent("connection:reconnect", {
        current: "online",
        metadata: {
          advisory: true,
          offlineDuration: payload.timestamp - this.lastOfflineAt,
        },
        previous: "offline",
        snapshot,
        source: "connectivity",
        timestamp: payload.timestamp,
        type: "connection:reconnect",
      });
      this.lastOfflineAt = undefined;
    }
  }

  private handleActivityDetected(
    payload: InternalSessionEventMap["internal:activity-detected"],
  ): void {
    if (this.state.getPhase() !== "running") {
      return;
    }

    const snapshot = this.state.getSnapshot();
    this.emitPublicEvent("activity:detected", {
      current: "active",
      metadata: payload.metadata,
      previous: snapshot.activity,
      snapshot,
      source: "activity",
      timestamp: payload.timestamp,
      type: payload.type,
    });
  }

  private handleActivityReset(payload: InternalSessionEventMap["internal:activity-reset"]): void {
    if (this.state.getPhase() !== "running") {
      return;
    }

    const snapshot = this.state.getSnapshot();
    this.emitPublicEvent("activity:reset", {
      current: "active",
      metadata: payload.metadata,
      previous: snapshot.activity,
      snapshot,
      source: "activity",
      timestamp: payload.timestamp,
      type: payload.type,
    });
  }

  private handleActivityChanged(
    payload: InternalSessionEventMap["internal:activity-changed"],
  ): void {
    this.state.update(
      (snapshot) => ({
        ...snapshot,
        activity: payload.current,
        timestamps: {
          ...snapshot.timestamps,
          lastEventAt: payload.timestamp,
        },
      }),
      payload.timestamp,
    );

    if (this.state.getPhase() !== "running") {
      this.pendingActivityEvents.push(payload);
      return;
    }

    this.emitActivityEvent(payload);
  }

  private emitActivityEvent(payload: InternalSessionEventMap["internal:activity-changed"]): void {
    const snapshot = this.state.getSnapshot();

    if (payload.type === "session:idle") {
      this.emitPublicEvent("session:idle", {
        current: "idle",
        metadata: payload.metadata,
        previous: payload.previous,
        snapshot,
        source: "activity",
        timestamp: payload.timestamp,
        type: payload.type,
      });
      return;
    }

    this.emitPublicEvent("session:active", {
      current: "active",
      metadata: payload.metadata,
      previous: payload.previous,
      snapshot,
      source: "activity",
      timestamp: payload.timestamp,
      type: payload.type,
    });
  }

  private handleLifecyclePageChanged(
    payload: InternalSessionEventMap["internal:lifecycle-changed"],
  ): void {
    this.state.update(
      (snapshot) => ({
        ...snapshot,
        lifecycle:
          payload.type === "page:suspend"
            ? payload.current
            : payload.type === "page:resume"
              ? "active"
              : snapshot.lifecycle,
        timestamps: {
          ...snapshot.timestamps,
          lastEventAt: payload.timestamp,
        },
      }),
      payload.timestamp,
    );

    if (this.state.getPhase() !== "running") {
      this.pendingLifecycleEvents.push(payload);
      return;
    }

    this.emitLifecyclePageEvent(payload);
  }

  private emitLifecyclePageEvent(
    payload: InternalSessionEventMap["internal:lifecycle-changed"],
  ): void {
    const snapshot = this.state.getSnapshot();

    if (payload.type === "page:suspend") {
      this.emitPublicEvent("page:suspend", {
        current: payload.current,
        metadata: payload.metadata,
        previous: payload.previous,
        snapshot,
        source: "lifecycle",
        timestamp: payload.timestamp,
        type: payload.type,
      });
      return;
    }

    if (payload.type === "session:restored") {
      this.emitPublicEvent("session:restored", {
        current: payload.current,
        metadata: payload.metadata,
        previous: payload.previous as BrowserLifecyclePhase,
        snapshot,
        source: "lifecycle",
        timestamp: payload.timestamp,
        type: payload.type,
      });
      return;
    }

    this.emitPublicEvent("page:resume", {
      current: payload.current,
      metadata: payload.metadata,
      previous: payload.previous,
      snapshot,
      source: "lifecycle",
      timestamp: payload.timestamp,
      type: payload.type,
    });
  }

  private handleCrossTabChanged(
    payload: InternalSessionEventMap["internal:cross-tab-changed"],
  ): void {
    this.state.update(
      (snapshot) => ({
        ...snapshot,
        tab: payload.current,
        timestamps: {
          ...snapshot.timestamps,
          lastEventAt: payload.timestamp,
        },
      }),
      payload.timestamp,
    );

    if (this.state.getPhase() !== "running") {
      this.pendingCrossTabEvents.push(payload);
      return;
    }

    this.emitCrossTabEvent(payload);
  }

  private emitCrossTabEvent(payload: InternalSessionEventMap["internal:cross-tab-changed"]): void {
    const snapshot = this.state.getSnapshot();

    if (payload.type === "tab:secondary") {
      this.emitPublicEvent("tab:secondary", {
        current: "secondary",
        metadata: payload.metadata,
        previous: payload.previous,
        snapshot,
        source: "transport",
        timestamp: payload.timestamp,
        type: payload.type,
      });
      return;
    }

    this.emitPublicEvent("tab:primary", {
      current: "primary",
      metadata: payload.metadata,
      previous: payload.previous,
      snapshot,
      source: "transport",
      timestamp: payload.timestamp,
      type: payload.type,
    });
  }

  private handleCrossTabMessage(
    payload: InternalSessionEventMap["internal:cross-tab-message"],
  ): void {
    if (this.state.getPhase() !== "running") {
      return;
    }

    const snapshot = this.state.getSnapshot();
    this.emitPublicEvent("tab:message", {
      current: "message",
      metadata: {
        messageType: payload.message.type,
        senderId: payload.message.senderId,
        ...(payload.message.value ? { value: payload.message.value } : {}),
      },
      previous: undefined,
      snapshot,
      source: "transport",
      timestamp: payload.timestamp,
      type: "tab:message",
    });
  }
}
