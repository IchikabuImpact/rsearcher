function normalizeKeywordLines(text, minLength = 3, maxLength = 20) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length >= minLength && line.length <= maxLength);
}

function shuffleInPlace(items, rng = Math.random) {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

function selectRandomKeywords(lines, count = 5, rng = Math.random) {
  const copied = [...lines];
  shuffleInPlace(copied, rng);
  return copied.slice(0, count);
}

function buildRakutenSearchUrl(keyword) {
  const encoded = encodeURIComponent(keyword);
  return `https://websearch.rakuten.co.jp/Web?qt=${encoded}&query=${encoded}&ref=top&col=OW&svx=101210&x=0&y=0`;
}

function buildRakutenSearchUrls(keywords) {
  return keywords.map(buildRakutenSearchUrl);
}

function extractKujiUrlsFromHrefs(hrefs) {
  return Array.from(
    new Set(
      hrefs.filter(
        (href) => href && href.startsWith('https://kuji.rakuten.co.jp/') && href !== 'https://kuji.rakuten.co.jp/'
      )
    )
  );
}

module.exports = {
  normalizeKeywordLines,
  shuffleInPlace,
  selectRandomKeywords,
  buildRakutenSearchUrl,
  buildRakutenSearchUrls,
  extractKujiUrlsFromHrefs,
};
