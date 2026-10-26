"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function localizedPath(pathname: string, locale: "ko" | "en") {
  // No English guide routes exist yet. Avoid linking to a missing translation.
  if (locale === "en" && (pathname === "/guides" || pathname.startsWith("/guides/"))) return "/en";
  const base = pathname.replace(/^\/en(?=\/|$)/, "") || "/";
  return locale === "en" ? (base === "/" ? "/en" : `/en${base}`) : base;
}

export default function SiteHeader() {
  const pathname = usePathname();
  const isEnglish = pathname === "/en" || pathname.startsWith("/en/");
  const prefix = isEnglish ? "/en" : "";
  const [languageOpen, setLanguageOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const languageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outside = (e: MouseEvent) => {
      if (!languageRef.current?.contains(e.target as Node)) setLanguageOpen(false);
    };
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLanguageOpen(false);
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, []);

  const close = () => setMenuOpen(false);
  const homePath = prefix || "/";
  const servicesPath = `${prefix}/services`;
  const preparePath = `${prefix}/prepare`;

  return (
    <>
    <a className="skip-link" href="#main-content">
      {isEnglish ? "Skip to content" : "본문 바로가기"}
    </a>
    <header className="header">
      <div className="container nav">
        <Link className="brand" href={prefix || "/"} aria-label={isEnglish ? "LOGOUT home" : "로그아웃 홈"}>
          {isEnglish ? "LOGOUT" : "로그아웃"}
          <span className="cursor">_</span>
        </Link>
        <button
          className="mobile-menu-trigger"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="site-navigation"
          aria-label={menuOpen ? (isEnglish ? "Close menu" : "메뉴 닫기") : isEnglish ? "Open menu" : "메뉴 열기"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? (isEnglish ? "Close" : "닫기") : isEnglish ? "Menu" : "메뉴"}
        </button>
        <nav id="site-navigation" className={`navlinks ${menuOpen ? "open" : ""}`} aria-label={isEnglish ? "Main navigation" : "주요 메뉴"}>
          <Link href={isEnglish ? "/en#start" : "/#start"} onClick={close} aria-current={pathname === homePath ? "page" : undefined}>
            {isEnglish ? "Get started" : "안내 시작"}
          </Link>
          <Link href={servicesPath} onClick={close} aria-current={pathname === servicesPath || pathname.startsWith(`${prefix}/company`) ? "page" : undefined}>
            {isEnglish ? "Company guides" : "회사별 안내"}
          </Link>
          <Link href={preparePath} onClick={close} aria-current={pathname === preparePath || pathname.startsWith(`${preparePath}/`) ? "page" : undefined}>
            {isEnglish ? "Documents" : "준비서류"}
          </Link>
          <Link href="/guides" onClick={close} aria-current={pathname === "/guides" || pathname.startsWith("/guides/") ? "page" : undefined}>
            {isEnglish ? "Guides (한국어)" : "가이드"}
          </Link>
          <div className="language-menu" ref={languageRef}>
            <button
              className="language-trigger"
              type="button"
              id="language-button"
              aria-haspopup="menu"
              aria-controls="language-menu"
              aria-label={isEnglish ? "Choose language" : "언어 선택"}
              aria-expanded={languageOpen}
              onClick={() => setLanguageOpen((v) => !v)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9S14.5 18.5 12 21c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3Z" />
              </svg>
            </button>
            {languageOpen && (
              <div className="language-dropdown" id="language-menu" role="menu" aria-labelledby="language-button">
                <Link href={localizedPath(pathname, "ko")} role="menuitem" className={!isEnglish ? "active" : ""} lang="ko" onClick={() => setLanguageOpen(false)}>
                  한국어
                </Link>
                <Link href={localizedPath(pathname, "en")} role="menuitem" className={isEnglish ? "active" : ""} lang="en" onClick={() => setLanguageOpen(false)}>
                  English
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
    </>
  );
}
