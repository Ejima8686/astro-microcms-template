# 環境変数とモードの設計

## 概要

この開発環境では`dummy`（ダミーデータ表示）と`staging`（ステージング環境）の2つをカスタムの開発環境として使用できます。

## 設計方針

### モード（`import.meta.env.MODE`）

環境（development/staging/production）を表します。

- `development`: 開発環境
- `staging`: ステージング環境
- `production`: 本番環境

### 環境変数フラグ（`import.meta.env.VITE_USE_DUMMY_DATA`）

ダミーデータの使用を制御するフラグです。

- `true`: ダミーデータを使用
- 未設定または`false`: 通常データを使用

## 使用パターン

### パターン1: ステージング環境でダミーデータを使用

```bash
# .env に設定
VITE_USE_DUMMY_DATA=true
```

```bash
pnpm dev:staging
# または
pnpm build:staging
```

### パターン2: ステージング環境で通常データを使用

```bash
# .env に設定しない、または
VITE_USE_DUMMY_DATA=false
```

```bash
pnpm dev:staging
# または
pnpm build:staging
```

## 実装詳細

### 判定ロジック

```typescript
// ダミーデータを使用するかどうか
const useDummyData = import.meta.env.VITE_USE_DUMMY_DATA === 'true';
```
