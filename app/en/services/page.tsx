"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { useCompositionSearch } from "@/components/useCompositionSearch";
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
    summary: "Delete an account or request a copy of public content",
  },
  {
    name: "Samsung",
    slug: "samsung",
    logo: "/logos/samsung.svg",
    keywords: ["samsung", "galaxy", "cloud"],
    summary: "Manage a Samsung Account and data stored on Galaxy devices",
  },
  {
    name: "Google",
    slug: "google",
    logo: "/logos/google.svg",
    keywords: ["google", "gmail", "youtube"],
    summary: "Download data, delete an account, or plan with Inactive Account Manager",
  },
  {
    name: "Apple",
    slug: "apple",
    logo: "/logos/apple.svg",
    keywords: ["apple", "icloud", "iphone"],
    summary: "Manage an Apple Account, iCloud data, and Legacy Contact access",
  },
  {
    name: "Meta",
    slug: "meta",
    logo: "/logos/meta.svg",
    keywords: ["meta", "facebook", "messenger"],
    summary: "Delete or memorialize a Facebook account",
  },
  {
    name: "Instagram",
    slug: "instagram",
    logo: "/logos/instagram.webp",
    keywords: ["instagram", "threads", "insta"],
    summary: "Download data, delete an account, or memorialize a profile",
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
  const search = useCompositionSearch(initial);
  const query = search.query;
  const setQuery = search.reset;
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
              Which service do you<br />
              need help with?
            </h1>
            <p>Choose a company to see available options and official instructions.</p>
          </div>
          <label>
            <span>Search services</span>
            <input
              {...search.inputProps}
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
              <em>View instructions</em>
            </Link>
          ))}
          {!filtered.length && (
            <div className={styles.empty}>
              <strong>No services found</strong>
              <p>Try a different search or view all services.</p>
              <button type="button" onClick={() => setQuery("")}>View all services</button>
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
