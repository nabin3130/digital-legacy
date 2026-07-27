import "./globals.css";
import "./brand.css";
import Link from "next/link";
import Script from "next/script"; // 👈 추가된 부분

export const metadata = {
  title: "망각인프라 – 디지털 유산 안내",
  description: "흩어진 디지털 기록 사이에서, 다음 단계를 찾도록.",
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
].sort((a, b) => a.name.localeCompare(b.name, "ko"));

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        {/* 구글 애드센스 자동 광고/인증 스크립트 */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2192845166334509"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        <header className="header">
          <div className="container nav">
            <Link className="brand" href="/" aria-label="망각인프라 홈">
              망각인프라<span className="cursor" aria-hidden="true">_</span>
            </Link>

            <nav className="navlinks" aria-label="주요 메뉴">
              <div className="company-menu">
                <Link className="company-menu-trigger" href="/">서비스</Link>
                <div className="company-dropdown">
                  {serviceMenu.map((service) => (
                    <Link className="company-dropdown-item" href={`/company/${service.slug}`} key={service.slug}>
                      <span className="company-dropdown-logo"><img src={service.logo} alt="" /></span>
                      <strong>{service.name}</strong>
                    </Link>
                  ))}
                </div>
              </div>
              <Link href="/compare">정책 비교</Link>
            </nav>
          </div>
        </header>

        {children}

        <footer className="footer">
          <div className="container footer-inner">
            <Link className="footer-brand" href="/">망각인프라_</Link>
            <p>정책은 변경될 수 있습니다. 신청 전 공식 플랫폼 페이지를 반드시 확인하세요.</p>
            <span>© 2026</span>
          </div>
        </footer>
      </body>
    </html>
  );
}