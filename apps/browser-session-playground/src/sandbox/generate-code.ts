import type { SandboxConfig } from "./types.js";

function indent(lines: string[], spaces = 2): string {
  const pad = " ".repeat(spaces);
  return lines.map((line) => `${pad}${line}`).join("\n");
}

export function generateSandboxCode(config: SandboxConfig): string {
  const optionLines: string[] = [];

  optionLines.push(`autoStart: ${String(config.autoStart)},`);
  optionLines.push(`emitInitialState: ${String(config.emitInitialState)},`);
  optionLines.push(`debug: ${String(config.diagnostics.debug)},`);
  optionLines.push(`eventBufferSize: ${String(config.eventBufferSize)},`);

  if (config.modules.idle) {
    optionLines.push(`idleTimeout: ${String(config.idle.timeoutMs)},`);
    optionLines.push(`activityDebounce: ${String(config.idle.debounceMs)},`);
    if (config.idle.useDefaultEvents) {
      optionLines.push(`activityEvents: "default",`);
    }
  } else {
    optionLines.push("idleTimeout: false,");
  }

  if (config.modules.crossTab) {
    optionLines.push("crossTab: {");
    optionLines.push(`  channelName: ${JSON.stringify(config.crossTab.channelName)},`);
    optionLines.push(`  heartbeatInterval: ${String(config.crossTab.heartbeatInterval)},`);
    optionLines.push(`  leaderTimeout: ${String(config.crossTab.leaderTimeout)},`);
    optionLines.push("},");
  } else {
    optionLines.push("crossTab: false,");
  }

  if (config.loggerPlugin) {
    optionLines.push("// plugins: [loggerPlugin],");
  }

  const alwaysOn = [
    config.modules.visibility ? "visibility" : null,
    config.modules.focus ? "focus" : null,
    config.modules.connectivity ? "connectivity" : null,
    config.modules.lifecycle ? "lifecycle" : null,
  ].filter(Boolean);

  const imports = ["createBrowserLifecycle"];
  const factoryLines: string[] = [];

  if (config.modules.timeline) {
    imports.push("createTimelineApi");
    factoryLines.push("const timeline = createTimelineApi(lifecycle, { maxEvents: 80 });");
    factoryLines.push("// timeline.events() / timeline.format()");
  }
  if (config.modules.metrics) {
    imports.push("createMetricsApi");
    factoryLines.push("const metrics = createMetricsApi(lifecycle);");
    factoryLines.push("// metrics.attention().score / metrics.snapshot()");
  }

  const comments = [
    "// Observe: Visibility / Focus / Connectivity / Lifecycle run with the session.",
    alwaysOn.length > 0 ? `// Observed modules: ${alwaysOn.join(", ")}` : null,
    config.modules.timeline || config.modules.metrics
      ? "// Understand: factories below allocate only when created (zero-cost until you ask)."
      : null,
  ].filter(Boolean);

  const importLine =
    imports.length === 1
      ? `import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";`
      : `import {\n  ${imports.join(",\n  ")},\n} from "@jayoncode/browser-lifecycle";`;

  return `${importLine}

${comments.join("\n")}
const lifecycle = createBrowserLifecycle({
${indent(optionLines)}
});

lifecycle.start();
${factoryLines.length > 0 ? `\n${factoryLines.join("\n")}\n` : ""}
const snapshot = lifecycle.getSnapshot();
lifecycle.subscribe((event, next) => {
  console.log(event.type, next);
});
`;
}
