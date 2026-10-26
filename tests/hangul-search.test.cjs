const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const ts = require('typescript');

require.extensions['.ts'] = (module, filename) => {
  const output = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }, fileName: filename,
  });
  module._compile(output.outputText, filename);
};
const { toChosung, matchesServiceQuery } = require('../lib/hangul-search.ts');

test('extracts service initials and preserves bare choseong and non-Hangul', () => {
  for (const [name, initials] of [['카카오', 'ㅋㅋㅇ'], ['네이버', 'ㄴㅇㅂ'], ['구글', 'ㄱㄱ'], ['인스타그램', 'ㅇㅅㅌㄱㄹ']]) {
    assert.equal(toChosung(name), initials);
  }
  assert.equal(toChosung('가힣 까따빠싸짜'), 'ㄱㅎ ㄲㄸㅃㅆㅉ');
  assert.equal(toChosung('ㄱㄲ Kakao 😀'), 'ㄱㄲ Kakao 😀');
  assert.equal(toChosung(''), '');
});

test('supports complete and partial chosung sequences derived from existing keywords', () => {
  for (const [query, words] of [
    ['ㅋㅋ', ['카카오', 'kakao']], ['ㅋㅋㅇ', ['카카오']], ['ㄴㅇㅂ', ['네이버', 'naver']],
    ['ㄱㄱ', ['구글']], ['ㅇㅅㅌ', ['인스타그램']], ['ㅇㅅㅌㄱㄹ', ['인스타그램']],
    ['ㅌㄱ', ['인스타그램']], [' ㄴ ㅇ\tㅂ ', ['네 이 버']],
    ['ㄲ', ['까치']], ['ㅋㅋ', ['ㅋㅋㅇ']],
  ]) assert.equal(matchesServiceQuery(query, words), true, query);
});

test('retains full Hangul, ASCII case-insensitive and keyword substring matches', () => {
  const words = ['카카오', 'kakao', '카카오톡'];
  for (const query of ['카카오', '카카', '카오', '카카오톡', 'kakao', 'KaKaO', '  KAK  ', '톡']) {
    assert.equal(matchesServiceQuery(query, words), true, query);
  }
  assert.equal(matchesServiceQuery('😀', ['이모지 😀']), true);
});

test('empty queries match; unrelated initials and Latin-only words do not', () => {
  for (const query of ['', '  ', '\t\n']) assert.equal(matchesServiceQuery(query, []), true);
  assert.equal(matchesServiceQuery('ㄴㅇㅂ', ['카카오', 'kakao']), false);
  assert.equal(matchesServiceQuery('ㅋㅋ', ['kakao', 'KAKAO']), false);
  assert.equal(matchesServiceQuery('ㅋ', []), false);
  assert.equal(matchesServiceQuery('ㄱ', ['까치']), false);
});

test('mixed syllable/Latin queries do not enter chosung mode', () => {
  for (const query of ['카ㅋ', '카k', 'ㅋk', '카 카오', 'ㄳ']) {
    assert.equal(matchesServiceQuery(query, ['카카오', 'kakao']), false, query);
  }
  assert.equal(matchesServiceQuery('카ㅋ', ['별칭 카ㅋ']), true, 'literal mixed substrings still work');
});

test('KO directory examples select only the intended company', () => {
  const services = [
    ['카카오', 'kakao', '카카오톡'], ['네이버', 'naver'], ['구글', 'google'],
    ['삼성', 'samsung'], ['애플', 'apple'], ['메타', 'meta'], ['인스타그램', 'instagram'], ['엑스', 'twitter'],
  ];
  for (const [query, expected] of [['ㅋㅋ', '카카오'], ['ㅋㅋㅇ', '카카오'], ['ㄴㅇㅂ', '네이버'], ['ㄱㄱ', '구글'], ['ㅇㅅㅌ', '인스타그램'], ['ㅇㅅㅌㄱㄹ', '인스타그램']]) {
    assert.deepEqual(services.filter(words => matchesServiceQuery(query, words)).map(words => words[0]), [expected]);
  }
});
