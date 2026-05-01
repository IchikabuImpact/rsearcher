# Rakuten Web Search Automation

楽天ログイン後に、楽天WEB検索を自動で実行する最小構成版です。

## 必要なもの

- Node.js
- Google Chrome
- ChromeDriver（Chromeバージョンと一致するもの）
- `config.js`（`email`, `pass`, `chromedriver` を設定）

## 実行方法

```bash
npm install
npm run websearch
# または
npm start
```

## 構成

- `rsearch.js`: エントリーポイント
- `scripts/run-web-search.js`: Web検索機能実行スクリプト
- `src/rakuten/auth.js`: 楽天ログインとWeb検索側の認証連携
- `src/features/webSearch/*`: キーワード読み込みと検索実行
- `src/core/browser.js`: Selenium/ChromeDriver 初期化

