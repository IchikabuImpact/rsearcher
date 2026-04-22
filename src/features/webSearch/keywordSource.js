const fs = require('fs');
const path = require('path');
const {
  normalizeKeywordLines,
  selectRandomKeywords,
  buildRakutenSearchUrls,
} = require('../../../kuji-utils');

function loadSearchUrls({ keywordsFilePath, fallbackKeywords, pickCount = 5 }) {
  let urls = [];
  try {
    const data = fs.readFileSync(keywordsFilePath || path.join(process.cwd(), 'keywords.txt'), 'utf8');
    const validLines = normalizeKeywordLines(data);
    const selectedKeywords = selectRandomKeywords(validLines, pickCount);
    urls = buildRakutenSearchUrls(selectedKeywords);
  } catch (e) {
    console.warn('⚠️ keywords.txt の読み取りに失敗しました。', e.message);
  }

  if (urls.length === 0) {
    urls = buildRakutenSearchUrls(
      fallbackKeywords || ['楽天ポイント', 'お買い物マラソン', '楽天トラベル', 'ふるさと納税', '楽天カード証券']
    );
  }

  return urls;
}

module.exports = { loadSearchUrls };
