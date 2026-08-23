import type { Metadata } from "next";
import { policyUpdates } from "@/lib/policy-updates";
import styles from "@/app/PolicyPages.module.css";

export const metadata: Metadata = {
  title: "Policy Updates",
  description: "Track policy verification records and operational changes for the Logout project.",
  alternates: { canonical: "/en/updates" },
};

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
          {policyUpdates.map((update) => (
            <article className={styles.update} key={`${update.date}-${update.title.en}`}>
              <time dateTime={update.date}>{update.date.replaceAll("-", ".")}</time>
              <div>
                <span className={styles.tag}>{update.category.en}</span>
                <h2>{update.title.en}</h2>
                <p>{update.summary.en}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

