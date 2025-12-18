import type { Lang } from '@libs/i18n';
import enCategoriesData from './json/categories/en.json' with { type: 'json' };
import jaCategoriesData from './json/categories/ja.json' with { type: 'json' };
import enNewsData from './json/news/en.json' with { type: 'json' };
import jaNewsData from './json/news/ja.json' with { type: 'json' };

export interface Post {
  id: string;
  publishedAt: string;
  title: string;
  content: string;
  category?: {
    id: string;
    name: string;
  } | null;
}

export interface Category {
  id: string;
  name: string;
}

export const POSTS_PER_PAGE = 5;

const news: Record<Lang, Post[]> = {
  ja: jaNewsData as Post[],
  en: enNewsData as Post[],
};

const categories: Record<Lang, Category[]> = {
  ja: jaCategoriesData as Category[],
  en: enCategoriesData as Category[],
};

/**
 * 言語別の投稿一覧を取得
 * @param lang - 言語
 * @param sort - 最後ですソートするかどうか
 */
export const getNews = (lang: Lang, sort = true): Post[] => {
  if (sort) {
    return news[lang].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
  }
  return news[lang];
};

/**
 * idで投稿を取得
 */
export const getNewsById = (lang: Lang, id: string): Post | undefined =>
  news[lang].find((news) => news.id === id);

/**
 * 全言語の全投稿を取得（ページ生成用）
 */
export const getAllNews = (): { lang: Lang; news: Post }[] =>
  (Object.entries(news) as [Lang, Post[]][]).flatMap(([lang, langNews]) =>
    langNews.map((news) => ({ lang, news })),
  );

/**
 * カテゴリ一覧を取得
 */
export const getCategories = (lang: Lang): { name: string; id: string }[] => {
  return categories[lang].map((category) => ({ name: category.name, id: category.id }));
};

/**
 * 全言語の全カテゴリを取得(ページ生成用)
 */
export const getAllCategories = (): { lang: Lang; category: Category }[] =>
  (Object.entries(categories) as [Lang, Category[]][]).flatMap(([lang, langCategories]) =>
    langCategories.map((category) => ({ lang, category })),
  );

/**
 * カテゴリ別投稿を取得
 */
export const getNewsByCategory = (lang: Lang, category: string): Post[] =>
  news[lang].filter((post) => post.category?.id === category);
