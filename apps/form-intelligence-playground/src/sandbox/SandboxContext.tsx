import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { buildSandboxForm, listSandboxFieldPaths, templateForCapability } from "./build-form.js";
import { copyTextToClipboard, decodeSandboxShareHash } from "./clipboard.js";
import { generateSandboxCode } from "./generate-code.js";
import { getSandboxTemplate } from "./templates.js";
import { DEFAULT_SANDBOX_CONFIG } from "./types.js";
import { FORM_INTELLIGENT_DOCS_URL } from "../lib/playground-links.js";

import type {
  InspectorTab,
  SandboxConfig,
  SandboxConsoleEntry,
  SandboxEventEntry,
  SandboxTemplateId,
} from "./types.js";
import type { FormInstance } from "../lib/form-intelligence.js";

interface SandboxContextValue {
  readonly config: SandboxConfig;
  readonly form: FormInstance<Record<string, unknown>>;
  readonly fieldPaths: readonly string[];
  readonly selectedPath: string | null;
  readonly inspectorTab: InspectorTab;
  readonly consoleEntries: readonly SandboxConsoleEntry[];
  readonly eventEntries: readonly SandboxEventEntry[];
  readonly generatedCode: string;
  readonly docsBase: string;
  setConfig: (patch: Partial<SandboxConfig>) => void;
  /** Replace config (used by New form). */
  replaceConfig: (next: SandboxConfig) => void;
  loadTemplate: (templateId: SandboxConfig["templateId"]) => void;
  resetForm: () => void;
  undo: () => void;
  redo: () => void;
  copyText: (value: string, label: string) => Promise<void>;
  selectField: (path: string | null) => void;
  setInspectorTab: (tab: InspectorTab) => void;
  clearConsole: () => void;
  clearEvents: () => void;
  exportConfig: () => string;
  importConfig: (raw: string) => void;
  populateSample: () => void;
  randomizeValues: () => void;
  generateInvalid: () => void;
  stressFields: (count: number) => void;
  clearStress: () => void;
}

const SandboxContext = createContext<SandboxContextValue | null>(null);

let consoleCounter = 0;
let eventCounter = 0;

const DOCS_BASE = FORM_INTELLIGENT_DOCS_URL.replace(/\/$/, "");

export function SandboxProvider({ children }: { readonly children: ReactNode }) {
  const [config, setConfigState] = useState<SandboxConfig>(() => {
    if (typeof window === "undefined") {
      return DEFAULT_SANDBOX_CONFIG;
    }
    const shared = decodeSandboxShareHash(window.location.hash);
    if (shared !== null && typeof shared === "object") {
      return { ...DEFAULT_SANDBOX_CONFIG, ...(shared as Partial<SandboxConfig>) };
    }
    return DEFAULT_SANDBOX_CONFIG;
  });
  const [selectedPath, setSelectedPath] = useState<string | null>("email");
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>("field");
  const [consoleEntries, setConsoleEntries] = useState<readonly SandboxConsoleEntry[]>([]);
  const [eventEntries, setEventEntries] = useState<readonly SandboxEventEntry[]>([]);
  const [form, setForm] = useState<FormInstance<Record<string, unknown>> | null>(null);
  const formRef = useRef<FormInstance<Record<string, unknown>> | null>(null);

  const pushConsole = useCallback(
    (message: string, level: SandboxConsoleEntry["level"] = "info") => {
      const entry: SandboxConsoleEntry = {
        id: `c-${String(++consoleCounter)}`,
        at: new Date().toLocaleTimeString(),
        level,
        message,
      };
      setConsoleEntries((current) => [entry, ...current].slice(0, 100));
    },
    [],
  );

  useEffect(() => {
    const next = buildSandboxForm(config, pushConsole);
    formRef.current = next;
    setForm(next);
    const paths = listSandboxFieldPaths(config);
    setSelectedPath((current) =>
      current && paths.includes(current) ? current : (paths[0] ?? null),
    );
    return () => {
      next.destroy();
      if (formRef.current === next) {
        formRef.current = null;
      }
    };
  }, [config, pushConsole]);

  useEffect(() => {
    const template = getSandboxTemplate(config.templateId);
    if (config.stressFieldCount === 0) {
      pushConsole(`Template ready: ${template.label}`, "success");
    }
  }, [config.templateId, config.stressFieldCount, pushConsole]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const shared = decodeSandboxShareHash(window.location.hash);
    if (shared !== null && typeof shared === "object") {
      pushConsole("Restored sandbox from share URL", "success");
    }
  }, [pushConsole]);

  useEffect(() => {
    if (!form) {
      return;
    }
    const events = [
      "change",
      "blur",
      "focus",
      "validate",
      "validated",
      "submit",
      "reset",
      "autosave",
      "draft",
    ] as const;
    const started = new Map<string, number>();
    const offs = events.map((eventName) =>
      form.on(eventName, () => {
        const now = performance.now();
        let durationMs: number | undefined;
        if (eventName === "validate") {
          started.set("validate", now);
        }
        if (eventName === "validated") {
          const begin = started.get("validate");
          if (begin !== undefined) {
            durationMs = Math.round(now - begin);
          }
        }
        const entry: SandboxEventEntry = {
          id: `e-${String(++eventCounter)}`,
          at: new Date().toLocaleTimeString(),
          event: eventName,
          ...(durationMs === undefined ? {} : { durationMs }),
        };
        setEventEntries((current) => [entry, ...current].slice(0, 120));
        pushConsole(
          `Event: ${eventName}${durationMs !== undefined ? ` (${String(durationMs)}ms)` : ""}`,
        );
      }),
    );
    return () => {
      for (const off of offs) {
        off();
      }
    };
  }, [form, pushConsole]);

  const setConfig = useCallback(
    (patch: Partial<SandboxConfig>) => {
      setConfigState((current) => {
        let next: SandboxConfig = { ...current, ...patch };

        if (patch.conditionalBusiness === true) {
          const fields = listSandboxFieldPaths({ ...next, stressFieldCount: 0 });
          if (!fields.includes("customerType")) {
            next = { ...next, templateId: templateForCapability("rules") };
            pushConsole("Switched to Employee template for business rules", "info");
          }
        }
        if (patch.calculations === true) {
          const fields = listSandboxFieldPaths({ ...next, stressFieldCount: 0 });
          if (!fields.includes("qty") && !fields.includes("subtotal")) {
            next = { ...next, templateId: templateForCapability("calculations") };
            pushConsole("Switched to Checkout template for calculations", "info");
          }
        }
        if (patch.wizard === true) {
          const fields = listSandboxFieldPaths(next);
          if (fields.length < 2) {
            next = { ...next, templateId: templateForCapability("wizard") };
            pushConsole("Switched to Booking template for wizard", "info");
          }
        }
        if (patch.formatters === true) {
          const fields = listSandboxFieldPaths({ ...next, stressFieldCount: 0 });
          if (!fields.includes("price") && !fields.includes("phone")) {
            next = { ...next, templateId: templateForCapability("formatters") };
            pushConsole("Switched to Checkout template for currency formatters", "info");
          }
        }
        if (patch.asyncUsername === true) {
          const fields = listSandboxFieldPaths(next);
          if (fields.includes("username")) {
            // register-style template — ready
          } else if (fields.includes("email")) {
            pushConsole("Async validation will run on email for this template", "info");
          } else {
            next = { ...next, templateId: templateForCapability("async") };
            pushConsole("Switched to Register template for async username", "info");
          }
        }
        return next;
      });
    },
    [pushConsole],
  );

  const replaceConfig = useCallback((next: SandboxConfig) => {
    setConfigState(next);
  }, []);

  const loadTemplate = useCallback(
    (templateId: SandboxTemplateId) => {
      setConfigState((current) => ({
        ...current,
        templateId,
        stressFieldCount: 0,
        conditionalBusiness: templateId === "employee" ? true : current.conditionalBusiness,
        calculations:
          templateId === "checkout" || templateId === "invoice" ? true : current.calculations,
        asyncUsername: templateId === "register" ? true : current.asyncUsername,
        wizard: templateId === "booking" ? true : current.wizard,
        formatters: templateId === "checkout" ? true : current.formatters,
      }));
      pushConsole(`Loaded template: ${templateId}`, "success");
    },
    [pushConsole],
  );

  const activeForm = form;

  const resetForm = useCallback(() => {
    activeForm?.reset();
    pushConsole("Form reset", "warn");
  }, [activeForm, pushConsole]);

  const undo = useCallback(() => {
    if (!activeForm || !config.undoRedo) {
      pushConsole("History is disabled", "warn");
      return;
    }
    const ok = activeForm.undo();
    pushConsole(ok ? "Undo applied" : "Nothing to undo", ok ? "success" : "warn");
  }, [activeForm, config.undoRedo, pushConsole]);

  const redo = useCallback(() => {
    if (!activeForm || !config.undoRedo) {
      pushConsole("History is disabled", "warn");
      return;
    }
    const ok = activeForm.redo();
    pushConsole(ok ? "Redo applied" : "Nothing to redo", ok ? "success" : "warn");
  }, [activeForm, config.undoRedo, pushConsole]);

  const copyText = useCallback(
    async (value: string, label: string) => {
      const ok = await copyTextToClipboard(value);
      if (ok) {
        pushConsole(`Copied ${label}`, "success");
        return;
      }
      window.prompt(`Copy ${label}:`, value);
      pushConsole(`Clipboard blocked — showed ${label} in prompt`, "warn");
    },
    [pushConsole],
  );

  const exportConfig = useCallback(() => JSON.stringify(config, null, 2), [config]);

  const importConfig = useCallback(
    (raw: string) => {
      try {
        const parsed = JSON.parse(raw) as Partial<SandboxConfig>;
        setConfigState((current) => ({ ...current, ...parsed }));
        pushConsole("Config imported", "success");
      } catch {
        pushConsole("Import failed: invalid JSON", "error");
      }
    },
    [pushConsole],
  );

  const populateSample = useCallback(() => {
    if (!activeForm) {
      return;
    }
    const template = getSandboxTemplate(config.templateId);
    for (const path of listSandboxFieldPaths(config)) {
      const meta = template.fieldMeta[path];
      if (path.startsWith("field_")) {
        activeForm.setValue(path, `value-${path}`);
        continue;
      }
      if (path === "email") {
        activeForm.setValue(path, "dev@jayoncode.dev");
      } else if (path === "password" || path === "confirmPassword") {
        activeForm.setValue(path, "Password1!");
      } else if (path === "username") {
        activeForm.setValue(path, "jayoncode");
      } else if (meta?.type === "number") {
        activeForm.setValue(path, 2);
      } else if (meta?.type === "select" && meta.options?.[0]) {
        activeForm.setValue(path, meta.options[0].value);
      } else if (meta?.type === "textarea") {
        activeForm.setValue(path, "Sample notes from the sandbox.");
      } else {
        activeForm.setValue(path, `Sample ${meta?.label ?? path}`);
      }
    }
    pushConsole("Populated sample data", "success");
  }, [activeForm, config, pushConsole]);

  const randomizeValues = useCallback(() => {
    if (!activeForm) {
      return;
    }
    const template = getSandboxTemplate(config.templateId);
    for (const path of listSandboxFieldPaths(config)) {
      const meta = template.fieldMeta[path];
      if (meta?.type === "number" || path === "guests" || path === "qty") {
        activeForm.setValue(path, Math.floor(Math.random() * 20) + 1);
      } else if (meta?.type === "email" || path === "email") {
        activeForm.setValue(path, `user${String(Math.floor(Math.random() * 999))}@example.com`);
      } else if (meta?.type === "select" && meta.options?.length) {
        const pick = meta.options[Math.floor(Math.random() * meta.options.length)];
        activeForm.setValue(path, pick?.value ?? "");
      } else {
        activeForm.setValue(path, `${path}-${String(Math.floor(Math.random() * 1000))}`);
      }
    }
    pushConsole("Randomized values", "info");
  }, [activeForm, config, pushConsole]);

  const generateInvalid = useCallback(() => {
    if (!activeForm) {
      return;
    }
    for (const path of listSandboxFieldPaths(config)) {
      if (path === "email") {
        activeForm.setValue(path, "not-an-email");
      } else if (path === "password") {
        activeForm.setValue(path, "short");
      } else if (path === "confirmPassword") {
        activeForm.setValue(path, "mismatch");
      } else if (path === "username") {
        activeForm.setValue(path, "taken");
      } else {
        activeForm.setValue(path, "");
      }
    }
    void activeForm.validate();
    pushConsole("Generated invalid data + validate()", "warn");
  }, [activeForm, config, pushConsole]);

  const stressFields = useCallback(
    (count: number) => {
      setConfigState((current) => ({ ...current, stressFieldCount: count }));
      pushConsole(`Generating ${String(count)} fields…`, "warn");
    },
    [pushConsole],
  );

  const clearStress = useCallback(() => {
    setConfigState((current) => ({ ...current, stressFieldCount: 0 }));
    pushConsole("Cleared stress fields — restored template", "info");
  }, [pushConsole]);

  const fieldPaths = useMemo(() => listSandboxFieldPaths(config), [config]);

  const value = useMemo<SandboxContextValue | null>(() => {
    if (!activeForm) {
      return null;
    }
    return {
      config,
      form: activeForm,
      fieldPaths,
      selectedPath,
      inspectorTab,
      consoleEntries,
      eventEntries,
      generatedCode: generateSandboxCode(config),
      docsBase: DOCS_BASE,
      setConfig,
      replaceConfig,
      loadTemplate,
      resetForm,
      undo,
      redo,
      copyText,
      selectField: setSelectedPath,
      setInspectorTab,
      clearConsole: () => {
        setConsoleEntries([]);
      },
      clearEvents: () => {
        setEventEntries([]);
      },
      exportConfig,
      importConfig,
      populateSample,
      randomizeValues,
      generateInvalid,
      stressFields,
      clearStress,
    };
  }, [
    activeForm,
    config,
    fieldPaths,
    selectedPath,
    inspectorTab,
    consoleEntries,
    eventEntries,
    setConfig,
    replaceConfig,
    loadTemplate,
    resetForm,
    undo,
    redo,
    copyText,
    exportConfig,
    importConfig,
    populateSample,
    randomizeValues,
    generateInvalid,
    stressFields,
    clearStress,
  ]);

  if (!value) {
    return <div style={{ padding: "1rem" }}>Bootstrapping sandbox…</div>;
  }

  return <SandboxContext.Provider value={value}>{children}</SandboxContext.Provider>;
}

export function useSandbox(): SandboxContextValue {
  const value = useContext(SandboxContext);
  if (!value) {
    throw new Error("useSandbox must be used within SandboxProvider");
  }
  return value;
}
