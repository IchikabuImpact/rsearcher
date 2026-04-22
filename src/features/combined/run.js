const path = require('path');
const { loadConfig } = require('../../config/loadConfig');
const { createDriver } = require('../../core/browser');
const { loginRakuten } = require('../../rakuten/auth');
const { fetchPointHistoryTableHtml } = require('../pointHistoryCollect/fetcher');
const { parsePointHistory } = require('../pointHistoryCollect/parser');
const { savePointHistory } = require('../pointHistoryCollect/repository');
const { exportToCsv } = require('../../../csvExporter');
const { loadSearchUrls } = require('../webSearch/keywordSource');
const { runWebSearch } = require('../webSearch/service');
const { openNewTab } = require('../../core/browser');
const { openAllKujiLinks } = require('../kuji/openKuji');

async function runLegacyCombinedFlow({ keepBrowserOpen = true } = {}) {
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

    await openNewTab(driver, 'https://kuji.rakuten.co.jp/');
    await openNewTab(driver, 'https://point.rakuten.co.jp/history/?l-id=point_header_history');

    const handles = await driver.getAllWindowHandles();
    await driver.switchTo().window(handles[handles.length - 1]);

    const tableHtml = await fetchPointHistoryTableHtml(driver, process.cwd());
    if (tableHtml) {
      const records = parsePointHistory(tableHtml);
      console.log(`🔍 パース成功: ${records.length}件のポイント履歴を検出しました。`);
      await savePointHistory(config, records);
      await exportToCsv(config);
    }

    await driver.switchTo().window(handles[handles.length - 2]);
    await openAllKujiLinks(driver);

    const searchUrls = loadSearchUrls({ keywordsFilePath: path.join(process.cwd(), 'keywords.txt') });
    await runWebSearch(driver, searchUrls);

    console.log('✅ 完了しました！ブラウザはこのまま手動で操作できます。（Ctrl+Cで終了すると一時的にブラウザが閉じる可能性があります）');
    if (keepBrowserOpen) {
      await driver.sleep(3600 * 1000);
    }
  } catch (error) {
    console.error('❌ 実行中にエラーが発生しました:', error.message);
  } finally {
    // legacy behavior: keep browser open unless opted out
    if (driver && !keepBrowserOpen) {
      await driver.quit();
    }
  }
}

module.exports = { runLegacyCombinedFlow };
