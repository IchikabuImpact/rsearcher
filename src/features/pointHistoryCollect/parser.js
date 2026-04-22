const cheerio = require('cheerio');
const crypto = require('crypto');

function parsePointHistory(html) {
  const $ = cheerio.load(html);
  const results = [];

  $('tr.get, tr.use, tr.exchange').each((i, el) => {
    const row = $(el);

    const eventDateRaw = row.find('td.date').html() || '';
    const eventDate = eventDateRaw.replace(/<br>/i, '/').replace(/[\r\n\t\s]+/g, '').trim();

    const service = row.find('td.service').text().replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim();

    const detailCell = row.find('td.detail').clone();
    const dataDiv = detailCell.find('.data');
    const infoText = dataDiv.find('.info').text().replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim();
    dataDiv.remove();
    const content = detailCell.text().replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim();

    let pointText = row.find('td.point').text().replace(/[,]/g, '').trim();
    let points = parseInt(pointText, 10);
    if (isNaN(points)) points = 0;

    const actionCell = row.find('td.action').clone();
    const exDiv = actionCell.find('.ex');
    const exText = exDiv.text().replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim();
    exDiv.remove();
    const type = actionCell.text().replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim();

    const noteDivText = row.find('td.note').text().replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim();
    const notes = [];
    if (exText) notes.push(`[${exText}]`);
    if (infoText) notes.push(infoText);
    if (noteDivText) notes.push(noteDivText);
    const note = notes.join(' | ');

    const rawKeyString = `${eventDate}_${service}_${content}_${points}_${type}_${note}`;
    const hashKey = crypto.createHash('sha256').update(rawKeyString).digest('hex');

    results.push({ eventDate, service, content, points, type, note, hashKey });
  });

  return results;
}

module.exports = { parsePointHistory };
