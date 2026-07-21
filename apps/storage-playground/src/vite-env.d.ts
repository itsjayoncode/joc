/// <reference types="vite/client" />

declare const __STORAGE_VERSION__: string;
declare const __PLAYGROUND_VERSION__: string;

interface ImportMetaEnv {
  readonly MODE: "development" | "production" | "test";
  readonly VITE_PLAYGROUND_ENABLE_DEBUG_TOOLS?: string;
  readonly VITE_PLAYGROUND_SUPPORT_LABEL?: string;
  readonly VITE_PLAYGROUND_SUPPORT_URL?: string;
  readonly VITE_STORAGE_DOCS_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
