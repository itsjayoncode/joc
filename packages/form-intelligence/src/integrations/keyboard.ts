import type { FormInstance, FormPlugin } from "../types/index.js";

export interface KeyboardShortcut {
  readonly combo: string;
  readonly handler: (form: FormInstance<Record<string, unknown>>) => void;
}

function parseCombo(combo: string): { ctrl: boolean; meta: boolean; shift: boolean; key: string } {
  const parts = combo
    .toLowerCase()
    .split("+")
    .map((part) => part.trim());
  const key = parts[parts.length - 1] ?? "";
  return {
    ctrl: parts.includes("ctrl") || parts.includes("control"),
    meta: parts.includes("meta") || parts.includes("cmd"),
    shift: parts.includes("shift"),
    key,
  };
}

function matchesCombo(event: KeyboardEvent, combo: string): boolean {
  const parsed = parseCombo(combo);
  const eventKey = event.key.toLowerCase();
  const expectedKey = parsed.key === "enter" ? "enter" : parsed.key;

  return (
    eventKey === expectedKey &&
    event.ctrlKey === parsed.ctrl &&
    event.metaKey === parsed.meta &&
    event.shiftKey === parsed.shift
  );
}

export function createKeyboardPlugin(shortcuts: readonly KeyboardShortcut[]): FormPlugin {
  return {
    name: "keyboard",
    setup(form, _api) {
      const listener = (event: KeyboardEvent): void => {
        for (const shortcut of shortcuts) {
          if (!matchesCombo(event, shortcut.combo)) {
            continue;
          }

          event.preventDefault();
          shortcut.handler(form);
          return;
        }
      };

      if (typeof window !== "undefined") {
        window.addEventListener("keydown", listener);
      }

      return () => {
        if (typeof window !== "undefined") {
          window.removeEventListener("keydown", listener);
        }
      };
    },
  };
}

export const keyboard = {
  shortcut(
    combo: string,
    handler: (form: FormInstance<Record<string, unknown>>) => void,
  ): KeyboardShortcut {
    return {
      combo,
      handler,
    };
  },
};
