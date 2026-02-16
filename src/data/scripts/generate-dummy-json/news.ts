import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * 定数定義
 * - TARGET_COUNT: 生成する記事数
 * - BASE_DATE: 基準日時
 * - DAYS_AGO_PER_POST: 記事ごとに過去に遡る日数
 * - ID_PREFIX: IDのプレフィックス
 * - THUMBNAIL_SIZE: サムネイル画像サイズ
 * - IMAGE_URLS: 画像URLのリスト
 * - CATEGORY_NAMES: カテゴリ名のリスト
 * - CONTENT_TEMPLATES: コンテンツテンプレート
 * - TITLE_TEMPLATES: タイトルテンプレート
 * - LANGUAGES: 言語設定
 */
const TARGET_COUNT = 20;
const BASE_DATE = '2026-01-06T05:03:27.626Z';
const DAYS_AGO_PER_POST = 2;
const ID_PREFIX = 'dummy-news';
const THUMBNAIL_SIZE = { width: 640, height: 480 };
const IMAGE_URLS = [
  'https://fastly.picsum.photos/id/403/640/480.jpg?hmac=yeF12UI0tA5_cc9lIoq8OPadmmylpvrQWte6EbBy_GY',
  'https://fastly.picsum.photos/id/248/640/480.jpg?hmac=JhcLjQ0Pz5mx2jx-21ediuqTgPLkyp-NHMimuyM-CQ0',
  'https://fastly.picsum.photos/id/893/640/480.jpg?hmac=bozV3kcU48RHnKPS7CE_RfM_VSF1-5Ts0t99kVdpZZQ',
  'https://fastly.picsum.photos/id/186/640/480.jpg?hmac=SXOldAmsCJd6f1lSwwmnNOP3OUBOpm3gl_4yyb2364g',
];
const CATEGORY_NAMES = ['Category_A', 'Category_B', 'Category_C', 'Category_D', 'Category_E'];
const CONTENT_TEMPLATES = {
  ja: '<h1 id="h0b6a89261a">見出し1(h1)見出し1(h1)見出し1(h1)見出し1(h1)見出し1(h1)見出し1(h1)</h1><p>ここに記事本文が入ります。ここに記事本文が入ります。ここに記事本文が入ります。ここに記事本文が入ります。ここに記事本文が入ります。ここに記事本文が入ります。ここに記事本文が入ります。ここに記事本文が入ります。ここに記事本文が入ります。ここに記事本文が入ります。ここに記事本文が入ります。ここに記事本文が入ります。ここに記事本文が入ります。ここに記事本文が入ります。ここに記事本文が入ります。ここに記事本文が入ります。ここに記事本文が入ります。ここに記事本文が入ります。ここに記事本文が入ります。</p><h2 id="h04ae529ed9">見出し2(h2)見出し2(h2)見出し2(h2)見出し2(h2)見出し2(h2)</h2><p>ここに記事本文が入ります。ここに記事本文が入ります。ここに記事本文が入ります。ここに記事本文が入ります。ここに記事本文が入ります。<br>改行<br>ここに記事本文が入ります。ここに記事本文が入ります。ここに記事本文が入ります。<br>ここに記事本文が入ります。ここに記事本文が入ります。ここに記事本文が入ります。ここに記事本文が入ります。ここに記事本文が入ります。ここに記事本文が入ります。ここに記事本文が入ります。ここに記事本文が入ります。ここに記事本文が入ります。ここに記事本文が入ります。</p><h3 id="h8176821089">見出し3(h3)見出し3(h2)見出し3(h3)見出し3(h3)見出し3(h3)</h3><p><strong>太字</strong></p><p><em>斜体</em></p><p><u>下線</u></p><p><s>打ち消し線</s></p><p><code>コード</code></p><p><code>&lt;div&gt;&lt;/div&gt;</code></p><p><span style="color: #ff0000">赤色</span>　<span style="color: #1a00ff">青色</span>　<span style="color: #ffff00">黄色</span></p><p>左揃え</p><p style="text-align: center">中央揃え</p><p style="text-align: right">右揃え</p><hr><blockquote><p>引用ブロック<br>改行<br>引用ブロック引用ブロック引用ブロック引用ブロック引用ブロック引用ブロック引用ブロック引用ブロック引用ブロック引用ブロック引用ブロック引用ブロック引用ブロック</p></blockquote><div data-filename="ファイル名"><pre><code class="language-html">コードブロックコードブロック\nコードブロックコードブロック\nコードブロックコードブロック\nコードブロックコードブロックコードブロックコードブロック</code></pre></div><ul><li> 箇条書きリスト　箇条書きリスト　箇条書きリスト　箇条書きリスト　箇条書きリスト　箇条書きリスト　箇条書きリスト　箇条書きリスト</li><li>箇条書きリスト　箇条書きリスト　箇条書きリスト　箇条書きリスト<ul><li>ネストすることも可能<ul><li>さらに深い階層も可能</li></ul></li></ul></li></ul><ol><li>番号付きリスト番号付きリスト番号付きリスト番号付きリスト番号付きリスト番号付きリスト番号付きリスト番号付きリスト<ol><li>ネストすることも可能　ネストすることも可能</li><li>ネストすることも可能　ネストすることも可能<ol><li>さらに深い階層も可能　さらに深い階層も可能　さらに深い階層も可能</li><li>さらに深い階層も可能　さらに深い階層も可能　さらに深い階層も可能</li><li>さらに深い階層も可能　さらに深い階層も可能　さらに深い階層も可能</li></ol></li></ol></li></ol><p><a href="https://example.com/">リンクテキスト</a></p><p><a href="https://example.com/" target="_blank" rel="noopener noreferrer">別タブで開くリンクテキスト</a></p><p><a href="https://example.com/" rel="nofollow">検索エンジンに評価させないリンクテキスト</a></p><figure><a href="https://example.com/" target="_blank" rel="noopener noreferrer nofollow"><img src="IMAGE_URL_PLACEHOLDER" alt="Alt（代替テキスト）" width="2000" height="1500"></a><figcaption>キャプション (説明文)</figcaption></figure><figure><img src="IMAGE_URL_PLACEHOLDER" alt="" width="640" height="480"><figcaption>左揃え</figcaption></figure><figure style="text-align: center;"><img src="IMAGE_URL_PLACEHOLDER" alt="" width="640" height="480"><figcaption>中央揃え</figcaption></figure><figure style="text-align: right;"><img src="IMAGE_URL_PLACEHOLDER" alt="" width="640" height="480"><figcaption>右揃え</figcaption></figure><p><a href="IMAGE_URL_PLACEHOLDER" target="_blank" data-embed-type="file" data-mime-type="image/jpeg">ファイル</a></p><div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;"><iframe src="https://www.youtube.com/embed/MYPVQccHhAQ?rel=0" style="top: 0; left: 0; width: 100%; height: 100%; position: absolute; border: 0;" allowfullscreen scrolling="no" allow="accelerometer *; clipboard-write *; encrypted-media *; gyroscope *; picture-in-picture *; web-share *;" referrerpolicy="strict-origin"></iframe></div>',
  en: '<h1 id="h2600e9cab8">Heading 1(h1)Heading 1(h1)Heading 1(h1)Heading 1(h1)</h1><p>The article text goes here.The article text goes here.The article text goes here.The article text goes here.The article text goes here.The article text goes here.The article text goes here.The article text goes here.The article text goes here.The article text goes here.The article text goes here.The article text goes here.The article text goes here.The article text goes here.The article text goes here.The article text goes here.The article text goes here.The article text goes here.The article text goes here.The article text goes here.The article text goes here.The article text goes here.</p><h2 id="h7cf3a5abb9">Heading 2(h2)Heading 2(h2)Heading 2(h2)Heading 2(h2)</h2><p>The article text goes here.The article text goes here.The article text goes here.The article text goes here.The article text goes here.The article text goes here.The article text goes here.The article text goes here.The article text goes here.The article text goes here.The article text goes here.The article text goes here.The article text goes here.The article text goes here.The article text goes here.The article text goes here.The article text goes here.The article text goes here.The article text goes here.The article text goes here.The article text goes here.The article text goes here.</p><h3 id="h4108789bf5">Heading 3(h3)Heading 3(h3)Heading 3(h3)Heading 3(h3)</h3><p><strong>Bold</strong></p><p><em>Italic</em></p><p><u>Underline</u></p><p><s>Strikethrough</s></p><p><code>Code</code></p><p><code>&lt;div&gt;&lt;/div&gt;</code></p><p><span style="color: #ff0000">Red</span>　<span style="color: #062cff">Blue</span>　<span style="color: #e8ff00">Yellow</span></p><p> Left aligned</p><p style="text-align: center">Center aligned</p><p style="text-align: right">Right aligne</p><hr><blockquote><p>Blockquote　<strong>Blockquote　</strong>Blockquote　<strong>Blockquote　</strong>Blockquote　<strong>Blockquote　</strong>Blockquote　<strong>Blockquote　</strong>Blockquote　<strong>Blockquote　</strong>Blockquote　<strong>Blockquote　</strong>Blockquote　<strong>Blockquote</strong></p></blockquote><div data-filename="file"><pre><code>Code Block Code Block Code Block Code Block Code Block Code Block Code Block Code Block Code Block</code></pre></div><ul><li>Bullet list</li><li>Bullet list<ul><li>Nested<ul><li>Nested</li></ul></li></ul></li></ul><ol><li>Numbered list<ol><li>Numbered list</li><li>Numbered list<ol><li>Nested</li><li>Nested</li><li>Nested</li></ol></li></ol></li></ol><p><a href="https://example.com/">Link Text</a></p><p><a href="https://example.com/" target="_blank" rel="noopener noreferrer">Open in new tab</a></p><p><a href="https://example.com/" rel="nofollow">Do not follow link</a></p><figure><img src="IMAGE_URL_PLACEHOLDER" alt="" width="640" height="480"><figcaption>caption</figcaption></figure>',
};
const TITLE_TEMPLATES = {
  ja: (postNumber: string) =>
    `【ダミー#${postNumber}】「ではみなさんは、そういうふうに川だと言われたり、乳の流れたあとだと言われたりしていた、このぼんやりと白いものがほんとうは何かご承知ですか」先生は、黒板につるした大きな黒い星座の図の、上から下へ白くけぶった銀河帯のようなところを指しながら、みんなに問いをかけました。カムパネルラが手をあげました。それから四、五人手をあげました。ジョバンニも手をあげようとして、急いでそのままやめました。たしかにあれがみんな星だと、いつか雑誌で読んだのでしたが、このごろはジョバンニはまるで毎日教室でもねむく、本を読むひまも読む本もないので、なんだかどんなこともよくわからないという気持ちがするのでした。ところが先生は早くもそれを見つけたのでした。「ジョバンニさん。あなたはわかっているのでしょう」ジョバンニは勢いよく立ちあがりましたが、立ってみるともうはっきりとそれを答えることができないのでした。ザネリが前の席から`,
  en: (postNumber: string) =>
    `【dummy#${postNumber}】Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dui id ornare arcu odio ut sem nulla pharetra diam. Risus viverra adipiscing at in. Augue lacus viverra vitae congue eu consequat ac felis donec. Volutpat sed cras ornare arcu dui. Vitae nunc sed velit dignissim sodales ut eu sem integer. Faucibus in ornare quam viverra orci.`,
};
const LANGUAGES = ['ja', 'en'] as const;
type Lang = (typeof LANGUAGES)[number];

/**
 * ダミーニュース記事を生成する
 */
export function generateDummyNews() {
  const dummyDir = join(__dirname, '..', '..', 'dummy-json', 'news');
  const categoriesPath = join(dummyDir, 'categories.json');

  let categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf-8'));

  // カテゴリが空の場合はダミーカテゴリを生成
  if (categories.length === 0) {
    const baseDate = new Date(BASE_DATE);
    categories = CATEGORY_NAMES.map((name, index) => {
      const date = new Date(baseDate);
      date.setDate(date.getDate() - index);
      const dateString = date.toISOString();
      return {
        id: `dummy-category-${String(index + 1).padStart(2, '0')}`,
        createdAt: dateString,
        updatedAt: dateString,
        publishedAt: dateString,
        revisedAt: dateString,
        name: name,
      };
    });
    fs.writeFileSync(categoriesPath, JSON.stringify(categories, null, 2));
  }

  // ランダムにカテゴリを選択する関数
  const getRandomCategory = () => {
    const randomIndex = Math.floor(Math.random() * categories.length);
    return categories[randomIndex];
  };

  // ランダムに画像URLを選択する関数
  const getRandomImageUrl = () => {
    const randomIndex = Math.floor(Math.random() * IMAGE_URLS.length);
    return IMAGE_URLS[randomIndex];
  };

  // 新規ダミー記事を作成する関数
  const createNewDummyPost = (index: number, lang: Lang) => {
    const postNumber = String(index + 1).padStart(2, '0');
    const newId = `${ID_PREFIX}-${postNumber}`;
    const randomCategory = getRandomCategory();
    const randomImageUrl = getRandomImageUrl();

    // 日付も少し変える（基準日から過去に遡る）
    const baseDate = new Date(BASE_DATE);
    const daysAgo = index * DAYS_AGO_PER_POST;
    const newDate = new Date(baseDate);
    newDate.setDate(newDate.getDate() - daysAgo);
    const dateString = newDate.toISOString();

    // タイトルとコンテンツを生成
    const title = TITLE_TEMPLATES[lang](postNumber);
    const content = CONTENT_TEMPLATES[lang].replace(/IMAGE_URL_PLACEHOLDER/g, randomImageUrl);

    return {
      id: newId,
      createdAt: dateString,
      updatedAt: dateString,
      publishedAt: dateString,
      revisedAt: dateString,
      title: title,
      content: content,
      category: {
        id: randomCategory.id,
        createdAt: randomCategory.createdAt,
        updatedAt: randomCategory.updatedAt,
        publishedAt: randomCategory.publishedAt,
        revisedAt: randomCategory.revisedAt,
        name: randomCategory.name,
      },
      thumbnail: {
        url: randomImageUrl,
        height: THUMBNAIL_SIZE.height,
        width: THUMBNAIL_SIZE.width,
      },
    };
  };

  // 全て新規ダミー記事を生成（既存記事は上書き）
  const postsByLang: Record<Lang, unknown[]> = {
    ja: [],
    en: [],
  };

  // 各言語ごとに記事を生成
  for (const lang of LANGUAGES) {
    for (let i = 0; i < TARGET_COUNT; i++) {
      postsByLang[lang].push(createNewDummyPost(i, lang));
    }
  }

  // ファイルを書き込む
  fs.writeFileSync(join(dummyDir, 'ja.json'), JSON.stringify(postsByLang.ja, null, 2));
  fs.writeFileSync(join(dummyDir, 'en.json'), JSON.stringify(postsByLang.en, null, 2));

  console.log(`✅ ダミー記事(news)を生成しました`);
  console.log(`   - 日本語記事数: ${postsByLang.ja.length}`);
  console.log(`   - 英語記事数: ${postsByLang.en.length}`);
  console.log(`   - カテゴリ数: ${categories.length}`);
  console.log(
    `   - ID範囲: ${ID_PREFIX}-01 〜 ${ID_PREFIX}-${String(Math.max(postsByLang.ja.length, postsByLang.en.length)).padStart(2, '0')}`,
  );
}
