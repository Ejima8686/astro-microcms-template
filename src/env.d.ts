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

// 投稿タイプ
declare type PostType = 'news';
declare type PageType = 'detail' | 'category' | 'pagination' | 'archive';

declare namespace App {
  interface Locals {
    pageType: PageType;
    postType: PostType;
    setTypes: (pageType: PageType, postType: PostType) => void;
  }
}

declare interface NewsCategory {
  id: string;
  name: string;
}

declare interface NewsPost {
  id: string;
  publishedAt: string;
  title: string;
  description?: string;
  content: string;
  category?: NewsCategory | null;
  thumbnail?: {
    url: string;
    width: number;
    height: number;
  };
}
