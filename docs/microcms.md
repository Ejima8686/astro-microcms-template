# microCMS 連携ガイド

このプロジェクトでは、microCMS のコンテンツをビルド前に取得し、`src/data/json` 以下に JSON として保存してから Astro で静的サイトを生成します。

---

## 1. 環境変数の設定

1. プロジェクトルートで `.env` を作成し、以下を設定します（`.example.env` があればコピーして使ってください）。

```bash
MICROCMS_SERVICE_DOMAIN=サービスドメイン
MICROCMS_API_KEY=APIキー
```

1. 値の確認方法は microCMS 公式ドキュメントや、以下の記事などを参照してください。
   - [AstroとmicroCMSでつくるブログサイト](https://blog.microcms.io/astro-microcms-introduction/)

---

## 2. microCMS 側で API を作成する

microCMS の管理画面で、コンテンツモデル（API）を作成します。
このプロジェクトのデフォルト構成は、以下のような想定です。

- 記事（日本語）用 API
  - **エンドポイント**: `news`
- 記事（英語）用 API
  - **エンドポイント**: `news-en`
- カテゴリ用 API
  - **エンドポイント**: `categories`

---

## 3. `src/data/scripts/fetch-data.ts` に API を登録する

microCMS 側で作成した API は、`src/data/scripts/fetch-data.ts` の `endpoints` 配列に登録します。

```ts
const endpoints = [
  {
    endpoint: 'news', // microCMS の API ID
    subDir: 'news', // 出力ディレクトリ
    outputFileName: 'ja', // 出力ファイル名（拡張子 .json は自動付与）
  },
  {
    endpoint: 'news-en',
    subDir: 'news',
    outputFileName: 'en',
  },
  {
    endpoint: 'categories',
    subDir: 'news',
    outputFileName: 'categories',
  },
  // 必要に応じてここに API を追加する
];
```

- **endpoint**
  - microCMSで設定した **エンドポイント** と一致させます。
- **subDir**
  - JSONを保存したいディレクトリパスです。
- **outputFileName**
  - JSONの実際のファイル名になります（`{outputFileName}.json`）。

不要な API 設定があれば、この配列から削除して構いません。

---

## 4. データ取得スクリプトの実行

設定が終わったら、microCMS からデータを取得して JSON を生成します。

```bash
pnpm install       # まだなら
pnpm run fetch-data
# もしくは
pnpm run build
```

---

## 5. ダミーコンテンツのセットアップ

microCMSのダミーコンテンツの一括生成ができます。

```bash
cd plugins/microcms
npm install
npm run setup:dummy [生成するカテゴリ数] [生成する記事数]
```

**例:**

```bash
# カテゴリ10件、記事30件を日本語・英語それぞれ作成
npm run setup:dummy 10 30
```

詳しい仕様・使用方法は以下を参照してください。

### [microCMS ダミーデータ生成ツール](../plugins/microcms/README.md)

---

## 参考リンク

- [AstroとmicroCMSでつくるブログサイト](https://blog.microcms.io/astro-microcms-introduction/)
- [microCMS 公式ドキュメント](https://document.microcms.io/)
