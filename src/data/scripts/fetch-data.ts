import fs from 'fs';
import { fetchData } from './microcms-export';

/**
 * microCMSのAPIを取得して、JSONファイルに保存する
 * @description 実行のたびにjsonファイルを削除してから更新する。
 *
 * @param BASE_DIR - 出力先ディレクトリ
 * @param endpoints - microCMSのAPIエンドポイントの配列
 * @param endpoint - microCMSのAPIエンドポイント
 * @param outputDir - endpointごとの出力先ディレクトリ
 * @param outputFileName - endpointごとの出力ファイル名
 */

const BASE_DIR = 'src/data/json';
const TEMP_DIR = `${BASE_DIR}_tmp`;

const endpoints = [
  {
    endpoint: 'news',
    subDir: 'news',
    outputFileName: 'ja',
  },
  {
    endpoint: 'news-en',
    subDir: 'news',
    outputFileName: 'en',
  },
  {
    endpoint: 'categories',
    subDir: 'categories',
    outputFileName: 'ja',
  },
  {
    endpoint: 'categories-en',
    subDir: 'categories',
    outputFileName: 'en',
  },
];

async function main() {
  // まず一時ディレクトリに全ての JSON を生成する
  fs.rmSync(TEMP_DIR, { recursive: true, force: true });

  try {
    for (const item of endpoints) {
      const outputDir = `${TEMP_DIR}/${item.subDir}`;
      await fetchData(outputDir, item.endpoint, item.outputFileName);
    }

    // 全て成功したら、既存ディレクトリを削除してから入れ替える
    fs.rmSync(BASE_DIR, { recursive: true, force: true });
    fs.renameSync(TEMP_DIR, BASE_DIR);

    console.log('✅ microCMS の JSON データを更新しました');
  } catch (error) {
    console.error('❌ microCMS の JSON データ更新に失敗しました。既存の JSON はそのまま残します。');
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }
    // 失敗した場合は一時ディレクトリも削除しておく
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    process.exitCode = 1;
  }
}

main();
