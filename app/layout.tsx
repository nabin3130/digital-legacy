import "./globals.css";
import "./brand.css";
import "./theme.css";
import "./navigation.css";
import Link from "next/link";
import Script from "next/script"; // 👈 추가된 부분
import type { Metadata } from "next";
import { SITE_DESCRIPTION, SITE_KEYWORDS, SITE_URL } from "@/lib/site";

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

const serviceMenu = [
  {
    name: "카카오",
    slug: "kakao",
    logo: "/logos/kakao.webp",
  },
  {
    name: "네이버",
    slug: "naver",
    logo: "/logos/naver.svg",
  },
  {
    name: "인스타그램",
    slug: "instagram",
    logo: "/logos/instagram.webp",
  },
  {
    name: "구글",
    slug: "google",
    logo: "/logos/google.svg",
  },
  {
    name: "애플",
    slug: "apple",
    logo: "/logos/apple.svg",
  },
  {
    name: "메타",
    slug: "meta",
    logo: "/logos/meta.svg",
  },
  {
    name: "삼성",
    slug: "samsung",
    logo: "/logos/samsung.svg",
  },
  {
    name: "X",
    slug: "x",
    logo: "/logos/x.svg",
  },
].sort((a, b) => a.name.localeCompare(b.name, "ko"));

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
        {/* 구글 애드센스 자동 광고/인증 스크립트 */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2192845166334509"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        <header className="header">
          <div className="container nav">
            <Link className="brand" href="/" aria-label="로그아웃 홈">
              로그아웃<span className="cursor" aria-hidden="true">_</span>
            </Link>

            <nav className="navlinks" aria-label="주요 메뉴">
              <div className="company-menu">
                <Link className="company-menu-trigger" href="/#services">회사</Link>
                <div className="company-dropdown">
                  <div className="company-dropdown-groups">
                    {[
                      { title: "국내", slugs: ["naver", "kakao", "samsung"] },
                      { title: "국외", slugs: ["google", "apple", "meta", "instagram", "x"] },
                    ].map((group) => (
                      <section className="company-dropdown-group" key={group.title}>
                        <h2>{group.title}</h2>
                        {serviceMenu.filter((service) => group.slugs.includes(service.slug)).map((service) => (
                          <Link className="company-dropdown-item" href={`/company/${service.slug}`} key={service.slug}>
                            <span className="company-dropdown-logo"><img src={service.logo} alt="" /></span>
                            <strong>{service.name}</strong>
                          </Link>
                        ))}
                      </section>
                    ))}
                  </div>
                  <Link className="company-dropdown-all" href="/#services">모든 서비스 보기</Link>
                </div>
              </div>
              <Link href="/prepare">준비</Link>
              <Link href="/about">이야기</Link>
              <Link href="/contact">문의</Link>
            </nav>
          </div>
        </header>

        {children}

        <footer className="footer">
          <div className="container footer-inner">
            <Link className="footer-brand" href="/">로그아웃_</Link>
            <p>정책은 변경될 수 있습니다. 신청 전 공식 플랫폼 페이지를 반드시 확인하세요.</p>
            <span>© 2026</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
