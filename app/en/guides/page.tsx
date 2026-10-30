import Link from "next/link";
import type { Metadata } from "next";
import { englishGuides } from "@/lib/guides-en";
import { pageMetadata } from "@/lib/seo";
import styles from "@/app/guides/Guides.module.css";

export const metadata: Metadata = pageMetadata({ locale: "en", koPath: "/guides", title: "Guides", description: "Korea-focused guidance for preparing digital accounts and handling account requests after a death." });

export default function EnglishGuidesIndex() {
  return <main className={styles.page}><div className={styles.column}><nav aria-label="Breadcrumb" className={styles.breadcrumb}><Link href="/en">Home</Link><span aria-hidden="true">/</span><span aria-current="page">Guides</span></nav><header className={styles.header}><p className={styles.eyebrow}>KOREA FOCUSED</p><h1>Digital legacy guides</h1><p>Original guidance for Korea. Check each service’s official instructions before submitting a request.</p></header><ul className={styles.list}>{englishGuides.map((guide) => <li key={guide.slug} className={styles.card}><h2><Link href={`/en/guides/${guide.slug}`}>{guide.title}</Link></h2><p>{guide.description}</p></li>)}</ul></div></main>;
}
