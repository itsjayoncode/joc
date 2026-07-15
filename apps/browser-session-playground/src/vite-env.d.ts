/// <reference types="vite/client" />

declare const __BROWSER_LIFECYCLE_VERSION__: string;
declare const __PLAYGROUND_VERSION__: string;

interface ImportMetaEnv {
  readonly MODE: "development" | "production" | "test";
  readonly VITE_PLAYGROUND_ENABLE_DEBUG_TOOLS?: string;
  readonly VITE_PLAYGROUND_SUPPORT_LABEL?: string;
  readonly VITE_PLAYGROUND_SUPPORT_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
