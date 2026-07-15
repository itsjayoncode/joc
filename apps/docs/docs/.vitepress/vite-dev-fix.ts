import path from "node:path";
import { fileURLToPath } from "node:url";

import * as compiler from "vue/compiler-sfc";

import type { Plugin, ResolvedConfig, ViteDevServer } from "vite";

const vitepressDir = path.dirname(fileURLToPath(import.meta.url));
const publicAssetsDir = path.resolve(vitepressDir, "..", "public");

type VuePluginApi = {
  api?: {
    options: {
      compiler?: typeof compiler;
    };
  };
};

function patchVueCompiler(config: Pick<ResolvedConfig, "plugins">) {
  const vuePlugin = config.plugins.find((plugin: Plugin) => plugin.name === "vite:vue") as
    VuePluginApi | undefined;

  const options = vuePlugin?.api?.options;
  if (options && !options.compiler) {
    options.compiler = compiler;
  }
}

/** Avoid vue-plugin HMR races when public assets or sync output change during `docs:dev`. */
export function createDocsVitePlugins(): Plugin[] {
  return [
    {
      name: "joc-docs-vue-compiler-eager",
      configResolved(config: ResolvedConfig) {
        patchVueCompiler(config);
      },
      configureServer(server: ViteDevServer) {
        patchVueCompiler(server.config);
      },
    },
  ];
}

export const docsPublicAssetsDir = publicAssetsDir;
