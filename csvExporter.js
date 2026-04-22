const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function exportToCsv(config) {
    if (!config.csvExportPath) {
        console.log('CSV出力パスが設定されていません。エクスポートをスキップします。');
        return;
    }

    let connection;
    try {
        connection = await mysql.createConnection({
            host: config.DB_HOST,
            user: config.DB_USER,
            password: config.DB_PASSWORD,
            database: config.DB_NAME
        });

        // ユーザ指定のフォーマットSQL
        const query = `
            SELECT
                id,
                DATE_FORMAT(event_date, '%m/%d') AS dt,
                points AS pt,
                LEFT(type, 4) AS tp,
                LEFT(REPLACE(REPLACE(service, '　', ''), ' ', ''), 12) AS svc,
                LEFT(REPLACE(REPLACE(content, '　', ''), ' ', ''), 24) AS cnt
            FROM history
            ORDER BY event_date DESC, id DESC;
        `;

        const [rows] = await connection.execute(query);

        if (rows.length === 0) {
            console.log('エクスポートするデータがありません。');
            return;
        }

        // CSVヘッダー
        const header = ['id', '日付', 'ポイント', '種別', 'サービス', '内容'].join(',');

        // データ行の生成
        const csvRows = rows.map(r => {
            // カンマや改行が含まれる場合はダブルクォーテーションで囲む
            const escapeCsv = (str) => {
                if (str == null) return '""';
                let stringified = String(str);
                if (stringified.includes(',') || stringified.includes('"') || stringified.includes('\n')) {
                    stringified = '"' + stringified.replace(/"/g, '""') + '"';
                }
                return stringified;
            };

            return [
                r.id,
                escapeCsv(r.dt),
                r.pt,
                escapeCsv(r.tp),
                escapeCsv(r.svc),
                escapeCsv(r.cnt)
            ].join(',');
        });

        // テキストを結合 (BOMを付けるとExcel等でも文字化けしづらい)
        const csvContent = '\uFEFF' + [header, ...csvRows].join('\n');

        fs.writeFileSync(config.csvExportPath, csvContent, 'utf8');
        console.log(`✅ CSVエクスポート完了: ${config.csvExportPath}`);

    } catch (error) {
        console.error('❌ CSVのエクスポート中にエラーが発生しました:', error.message);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

module.exports = { exportToCsv };
