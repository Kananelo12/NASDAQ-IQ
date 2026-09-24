/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Backend origin in production, e.g. https://nasdaq-intelligence-api.onrender.com.
  // Leave unset in dev to use the Vite proxy.
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
