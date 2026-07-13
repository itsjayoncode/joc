/* v8 ignore next */
import { ModuleRegistry } from "./module-registry.js";
import { createSessionContext } from "./session-context.js";
import { SessionStateStore } from "./session-state.js";
import { detectBrowserLifecycleCapabilities } from "../../browser/features/index.js";
import {
  InitializationError,
  LifecycleError,
  PluginError,
} from "../../errors/index.js";
import { TypedEventEmitter } from "../../events/index.js";
import {
  createBrowserLifecycleConfig,
  getPluginIds,
} from "../config/index.js";

import type {
  BrowserLifecycle,
  BrowserLifecycleEventListener,
  BrowserLifecycleEventMap,
  BrowserLifecycleEventName,
  BrowserLifecycleSessionOptions,
  BrowserLifecycleSnapshot,
  BrowserLifecycleSubscriber,
  InternalSessionEventMap,
  SessionContext,
  SessionModule,
} from "./types.js";
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
  { name: "connection:online", public: true },
  { name: "connection:offline", public: true },
  { name: "page:suspend", public: true },
  { name: "page:resume", public: true },
  { name: "session:restored", public: true },
  { name: "tab:primary", public: true },
  { name: "tab:secondary", public: true },
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
  private initialized = false;
  private readonly plugins = new Map<string, BrowserLifecyclePlugin>();

  public constructor(
    config: BrowserLifecycleConfig = {},
    options: BrowserLifecycleSessionOptions = {},
  ) {
    this.timeProvider = options.timeProvider ?? Date.now;
    this.resolvedConfig = createBrowserLifecycleConfig(config);
    this.capabilities =
      options.capabilities ?? detectBrowserLifecycleCapabilities();
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

    for (const plugin of this.resolvedConfig.plugins) {
      this.plugins.set(plugin.id, plugin);
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

    if (this.plugins.has(plugin.id)) {
      throw new PluginError(`A plugin with id "${plugin.id}" is already registered.`);
    }

    this.plugins.set(plugin.id, plugin);
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
    return getPluginIds({
      ...this.resolvedConfig,
      plugins: [...this.plugins.values()],
    });
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
  }

  private ensureActiveForListeners(): void {
    if (this.state.getPhase() === "disposed") {
      throw new LifecycleError("Cannot interact with listeners on a disposed BrowserLifecycle instance.");
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
        this.initialized = true;
      }

      this.modules.startAll(this.context);
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
  }
}
