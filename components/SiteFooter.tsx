"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteFooter() {
  const pathname = usePathname();
  const isEnglish = pathname === "/en" || pathname.startsWith("/en/");
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <Link className="footer-brand" href={isEnglish ? "/en" : "/"}>
          {isEnglish ? "LOGOUT_" : "로그아웃_"}
        </Link>
        <p>
          {isEnglish
            ? "Policies can change. Review the platform’s official instructions before you submit a request."
            : "정책은 변경될 수 있습니다. 신청 전 공식 플랫폼 페이지를 반드시 확인하세요."}
        </p>
        <nav className="footer-links" aria-label={isEnglish ? "Policies" : "정책 메뉴"}>
          <Link href="/guides">{isEnglish ? "Guides (한국어)" : "가이드"}</Link>
          <Link href={isEnglish ? "/en/about" : "/about"}>{isEnglish ? "About" : "이야기"}</Link>
          <Link href={isEnglish ? "/en/contact" : "/contact"}>{isEnglish ? "Contact" : "문의"}</Link>
          <Link href={isEnglish ? "/en/privacy" : "/privacy"}>
            {isEnglish ? "Privacy" : "개인정보처리방침"}
          </Link>
          <Link href={isEnglish ? "/en/updates" : "/updates"}>
            {isEnglish ? "Policy updates" : "정책 업데이트"}
          </Link>
        </nav>
        <span className="footer-copyright">© 2026</span>
      </div>
    </footer>
  );
}
