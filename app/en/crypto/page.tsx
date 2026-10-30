import type { Metadata } from "next";
import Link from "next/link";
import { cryptoNotes } from "@/lib/hubs";
import { pageMetadata } from "@/lib/seo";
import styles from "@/app/content-hub.module.css";

export const metadata: Metadata = pageMetadata({ locale: "en", koPath: "/crypto", title: "Crypto account guidance", description: "A brief Korea-focused note on exchange accounts and self-custody wallet recovery." });

export default function CryptoPage() {
  return <main className={styles.page}><div className={styles.column}><nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/en">Home</Link><span>/</span><span aria-current="page">Crypto</span></nav><header className={styles.header}><p className={styles.eyebrow}>CRYPTO · KOREA</p><h1>Checking crypto records</h1><p>Exchange account records and self-custody wallet recovery materials need different handling.</p><p className={styles.review}>Last reviewed: <time dateTime="2026-10">2026-10</time></p></header><ol className={styles.noteList}>{cryptoNotes.en.map((text, index) => <li key={text}><span>{String(index + 1).padStart(2,"0")}</span><p>{text}</p></li>)}</ol><section className={styles.sourceBox}><h2>Official references</h2><ul><li><a href="https://www.law.go.kr/LSW/lsInfoP.do?lsId=014474" target="_blank" rel="noopener noreferrer">Korea Law Information Center: Virtual Asset User Protection Act</a></li><li><a href="https://www.gov.kr/mw/AA020InfoCappView.do?CappBizCD=17400000001" target="_blank" rel="noopener noreferrer">Gov.kr: One-stop Inheritance Administrative Service</a></li></ul><p>The legal link is a reference to the user-protection statute. It does not explain or determine inheritance rights or procedures.</p></section><p className={styles.next}><Link href="/en/after">Read the after-death guides</Link></p></div></main>;
}
