# microCMS ダミーデータ生成ツール

microCMSにダミーデータ（カテゴリ・記事）を生成・削除するためのツールです。

## 概要

microCMSの開発・テスト環境で使用するためのダミーデータを生成・管理します。

- 日本語・英語の両言語に対応
- カテゴリと記事の一括生成・削除

## 準備

1. 以下の環境変数を設定してください
   - `MICROCMS_SERVICE_DOMAIN`: microCMSのサービスドメイン
   - `MICROCMS_API_KEY`: microCMSのAPIキー

   環境変数は`.env`ファイルに設定するか、システムの環境変数として設定してください。

2. microCMSの管理画面で、以下のAPIエンドポイントを作成してください

   **注意:**
   - API名（管理画面での表示名）は任意です
   - エンドポイント名（APIの識別子）は以下の通りに設定してください

   **カテゴリAPI:**
   - `categories` (日本語カテゴリ)
     - フィールド: `name` (テキストフィールド)
   - `categories-en` (英語カテゴリ)
     - フィールド: `name` (テキストフィールド)

   **記事API:**
   - `news` (日本語記事)
     - フィールド:
       - `title` (テキストフィールド)
       - `category` (参照フィールド、`categories`を参照、オプション)
   - `news-en` (英語記事)
     - フィールド:
       - `title` (テキストフィールド)
       - `category` (参照フィールド、`categories-en`を参照、オプション)

## インストール

```bash
cd plugins/microcms
npm install
```

## 使用方法

### 1. ダミーデータの一括セットアップ

カテゴリと記事を一度に作成します。

```bash
npm run setup:dummy [カテゴリ数] [記事数]
```

**例:**

```bash
# カテゴリ10件、記事30件を日本語・英語それぞれ作成
npm run setup:dummy 10 30
```

### 2. ダミーデータの削除

全てのダミーデータ（カテゴリ・記事）を削除します。

```bash
npm run delete:dummy
```

### 3. カテゴリのみ作成

```bash
# 日本語・英語両方
npm run create:dummy:categories [件数]

# 日本語のみ
npm run create:dummy:categories:ja [件数]

# 英語のみ
npm run create:dummy:categories:en [件数]
```

**例:**

```bash
# 日本語・英語それぞれ5件のカテゴリを作成
npm run create:dummy:categories 5
```

### 4. 記事のみ作成

```bash
# 日本語・英語両方
npm run create:dummy:news [件数]

# 日本語のみ
npm run create:dummy:news:ja [件数]

# 英語のみ
npm run create:dummy:news:en [件数]
```

**例:**

```bash
# 日本語・英語それぞれ20件の記事を作成
npm run create:dummy:news 20
```

## 生成されるデータ

### カテゴリ

- **日本語**: `#1カテゴリ`, `#2カテゴリ`, ...
- **英語**: `#1Category`, `#2Category`, ...

### 記事

- **タイトル**: `【ダミー】#[番号] [Fakerで生成されたテキスト]`（日本語）
- **タイトル**: `【dummy】#[番号] [Fakerで生成されたテキスト]`（英語）
- **本文**: Faker.jsで生成されたランダムなテキスト（最大200文字）
- **公開日**: 過去30日以内のランダムな日付
- **カテゴリ**: 既存のカテゴリからランダムに1つ選択（カテゴリが存在する場合）

## ファイル構成

```text
plugins/microcms/
├── README.md                      # このファイル
├── package.json                   # パッケージ設定
├── setup-dummy-data.ts           # 一括セットアップスクリプト
├── delete-dummy-data.ts          # データ削除スクリプト
├── create-dummy-categories.ts    # カテゴリ作成スクリプト
├── create-dummy-news.ts          # 記事作成スクリプト
└── libs/
    └── load-env.ts               # 環境変数読み込みユーティリティ
```

## 注意事項

1. **削除順序**: カテゴリが記事から参照されている場合、カテゴリを削除できません。`delete:dummy`コマンドは自動的に記事を先に削除してからカテゴリを削除します。

2. **既存データ**: 各コマンドは既存のダミーデータを自動的に削除してから新しいデータを作成します。

3. **API制限**: microCMSのAPIレート制限に注意してください。大量のデータを作成する場合は、適切な間隔を空けて実行してください。
   参照: [コンテンツAPIに関する制限事項](https://document.microcms.io/manual/limitations#h9e37a059c1)

## トラブルシューティング

### 環境変数が読み込まれない

`.env`ファイルがプロジェクトルートに存在することを確認してください。または、環境変数を直接設定してください。

```bash
export MICROCMS_SERVICE_DOMAIN=your-service-domain
export MICROCMS_API_KEY=your-api-key
```

### カテゴリの削除に失敗する

記事がカテゴリを参照している場合、カテゴリを削除できません。`delete:dummy`コマンドを使用するか、手動で記事を先に削除してください。
