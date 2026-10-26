import type { Metadata } from "next";
import { SITE_NAME_EN, SITE_NAME_KO, SITE_URL } from "@/lib/site";

export const OG_IMAGE_PATH = "/og/logout-share.png";
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

export type Locale = "ko" | "en";

export const COMPANY_NAMES = {
  apple: { ko: "애플", en: "Apple" },
  google: { ko: "구글", en: "Google" },
  meta: { ko: "메타", en: "Meta" },
  instagram: { ko: "인스타그램", en: "Instagram" },
  samsung: { ko: "삼성", en: "Samsung" },
  naver: { ko: "네이버", en: "Naver" },
  kakao: { ko: "카카오", en: "Kakao" },
  x: { ko: "X", en: "X" },
} as const;

export type CompanySlug = keyof typeof COMPANY_NAMES;

export function isCompanySlug(slug: string): slug is CompanySlug {
  return slug in COMPANY_NAMES;
}

export function absoluteUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

export function englishPath(koPath: string) {
  const ko = koPath === "/" ? "/" : koPath.replace(/\/$/, "");
  return ko === "/" ? "/en" : `/en${ko}`;
}

export function ogImage(locale: Locale) {
  return {
    url: absoluteUrl(OG_IMAGE_PATH),
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
    alt:
      locale === "ko"
        ? "로그아웃 – 디지털 유산 안내. 계정 삭제, 데이터 다운로드, 추모 계정."
        : "LOGOUT – digital legacy guide. Account deletion, data download, and memorial accounts.",
    type: "image/png",
  };
}

type PageMetadataOptions = {
  locale: Locale;
  /** Korean path, including the leading slash. "/" for the homepage. */
  koPath: string;
  title: string;
  description: string;
  /** Use the title as-is, without the layout template. */
  absoluteTitle?: boolean;
  index?: boolean;
  follow?: boolean;
  /** Include ko/en/x-default alternates. Turn off for noindex previews. */
  languages?: boolean;
  ogType?: "website" | "article";
};

export function pageMetadata({
  locale,
  koPath,
  title,
  description,
  absoluteTitle = false,
  index = true,
  follow = true,
  languages = true,
  ogType = "website",
}: PageMetadataOptions): Metadata {
  const ko = koPath === "/" ? "/" : koPath.startsWith("/") ? koPath : `/${koPath}`;
  const en = englishPath(ko);
  const canonical = locale === "ko" ? ko : en;
  const image = ogImage(locale);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical,
      ...(languages
        ? {
            languages: {
              "ko-KR": ko,
              en,
              "x-default": ko,
            },
          }
        : {}),
    },
    openGraph: {
      type: ogType,
      locale: locale === "ko" ? "ko_KR" : "en_US",
      alternateLocale: locale === "ko" ? ["en_US"] : ["ko_KR"],
      url: canonical,
      siteName: locale === "ko" ? SITE_NAME_KO : SITE_NAME_EN,
      title,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
    ...(index && follow ? {} : { robots: { index, follow } }),
  };
}

export function companyMetadata(locale: Locale, slug: string, description: string): Metadata {
  const names = isCompanySlug(slug) ? COMPANY_NAMES[slug] : null;
  const name = names ? names[locale] : slug;
  const title = locale === "ko" ? `${name} 디지털 유산` : `${name} digital legacy`;

  return pageMetadata({
    locale,
    koPath: `/company/${slug}`,
    title,
    description,
    ogType: "article",
  });
}
