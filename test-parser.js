const fs = require('fs');
const { parsePointHistory } = require('./point-history-parser');

try {
    const html = fs.readFileSync('point_history_sample.html', 'utf8');
    const records = parsePointHistory(html);
    console.log(`抽出件数: ${records.length}件`);
    console.log('--- サンプル(上位3件) ---');
    console.log(JSON.stringify(records.slice(0, 3), null, 2));
} catch(e) {
    console.error(e);
}
