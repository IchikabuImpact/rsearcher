const path = require('path');
const { loadConfig } = require('../../config/loadConfig');
const { createDriver } = require('../../core/browser');
const { loginRakuten } = require('../../rakuten/auth');
const { loadSearchUrls } = require('./keywordSource');
const { runWebSearch } = require('./service');

async function runWebSearchFeature({ keepBrowserOpen = true } = {}) {
  const config = loadConfig();
  const { email, pass, chromedriver } = config;

  if (!email || !pass || !chromedriver) {
    console.error('❌ config.jsに email, pass, chromedriver のいずれかが設定されていません。');
    process.exit(1);
  }

  let driver;
  try {
    console.log('🔄 ChromeDriverを設定しています...');
    driver = await createDriver(chromedriver);

    await loginRakuten(driver, { email, pass });

    const searchUrls = loadSearchUrls({ keywordsFilePath: path.join(process.cwd(), 'keywords.txt') });
    await runWebSearch(driver, searchUrls);

    console.log('✅ Web Search automation が完了しました。');
    if (keepBrowserOpen) {
      console.log('ブラウザは手動確認のため1時間待機します。');
      await driver.sleep(3600 * 1000);
    }
  } finally {
    if (driver && !keepBrowserOpen) {
      await driver.quit();
    }
  }
}

module.exports = { runWebSearchFeature };
