/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_SIMULATION_INTERVAL_MS?: string;
  readonly VITE_DEFAULT_TIME_RANGE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

