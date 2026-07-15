import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type {
  BrowserLifecycle,
  BrowserLifecycleConfig,
  ResolvedBrowserLifecycleConfig,
} from "@jayoncode/browser-lifecycle";
import { createBrowserLifecycleConfig } from "@jayoncode/browser-lifecycle";

import {
  BUILTIN_CONFIGURATION_PRESETS,
  buildPendingConfigurationInput,
  computeConfigurationDiff,
  createConfigurationPlaygroundSession,
  exportConfigurationBundle,
  getConfigurationFieldRows,
  getDefaultConfiguration,
  parseImportedConfiguration,
  readCustomPresets,
  resolvePresetConfig,
  serializeConfiguration,
  toConfigurationInput,
  validatePlaygroundConfiguration,
  writeCustomPresets,
  type ConfigurationPresetId,
  type CustomConfigurationPreset,
} from "../../lib/playground-configuration.js";

export function useConfigurationPlayground() {
  const lifecycleRef = useRef<BrowserLifecycle | null>(null);
  const [appliedConfig, setAppliedConfig] =
    useState<ResolvedBrowserLifecycleConfig>(getDefaultConfiguration());
  const [pendingConfig, setPendingConfig] = useState<BrowserLifecycleConfig>({});
  const [customPresets, setCustomPresets] =
    useState<CustomConfigurationPreset[]>(readCustomPresets());
  const [importPreview, setImportPreview] = useState<BrowserLifecycleConfig | undefined>();
  const [importError, setImportError] = useState<string | undefined>();
  const [isRunning, setIsRunning] = useState(false);
  const [lastAppliedAt, setLastAppliedAt] = useState<number | undefined>();

  const defaults = useMemo(() => getDefaultConfiguration(), []);

  const validation = useMemo(
    () =>
      validatePlaygroundConfiguration(buildPendingConfigurationInput(appliedConfig, pendingConfig)),
    [appliedConfig, pendingConfig],
  );

  const pendingResolved = useMemo(() => {
    if (!validation.valid) {
      return appliedConfig;
    }
    try {
      return createBrowserLifecycleConfig(
        buildPendingConfigurationInput(appliedConfig, pendingConfig),
      );
    } catch {
      return appliedConfig;
    }
  }, [appliedConfig, pendingConfig, validation.valid]);

  const diffFromApplied = useMemo(
    () => computeConfigurationDiff(appliedConfig, pendingResolved),
    [appliedConfig, pendingResolved],
  );

  const diffFromDefault = useMemo(
    () => computeConfigurationDiff(defaults, pendingResolved),
    [defaults, pendingResolved],
  );

  const fieldRows = useMemo(
    () => getConfigurationFieldRows(appliedConfig, pendingConfig, defaults),
    [appliedConfig, defaults, pendingConfig],
  );

  const restartSession = useCallback((config: BrowserLifecycleConfig): void => {
    lifecycleRef.current?.dispose();
    const { lifecycle, resolved } = createConfigurationPlaygroundSession(config);
    lifecycleRef.current = lifecycle;
    lifecycle.start();
    setAppliedConfig(resolved);
    setIsRunning(lifecycle.isRunning());
    setLastAppliedAt(Date.now());
  }, []);

  useEffect(() => {
    restartSession({});
    return () => {
      lifecycleRef.current?.dispose();
      lifecycleRef.current = null;
    };
  }, [restartSession]);

  const applyChanges = (): void => {
    if (!validation.valid) {
      return;
    }
    const merged = buildPendingConfigurationInput(appliedConfig, pendingConfig);
    restartSession(merged);
    setPendingConfig({});
    setImportPreview(undefined);
    setImportError(undefined);
  };

  return {
    applyChanges,
    appliedConfig,
    builtinPresets: BUILTIN_CONFIGURATION_PRESETS,
    customPresets,
    defaults,
    diffFromApplied,
    diffFromDefault,
    discardChanges: () => {
      setPendingConfig({});
      setImportPreview(undefined);
      setImportError(undefined);
    },
    exportApplied: () => exportConfigurationBundle(appliedConfig, "applied"),
    exportDefaults: () => exportConfigurationBundle(defaults, "defaults"),
    exportPending: () => {
      try {
        return serializeConfiguration(buildPendingConfigurationInput(appliedConfig, pendingConfig));
      } catch {
        return serializeConfiguration(toConfigurationInput(appliedConfig));
      }
    },
    fieldRows,
    importError,
    importPreview,
    isRunning,
    lastAppliedAt,
    loadPreset: (presetId: ConfigurationPresetId) => {
      setPendingConfig(resolvePresetConfig(presetId));
      setImportPreview(undefined);
      setImportError(undefined);
    },
    loadCustomPreset: (presetId: string) => {
      const preset = customPresets.find((entry) => entry.id === presetId);
      if (!preset) {
        return;
      }
      setPendingConfig(preset.config);
    },
    parseImport: (raw: string) => {
      const result = parseImportedConfiguration(raw);
      setImportError(result.error);
      setImportPreview(result.config);
      return result;
    },
    pendingConfig,
    pendingResolved,
    restartSession: () => {
      restartSession(buildPendingConfigurationInput(appliedConfig, pendingConfig));
      setPendingConfig({});
    },
    saveCustomPreset: (label: string, description: string) => {
      const preset: CustomConfigurationPreset = {
        config: buildPendingConfigurationInput(appliedConfig, pendingConfig),
        description,
        id: `custom-${String(Date.now())}`,
        label,
        savedAt: Date.now(),
      };
      const next = [preset, ...customPresets].slice(0, 20);
      setCustomPresets(next);
      writeCustomPresets(next);
    },
    setPendingValue: (key: keyof BrowserLifecycleConfig, value: unknown) => {
      setPendingConfig((current) => ({
        ...current,
        [key]: value,
      }));
    },
    updatePendingJson: (raw: string) => {
      const result = parseImportedConfiguration(raw);
      if (result.config) {
        setPendingConfig(result.config);
        setImportError(undefined);
        setImportPreview(result.config);
      } else {
        setImportError(result.error);
      }
    },
    validation,
  };
}
