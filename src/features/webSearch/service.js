const { ensureWebSearchAuthenticated } = require('../../rakuten/auth');
const { randomInt } = require('../../core/browser');

async function runWebSearch(driver, searchUrls) {
  console.log('🔍 キーワード検索の前に、Web検索のトップページでログイン連携を行います...');
  await ensureWebSearchAuthenticated(driver);

  console.log(`🔍 続いて、キーワード検索（合計 ${searchUrls.length} 件）を同一タブで実行します...`);
  for (let idx = 0; idx < searchUrls.length; idx++) {
    const url = searchUrls[idx];
    console.log(`[${idx + 1}/${searchUrls.length}] 検索を実行しています: ${url}`);
    await driver.get(url);

    if (idx < searchUrls.length - 1) {
      const searchWaitTime = randomInt(10000, 20000);
      console.log(`  ⏳ 次のキーワード検索まで約 ${Math.round(searchWaitTime / 1000)} 秒待機します...`);
      await driver.sleep(searchWaitTime);
    }
  }
}

module.exports = { runWebSearch };
