import dotenv from 'dotenv';
import fs from 'fs';
import { createClient } from 'microcms-js-sdk';
dotenv.config();

if (!process.env.MICROCMS_SERVICE_DOMAIN || !process.env.MICROCMS_API_KEY) {
  throw new Error('MICROCMS_SERVICE_DOMAIN / MICROCMS_API_KEY が環境変数に設定されていません。');
}

const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_API_KEY,
});

const getAllContents = async (endpoint: string, queries = {}) => {
  return await client.getAllContents({ endpoint, queries });
};

export async function fetchData(outputDir: string, endpoint: string, outputFileName: string) {
  try {
    const data = await getAllContents(endpoint);

    fs.mkdirSync(outputDir, { recursive: true });

    fs.writeFileSync(`${outputDir}/${outputFileName}.json`, JSON.stringify(data));
    console.log(`✅ Created ${outputDir}/${outputFileName}.json`);
  } catch (error) {
    console.error(`❌ microCMS からのデータ取得に失敗しました (endpoint: ${endpoint})`);
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }
    throw error;
  }
}
