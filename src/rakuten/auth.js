const { By, until, Key } = require('selenium-webdriver');

const LOGIN_URL = 'https://login.account.rakuten.com/sso/authorize?client_id=rakuten_ichiba_top_web&service_id=s245&response_type=code&scope=openid&redirect_uri=https%3A%2F%2Fwww.rakuten.co.jp%2F#/sign_in';

async function loginRakuten(driver, { email, pass }) {
  console.log('🔑 楽天のログインページにアクセスしています...');
  await driver.get(LOGIN_URL);

  const userIdInput = await driver.wait(until.elementLocated(By.id('user_id')), 10000);
  await driver.wait(until.elementIsVisible(userIdInput), 5000);
  await userIdInput.clear();
  await userIdInput.sendKeys(email, Key.RETURN);

  const passwordInput = await driver.wait(until.elementLocated(By.id('password_current')), 10000);
  await driver.wait(until.elementIsVisible(passwordInput), 5000);
  await passwordInput.clear();
  await passwordInput.sendKeys(pass, Key.RETURN);

  console.log('📝 ログイン情報を入力しました。ログイン完了を待機中...');
  await driver.sleep(5000);
}

async function ensureWebSearchAuthenticated(driver) {
  await driver.get('https://websearch.rakuten.co.jp/SimpleTop');
  await driver.sleep(3000);

  try {
    const loginEls = await driver.findElements(By.xpath('//a[contains(., "ログイン")] | //button[contains(., "ログイン")]'));
    if (loginEls.length > 0) {
      console.log('🔗 「ログイン」ボタンを検知しました。クリックして認証状態を紐付けます...');
      await loginEls[0].click();
      await driver.sleep(8000);
    } else {
      console.log('✅ 「ログイン」等のリンクは見当たりませんでした（認証反映済みと推測）');
    }
  } catch (e) {
    console.log('✅ 要素取得中にエラーが出ましたが、おそらく認証済みです。進行します。');
  }
}

module.exports = {
  loginRakuten,
  ensureWebSearchAuthenticated,
};
