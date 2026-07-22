import {
  createLocalStorageAdapter,
  createMemoryAdapter,
  createSessionStorageAdapter,
  createStorage,
} from "@jayoncode/storage";

export function getStorageIntegrationSummary() {
  return {
    packageName: "@jayoncode/storage",
    entryPoint: "src/lib/storage.ts",
    capabilities: [
      "createStorage",
      "adapters",
      "ttl",
      "policies",
      "migrate",
      "maintenance",
      "snapshots",
      "observable",
      "diagnostics",
      "transactions",
      "async",
      "cross-tab",
    ],
  };
}

export {
  createLocalStorageAdapter,
  createMemoryAdapter,
  createSessionStorageAdapter,
  createStorage,
};
