import { describe, expect, it } from "vitest";

import { BrowserLifecycleSession } from "../../src/core/session/index.js";
import {
  createBrowserLifecycle,
  LifecycleError,
  PluginError,
} from "../../src/index.js";

import type {
  BrowserLifecycleEventListener,
  BrowserLifecycleEventMap,
  BrowserLifecycleEventName,
  BrowserLifecycleSubscriber,
} from "../../src/index.js";

describe("BrowserLifecycleSession", () => {
  it("creates a session in the created phase when autoStart is disabled", () => {
    const session = createBrowserLifecycle({
      autoStart: false,
    });

    expect(session.isRunning()).toBe(false);
    expect(session.getSnapshot().phase).toBe("created");
    expect(session.getCapabilities()).toEqual(session.getSnapshot().capabilities);
  });

  it("auto-starts when autoStart is enabled", () => {
    const session = createBrowserLifecycle({
      autoStart: true,
    });

    expect(session.isRunning()).toBe(true);
    expect(session.getSnapshot().phase).toBe("running");
  });

  it("starts stops and disposes with event integration", () => {
    const session = createBrowserLifecycle({
      autoStart: false,
    });
    const namedEvents: string[] = [];
    const feedEvents: string[] = [];
    let onceListenerCallCount = 0;
    const startListener = (event: Readonly<BrowserLifecycleEventMap["session:started"]>): void => {
      namedEvents.push(`${event.type}:${event.current}:${event.previous}`);
      expect(session.getSnapshot().phase).toBe("running");
    };
    const stopListener = (event: Readonly<BrowserLifecycleEventMap["session:stopped"]>): void => {
      namedEvents.push(`${event.type}:${event.current}:${event.previous}`);
    };
    const feedListener: BrowserLifecycleSubscriber = (event, snapshot) => {
      feedEvents.push(`${event.type}:${snapshot.phase}`);
    };
    const unsubscribeFeed = session.subscribe(feedListener);

    session.on("session:started", startListener);
    session.once("session:started", () => {
      onceListenerCallCount += 1;
    });
    session.on("session:stopped", stopListener);

    session.start();
    session.stop();
    unsubscribeFeed();
    session.dispose();

    expect(onceListenerCallCount).toBe(1);
    expect(namedEvents).toEqual([
      "session:started:running:created",
      "session:stopped:stopped:running",
    ]);
    expect(feedEvents).toEqual([
      "session:started:running",
      "session:stopped:stopped",
    ]);
    expect(session.getSnapshot().phase).toBe("disposed");
  });

  it("treats repeated start stop and dispose operations predictably", () => {
    const session = createBrowserLifecycle({
      autoStart: false,
    });

    session.start();
    session.start();
    expect(session.getSnapshot().phase).toBe("running");

    session.stop();
    session.stop();
    expect(session.getSnapshot().phase).toBe("stopped");

    session.dispose();
    session.dispose();
    expect(session.getSnapshot().phase).toBe("disposed");
  });

  it("rejects invalid lifecycle operations after dispose", () => {
    const session = createBrowserLifecycle({
      autoStart: false,
    });

    session.dispose();

    expect(() => {
      session.start();
    }).toThrow(LifecycleError);
    expect(() => {
      session.subscribe(() => undefined);
    }).toThrow(LifecycleError);
    expect(() => {
      session.on("session:started", () => undefined);
    }).toThrow(LifecycleError);
    expect(() => {
      session.once("session:started", () => undefined);
    }).toThrow(LifecycleError);
    expect(() => {
      session.use({
        id: "plugin",
      });
    }).toThrow(LifecycleError);
    expect(() => {
      session.stop();
    }).toThrow(LifecycleError);
  });

  it("supports module registration ordering and state updates without browser logic", () => {
    const session = new BrowserLifecycleSession(
      {
        autoStart: false,
      },
      {
        capabilities: {
          abortController: true,
          broadcastChannel: false,
          pageLifecycle: false,
          requestIdleCallback: false,
          visibility: true,
        },
        timeProvider: (() => {
          let current = 100;
          return () => {
            current += 100;
            return current;
          };
        })(),
      },
    );
    const calls: string[] = [];

    session.registerModule({
      id: "visibility",
      order: 5,
      destroy: () => {
        calls.push("visibility:destroy");
      },
      initialize: () => {
        calls.push("visibility:init");
      },
      start: (context) => {
        calls.push("visibility:start");
        context.updateSnapshot((current) => ({
          ...current,
          visibility: "visible",
          timestamps: {
            ...current.timestamps,
            lastEventAt: 350,
          },
        }));
      },
      stop: () => {
        calls.push("visibility:stop");
      },
    });
    session.registerModule({
      id: "attention",
      order: 1,
      destroy: () => {
        calls.push("attention:destroy");
      },
      initialize: () => {
        calls.push("attention:init");
      },
      start: () => {
        calls.push("attention:start");
      },
      stop: () => {
        calls.push("attention:stop");
      },
    });

    session.start();
    expect(session.getSnapshot().visibility).toBe("visible");
    expect(session.moduleCount()).toBe(2);

    expect(session.unregisterModule("attention")).toBe(true);
    expect(session.unregisterModule("attention")).toBe(false);

    session.stop();
    session.dispose();

    expect(calls).toEqual([
      "attention:init",
      "visibility:init",
      "attention:start",
      "visibility:start",
      "attention:stop",
      "attention:destroy",
      "visibility:stop",
      "visibility:destroy",
    ]);
  });

  it("supports plugin metadata registration before startup only", () => {
    const session = new BrowserLifecycleSession({
      autoStart: false,
    });

    session.use({
      id: "analytics",
    });

    expect(session.getPluginIds()).toEqual(["analytics"]);
    expect(() => {
      session.use({
        id: "analytics",
      });
    }).toThrow(PluginError);

    session.start();

    expect(() => {
      session.use({
        id: "late-plugin",
      });
    }).toThrow(PluginError);
  });

  it("wraps module startup failures as initialization errors", () => {
    const session = new BrowserLifecycleSession({
      autoStart: false,
    });

    session.registerModule({
      id: "broken",
      start: () => {
        throw new Error("boom");
      },
    });

    expect(() => {
      session.start();
    }).toThrow("Failed to start BrowserLifecycle.");
  });

  it("supports manual listener cleanup and rejects unknown public event names", () => {
    const session = createBrowserLifecycle({
      autoStart: false,
    });
    let callCount = 0;
    const listener = (_event: Readonly<BrowserLifecycleEventMap["session:started"]>): void => {
      callCount += 1;
    };
    const unsubscribe = session.on("session:started", listener);
    const unsubscribeOnce = session.once("session:started", () => {
      callCount += 10;
    });
    const unsubscribeFeed = session.subscribe(() => {
      callCount += 100;
    });

    session.off("session:started", listener);
    unsubscribe();
    unsubscribeOnce();
    unsubscribeFeed();
    session.start();

    expect(callCount).toBe(0);

    const invalidEvent = "session:unknown" as unknown as BrowserLifecycleEventName;
    const invalidListener =
      (() => undefined) as unknown as BrowserLifecycleEventListener<BrowserLifecycleEventName>;

    expect(() => {
      session.on(invalidEvent, invalidListener);
    }).toThrow(LifecycleError);

    const disposedListener = (_event: Readonly<BrowserLifecycleEventMap["session:started"]>): void => {
      callCount += 1;
    };

    session.dispose();

    expect(() => {
      session.off("session:started", disposedListener);
    }).not.toThrow();
  });

  it("exposes session context and handles late module registration after initialization", () => {
    const runningSession = new BrowserLifecycleSession({
      autoStart: false,
      plugins: [{ id: "from-config" }],
    });
    const runningCalls: string[] = [];

    expect(runningSession.getContext().configuration.autoStart).toBe(false);
    expect(runningSession.getContext().getSnapshot().phase).toBe("created");

    runningSession.use({
      id: "runtime-plugin",
    });
    expect(runningSession.getPluginIds()).toEqual(["from-config", "runtime-plugin"]);

    runningSession.start();
    runningSession.registerModule({
      id: "late-running",
      initialize: () => {
        runningCalls.push("initialize");
      },
      start: () => {
        runningCalls.push("start");
      },
    });
    expect(runningCalls).toEqual(["initialize", "start"]);
    expect(runningSession.unregisterModule("missing")).toBe(false);
    runningSession.dispose();
    expect(runningSession.unregisterModule("late-running")).toBe(false);
    expect(() => {
      runningSession.registerModule({
        id: "after-dispose",
      });
    }).toThrow(LifecycleError);

    const stoppedSession = new BrowserLifecycleSession({
      autoStart: false,
    });
    const stoppedCalls: string[] = [];

    stoppedSession.start();
    stoppedSession.stop();
    stoppedSession.registerModule({
      id: "late-stopped",
      initialize: () => {
        stoppedCalls.push("initialize");
      },
      start: () => {
        stoppedCalls.push("start");
      },
    });

    expect(stoppedCalls).toEqual(["initialize"]);

    stoppedSession.start();
    expect(stoppedCalls).toEqual(["initialize", "start"]);
  });

  it("emits session:stopped with a dispose reason during running teardown", () => {
    const session = createBrowserLifecycle({
      autoStart: false,
    });
    const reasons: Array<NonNullable<BrowserLifecycleEventMap["session:stopped"]["metadata"]>["reason"]> =
      [];

    session.on("session:stopped", (event) => {
      if (event.metadata) {
        reasons.push(event.metadata.reason);
      }
    });

    session.start();
    session.dispose();

    expect(reasons).toEqual(["dispose"]);
    expect(session.getSnapshot().phase).toBe("disposed");
  });
});
