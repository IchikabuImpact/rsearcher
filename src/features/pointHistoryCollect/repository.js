const { upsertHistoryRecords } = require('../../db/historyRepository');

async function savePointHistory(config, records) {
  await upsertHistoryRecords(config, records);
}

module.exports = { savePointHistory };
