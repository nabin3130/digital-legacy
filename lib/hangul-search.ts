const CHOSEONG = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";
const CHOSEONG_QUERY = /^[ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ\s]+$/u;

/** Decompose modern Hangul syllables; preserve bare jamo and other characters. */
export function toChosung(text: string): string {
  return Array.from(text, (character) => {
    const code = character.codePointAt(0)!;
    return code >= 0xac00 && code <= 0xd7a3
      ? CHOSEONG[Math.floor((code - 0xac00) / (21 * 28))]
      : character;
  }).join("");
}

/** Existing substring search, plus initial-consonant-only search over the same keywords. */
export function matchesServiceQuery(query: string, haystacks: readonly string[]): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  const initials = CHOSEONG_QUERY.test(normalized) ? normalized.replace(/\s/g, "") : null;
  return haystacks.some((text) =>
    text.toLowerCase().includes(normalized)
    || (initials !== null && toChosung(text).replace(/\s/g, "").includes(initials)),
  );
}
