const { createDbConnection } = require('./connection');

async function upsertHistoryRecords(config, records, limit = 30) {
  if (!records || records.length === 0) {
    console.log('保存する履歴レコードがありません。');
    return;
  }

  const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = config;
  if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME) {
    console.error('DB設定が不完全です。保存をスキップします。');
    return;
  }

  let connection;
  try {
    connection = await createDbConnection(config);
    const topRecords = records.slice(0, limit);
    let insertedCount = 0;
    let updatedCount = 0;

    const query = `
      INSERT INTO history (event_date, service, content, points, type, note, hash_key)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
          event_date = VALUES(event_date),
          service = VALUES(service),
          content = VALUES(content),
          points = VALUES(points),
          type = VALUES(type),
          note = VALUES(note)
    `;

    for (const r of topRecords) {
      const [result] = await connection.execute(query, [
        r.eventDate,
        r.service,
        r.content,
        r.points,
        r.type,
        r.note,
        r.hashKey,
      ]);

      if (result.affectedRows === 1) insertedCount++;
      else if (result.affectedRows === 2) updatedCount++;
    }

    console.log(`✅ DB保存完了: 新規 ${insertedCount}件, 更新 ${updatedCount}件 (上位${topRecords.length}件中)`);
  } catch (e) {
    console.error('❌ DBへの保存中にエラーが発生しました:', e.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function fetchHistoriesForDashboard(config) {
  let connection;
  try {
    connection = await createDbConnection(config);
    const query = `
      SELECT
          id,
          event_date AS raw_date,
          DATE_FORMAT(event_date, '%m/%d') AS dt,
          DATE_FORMAT(event_date, '%Y/%m/%d') AS dt_full,
          points AS pt,
          type AS tp_full,
          LEFT(type, 4) AS tp,
          REPLACE(REPLACE(service, '　', ''), ' ', '') AS svc,
          REPLACE(REPLACE(content, '　', ''), ' ', '') AS cnt
      FROM history
      ORDER BY event_date DESC, id DESC;
    `;
    const [rows] = await connection.execute(query);
    return rows;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

module.exports = {
  upsertHistoryRecords,
  fetchHistoriesForDashboard,
};
