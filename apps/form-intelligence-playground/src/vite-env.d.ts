/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MODE: "development" | "production" | "test";
  readonly VITE_FORM_INTELLIGENT_VERSION: string;
  readonly VITE_FORM_INTELLIGENT_REACT_VERSION: string;
  readonly VITE_PLAYGROUND_VERSION: string;
  readonly VITE_PLAYGROUND_ENABLE_DEBUG_TOOLS?: string;
  readonly VITE_PLAYGROUND_SUPPORT_LABEL?: string;
  readonly VITE_PLAYGROUND_SUPPORT_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
