function loadConfig() {
  try {
    return require('../../config.js');
  } catch (e) {
    console.error('❌ config.jsの読み込みに失敗しました。config.js.sampleをコピーして適切な値を設定してください。', e.message);
    process.exit(1);
  }
}

module.exports = { loadConfig };
