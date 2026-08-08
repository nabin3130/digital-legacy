"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteFooter() {
  const pathname = usePathname();
  const isEnglish = pathname === "/en" || pathname.startsWith("/en/");
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <Link className="footer-brand" href={isEnglish ? "/en" : "/"}>{isEnglish ? "Logout_" : "로그아웃_"}</Link>
        <p>{isEnglish ? "Policies may change. Always check the platform’s official page before submitting a request." : "정책은 변경될 수 있습니다. 신청 전 공식 플랫폼 페이지를 반드시 확인하세요."}</p>
        <span>© 2026</span>
      </div>
    </footer>
  );
}
