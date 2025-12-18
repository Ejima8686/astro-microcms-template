# formrun 連携ガイド

このプロジェクトでは、formrunと連携できるテンプレートを用意しています。

---

## セットアップ

1. プロジェクトルートで `.env` を作成し、以下を設定します（`.example.env` があればコピーして使ってください）。

```bash
FORM_RUN_API_URL=
```

2. 値の確認方法
   1. formrunにログイン > 設定 > 埋め込み設定で埋め込みコードを表示。
   2. 埋め込みコードのformタグのactionの値をコピーし、`.env`に貼り付けてください。(例: https://form.run/api/v1/r/xxxx)

3. 問い合わせページにアクセスし、フォームが動作しているかを確認してください。

---

## 参考リンク

- [コード型フォームのサンプルコード集
  ](https://faq.form.run/faq/sample-codes)
- [確認画面モードを有効にする
  ](https://faq.form.run/faq/sample-codes#block-5506af00c38c4e22ac45bb0421bcde58)
- [reCAPTCHAを設定する
  ](https://faq.form.run/faq/samplecode#block-19c881b7791a4e948d06cec2ba9b5581)
