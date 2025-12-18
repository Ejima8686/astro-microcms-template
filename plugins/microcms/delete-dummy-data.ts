/**
 * microCMSからダミーデータを全て削除するモジュール
 *
 * ダミーカテゴリとダミー記事を全て削除します。
 *
 * 実行方法:
 *   pnpm delete:dummy
 */
import { deleteExistingDummyCategories } from './create-dummy-categories';
import { deleteExistingDummyNews } from './create-dummy-news';
import { loadEnv } from './libs/load-env';

const env = loadEnv();
const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN || env.MICROCMS_SERVICE_DOMAIN || '';
const apiKey = process.env.MICROCMS_API_KEY || env.MICROCMS_API_KEY || '';

if (!serviceDomain || !apiKey) {
  console.error('❌ エラー: MICROCMS_SERVICE_DOMAIN と MICROCMS_API_KEY が設定されていません。');
  console.error('.envファイルに設定するか、環境変数として設定してください。');
  process.exit(1);
}

async function deleteAllDummyData() {
  console.log('🗑️  microCMS ダミーデータ削除');
  console.log('=====================================');
  console.log(`Service Domain: ${serviceDomain}`);
  console.log('=====================================\n');

  try {
    // ダミー記事を削除（カテゴリが参照されているため先に削除）
    console.log('📝 ダミー記事を削除します...');
    const { japanese: deletedJapaneseNews, english: deletedEnglishNews } =
      await deleteExistingDummyNews();

    console.log(`\n✅ 記事削除完了:`);
    console.log(`   日本語: ${deletedJapaneseNews}件`);
    console.log(`   英語: ${deletedEnglishNews}件\n`);

    // ダミーカテゴリを削除（記事削除後に実行）
    console.log('📂 ダミーカテゴリを削除します...');
    const { japanese: deletedJapaneseCategories, english: deletedEnglishCategories } =
      await deleteExistingDummyCategories();

    console.log(`\n✅ カテゴリ削除完了:`);
    console.log(`   日本語: ${deletedJapaneseCategories}件`);
    console.log(`   英語: ${deletedEnglishCategories}件\n`);

    // 最終結果
    console.log('=====================================');
    console.log('✨ 削除完了！');
    console.log('=====================================');
    console.log(`📂 カテゴリ:`);
    console.log(`   日本語: ${deletedJapaneseCategories}件`);
    console.log(`   英語: ${deletedEnglishCategories}件`);
    console.log(`📝 記事:`);
    console.log(`   日本語: ${deletedJapaneseNews}件`);
    console.log(`   英語: ${deletedEnglishNews}件`);
    console.log('=====================================\n');

    return {
      success: true,
      categories: {
        japanese: deletedJapaneseCategories,
        english: deletedEnglishCategories,
      },
      news: {
        japanese: deletedJapaneseNews,
        english: deletedEnglishNews,
      },
    };
  } catch (error: unknown) {
    console.error('\n❌ 削除中にエラーが発生しました:');
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
deleteAllDummyData().then((result) => {
  process.exit(result.success ? 0 : 1);
});
