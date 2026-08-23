import type { Metadata } from "next";
import styles from "@/app/PolicyPages.module.css";

export const metadata: Metadata = {
  title: "Policy Updates",
  description: "Track policy verification records and operational changes for the Logout project.",
  alternates: { canonical: "/en/updates" },
};

const policyUpdatesEn = [
  {
    date: "2026-08-23",
    category: "Feature",
    title: "English version complete feature parity and interactive guide release",
    summary:
      "Released full English parity including the 4-step situation guide, Google Inactive Account Manager, Apple Legacy Contact, Naver public post backup, and full company flows.",
  },
  {
    date: "2026-08-22",
    category: "Policy",
    title: "Comprehensive verification of 8 major platform digital legacy terms",
    summary:
      "Verified official documentation and support paths for Apple, Google, Meta, Instagram, Samsung, Naver, Kakao, and X.",
  },
  {
    date: "2026-08-20",
    category: "Service",
    title: "Launched Logout digital legacy navigation service",
    summary:
      "Published step-by-step guides for posthumous account handling, required document preparations, and memorial profile conversions.",
  },
];

export default function EnglishUpdatesPage() {
  return (
    <main className={styles.page}>
      <div className="container">
        <header className={styles.header}>
          <p className={styles.eyebrow}>CHANGELOG</p>
          <h1>Policy Updates</h1>
          <p>
            We transparently record company digital legacy policy verifications and Logout operational changes.
          </p>
        </header>

        <div className={styles.updates}>
          {policyUpdatesEn.map((update) => (
            <article className={styles.update} key={`${update.date}-${update.title}`}>
              <time dateTime={update.date}>{update.date.replaceAll("-", ".")}</time>
              <div>
                <span className={styles.tag}>{update.category}</span>
                <h2>{update.title}</h2>
                <p>{update.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
