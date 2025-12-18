/**
 * microCMSにダミーデータをセットアップするコマンド
 *
 * 実行方法:
 *   pnpm setup:dummy [カテゴリ数] [記事数]
 *   例: pnpm setup:dummy 5 20
 *
 * 注意: カテゴリ数と記事数は必須です。
 */
import { createDummyCategories } from './create-dummy-categories';
import { createDummyNews } from './create-dummy-news';
import { loadEnv } from './libs/load-env';

const env = loadEnv();
const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN || env.MICROCMS_SERVICE_DOMAIN || '';
const apiKey = process.env.MICROCMS_API_KEY || env.MICROCMS_API_KEY || '';

if (!serviceDomain || !apiKey) {
  console.error('❌ エラー: MICROCMS_SERVICE_DOMAIN と MICROCMS_API_KEY が設定されていません。');
  console.error('.envファイルに設定するか、環境変数として設定してください。');
  process.exit(1);
}

async function setupDummyData(categoryCount: number, newsCount: number) {
  console.log('🚀 microCMS ダミーデータセットアップ');
  console.log('=====================================');
  console.log(`Service Domain: ${serviceDomain}`);
  console.log(`カテゴリ作成数: ${categoryCount}件（日本語・英語それぞれ）`);
  console.log(`記事作成数: ${newsCount}件（日本語・英語それぞれ）`);
  console.log('=====================================\n');

  try {
    // ステップ1: ダミーカテゴリを作成
    console.log('📂 ステップ1: ダミーカテゴリを作成します...');
    const { japanese: japaneseCategories, english: englishCategories } =
      await createDummyCategories(categoryCount);

    console.log(`\n✅ カテゴリ作成完了:`);
    console.log(`   日本語: ${japaneseCategories.length}件`);
    console.log(`   英語: ${englishCategories.length}件\n`);

    // ステップ2: ダミー記事を作成（作成したカテゴリを使用）
    console.log('📝 ステップ2: ダミー記事を作成します...');
    const { japanese: japaneseNews, english: englishNews } = await createDummyNews(
      newsCount,
      japaneseCategories,
      englishCategories,
    );

    console.log(`\n✅ 記事作成完了:`);
    console.log(`   日本語: ${japaneseNews.length}件`);
    console.log(`   英語: ${englishNews.length}件\n`);

    // 最終結果
    console.log('=====================================');
    console.log('✨ セットアップ完了！');
    console.log('=====================================');
    console.log(`📂 カテゴリ:`);
    console.log(`   日本語: ${japaneseCategories.length}件`);
    console.log(`   英語: ${englishCategories.length}件`);
    console.log(`📝 記事:`);
    console.log(`   日本語: ${japaneseNews.length}件`);
    console.log(`   英語: ${englishNews.length}件`);
    console.log('=====================================\n');

    return {
      success: true,
      categories: {
        japanese: japaneseCategories.length,
        english: englishCategories.length,
      },
      news: {
        japanese: japaneseNews.length,
        english: englishNews.length,
      },
    };
  } catch (error: unknown) {
    console.error('\n❌ セットアップ中にエラーが発生しました:');
    const errorObj = error as { message?: string; response?: { status?: number; data?: unknown } };
    console.error(errorObj.message || String(error));
    if (errorObj.response) {
      console.error('ステータス:', errorObj.response.status);
      console.error('詳細:', JSON.stringify(errorObj.response.data, null, 2));
    }
    return {
      success: false,
      error: errorObj.message || String(error),
    };
  }
}

// メイン処理
const categoryCountArg = process.argv[2];
const newsCountArg = process.argv[3];

if (!categoryCountArg || !newsCountArg) {
  console.error('❌ エラー: カテゴリ数と記事数を指定してください。');
  console.error('');
  console.error('使用例:');
  console.error('  pnpm setup:dummy 5 20');
  console.error('  pnpm setup:dummy [カテゴリ数] [記事数]');
  console.error('');
  console.error('引数:');
  console.error('  [カテゴリ数] - 作成するカテゴリ数（日本語・英語それぞれ）');
  console.error('  [記事数]     - 作成する記事数（日本語・英語それぞれ）');
  process.exit(1);
}

const categoryCount = parseInt(categoryCountArg, 10);
const newsCount = parseInt(newsCountArg, 10);

if (isNaN(categoryCount) || categoryCount < 1) {
  console.error('❌ エラー: カテゴリ数は1以上の数値を指定してください。');
  process.exit(1);
}

if (isNaN(newsCount) || newsCount < 1) {
  console.error('❌ エラー: 記事数は1以上の数値を指定してください。');
  process.exit(1);
}

setupDummyData(categoryCount, newsCount).then((result) => {
  process.exit(result.success ? 0 : 1);
});
