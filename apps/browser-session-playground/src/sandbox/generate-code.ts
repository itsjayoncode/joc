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

  const future = [
    config.modules.activity ? "activity" : null,
    config.modules.presence ? "presence" : null,
    config.modules.timeline ? "timeline" : null,
    config.modules.metrics ? "metrics" : null,
    config.modules.reports ? "reports" : null,
  ].filter(Boolean);

  const comments = [
    "// Visibility / Focus / Connectivity / Lifecycle observers run with the session.",
    alwaysOn.length > 0 ? `// Observed modules (always-on): ${alwaysOn.join(", ")}` : null,
    future.length > 0 ? `// Future modules (UI preview): ${future.join(", ")}` : null,
  ].filter(Boolean);

  return `import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";

${comments.join("\n")}
const browser = createBrowserLifecycle({
${indent(optionLines)}
});

browser.start();

const snapshot = browser.getSnapshot();
browser.subscribe((event, next) => {
  console.log(event.type, next);
});
`;
}
