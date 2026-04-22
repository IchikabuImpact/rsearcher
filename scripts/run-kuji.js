const { runKujiFeature } = require('../src/features/kuji/run');

runKujiFeature().catch((e) => {
  console.error('❌ Kuji実行エラー:', e.message);
  process.exit(1);
});
