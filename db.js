const { upsertHistoryRecords } = require('./src/db/historyRepository');

async function upsertHistory(config, records) {
  return upsertHistoryRecords(config, records);
}

module.exports = { upsertHistory };
