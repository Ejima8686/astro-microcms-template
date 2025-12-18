import { DEFAULT_LANG, i18nConfig, LANGUAGES, type Lang } from './config';

/**
 * ドットパスでオブジェクトの値を取得
 * @example get({ foo: { bar: 'baz' } }, 'foo.bar') // 'baz'
 */
export const get = (obj: unknown, path: string): unknown =>
  path.split('.').reduce<unknown>((acc, key) => {
    if (acc !== null && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);

export interface AstroContext {
  params: { lang?: string };
}

interface PathConfig<T extends Record<string, unknown> = Record<string, never>> {
  params?: T;
  props?: Record<string, unknown>;
}

/**
 * getStaticPaths用のパス生成
 * @param extend - 各言語のパスを拡張するコールバック（オプション）
 */
export const getLanguagePaths = <T extends Record<string, unknown> = Record<string, never>>(
  extend?: (lang: Lang) => PathConfig<T>,
) =>
  LANGUAGES.map((lang) => {
    const extended = extend?.(lang) ?? {};
    const useLangParam = lang !== DEFAULT_LANG || i18nConfig.prefixDefaultLang;
    return {
      params: {
        lang: useLangParam ? lang : undefined,
        ...extended.params,
      },
      ...(extended.props && { props: extended.props }),
    };
  });

/**
 * Astroコンテキストから言語を取得
 * @example getLang(Astro)
 */
export const getLang = (astro: AstroContext): Lang => {
  const paramLang = astro.params.lang;
  if (paramLang && LANGUAGES.includes(paramLang as Lang)) {
    return paramLang as Lang;
  }
  return DEFAULT_LANG;
};

/**
 * 言語プレフィックスを取得
 * デフォルト言語の場合は空文字列を返す
 */
export const getLangPrefix = (lang: Lang): string => {
  if (lang === DEFAULT_LANG && !i18nConfig.prefixDefaultLang) {
    return '';
  }
  return `/${lang}`;
};

/**
 * getStaticPaths用の言語パラメータを取得
 * デフォルト言語の場合はundefinedを返す（設定による）
 */
export const getLangParam = (lang: Lang): Lang | undefined => {
  if (lang === DEFAULT_LANG && !i18nConfig.prefixDefaultLang) {
    return undefined;
  }
  return lang;
};
