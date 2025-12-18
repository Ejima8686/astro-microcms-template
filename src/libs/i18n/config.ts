/**
 * i18n設定
 */
export const i18nConfig = {
  languages: ['ja', 'en'] as const,
  defaultLang: 'ja' as const,
  /** デフォルト言語のパスにプレフィックスを含めるか */
  prefixDefaultLang: false,
};

export const LANGUAGES = i18nConfig.languages;
export const DEFAULT_LANG = i18nConfig.defaultLang;

/** 言語の型定義 */
export type Lang = (typeof LANGUAGES)[number];

/** 多言語メッセージの型定義 */
export type Messages<T> = Record<Lang, T>;
