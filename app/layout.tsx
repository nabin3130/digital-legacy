import "./globals.css";
import "./brand.css";
import "./navigation.css";
import "./redesign.css";
import "./design-system.css";
import Script from "next/script";
import type { Metadata } from "next";
import { ogImage } from "@/lib/seo";
import { CONTACT_EMAIL, SITE_DESCRIPTION, SITE_KEYWORDS, SITE_TITLE_EN, SITE_TITLE_KO, SITE_URL } from "@/lib/site";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const shareImage = ogImage("ko");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE_KO,
    template: "%s | 로그아웃",
  },
  description: SITE_DESCRIPTION,
  keywords: [...SITE_KEYWORDS],
  alternates: {
    canonical: "/",
    languages: {
      "ko-KR": "/",
      en: "/en",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    alternateLocale: ["en_US"],
    url: "/",
    siteName: "로그아웃",
    title: SITE_TITLE_KO,
    description: SITE_DESCRIPTION,
    images: [shareImage],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE_KO,
    description: SITE_DESCRIPTION,
    images: [shareImage.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "로그아웃",
      alternateName: "LOGOUT",
      url: SITE_URL,
      email: CONTACT_EMAIL,
      description: SITE_DESCRIPTION,
      image: shareImage.url,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "로그아웃",
      alternateName: ["LOGOUT", SITE_TITLE_EN],
      description: SITE_DESCRIPTION,
      inLanguage: ["ko-KR", "en"],
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: 'document.documentElement.lang=location.pathname==="/en"||location.pathname.indexOf("/en/")===0?"en":"ko"',
          }}
        />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css" />
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
        {/* 구글 애드센스 자동 광고/인증 스크립트 */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2192845166334509"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        <SiteHeader />

        {children}

        <SiteFooter />
      </body>
    </html>
  );
}
