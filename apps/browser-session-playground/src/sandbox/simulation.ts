import type { SimulatedBrowserState } from "./types.js";

export type SimulationAction =
  "hide" | "show" | "blur" | "focus" | "offline" | "online" | "freeze" | "resume" | "reset";

export interface SimulationResult {
  readonly ok: boolean;
  readonly mode: "native" | "mock";
  readonly message: string;
  readonly simulated?: Partial<SimulatedBrowserState>;
}

/**
 * Attempt native browser event dispatch. Many visibility/focus APIs are read-only;
 * when mockSimulation is on, return overlay state for educational preview.
 */
export function runSimulation(action: SimulationAction, mockSimulation: boolean): SimulationResult {
  if (typeof window === "undefined") {
    return { ok: false, mode: "mock", message: "No window available." };
  }

  switch (action) {
    case "offline": {
      window.dispatchEvent(new Event("offline"));
      return mockSimulation
        ? {
            ok: true,
            mode: "mock",
            message: "Dispatched offline + mock overlay (navigator.onLine may stay true).",
            simulated: { connectivity: "offline" },
          }
        : {
            ok: true,
            mode: "native",
            message: "Dispatched window 'offline' event.",
          };
    }
    case "online": {
      window.dispatchEvent(new Event("online"));
      return mockSimulation
        ? {
            ok: true,
            mode: "mock",
            message: "Dispatched online + mock overlay.",
            simulated: { connectivity: "online" },
          }
        : { ok: true, mode: "native", message: "Dispatched window 'online' event." };
    }
    case "blur": {
      window.dispatchEvent(new Event("blur"));
      return mockSimulation
        ? {
            ok: true,
            mode: "mock",
            message: "Dispatched blur + mock unfocused overlay.",
            simulated: { attention: "unfocused" },
          }
        : { ok: true, mode: "native", message: "Dispatched window 'blur' event." };
    }
    case "focus": {
      window.dispatchEvent(new Event("focus"));
      window.focus();
      return mockSimulation
        ? {
            ok: true,
            mode: "mock",
            message: "Dispatched focus + mock focused overlay.",
            simulated: { attention: "focused" },
          }
        : { ok: true, mode: "native", message: "Dispatched window 'focus' event." };
    }
    case "hide": {
      document.dispatchEvent(new Event("visibilitychange"));
      return {
        ok: true,
        mode: mockSimulation ? "mock" : "native",
        message: mockSimulation
          ? "document.hidden is read-only — applied mock hidden overlay."
          : "Dispatched visibilitychange (document.hidden unchanged).",
        ...(mockSimulation ? { simulated: { visibility: "hidden" as const } } : {}),
      };
    }
    case "show": {
      document.dispatchEvent(new Event("visibilitychange"));
      return {
        ok: true,
        mode: mockSimulation ? "mock" : "native",
        message: mockSimulation
          ? "Applied mock visible overlay."
          : "Dispatched visibilitychange (document.hidden unchanged).",
        ...(mockSimulation ? { simulated: { visibility: "visible" as const } } : {}),
      };
    }
    case "freeze": {
      document.dispatchEvent(new Event("freeze"));
      return {
        ok: true,
        mode: mockSimulation ? "mock" : "native",
        message: mockSimulation
          ? "Dispatched freeze + mock frozen overlay."
          : "Dispatched document 'freeze' event.",
        ...(mockSimulation ? { simulated: { lifecycle: "frozen" as const } } : {}),
      };
    }
    case "resume": {
      document.dispatchEvent(new Event("resume"));
      return {
        ok: true,
        mode: mockSimulation ? "mock" : "native",
        message: mockSimulation
          ? "Dispatched resume + mock active overlay."
          : "Dispatched document 'resume' event.",
        ...(mockSimulation ? { simulated: { lifecycle: "active" as const } } : {}),
      };
    }
    case "reset":
      return {
        ok: true,
        mode: "mock",
        message: "Cleared simulated overlays.",
        simulated: {
          visibility: null,
          attention: null,
          connectivity: null,
          lifecycle: null,
        },
      };
    default:
      return { ok: false, mode: "mock", message: "Unknown simulation action." };
  }
}
