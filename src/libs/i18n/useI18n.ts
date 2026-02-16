import { commonMessages } from './common.i18n';
import { type Lang, type Messages } from './config';
import { get, getLang, getLangPrefix, type AstroContext } from './helpers';

/**
 * 翻訳関数を生成
 * 第二引数があるなら、文字列内の `%key%` を第二引数のプレースホルダーで置換する
 */
const PLACEHOLDER_PATTERN = /%([^%]+)%/g;
const createT = <T extends Record<string, unknown>>(lang: Lang, localMessages: Messages<T>) => {
  const merged = {
    common: commonMessages[lang],
    ...localMessages[lang],
  };

  function t(path: string, placeholders?: Record<string, string>) {
    const value = get(merged, path);

    if (typeof value !== 'string') {
      console.warn(`[i18n] Missing translation: ${path}`);
      return path;
    }

    if (!placeholders) {
      return value;
    }

    // "%key%" にマッチさせて、placeholders[key] で置換
    return value.replace(PLACEHOLDER_PATTERN, (match, key) => {
      const replacement = placeholders[key];
      return replacement ?? match;
    });
  }

  return t;
};

/**
 * i18nユーティリティを一括取得
 * @param astro - Astroグローバルオブジェクト
 * @param messages - ページ/コンポーネント固有のメッセージ
 */
export const useI18n = <T extends Record<string, unknown>>(
  astro: AstroContext,
  messages?: Messages<T>,
) => {
  const lang = getLang(astro);
  const langPrefix = getLangPrefix(lang);
  let t: ReturnType<typeof createT<T>>;
  if (messages) {
    t = createT(lang, messages);
  } else {
    t = createT(lang, { ja: {}, en: {} });
  }

  /**
   * 言語プレフィックス付きパスを生成
   * @example localePath('/about') // → '/about' (ja) or '/en/about' (en)
   */
  const localePath = (pathname: string): string => {
    const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
    return `${langPrefix}${normalized}`;
  };

  return { lang, langPrefix, t, localePath };
};
