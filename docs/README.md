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

```
.
├── public/             # ビルドによって加工されないアセット
├── src/                # サイトのソースコード
│   ├── assets/         # ビルドによって加工されるアセット
│   ├── components/     # Astroコンポーネント
│   ├── layouts/        # ページの構造を規定するAstroコンポーネント
│   ├── pages/          # ページのためのAstroコンポーネント
│   ├── scripts/        # クライアントサイドで利用されるスクリプト
│   └── styles/         # サイトで利用されるCSSファイル
├── astro.config.ts     # Astroの設定
├── package.json        # 依存パッケージを管理するための設定
└── tsconfig.json       # TypeScriptの設定
```

## 多言語対応

### [i18n 設計ガイド](./i18n.md)

## microCMS

### [microCMS 連携ガイド](./microcms.md)

## formrun

### [formrun 連携ガイド](./formrun.md)

## コミットテンプレート

### [コミットテンプレート 設定ガイド](./formrun.md)
