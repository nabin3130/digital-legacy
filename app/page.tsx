"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const availableServices = [
  { name: "카카오", slug: "kakao", logo: "/logos/kakao.webp", keywords: ["카카오", "kakao", "카카오톡"] },
  { name: "네이버", slug: "naver", logo: "/logos/naver.svg", keywords: ["네이버", "naver", "네이버 포스트"] },
  { name: "삼성", slug: "samsung", logo: "/logos/samsung.svg", keywords: ["삼성", "samsung", "갤럭시", "galaxy"] },
  { name: "인스타그램", slug: "instagram", logo: "/logos/instagram.webp", keywords: ["인스타그램", "instagram", "인스타", "threads", "스레드"] },
  { name: "구글", slug: "google", logo: "/logos/google.svg", keywords: ["구글", "google", "gmail", "유튜브", "youtube"] },
  { name: "메타", slug: "meta", logo: "/logos/meta.svg", keywords: ["메타", "meta", "페이스북", "facebook"] },
  { name: "애플", slug: "apple", logo: "/logos/apple.svg", keywords: ["애플", "apple", "아이클라우드", "icloud"] },
].sort((a, b) => a.name.localeCompare(b.name, "ko"));

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const searchResults = normalizedQuery
    ? availableServices.filter((service) =>
        service.keywords.some((keyword) => keyword.toLowerCase().includes(normalizedQuery)),
      )
    : [];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (searchResults.length > 0) router.push(`/company/${searchResults[0].slug}`);
  }

  return (
    <main>
      <section className="hero">
        <div className="fog fog-one" aria-hidden="true" />
        <div className="fog fog-two" aria-hidden="true" />
        <div className="horizon" aria-hidden="true" />

        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">DIGITAL LEGACY NAVIGATOR / 01</p>
            <h1>
              <span>흩어진 디지털 기록 사이에서,</span>
              <span>다음 단계를 찾도록.</span>
            </h1>
            <p className="hero-description">
              생전 설정부터 사후 처리 방법, 필요한 서류와 공식 신청 경로까지
              한곳에서 안내합니다.
            </p>

            <form className="company-search" onSubmit={handleSubmit}>
              <input
                className="search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label="회사 또는 서비스 검색"
                placeholder="회사 또는 서비스를 검색하세요"
                autoComplete="off"
              />
              <span className="search-command" aria-hidden="true">↵</span>

              {normalizedQuery && (
                <div className="search-results">
                  {searchResults.length > 0 ? (
                    searchResults.map((service) => (
                      <Link className="search-result" href={`/company/${service.slug}`} key={service.slug}>
                        <span className="search-result-logo"><img src={service.logo} alt="" /></span>
                        <strong>{service.name}</strong>
                        <span className="result-arrow" aria-hidden="true">→</span>
                      </Link>
                    ))
                  ) : (
                    <p className="search-empty">검색 결과가 없습니다.</p>
                  )}
                </div>
              )}
            </form>
          </div>

          <div className="hero-signal" aria-hidden="true">
            <div className="signal-card signal-card-one">
              <span>RECORD_01</span><i /><i /><i />
            </div>
            <div className="signal-card signal-card-two">
              <span>NEXT_PATH</span><i /><i />
            </div>
            <div className="signal-light" />
            <p>기록은 남아 있습니다.<br />경로를 찾습니다.</p>
          </div>
        </div>
      </section>

      <section className="available-services-section">
        <div className="container services-layout">
          <div className="available-services-heading">
            <p className="eyebrow">AVAILABLE PATHS / 02</p>
            <h2>현재 확인 가능한 서비스</h2>
            <p>관리하려는 계정의 서비스를 선택하세요.</p>
          </div>

          <div className="available-services">
            {availableServices.map((service, index) => (
              <Link className="available-service" href={`/company/${service.slug}`} key={service.slug}>
                <span className="service-index">{String(index + 1).padStart(2, "0")}</span>
                <span className="available-service-logo"><img src={service.logo} alt="" /></span>
                <strong>{service.name}</strong>
                <span className="service-arrow" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
