const { until, By } = require('selenium-webdriver');
const { openNewTab } = require('../../core/browser');

async function openKujiListInNewTab(driver) {
  console.log('🎁 ラッキーくじ一覧ページを開きます...');
  await openNewTab(driver, 'https://kuji.rakuten.co.jp/');
  const handles = await driver.getAllWindowHandles();
  await driver.switchTo().window(handles[handles.length - 1]);
  await driver.wait(until.elementLocated(By.css('a[href^="https://kuji.rakuten.co.jp/"]')), 15000);
}

module.exports = { openKujiListInNewTab };
