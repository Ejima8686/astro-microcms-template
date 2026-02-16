# astro-microcms-template

## 開発環境

次のツールを採用しています:

- [Astro](https://astro.build/): ウェブサイト構築のためのフレームワーク
- [Tailwind CSS](https://tailwindcss.com/): ユーティリティファーストCSSフレームワーク
- [Alpine.js](https://alpinejs.dev/): HTMLに直接振る舞いを記述できるようにするJavaScriptフレームワーク
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)

## コマンドラインインターフェース

### セットアップ

```bash
npm install -g pnpm
pnpm install
```

### 環境変数の設定

プロジェクトルートに `.env` ファイルを作成し、必要な環境変数を設定してください。`.example.env` をコピーして使用できます。

#### 必須環境変数

- `MICROCMS_SERVICE_DOMAIN`: microCMSのサービスドメイン
- `MICROCMS_API_KEY`: microCMSのAPIキー

詳細は [microCMS 連携ガイド](./microcms.md) を参照してください。

#### オプション環境変数

- `BASIC_AUTH_USER`: Basic認証のユーザー名（vercel環境の認証で使用）
- `BASIC_AUTH_PASSWORD`: Basic認証のパスワード（vercel環境の認証で使用）
- `SITE_URL`: サイトのURL（サイトマップ生成などで使用）
- `VITE_USE_DUMMY_DATA`: 動的コンテンツにダミーデータを使用するかどうか
  - `true`: ダミーデータを使用
  - 未設定または`false`: 通常データを使用

### ローカルサーバーの起動

```bash
pnpm run dev
```

### 本番用ビルド

```bash
pnpm run build
```

### ソースコードの静的検証

```bash
pnpm run lint
```

### ソースコードの自動修正

```bash
pnpm run fix
```

## ファイル構成

```text
.
├── public/             # ビルドによって加工されないアセット
├── src/                # サイトのソースコード
│   ├── assets/         # ビルドによって加工されるアセット
│   ├── components/     # Astroコンポーネント
│   ├── data/           # データ取得・生成スクリプト
│   ├── layouts/        # ページの構造を規定するAstroコンポーネント
│   ├── libs/           # ユーティリティライブラリ
│   ├── middleware/     # ミドルウェア
│   ├── pages/          # ページのためのAstroコンポーネント
│   ├── scripts/        # クライアントサイドで利用されるスクリプト
│   └── styles/         # サイトで利用されるCSSファイル
├── astro.config.ts     # Astroの設定
├── config.ts           # プロジェクト設定
├── package.json        # 依存パッケージを管理するための設定
└── tsconfig.json       # TypeScriptの設定
```

## 多言語対応

### [i18n 設計ガイド](./i18n.md)

## microCMS

### [microCMS 連携ガイド](./microcms.md)

## 環境変数とモード

### [環境変数とモードの設計ガイド](./mode.md)

## コミットテンプレート

### [コミットテンプレート 設定ガイド](./formrun.md)
