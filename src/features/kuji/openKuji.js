const { By } = require('selenium-webdriver');
const { extractKujiUrlsFromHrefs } = require('../../../kuji-utils');
const { openNewTab, randomInt } = require('../../core/browser');

async function openAllKujiLinks(driver) {
  console.log('🔄 くじのリンクを抽出して別タブで順次開きます...');
  const kujiLinks = await driver.findElements(By.css('a[href^="https://kuji.rakuten.co.jp/"]'));
  const hrefs = [];
  for (const link of kujiLinks) {
    hrefs.push(await link.getAttribute('href'));
  }
  const kujiUrls = extractKujiUrlsFromHrefs(hrefs);
  console.log(`抽出されたくじリンクの数: ${kujiUrls.length}件`);

  for (let idx = 0; idx < kujiUrls.length; idx++) {
    const url = kujiUrls[idx];
    console.log(`[${idx + 1}/${kujiUrls.length}] くじを別タブで開いています: ${url}`);
    await openNewTab(driver, url);
    const waitTime = randomInt(3000, 20000);
    console.log(`  ⏳ 次のくじタブを開くまで約 ${Math.round(waitTime / 1000)} 秒待機します...`);
    await driver.sleep(waitTime);
  }

  return kujiUrls;
}

module.exports = { openAllKujiLinks };
