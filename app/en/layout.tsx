import type { Metadata } from "next";
import { ogImage } from "@/lib/seo";
import { SITE_DESCRIPTION_EN, SITE_TITLE_EN } from "@/lib/site";

const shareImage = ogImage("en");

export const metadata: Metadata = {
  title: { default: SITE_TITLE_EN, template: "%s | LOGOUT" },
  description: SITE_DESCRIPTION_EN,
  keywords: ["digital legacy", "account deletion", "data download", "memorial account", "legacy contact"],
  alternates: {
    canonical: "/en",
    languages: {
      "ko-KR": "/",
      en: "/en",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["ko_KR"],
    url: "/en",
    siteName: "LOGOUT",
    title: SITE_TITLE_EN,
    description: SITE_DESCRIPTION_EN,
    images: [shareImage],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE_EN,
    description: SITE_DESCRIPTION_EN,
    images: [shareImage.url],
  },
};

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return <div className="english-site">{children}</div>;
}
