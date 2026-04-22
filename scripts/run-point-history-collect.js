const { runPointHistoryCollectFeature } = require('../src/features/pointHistoryCollect/run');

runPointHistoryCollectFeature().catch((e) => {
  console.error('❌ Point History Collect実行エラー:', e.message);
  process.exit(1);
});
