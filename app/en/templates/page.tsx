import type { Metadata } from "next";
import { templates } from "@/lib/hubs";
import { pageMetadata } from "@/lib/seo";
import styles from "@/app/content-hub.module.css";

export const metadata: Metadata = pageMetadata({ locale: "en", koPath: "/templates", title: "Free printable templates", description: "Free A4 printable forms for an account inventory, family instructions, and account recovery checklist." });

export default function EnglishTemplatesPage() {
  return <main className={styles.page}><div className={styles.column}><nav className={styles.breadcrumb} aria-label="Breadcrumb"><a href="/en">Home</a><span>/</span><span aria-current="page">Templates</span></nav><header className={styles.header}><p className={styles.eyebrow}>FREE · A4 PRINTABLE</p><h1>Write down the next steps</h1><p>Download and print these forms without signing up or sharing an email address.</p><p className={styles.review}>Last reviewed: <time dateTime="2026-10">2026-10</time></p></header><div className={styles.templates}>{templates.map((item, index) => <article id={item.id} className={styles.template} key={item.id}><p className={styles.number}>{String(index + 1).padStart(2, "0")}</p><h2>{item.en}</h2><p>{item.description === "서비스 이름, 계정 식별 힌트, 보관할 기록과 다음 행동을 적습니다." ? "List a service, an account clue, records to preserve, and the next step." : item.description === "확인할 위치와 연락처를 남깁니다. 비밀번호나 복구 코드는 적지 마세요." ? "Leave places to check and contact details. Do not write passwords or recovery codes." : "Review two-factor authentication, recovery codes, and contact details from time to time."}</p><a className={styles.download} href={`/templates/${item.file}-en.pdf`} download>Download English PDF</a></article>)}</div><p className={styles.note}>Do not write passwords, two-factor codes, recovery codes, or wallet recovery phrases on these forms. Store access information separately using a method you trust.</p><p className={styles.languageLink}><a href="/templates">한국어 양식 →</a></p></div></main>;
}
