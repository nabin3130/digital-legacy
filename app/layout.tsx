import "./globals.css";
import "./brand.css";
import "./theme.css";
import "./navigation.css";
import "./redesign.css";
import Script from "next/script"; // 👈 추가된 부분
import type { Metadata } from "next";
import { SITE_DESCRIPTION, SITE_KEYWORDS, SITE_URL } from "@/lib/site";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "로그아웃 – 디지털 유산 안내",
    template: "%s | 로그아웃",
  },
  description: SITE_DESCRIPTION,
  keywords: [...SITE_KEYWORDS],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    siteName: "로그아웃",
    title: "로그아웃 – 디지털 유산 안내",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: "로그아웃 – 디지털 유산 안내",
    description: SITE_DESCRIPTION,
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
      url: SITE_URL,
      email: "kimnabin01@gmail.com",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "로그아웃",
      description: SITE_DESCRIPTION,
      inLanguage: "ko-KR",
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
    <html lang="ko">
      <head>
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
