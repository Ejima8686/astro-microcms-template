/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="../.astro/types.d.ts" />
/// <reference path="../.astro/icon.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly VITE_USE_DUMMY_DATA?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface DetailCategory {
  id: string;
  name: string;
}

interface DetailPost {
  id: string;
  publishedAt: string;
  title: string;
  description?: string;
  content: string;
  category?: DetailCategory | null;
  thumbnail?: {
    url: string;
    width: number;
    height: number;
  };
}
