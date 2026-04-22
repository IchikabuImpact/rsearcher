const test = require('node:test');
const assert = require('node:assert/strict');

const {
  normalizeKeywordLines,
  selectRandomKeywords,
  buildRakutenSearchUrl,
  buildRakutenSearchUrls,
  extractKujiUrlsFromHrefs,
} = require('../kuji-utils');

test('normalizeKeywordLines trims lines and keeps only 3-20 chars', () => {
  const input = '  aa  \n abc \n 12345678901234567890 \n123456789012345678901\n\n  楽天カード  ';
  const actual = normalizeKeywordLines(input);

  assert.deepEqual(actual, ['abc', '12345678901234567890', '楽天カード']);
});

test('selectRandomKeywords picks deterministic subset with custom rng', () => {
  const lines = ['a1', 'a2', 'a3', 'a4', 'a5', 'a6'];
  const sequence = [0.6, 0.1, 0.9, 0.3, 0.2];
  let idx = 0;
  const rng = () => sequence[idx++ % sequence.length];

  const selected = selectRandomKeywords(lines, 3, rng);

  assert.equal(selected.length, 3);
  assert.deepEqual(selected, ['a2', 'a3', 'a5']);
});

test('buildRakutenSearchUrl encodes Japanese keyword correctly', () => {
  const url = buildRakutenSearchUrl('楽天ポイント');
  assert.match(url, /qt=%E6%A5%BD%E5%A4%A9%E3%83%9D%E3%82%A4%E3%83%B3%E3%83%88/);
  assert.match(url, /query=%E6%A5%BD%E5%A4%A9%E3%83%9D%E3%82%A4%E3%83%B3%E3%83%88/);
});

test('buildRakutenSearchUrls maps all keywords', () => {
  const urls = buildRakutenSearchUrls(['aaa', 'bbb']);
  assert.equal(urls.length, 2);
  assert.ok(urls[0].includes('qt=aaa'));
  assert.ok(urls[1].includes('qt=bbb'));
});

test('extractKujiUrlsFromHrefs removes duplicates and root URL', () => {
  const hrefs = [
    'https://kuji.rakuten.co.jp/',
    'https://kuji.rakuten.co.jp/abc',
    null,
    'https://example.com/x',
    'https://kuji.rakuten.co.jp/abc',
    'https://kuji.rakuten.co.jp/def',
  ];

  const urls = extractKujiUrlsFromHrefs(hrefs);

  assert.deepEqual(urls, ['https://kuji.rakuten.co.jp/abc', 'https://kuji.rakuten.co.jp/def']);
});
