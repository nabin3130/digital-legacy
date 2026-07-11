import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "망각인프라",
  description: "디지털 유산 정책과 신청 절차를 한곳에서 비교합니다."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <header className="header">
          <div className="container nav">
            <Link href="/"><strong>망각인프라</strong></Link>
            <nav className="navlinks">
              <Link href="/">회사</Link>
              <Link href="/compare">비교</Link>
              <Link href="/guide">가이드</Link>
            </nav>
          </div>
        </header>
        {children}
        <footer className="footer"><div className="container">정책은 변경될 수 있습니다. 신청 전 공식 플랫폼 페이지를 반드시 확인하세요.</div></footer>
      </body>
    </html>
  );
}
