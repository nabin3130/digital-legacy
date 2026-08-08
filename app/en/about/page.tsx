import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/app/about/About.module.css";

export const metadata: Metadata = { title: "About", description: "The story and purpose behind the Logout digital legacy project.", alternates: { canonical: "/en/about" } };

export default function EnglishAboutPage() {
  return <main className={styles.page}><article className={styles.article}>
    <header className={styles.heading}><p className="eyebrow">ABOUT LOGOUT</p><h1>The story behind Logout</h1><p className={styles.question}>“Our information is personal while we are alive. What happens to it after we die?”</p><p><strong>Logout</strong> began with this question.</p></header>
    <div className={styles.body}>
      <p>We spend much of our lives online. We leave photos, videos, emails, blogs, and social media posts behind. Yet few people know what happens to those records after death or what their families are allowed to do.</p>
      <p>Each company has a different process and philosophy. Some let people appoint a legacy contact in advance, some preserve memorialized accounts, and others only support account deletion. Policies can also be difficult to find or understand.</p>
      <p className={styles.statement}>That is why I created this project.</p>
      <p><strong>Logout</strong> brings scattered digital legacy policies together so that anyone can understand the official process and find the next step. We are starting with major services used in Korea and hope to expand to more countries and platforms.</p>
      <p>I built this project while thinking about the people I love.</p>
      <p>We prepare wills and insurance in advance. Shouldn’t we also be able to organize our digital traces before the end of life?</p>
      <p>Digital legacy is still an evolving area of law and policy. We hope this project can become a small starting point for a wider conversation.</p>
    </div>
    <aside className={styles.contact}><p>If you would like to share feedback or have a coffee chat, please email us anytime.</p><Link href="/en/contact">Contact us →</Link></aside>
  </article></main>;
}
