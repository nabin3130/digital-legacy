"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const availableServices = [
  {
    name: "카카오",
    slug: "kakao",
    logo: "/logos/kakao.webp",
    keywords: ["카카오", "kakao", "카카오톡"],
  },
  {
    name: "네이버",
    slug: "naver",
    logo: "/logos/naver.svg",
    keywords: ["네이버", "naver", "네이버 포스트"],
  },
  {
    name: "인스타그램",
    slug: "instagram",
    logo: "/logos/instagram.webp",
    keywords: ["인스타그램", "instagram", "인스타", "threads", "스레드"],
  },
].sort((a, b) => a.name.localeCompare(b.name, "ko"));

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();

  const searchResults = normalizedQuery
    ? availableServices.filter((service) =>
        service.keywords.some((keyword) =>
          keyword.toLowerCase().includes(normalizedQuery),
        ),
      )
    : [];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (searchResults.length > 0) {
      router.push(`/company/${searchResults[0].slug}`);
    }
  }

  return (
    <main>
      <section className="hero">
        <div className="container">
          <h1>
            <span>우리가 남긴 계정과 기록,</span>
            <span>필요한 순간에도</span>
            <span>헤매지 않도록</span>
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

            {normalizedQuery && (
              <div className="search-results">
                {searchResults.length > 0 ? (
                  searchResults.map((service) => (
                    <Link
                      className="search-result"
                      href={`/company/${service.slug}`}
                      key={service.slug}
                    >
                      <span className="search-result-logo">
                        <img src={service.logo} alt="" />
                      </span>

                      <strong>{service.name}</strong>
                    </Link>
                  ))
                ) : (
                  <p className="search-empty">검색 결과가 없습니다.</p>
                )}
              </div>
            )}
          </form>
        </div>
      </section>

      <section className="available-services-section">
        <div className="container">
          <div className="available-services-heading">
            <h2>현재 확인 가능한 서비스</h2>
            <p>관리하려는 계정의 서비스를 선택하세요.</p>
          </div>

          <div className="available-services">
            {availableServices.map((service) => (
              <Link
                className="available-service"
                href={`/company/${service.slug}`}
                key={service.slug}
              >
                <span className="available-service-logo">
                  <img src={service.logo} alt="" />
                </span>

                <strong>{service.name}</strong>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}