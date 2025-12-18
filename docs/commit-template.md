# コミットテンプレート 設定ガイド

コミットメッセージの一貫性を保つため、コミットメッセージのテンプレートを用意しています。

### セットアップ

```bash
git config commit.template .github/.gitmessage.txt
```

### 使用方法

`git commit` を実行すると、`.github/.gitmessage.txt` の内容が展開されます。

### 設定の削除

```bash
git config --unset commit.template
```

<details>
<summary><strong>💡 Cursor を使う場合のエディタ変更方法</strong></summary>

デフォルトでは Vim が開くため、他のエディタに変更するには以下を実行します。

### 1. アプリケーションまでのフルパスを取得

```bash
find /Applications -name "Cursor"
```

### 2. 編集エディタを設定

```bash
git config --global core.editor "「アプリのフルパス」 --wait"
```

### 3. 既存設定を消してから再設定（必要な場合）

```bash
git config --global --unset-all core.editor
git config --global core.editor "「アプリのフルパス」 --wait"
```

### 4. 設定確認

```bash
git config --global --get-all core.editor
```

</details>
