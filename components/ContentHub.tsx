import Link from "next/link";
import type { HubCard } from "@/lib/hubs";
import styles from "@/app/content-hub.module.css";

export default function ContentHub({ locale, label, title, intro, guides, note, asSection = false }: {
  locale: "ko" | "en"; label: string; title: string; intro: string; guides: HubCard[]; note: string; asSection?: boolean;
}) {
  const Root = asSection ? "section" : "main";
  return <Root className={styles.page}><div className={styles.column}>
    <nav className={styles.breadcrumb} aria-label={locale === "ko" ? "현재 위치" : "Breadcrumb"}>
      <Link href={locale === "ko" ? "/" : "/en"}>{locale === "ko" ? "홈" : "Home"}</Link><span aria-hidden="true">/</span><span aria-current="page">{title}</span>
    </nav>
    <header className={styles.header}><p className={styles.eyebrow}>{label}</p><h1>{title}</h1><p>{intro}</p></header>
    <ol className={styles.list}>{guides.map((item) => {
      const external = item.href.startsWith("https://");
      return <li key={item.number} className={styles.card}><span className={styles.number}>{item.number}</span><div><h2>{external ? <a href={item.href} target="_blank" rel="noopener noreferrer">{item.title}<span className={styles.external} aria-label={locale === "ko" ? "새 창" : "opens in a new tab"}> ↗</span></a> : <Link href={item.href}>{item.title}</Link>}</h2><p>{item.description}</p></div></li>;
    })}</ol>
    <p className={styles.note}>{note}</p>
    <div className={styles.next}><Link href={locale === "ko" ? "/services" : "/en/services"}>{locale === "ko" ? "서비스별 공식 안내 보기" : "Browse service guides"}</Link></div>
  </div></Root>;
}
