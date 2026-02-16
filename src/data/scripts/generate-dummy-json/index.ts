import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { generateDummyNews } from './news';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_DIR = join(__dirname, '..', '..');
const DUMMY_DIR = join(DATA_DIR, 'dummy-json');
const JSON_DIR = join(DATA_DIR, 'json');

const DIRS = [
  {
    dir: 'news',
    files: ['categories.json', 'ja.json', 'en.json'],
  },
];

function createDummyDir() {
  if (fs.existsSync(DUMMY_DIR)) {
    fs.rmSync(DUMMY_DIR, { recursive: true });
  }
  fs.mkdirSync(DUMMY_DIR, { recursive: true });

  DIRS.forEach((dir) => {
    const dirPath = join(DUMMY_DIR, dir.dir);
    fs.mkdirSync(dirPath, { recursive: true });
    dir.files.forEach((file) => {
      const filePath = join(dirPath, file);
      fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    });
  });
}

// news.ts が json ディレクトリのファイルをインポートするので、
// ダミーと同じ構造のjsonディレクトリを作成する
function createJsonDir() {
  // 既存データ上書きをしない
  if (fs.existsSync(JSON_DIR)) {
    return;
  }

  fs.mkdirSync(JSON_DIR, { recursive: true });

  DIRS.forEach((dir) => {
    const dirPath = join(JSON_DIR, dir.dir);
    fs.mkdirSync(dirPath, { recursive: true });
    dir.files.forEach((file) => {
      const filePath = join(dirPath, file);
      // ファイルが存在しない場合のみ空ファイルを作成
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([], null, 2));
      }
    });
  });
}

function generateDummyJson() {
  createDummyDir();
  createJsonDir();
  generateDummyNews();
}

generateDummyJson();
