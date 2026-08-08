"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const services = [
  { name: "Naver", slug: "naver", logo: "/logos/naver.svg", group: "Korean", keywords: ["naver", "blog", "mybox"] },
  { name: "Kakao", slug: "kakao", logo: "/logos/kakao.webp", group: "Korean", keywords: ["kakao", "kakaotalk", "daum"] },
  { name: "Samsung", slug: "samsung", logo: "/logos/samsung.svg", group: "Korean", keywords: ["samsung", "galaxy", "cloud"] },
  { name: "Google", slug: "google", logo: "/logos/google.svg", group: "Global", keywords: ["google", "gmail", "youtube"] },
  { name: "Apple", slug: "apple", logo: "/logos/apple.svg", group: "Global", keywords: ["apple", "icloud"] },
  { name: "Meta", slug: "meta", logo: "/logos/meta.svg", group: "Global", keywords: ["meta", "facebook", "messenger"] },
  { name: "Instagram", slug: "instagram", logo: "/logos/instagram.webp", group: "Global", keywords: ["instagram", "threads"] },
  { name: "X", slug: "x", logo: "/logos/x.svg", group: "Global", keywords: ["x", "twitter"] },
];

export default function EnglishHomePage() {
  const router = useRouter(); const [query, setQuery] = useState("");
  const results = useMemo(() => { const q = query.trim().toLowerCase(); return q ? services.filter((service) => service.keywords.some((keyword) => keyword.includes(q))) : []; }, [query]);
  function submit(event: FormEvent) { event.preventDefault(); if (results[0]) router.push(`/en/company/${results[0].slug}`); }
  return <main>
    <section className="hero hero-video"><div className="hero-media" aria-hidden="true"><video autoPlay muted loop playsInline preload="auto" disablePictureInPicture poster="/media/ocean-hero-poster.jpg"><source src="/media/ocean-hero.mp4" type="video/mp4" /></video></div>
      <div className="container hero-grid"><div className="hero-copy"><p className="eyebrow">DIGITAL LEGACY NAVIGATOR / 01</p><h1><span>Your digital memories remain.</span><span>We help you decide what comes next.</span></h1><p className="hero-description">Find pre-planning options, steps after a death, required documents, and official request paths in one place.</p>
        <form className="company-search" onSubmit={submit}><input className="search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search companies or services" placeholder="Search a company or service" autoComplete="off" />{query.trim() && <div className="search-results">{results.length ? results.map((service) => <Link className="search-result" href={`/en/company/${service.slug}`} key={service.slug}><span className="search-result-logo"><img src={service.logo} alt="" /></span><strong>{service.name}</strong></Link>) : <p className="search-empty">No results found.</p>}</div>}</form>
      </div></div>
    </section>
    <section className="available-services-section" id="services"><div className="container"><div className="available-services-heading"><p className="eyebrow">AVAILABLE PATHS / 02</p><h2>Available services</h2><p>Choose the service for the account you need to manage.</p></div><div className="service-groups">{["Korean", "Global"].map((group) => <section className="service-group" key={group}><h3>{group} services</h3><div className="available-services">{services.filter((service) => service.group === group).map((service) => <Link className="available-service" href={`/en/company/${service.slug}`} key={service.slug}><span className="available-service-logo"><img src={service.logo} alt="" /></span><strong>{service.name}</strong></Link>)}</div></section>)}</div></div></section>
  </main>;
}
