const fs = require('fs');
const path = require('path');
const { By, until } = require('selenium-webdriver');

async function fetchPointHistoryTableHtml(driver, outputDir = process.cwd()) {
  await driver.get('https://point.rakuten.co.jp/history/?l-id=point_header_history');
  console.log('🔄 ポイント履歴のページを待機しています...');

  try {
    const tableEl = await driver.wait(
      until.elementLocated(By.xpath('//table[.//th[contains(text(), "利用日") or contains(text(), "獲得日") or contains(text(), "サービス")]] | /html/body/div[2]/div/div[2]/div/div/div/table')),
      15000
    );
    const tableHtml = await tableEl.getAttribute('outerHTML');
    fs.writeFileSync(path.join(outputDir, 'point_history_sample.html'), tableHtml, 'utf8');
    console.log('✅ ポイント履歴テーブルのHTMLを保存しました (point_history_sample.html)');
    return tableHtml;
  } catch (e) {
    console.warn('⚠️ ポイント履歴テーブルの取得に失敗しました:', e.message);
    const pageSource = await driver.getPageSource();
    fs.writeFileSync(path.join(outputDir, 'failed_history_page.html'), pageSource, 'utf8');
    return null;
  }
}

module.exports = { fetchPointHistoryTableHtml };
