const { loadConfig } = require('../../config/loadConfig');
const { createDriver } = require('../../core/browser');
const { loginRakuten } = require('../../rakuten/auth');
const { openKujiListInNewTab } = require('./openList');
const { openAllKujiLinks } = require('./openKuji');

async function runKujiFeature({ openEachKuji = true, keepBrowserOpen = true } = {}) {
  const config = loadConfig();
  const { email, pass, chromedriver } = config;

  if (!email || !pass || !chromedriver) {
    console.error('❌ config.jsに email, pass, chromedriver のいずれかが設定されていません。');
    process.exit(1);
  }

  let driver;
  try {
    driver = await createDriver(chromedriver);
    await loginRakuten(driver, { email, pass });
    await openKujiListInNewTab(driver);
    if (openEachKuji) {
      await openAllKujiLinks(driver);
    }

    console.log('✅ Kuji flow が完了しました。');
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

module.exports = { runKujiFeature };
