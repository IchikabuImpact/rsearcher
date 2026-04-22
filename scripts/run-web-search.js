const { runWebSearchFeature } = require('../src/features/webSearch/run');

runWebSearchFeature().catch((e) => {
  console.error('❌ Web Search実行エラー:', e.message);
  process.exit(1);
});
