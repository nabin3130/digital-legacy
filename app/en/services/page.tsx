"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import styles from "@/app/services/Services.module.css";

const services = [
  {
    name: "Kakao",
    slug: "kakao",
    logo: "/logos/kakao.webp",
    keywords: ["kakao", "kakaotalk", "daum"],
    summary: "Account deletion, data request, and memorial profile guide",
  },
  {
    name: "Naver",
    slug: "naver",
    logo: "/logos/naver.svg",
    keywords: ["naver", "blog", "mybox"],
    summary: "Account withdrawal and public data backup procedures",
  },
  {
    name: "Samsung",
    slug: "samsung",
    logo: "/logos/samsung.svg",
    keywords: ["samsung", "galaxy", "cloud"],
    summary: "Samsung Account and device data management guide",
  },
  {
    name: "Google",
    slug: "google",
    logo: "/logos/google.svg",
    keywords: ["google", "gmail", "youtube"],
    summary: "Account deletion, Google Takeout download, Inactive Account Manager",
  },
  {
    name: "Apple",
    slug: "apple",
    logo: "/logos/apple.svg",
    keywords: ["apple", "icloud", "iphone"],
    summary: "Apple Account and iCloud data management guide",
  },
  {
    name: "Meta",
    slug: "meta",
    logo: "/logos/meta.svg",
    keywords: ["meta", "facebook", "messenger"],
    summary: "Facebook account deletion and memorialized account guide",
  },
  {
    name: "Instagram",
    slug: "instagram",
    logo: "/logos/instagram.webp",
    keywords: ["instagram", "threads", "insta"],
    summary: "Account deletion, data download, and memorialization guide",
  },
  {
    name: "X",
    slug: "x",
    logo: "/logos/x.svg",
    keywords: ["x", "twitter"],
    summary: "Account deactivation and deletion procedures",
  },
];

function EnglishServicesDirectory() {
  const initial = useSearchParams().get("q") || "";
  const [query, setQuery] = useState(initial);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return services.filter(
      (s) => !q || s.keywords.some((k) => k.toLowerCase().includes(q)) || s.name.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <main className={styles.page}>
      <div className={styles.wrap}>
        <p className={styles.kicker}>GUIDES BY SERVICE</p>
        <div className={styles.heading}>
          <div>
            <h1>
              Which service would you<br />
              like to manage?
            </h1>
            <p>Select a company to view available posthumous options and official procedures.</p>
          </div>
          <label>
            <span>Search service</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Google, Apple"
            />
          </label>
        </div>

        <div className={styles.list}>
          {filtered.map((s) => (
            <Link href={`/en/company/${s.slug}`} key={s.slug}>
              <img src={s.logo} alt="" />
              <span>
                <strong>{s.name}</strong>
                <small>{s.summary}</small>
              </span>
              <em>View guide</em>
            </Link>
          ))}
          {!filtered.length && (
            <div className={styles.empty}>
              <strong>No results found.</strong>
              <p>Please check your spelling or view the full list.</p>
              <button onClick={() => setQuery("")}>View all services</button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function EnglishServicesPage() {
  return (
    <Suspense fallback={<main className={styles.page} />}>
      <EnglishServicesDirectory />
    </Suspense>
  );
}
