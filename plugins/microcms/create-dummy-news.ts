/**
 * microCMSにダミー記事を追加するモジュール
 *
 * news、news-enエンドポイントに記事を追加します。
 */
import { faker } from '@faker-js/faker';
import { faker as fakerJa } from '@faker-js/faker/locale/ja';
import { createClient } from 'microcms-js-sdk';
import { loadEnv } from './libs/load-env';

const env = loadEnv();
const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN || env.MICROCMS_SERVICE_DOMAIN || '';
const apiKey = process.env.MICROCMS_API_KEY || env.MICROCMS_API_KEY || '';

if (!serviceDomain || !apiKey) {
  console.error('❌ エラー: MICROCMS_SERVICE_DOMAIN と MICROCMS_API_KEY が設定されていません。');
  console.error('.envファイルに設定するか、環境変数として設定してください。');
  process.exit(1);
}

const client = createClient({
  serviceDomain,
  apiKey,
});

// 型定義
interface NewsContent {
  id: string;
  title?: string;
  content?: string;
  publishedAt?: string;
  category?: string;
}

interface CategoryContent {
  id: string;
  name: string;
}

interface ContentData {
  title: string;
  content: string;
  publishedAt: string;
  category?: string;
}

// 日付を過去に遡らせる（ランダムに）
function getRandomPastDate(daysAgo = 30): string {
  const now = new Date();
  const randomDays = Math.floor(Math.random() * daysAgo);
  const pastDate = new Date(now.getTime() - randomDays * 24 * 60 * 60 * 1000);
  return pastDate.toISOString();
}

/**
 * 既存のダミー記事を削除
 * @returns 削除された記事数
 */
export async function deleteExistingDummyNews(): Promise<{
  japanese: number;
  english: number;
}> {
  let deletedJapanese = 0;
  let deletedEnglish = 0;
  const errors: { endpoint: string; id: string; error: string }[] = [];

  console.log('🗑️  既存のダミー記事を削除します...\n');

  try {
    // 日本語記事を取得
    const japaneseNews = await client.getAllContents({
      endpoint: 'news',
    });

    // 【ダミー】#で始まる記事をフィルタリング
    const dummyJapaneseNews = japaneseNews.filter((news: NewsContent) =>
      news.title?.startsWith('【ダミー】#'),
    );

    console.log(`日本語ダミー記事: ${dummyJapaneseNews.length}件見つかりました`);

    // 削除実行
    for (const news of dummyJapaneseNews) {
      try {
        await client.delete({
          endpoint: 'news',
          contentId: news.id,
        });
        deletedJapanese++;
        process.stdout.write(`🗑️  日本語記事削除: ${news.title}\r`);
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error: unknown) {
        const errorMessage =
          (error as { response?: { data?: { message?: string } }; message?: string }).response?.data
            ?.message ||
          (error as { message?: string }).message ||
          '不明なエラー';
        errors.push({ endpoint: 'news', id: news.id, error: errorMessage });
        console.error(`\n❌ 日本語記事削除失敗 [${news.id}]: ${errorMessage}`);
      }
    }

    console.log('\n');

    // 英語記事を取得
    const englishNews = await client.getAllContents({
      endpoint: 'news-en',
    });

    // 【dummy】#で始まる記事をフィルタリング
    const dummyEnglishNews = englishNews.filter((news: NewsContent) =>
      news.title?.startsWith('【dummy】#'),
    );

    console.log(`英語ダミー記事: ${dummyEnglishNews.length}件見つかりました`);

    // 削除実行
    for (const news of dummyEnglishNews) {
      try {
        await client.delete({
          endpoint: 'news-en',
          contentId: news.id,
        });
        deletedEnglish++;
        process.stdout.write(`🗑️  英語記事削除: ${news.title}\r`);
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error: unknown) {
        const errorMessage =
          (error as { response?: { data?: { message?: string } }; message?: string }).response?.data
            ?.message ||
          (error as { message?: string }).message ||
          '不明なエラー';
        errors.push({ endpoint: 'news-en', id: news.id, error: errorMessage });
        console.error(`\n❌ 英語記事削除失敗 [${news.id}]: ${errorMessage}`);
      }
    }

    console.log('\n');

    if (errors.length > 0) {
      console.log('⚠️  削除エラーが発生した記事:');
      errors.forEach((error) => {
        console.log(`  ${error.endpoint} [${error.id}]: ${error.error}`);
      });
    }

    console.log(`✅ 削除完了: 日本語 ${deletedJapanese}件、英語 ${deletedEnglish}件\n`);
  } catch (error: unknown) {
    console.error('❌ 既存記事の取得中にエラーが発生しました:');
    console.error((error as { message?: string }).message || String(error));
  }

  return {
    japanese: deletedJapanese,
    english: deletedEnglish,
  };
}

/**
 * 日本語ダミー記事を作成
 * @param count 作成する記事数
 * @param categories 日本語カテゴリの配列
 * @param deleteExisting 既存のダミー記事を削除するか
 * @returns 作成された記事のID配列
 */
export async function createDummyJapaneseNews(
  count: number,
  categories: { id: string; name: string }[] = [],
  deleteExisting = true,
): Promise<{ id: string; title: string }[]> {
  // 既存の日本語ダミー記事を削除
  if (deleteExisting) {
    const japaneseNews = await client.getAllContents({
      endpoint: 'news',
    });
    const dummyJapaneseNews = japaneseNews.filter((news: NewsContent) =>
      news.title?.startsWith('【ダミー】#'),
    );

    if (dummyJapaneseNews.length > 0) {
      console.log(`🗑️  既存の日本語ダミー記事 ${dummyJapaneseNews.length}件を削除します...`);
      for (const news of dummyJapaneseNews) {
        try {
          await client.delete({
            endpoint: 'news',
            contentId: news.id,
          });
          await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (error: unknown) {
          console.error(
            `❌ 削除失敗 [${news.id}]: ${(error as { message?: string }).message || String(error)}`,
          );
        }
      }
      console.log('✅ 削除完了\n');
    }
  }

  const results: { id: string; title: string }[] = [];
  const errors: { index: number; error: string }[] = [];

  console.log(`\n📝 ${count}件の日本語ダミー記事を作成します...\n`);

  for (let i = 0; i < count; i++) {
    try {
      // タイトル: 【ダミー】#[番号] + fakerから取得した日本語の文章（20文字程度）
      const fakerTitle = fakerJa.lorem.paragraph().substring(0, 100);
      const title = `【ダミー】#${i + 1} ${fakerTitle}`;

      // 本文: ランダムな文字列200文字
      const randomText = fakerJa.lorem.paragraphs(2).substring(0, 200);
      const content = randomText;

      const publishedAt = getRandomPastDate(30);

      const contentData: ContentData = {
        title,
        content,
        publishedAt,
      };

      // カテゴリをランダムに1つ設定
      if (categories.length > 0) {
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        contentData.category = randomCategory.id;
      }

      const result = await client.create({
        endpoint: 'news',
        content: contentData,
      });

      results.push({ id: result.id, title });
      process.stdout.write(`✅ [${i + 1}/${count}] 日本語記事作成成功: ${title}\r`);

      if (i < count - 1) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string }).response?.data
          ?.message ||
        (error as { message?: string }).message ||
        '不明なエラー';
      errors.push({ index: i + 1, error: errorMessage });
      console.error(`\n❌ [${i + 1}/${count}] 日本語記事作成失敗: ${errorMessage}`);
    }
  }

  console.log('\n');

  if (errors.length > 0) {
    console.log('⚠️  エラーが発生した記事:');
    errors.forEach((error) => {
      console.log(`  [${error.index}]: ${error.error}`);
    });
  }

  return results;
}

/**
 * 英語ダミー記事を作成
 * @param count 作成する記事数
 * @param categories 英語カテゴリの配列
 * @param deleteExisting 既存のダミー記事を削除するか
 * @returns 作成された記事のID配列
 */
export async function createDummyEnglishNews(
  count: number,
  categories: { id: string; name: string }[] = [],
  deleteExisting = true,
): Promise<{ id: string; title: string }[]> {
  // 既存の英語ダミー記事を削除
  if (deleteExisting) {
    const englishNews = await client.getAllContents({
      endpoint: 'news-en',
    });
    const dummyEnglishNews = englishNews.filter((news: NewsContent) =>
      news.title?.startsWith('【dummy】#'),
    );

    if (dummyEnglishNews.length > 0) {
      console.log(`🗑️  既存の英語ダミー記事 ${dummyEnglishNews.length}件を削除します...`);
      for (const news of dummyEnglishNews) {
        try {
          await client.delete({
            endpoint: 'news-en',
            contentId: news.id,
          });
          await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (error: unknown) {
          console.error(
            `❌ 削除失敗 [${news.id}]: ${(error as { message?: string }).message || String(error)}`,
          );
        }
      }
      console.log('✅ 削除完了\n');
    }
  }

  const results: { id: string; title: string }[] = [];
  const errors: { index: number; error: string }[] = [];

  console.log(`\n📝 ${count}件の英語ダミー記事を作成します...\n`);
  for (let i = 0; i < count; i++) {
    try {
      // タイトル: 【dummy】#[番号] + fakerから取得した英語20文字程度の文字列
      const fakerTitle = faker.lorem.words(3).substring(0, 100);
      const title = `【dummy】#${i + 1} ${fakerTitle}`;

      // 本文: ランダムな文字列200文字
      const randomText = faker.lorem.paragraphs(2).substring(0, 200);
      const content = randomText;

      const publishedAt = getRandomPastDate(30);

      const contentData: ContentData = {
        title,
        content,
        publishedAt,
      };

      // カテゴリをランダムに1つ設定
      if (categories.length > 0) {
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        contentData.category = randomCategory.id;
      }

      const result = await client.create({
        endpoint: 'news-en',
        content: contentData,
      });

      results.push({ id: result.id, title });
      process.stdout.write(`✅ [${i + 1}/${count}] 英語記事作成成功: ${title}\r`);

      if (i < count - 1) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string }).response?.data
          ?.message ||
        (error as { message?: string }).message ||
        '不明なエラー';
      errors.push({ index: i + 1, error: errorMessage });
      console.error(`\n❌ [${i + 1}/${count}] 英語記事作成失敗: ${errorMessage}`);
    }
  }

  console.log('\n');

  if (errors.length > 0) {
    console.log('⚠️  エラーが発生した記事:');
    errors.forEach((error) => {
      console.log(`  [${error.index}]: ${error.error}`);
    });
  }

  return results;
}

/**
 * ダミー記事を作成（日本語・英語両方）
 * @param count 作成する記事数
 * @param japaneseCategories 日本語カテゴリの配列
 * @param englishCategories 英語カテゴリの配列
 * @param deleteExisting 既存のダミー記事を削除するか
 * @returns 作成された記事のID配列
 */
export async function createDummyNews(
  count: number,
  japaneseCategories: { id: string; name: string }[] = [],
  englishCategories: { id: string; name: string }[] = [],
  deleteExisting = true,
): Promise<{
  japanese: { id: string; title: string }[];
  english: { id: string; title: string }[];
}> {
  const [japanese, english] = await Promise.all([
    createDummyJapaneseNews(count, japaneseCategories, deleteExisting),
    createDummyEnglishNews(count, englishCategories, deleteExisting),
  ]);

  return {
    japanese,
    english,
  };
}

// 直接実行された場合のメイン処理（モジュールとしてインポートされた場合は実行しない）
const isDirectExecution =
  import.meta.url === `file://${process.argv[1]}` ||
  (process.argv[1] && process.argv[1].includes('create-dummy-news'));

// コマンド名から言語を判定（create:dummy:news:ja または create:dummy:news:en）
const commandName = process.argv[1] || '';
let langArg = process.argv[3]?.toLowerCase(); // 引数で指定された場合

// コマンド名から言語を判定
if (!langArg && commandName.includes('create-dummy-news')) {
  if (commandName.includes(':ja') || process.env.npm_lifecycle_event?.includes(':ja')) {
    langArg = 'ja';
  } else if (commandName.includes(':en') || process.env.npm_lifecycle_event?.includes(':en')) {
    langArg = 'en';
  }
}

const countArg = process.argv[2];

if (isDirectExecution && countArg !== undefined) {
  const count = parseInt(countArg, 10);

  if (isNaN(count) || count < 1) {
    console.error('❌ エラー: 作成数は1以上の数値を指定してください。');
    process.exit(1);
  }

  if (langArg && langArg !== 'ja' && langArg !== 'en') {
    console.error('❌ エラー: 言語は "ja" または "en" を指定してください。');
    console.error('使用例: pnpm create:dummy:news 10 ja  (日本語のみ)');
    console.error('使用例: pnpm create:dummy:news 10 en  (英語のみ)');
    console.error('使用例: pnpm create:dummy:news 10     (日本語・英語両方)');
    process.exit(1);
  }

  const lang = langArg || 'both';
  const langLabel =
    lang === 'ja' ? '日本語のみ' : lang === 'en' ? '英語のみ' : '日本語・英語それぞれ';

  console.log('microCMS ダミー記事作成スクリプト');
  console.log('=====================================');
  console.log(`作成数: ${count}件（${langLabel}）`);
  console.log(`Service Domain: ${serviceDomain}`);

  // 既存のカテゴリを取得
  let japaneseCategories: { id: string; name: string }[] = [];
  let englishCategories: { id: string; name: string }[] = [];

  (async () => {
    if (lang === 'ja' || lang === 'both') {
      try {
        const jpCats = await client.getAllContents({ endpoint: 'categories' });
        japaneseCategories = (jpCats as CategoryContent[]).map((cat) => ({
          id: cat.id,
          name: cat.name,
        }));
        console.log(`取得した日本語カテゴリ数: ${japaneseCategories.length}件`);
      } catch (error) {
        console.warn('日本語カテゴリの取得に失敗しました。カテゴリなしで作成します。');
      }
    }

    if (lang === 'en' || lang === 'both') {
      try {
        const enCats = await client.getAllContents({ endpoint: 'categories-en' });
        englishCategories = (enCats as CategoryContent[]).map((cat) => ({
          id: cat.id,
          name: cat.name,
        }));
        console.log(`取得した英語カテゴリ数: ${englishCategories.length}件`);
      } catch (error) {
        console.warn('英語カテゴリの取得に失敗しました。カテゴリなしで作成します。');
      }
    }

    if (lang === 'ja') {
      // 日本語のみ
      createDummyJapaneseNews(count, japaneseCategories)
        .then((japanese) => {
          console.log('\n=====================================');
          console.log('📊 作成結果');
          console.log('=====================================');
          console.log(`✅ 日本語記事: ${japanese.length}件`);

          if (japanese.length > 0) {
            console.log('\n作成された日本語記事（最初の5件）:');
            japanese.slice(0, 5).forEach((news, index) => {
              console.log(`  ${index + 1}. [${news.id}] ${news.title}`);
            });
            if (japanese.length > 5) {
              console.log(`  ... 他 ${japanese.length - 5}件`);
            }
          }

          console.log('\n✨ 処理が完了しました！');
          process.exit(0);
        })
        .catch((error) => {
          console.error('\n❌ 予期しないエラーが発生しました:');
          console.error(error.message);
          if (error.response) {
            console.error('ステータス:', error.response.status);
            console.error('詳細:', JSON.stringify(error.response.data, null, 2));
          }
          process.exit(1);
        });
    } else if (lang === 'en') {
      // 英語のみ
      createDummyEnglishNews(count, englishCategories)
        .then((english) => {
          console.log('\n=====================================');
          console.log('📊 作成結果');
          console.log('=====================================');
          console.log(`✅ 英語記事: ${english.length}件`);

          if (english.length > 0) {
            console.log('\n作成された英語記事（最初の5件）:');
            english.slice(0, 5).forEach((news, index) => {
              console.log(`  ${index + 1}. [${news.id}] ${news.title}`);
            });
            if (english.length > 5) {
              console.log(`  ... 他 ${english.length - 5}件`);
            }
          }

          console.log('\n✨ 処理が完了しました！');
          process.exit(0);
        })
        .catch((error) => {
          console.error('\n❌ 予期しないエラーが発生しました:');
          console.error(error.message);
          if (error.response) {
            console.error('ステータス:', error.response.status);
            console.error('詳細:', JSON.stringify(error.response.data, null, 2));
          }
          process.exit(1);
        });
    } else {
      // 両方
      createDummyNews(count, japaneseCategories, englishCategories)
        .then(({ japanese, english }) => {
          console.log('\n=====================================');
          console.log('📊 作成結果');
          console.log('=====================================');
          console.log(`✅ 日本語記事: ${japanese.length}件`);
          console.log(`✅ 英語記事: ${english.length}件`);

          if (japanese.length > 0) {
            console.log('\n作成された日本語記事（最初の5件）:');
            japanese.slice(0, 5).forEach((news, index) => {
              console.log(`  ${index + 1}. [${news.id}] ${news.title}`);
            });
            if (japanese.length > 5) {
              console.log(`  ... 他 ${japanese.length - 5}件`);
            }
          }

          if (english.length > 0) {
            console.log('\n作成された英語記事（最初の5件）:');
            english.slice(0, 5).forEach((news, index) => {
              console.log(`  ${index + 1}. [${news.id}] ${news.title}`);
            });
            if (english.length > 5) {
              console.log(`  ... 他 ${english.length - 5}件`);
            }
          }

          console.log('\n✨ 処理が完了しました！');
          process.exit(0);
        })
        .catch((error) => {
          console.error('\n❌ 予期しないエラーが発生しました:');
          console.error(error.message);
          if (error.response) {
            console.error('ステータス:', error.response.status);
            console.error('詳細:', JSON.stringify(error.response.data, null, 2));
          }
          process.exit(1);
        });
    }
  })();
}
