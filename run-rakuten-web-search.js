const { runWebSearchFeature } = require('./src/features/webSearch/run');

runWebSearchFeature().catch((e) => {
  console.error('❌ 実行中にエラーが発生しました:', e.message);
  process.exit(1);
});
