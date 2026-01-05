/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_MODE?: string;
    readonly VITE_API_KEY?: string;
    readonly GEMINI_API_KEY?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
