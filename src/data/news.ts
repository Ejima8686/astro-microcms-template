import { useDummyData } from '@libs/env';
import type { Lang } from '@libs/i18n';
import categoriesDataDummy from './dummy-json/news/categories.json' with { type: 'json' };
import enNewsDataDummy from './dummy-json/news/en.json' with { type: 'json' };
import jaNewsDataDummy from './dummy-json/news/ja.json' with { type: 'json' };
import categoriesData from './json/news/categories.json' with { type: 'json' };
import enNewsData from './json/news/en.json' with { type: 'json' };
import jaNewsData from './json/news/ja.json' with { type: 'json' };

export type Post = DetailPost;
export type Category = DetailCategory;

export const POSTS_PER_PAGE = 5;

const isDummyMode = useDummyData();

const news: Record<Lang, Post[]> = {
  ja: (isDummyMode ? jaNewsDataDummy : jaNewsData) as Post[],
  en: (isDummyMode ? enNewsDataDummy : enNewsData) as Post[],
};

const categories: Record<Lang, Category[]> = {
  ja: (isDummyMode ? categoriesDataDummy : categoriesData) as Category[],
  en: (isDummyMode ? categoriesDataDummy : categoriesData) as Category[],
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
 * 記事に使われているカテゴリ一覧を取得
 */
export const getCategoriesByNews = (lang: Lang): Category[] => {
  const newsPosts = getNews(lang);
  if (!newsPosts) return [];

  const categoryMap = new Map<string, Category>();

  newsPosts.forEach((post) => {
    if (post.category) {
      categoryMap.set(post.category.id, {
        id: post.category.id,
        name: post.category.name,
      });
    }
  });

  return Array.from(categoryMap.values());
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
