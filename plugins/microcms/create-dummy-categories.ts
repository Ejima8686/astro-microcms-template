/**
 * microCMSにダミーカテゴリを追加するモジュール
 *
 * categories、categories-enエンドポイントにカテゴリを追加します。
 */
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
interface CategoryContent {
  id: string;
  name: string;
}

/**
 * 既存のダミーカテゴリを削除
 * @returns 削除されたカテゴリ数
 */
export async function deleteExistingDummyCategories(): Promise<{
  japanese: number;
  english: number;
}> {
  let deletedJapanese = 0;
  let deletedEnglish = 0;
  const errors: { endpoint: string; id: string; error: string }[] = [];

  console.log('🗑️  既存のダミーカテゴリを削除します...\n');

  try {
    // 日本語カテゴリを取得
    const japaneseCategories = await client.getAllContents({
      endpoint: 'categories',
    });

    // #数字カテゴリの形式で始まるカテゴリをフィルタリング
    const dummyJapaneseCategories = (japaneseCategories as CategoryContent[]).filter((cat) =>
      /^#\d+カテゴリ$/.test(cat.name),
    );

    console.log(`日本語ダミーカテゴリ: ${dummyJapaneseCategories.length}件見つかりました`);

    // 削除実行
    for (const cat of dummyJapaneseCategories) {
      try {
        await client.delete({
          endpoint: 'categories',
          contentId: cat.id,
        });
        deletedJapanese++;
        process.stdout.write(`🗑️  日本語カテゴリ削除: ${cat.name}\r`);
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error: unknown) {
        const errorMessage =
          (error as { response?: { data?: { message?: string } }; message?: string }).response?.data
            ?.message ||
          (error as { message?: string }).message ||
          '不明なエラー';
        errors.push({ endpoint: 'categories', id: cat.id, error: errorMessage });
        console.error(`\n❌ 日本語カテゴリ削除失敗 [${cat.id}]: ${errorMessage}`);
      }
    }

    console.log('\n');

    // 英語カテゴリを取得
    const englishCategories = await client.getAllContents({
      endpoint: 'categories-en',
    });

    // #数字Categoryの形式で始まるカテゴリをフィルタリング
    const dummyEnglishCategories = (englishCategories as CategoryContent[]).filter((cat) =>
      /^#\d+Category$/.test(cat.name),
    );

    console.log(`英語ダミーカテゴリ: ${dummyEnglishCategories.length}件見つかりました`);

    // 削除実行
    for (const cat of dummyEnglishCategories) {
      try {
        await client.delete({
          endpoint: 'categories-en',
          contentId: cat.id,
        });
        deletedEnglish++;
        process.stdout.write(`🗑️  英語カテゴリ削除: ${cat.name}\r`);
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error: unknown) {
        const errorMessage =
          (error as { response?: { data?: { message?: string } }; message?: string }).response?.data
            ?.message ||
          (error as { message?: string }).message ||
          '不明なエラー';
        errors.push({ endpoint: 'categories-en', id: cat.id, error: errorMessage });
        console.error(`\n❌ 英語カテゴリ削除失敗 [${cat.id}]: ${errorMessage}`);
      }
    }

    console.log('\n');

    if (errors.length > 0) {
      console.log('⚠️  削除エラーが発生したカテゴリ:');
      errors.forEach((error) => {
        console.log(`  ${error.endpoint} [${error.id}]: ${error.error}`);
      });
    }

    console.log(`✅ 削除完了: 日本語 ${deletedJapanese}件、英語 ${deletedEnglish}件\n`);
  } catch (error: unknown) {
    console.error('❌ 既存カテゴリの取得中にエラーが発生しました:');
    console.error((error as { message?: string }).message || String(error));
  }

  return {
    japanese: deletedJapanese,
    english: deletedEnglish,
  };
}

/**
 * 日本語ダミーカテゴリを作成
 * @param count 作成するカテゴリ数
 * @param deleteExisting 既存のダミーカテゴリを削除するか
 * @returns 作成されたカテゴリのID配列
 */
export async function createDummyJapaneseCategories(
  count: number,
  deleteExisting = true,
): Promise<{ id: string; name: string }[]> {
  // 既存の日本語ダミーカテゴリを削除
  if (deleteExisting) {
    const japaneseCategories = await client.getAllContents({
      endpoint: 'categories',
    });
    const dummyJapaneseCategories = (japaneseCategories as CategoryContent[]).filter((cat) =>
      /^#\d+カテゴリ$/.test(cat.name),
    );

    if (dummyJapaneseCategories.length > 0) {
      console.log(
        `🗑️  既存の日本語ダミーカテゴリ ${dummyJapaneseCategories.length}件を削除します...`,
      );
      for (const cat of dummyJapaneseCategories) {
        try {
          await client.delete({
            endpoint: 'categories',
            contentId: cat.id,
          });
          await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (error: unknown) {
          console.error(
            `❌ 削除失敗 [${cat.id}]: ${(error as { message?: string }).message || String(error)}`,
          );
        }
      }
      console.log('✅ 削除完了\n');
    }
  }

  const results: { id: string; name: string }[] = [];
  const errors: { index: number; error: string }[] = [];

  console.log(`\n📝 ${count}件の日本語ダミーカテゴリを作成します...\n`);

  for (let i = 0; i < count; i++) {
    try {
      const name = `#${i + 1}カテゴリ`;
      const result = await client.create({
        endpoint: 'categories',
        content: { name },
      });

      results.push({ id: result.id, name });
      process.stdout.write(`✅ [${i + 1}/${count}] 日本語カテゴリ作成成功: ${name}\r`);

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
      console.error(`\n❌ [${i + 1}/${count}] 日本語カテゴリ作成失敗: ${errorMessage}`);
    }
  }

  console.log('\n');

  if (errors.length > 0) {
    console.log('⚠️  エラーが発生したカテゴリ:');
    errors.forEach((error) => {
      console.log(`  [${error.index}]: ${error.error}`);
    });
  }

  return results;
}

/**
 * 英語ダミーカテゴリを作成
 * @param count 作成するカテゴリ数
 * @param deleteExisting 既存のダミーカテゴリを削除するか
 * @returns 作成されたカテゴリのID配列
 */
export async function createDummyEnglishCategories(
  count: number,
  deleteExisting = true,
): Promise<{ id: string; name: string }[]> {
  // 既存の英語ダミーカテゴリを削除
  if (deleteExisting) {
    const englishCategories = await client.getAllContents({
      endpoint: 'categories-en',
    });
    const dummyEnglishCategories = (englishCategories as CategoryContent[]).filter((cat) =>
      /^#\d+Category$/.test(cat.name),
    );

    if (dummyEnglishCategories.length > 0) {
      console.log(`🗑️  既存の英語ダミーカテゴリ ${dummyEnglishCategories.length}件を削除します...`);
      for (const cat of dummyEnglishCategories) {
        try {
          await client.delete({
            endpoint: 'categories-en',
            contentId: cat.id,
          });
          await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (error: unknown) {
          console.error(
            `❌ 削除失敗 [${cat.id}]: ${(error as { message?: string }).message || String(error)}`,
          );
        }
      }
      console.log('✅ 削除完了\n');
    }
  }

  const results: { id: string; name: string }[] = [];
  const errors: { index: number; error: string }[] = [];

  console.log(`\n📝 ${count}件の英語ダミーカテゴリを作成します...\n`);

  for (let i = 0; i < count; i++) {
    try {
      const name = `#${i + 1}Category`;
      const result = await client.create({
        endpoint: 'categories-en',
        content: { name },
      });

      results.push({ id: result.id, name });
      process.stdout.write(`✅ [${i + 1}/${count}] 英語カテゴリ作成成功: ${name}\r`);

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
      console.error(`\n❌ [${i + 1}/${count}] 英語カテゴリ作成失敗: ${errorMessage}`);
    }
  }

  console.log('\n');

  if (errors.length > 0) {
    console.log('⚠️  エラーが発生したカテゴリ:');
    errors.forEach((error) => {
      console.log(`  [${error.index}]: ${error.error}`);
    });
  }

  return results;
}

/**
 * ダミーカテゴリを作成（日本語・英語両方）
 * @param count 作成するカテゴリ数
 * @param deleteExisting 既存のダミーカテゴリを削除するか
 * @returns 作成されたカテゴリのID配列
 */
export async function createDummyCategories(
  count: number,
  deleteExisting = true,
): Promise<{
  japanese: { id: string; name: string }[];
  english: { id: string; name: string }[];
}> {
  // 既存のダミーカテゴリを削除
  if (deleteExisting) {
    await deleteExistingDummyCategories();
  }

  const [japanese, english] = await Promise.all([
    createDummyJapaneseCategories(count, false), // 既に削除済みなのでfalse
    createDummyEnglishCategories(count, false),
  ]);

  return {
    japanese,
    english,
  };
}

// 直接実行された場合のメイン処理（モジュールとしてインポートされた場合は実行しない）
const isDirectExecution =
  import.meta.url === `file://${process.argv[1]}` ||
  (process.argv[1] && process.argv[1].includes('create-dummy-categories'));

// コマンド名から言語を判定（create:dummy:categories:ja または create:dummy:categories:en）
const commandName = process.argv[1] || '';
let langArg = process.argv[3]?.toLowerCase(); // 引数で指定された場合

// コマンド名から言語を判定
if (!langArg && commandName.includes('create-dummy-categories')) {
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
    console.error('使用例: pnpm create:dummy:categories 5 ja  (日本語のみ)');
    console.error('使用例: pnpm create:dummy:categories 5 en  (英語のみ)');
    console.error('使用例: pnpm create:dummy:categories 5     (日本語・英語両方)');
    process.exit(1);
  }

  const lang = langArg || 'both';
  const langLabel =
    lang === 'ja' ? '日本語のみ' : lang === 'en' ? '英語のみ' : '日本語・英語それぞれ';

  console.log('microCMS ダミーカテゴリ作成スクリプト');
  console.log('=====================================');
  console.log(`作成数: ${count}件（${langLabel}）`);
  console.log(`Service Domain: ${serviceDomain}`);

  if (lang === 'ja') {
    // 日本語のみ
    createDummyJapaneseCategories(count)
      .then((japanese) => {
        console.log('\n=====================================');
        console.log('📊 作成結果');
        console.log('=====================================');
        console.log(`✅ 日本語カテゴリ: ${japanese.length}件`);

        if (japanese.length > 0) {
          console.log('\n作成された日本語カテゴリ:');
          japanese.forEach((cat, index) => {
            console.log(`  ${index + 1}. [${cat.id}] ${cat.name}`);
          });
        }

        console.log('\n✨ 処理が完了しました！');
        process.exit(0);
      })
      .catch((error) => {
        console.error('\n❌ 予期しないエラーが発生しました:');
        console.error(error.message);
        process.exit(1);
      });
  } else if (lang === 'en') {
    // 英語のみ
    createDummyEnglishCategories(count)
      .then((english) => {
        console.log('\n=====================================');
        console.log('📊 作成結果');
        console.log('=====================================');
        console.log(`✅ 英語カテゴリ: ${english.length}件`);

        if (english.length > 0) {
          console.log('\n作成された英語カテゴリ:');
          english.forEach((cat, index) => {
            console.log(`  ${index + 1}. [${cat.id}] ${cat.name}`);
          });
        }

        console.log('\n✨ 処理が完了しました！');
        process.exit(0);
      })
      .catch((error) => {
        console.error('\n❌ 予期しないエラーが発生しました:');
        console.error(error.message);
        process.exit(1);
      });
  } else {
    // 両方
    createDummyCategories(count)
      .then(({ japanese, english }) => {
        console.log('\n=====================================');
        console.log('📊 作成結果');
        console.log('=====================================');
        console.log(`✅ 日本語カテゴリ: ${japanese.length}件`);
        console.log(`✅ 英語カテゴリ: ${english.length}件`);

        if (japanese.length > 0) {
          console.log('\n作成された日本語カテゴリ:');
          japanese.forEach((cat, index) => {
            console.log(`  ${index + 1}. [${cat.id}] ${cat.name}`);
          });
        }

        if (english.length > 0) {
          console.log('\n作成された英語カテゴリ:');
          english.forEach((cat, index) => {
            console.log(`  ${index + 1}. [${cat.id}] ${cat.name}`);
          });
        }

        console.log('\n✨ 処理が完了しました！');
        process.exit(0);
      })
      .catch((error) => {
        console.error('\n❌ 予期しないエラーが発生しました:');
        console.error(error.message);
        process.exit(1);
      });
  }
}
