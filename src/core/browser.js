const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

function buildChromeOptions({ headless = false } = {}) {
  const options = new chrome.Options();
  options.excludeSwitches('enable-logging');
  options.addArguments('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36');
  if (headless) {
    options.addArguments('--headless=new');
  }
  return options;
}

async function createDriver(chromedriverPath, { headless = false } = {}) {
  const serviceBuilder = new chrome.ServiceBuilder(chromedriverPath);
  const options = buildChromeOptions({ headless });
  return new Builder()
    .forBrowser('chrome')
    .setChromeService(serviceBuilder)
    .setChromeOptions(options)
    .build();
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function openNewTab(driver, url) {
  await driver.executeScript("window.open(arguments[0], '_blank');", url);
}

async function switchToLastTab(driver) {
  const handles = await driver.getAllWindowHandles();
  await driver.switchTo().window(handles[handles.length - 1]);
  return handles;
}

module.exports = {
  createDriver,
  randomInt,
  openNewTab,
  switchToLastTab,
};
