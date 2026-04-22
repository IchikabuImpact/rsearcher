const { runLegacyCombinedFlow } = require('./src/features/combined/run');

runLegacyCombinedFlow().catch((e) => {
  console.error('❌ 実行中にエラーが発生しました:', e.message);
  process.exit(1);
});
