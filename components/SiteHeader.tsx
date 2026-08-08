"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const services = [
  { ko: "카카오", en: "Kakao", slug: "kakao", logo: "/logos/kakao.webp", domestic: true },
  { ko: "네이버", en: "Naver", slug: "naver", logo: "/logos/naver.svg", domestic: true },
  { ko: "삼성", en: "Samsung", slug: "samsung", logo: "/logos/samsung.svg", domestic: true },
  { ko: "인스타그램", en: "Instagram", slug: "instagram", logo: "/logos/instagram.webp", domestic: false },
  { ko: "구글", en: "Google", slug: "google", logo: "/logos/google.svg", domestic: false },
  { ko: "메타", en: "Meta", slug: "meta", logo: "/logos/meta.svg", domestic: false },
  { ko: "애플", en: "Apple", slug: "apple", logo: "/logos/apple.svg", domestic: false },
];

function localizedPath(pathname: string, locale: "ko" | "en") {
  const base = pathname.replace(/^\/en(?=\/|$)/, "") || "/";
  return locale === "en" ? (base === "/" ? "/en" : `/en${base}`) : base;
}

export default function SiteHeader() {
  const pathname = usePathname();
  const isEnglish = pathname === "/en" || pathname.startsWith("/en/");
  const prefix = isEnglish ? "/en" : "";
  const [languageOpen, setLanguageOpen] = useState(false);
  const languageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outside = (event: MouseEvent) => {
      if (!languageRef.current?.contains(event.target as Node)) setLanguageOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLanguageOpen(false);
    };
    document.addEventListener("mousedown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, []);

  const groups = isEnglish
    ? [
        { title: "Korea", items: services.filter((service) => service.domestic) },
        { title: "Global", items: services.filter((service) => !service.domestic) },
      ]
    : [
        { title: "국내", items: services.filter((service) => service.domestic) },
        { title: "국외", items: services.filter((service) => !service.domestic) },
      ];

  return (
    <header className="header">
      <div className="container nav">
        <Link className="brand" href={isEnglish ? "/en" : "/"} aria-label={isEnglish ? "Digital Legacy Navigator home" : "망각인프라 홈"}>
          {isEnglish ? "Digital Legacy Navigator" : "망각인프라"}<span className="cursor" aria-hidden="true">_</span>
        </Link>
        <nav className="navlinks" aria-label={isEnglish ? "Main navigation" : "주요 메뉴"}>
          <div className="company-menu">
            <Link className="company-menu-trigger" href={`${prefix}/#services`}>{isEnglish ? "Companies" : "회사"}</Link>
            <div className="company-dropdown">
              <div className="company-dropdown-groups">
                {groups.map((group) => (
                  <section className="company-dropdown-group" key={group.title}>
                    <h2>{group.title}</h2>
                    {group.items.map((service) => (
                      <Link className="company-dropdown-item" href={`${prefix}/company/${service.slug}`} key={service.slug}>
                        <span className="company-dropdown-logo"><img src={service.logo} alt="" /></span>
                        <strong>{isEnglish ? service.en : service.ko}</strong>
                      </Link>
                    ))}
                  </section>
                ))}
              </div>
              <Link className="company-dropdown-all" href={`${prefix}/#services`}>{isEnglish ? "All companies" : "모든 서비스 보기"}</Link>
            </div>
          </div>
          <Link href={`${prefix}/procedures`}>{isEnglish ? "Procedures" : "공통 절차"}</Link>
          <Link href={`${prefix}/documents`}>{isEnglish ? "Documents" : "공통 서류"}</Link>
          <Link href={`${prefix}/compare`}>{isEnglish ? "Policies" : "비교"}</Link>
          <div className="language-menu" ref={languageRef}>
            <button className="language-trigger" type="button" aria-label={isEnglish ? "Choose language" : "언어 선택"} aria-expanded={languageOpen} onClick={() => setLanguageOpen((open) => !open)}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9S14.5 18.5 12 21c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3Z"/></svg>
            </button>
            {languageOpen && (
              <div className="language-dropdown" role="menu">
                <Link href={localizedPath(pathname, "ko")} role="menuitem" onClick={() => setLanguageOpen(false)} className={!isEnglish ? "active" : ""}><span>{!isEnglish ? "✓" : ""}</span>한국어</Link>
                <Link href={localizedPath(pathname, "en")} role="menuitem" onClick={() => setLanguageOpen(false)} className={isEnglish ? "active" : ""}><span>{isEnglish ? "✓" : ""}</span>English</Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
