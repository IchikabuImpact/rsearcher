const { loadConfig } = require('../../config/loadConfig');
const { createDriver } = require('../../core/browser');
const { loginRakuten } = require('../../rakuten/auth');
const { fetchPointHistoryTableHtml } = require('./fetcher');
const { parsePointHistory } = require('./parser');
const { savePointHistory } = require('./repository');
const { exportToCsv } = require('../../../csvExporter');

async function runPointHistoryCollectFeature({ keepBrowserOpen = false } = {}) {
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

    const tableHtml = await fetchPointHistoryTableHtml(driver, process.cwd());
    if (!tableHtml) {
      return;
    }

    const records = parsePointHistory(tableHtml);
    console.log(`🔍 パース成功: ${records.length}件のポイント履歴を検出しました。`);
    await savePointHistory(config, records);
    await exportToCsv(config);
  } finally {
    if (driver && !keepBrowserOpen) {
      await driver.quit();
    }
  }
}

module.exports = { runPointHistoryCollectFeature };
