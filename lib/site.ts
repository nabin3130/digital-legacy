const DEFAULT_SITE_URL = "https://digital-legacy-five.vercel.app";

function readSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || process.env.SITE_URL?.trim();
  if (!raw) return DEFAULT_SITE_URL;

  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

  try {
    const url = new URL(withProtocol);
    if (url.protocol !== "http:" && url.protocol !== "https:") return DEFAULT_SITE_URL;
    return url.origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

/** Public origin used for metadataBase, canonical URLs, Open Graph, sitemap, and robots. */
export const SITE_URL = readSiteUrl();

export const SITE_NAME_KO = "로그아웃";
export const SITE_NAME_EN = "LOGOUT";

export const SITE_DESCRIPTION =
  "디지털 유산을 차분하게 정리할 수 있도록, 주요 서비스의 계정 삭제, 데이터 다운로드, 추모 계정 절차를 공식 정책 기준으로 안내합니다.";

export const SITE_DESCRIPTION_EN =
  "A calm guide to digital legacy. Official steps for account deletion, data download, and memorial accounts on major services.";

export const SITE_TITLE_KO = "로그아웃 – 디지털 유산 안내";
export const SITE_TITLE_EN = "LOGOUT – Digital Legacy Guide";

export const SITE_KEYWORDS = [
  "디지털 유산",
  "계정 삭제",
  "데이터 다운로드",
  "추모 계정",
  "휴면 계정 관리자",
  "유산 관리자",
  "고인 계정",
  "구글 디지털 유산",
  "애플 유산 관리자",
  "네이버 사망자 계정",
  "카카오 추모 프로필",
  "삼성 디지털 유산",
  "페이스북 추모 계정",
  "인스타그램 추모 계정",
  "로그아웃",
] as const;

export const CONTACT_EMAIL = "kimnabin01@gmail.com";
