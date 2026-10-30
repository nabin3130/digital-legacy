import type { Metadata } from "next";
import { templates } from "@/lib/hubs";
import { pageMetadata } from "@/lib/seo";
import styles from "@/app/content-hub.module.css";

export const metadata: Metadata = pageMetadata({ locale: "ko", koPath: "/templates", title: "무료 디지털 유산 양식", description: "회원가입 없이 인쇄해 쓸 수 있는 디지털 계정 목록, 가족 안내문, 복구 수단 점검표를 제공합니다." });

export default function TemplatesPage() {
  return <main className={styles.page}><div className={styles.column}><nav className={styles.breadcrumb} aria-label="현재 위치"><a href="/">홈</a><span>/</span><span aria-current="page">템플릿</span></nav><header className={styles.header}><p className={styles.eyebrow}>무료 · A4 인쇄용</p><h1>종이에 정리하는 디지털 기록</h1><p>회원가입이나 이메일 입력 없이 바로 내려받아 손으로 작성할 수 있습니다.</p><p className={styles.review}>최종 확인: <time dateTime="2026-10">2026-10</time></p></header><div className={styles.templates}>{templates.map((item) => <article id={item.id} className={styles.template} key={item.id}><p className={styles.number}>{item.id === "inventory" ? "01" : item.id === "instructions" ? "02" : "03"}</p><h2>{item.title}</h2><p>{item.description}</p><a className={styles.download} href={`/templates/${item.file}-ko.pdf`} download>한국어 PDF 내려받기</a></article>)}</div><p className={styles.note}>양식에는 비밀번호, 2단계 인증 코드, 복구 코드, 지갑의 비밀 복구 문구를 적지 마세요. 접근 정보는 신뢰할 수 있는 별도 보관 방법을 사용하세요.</p><p className={styles.languageLink}><a href="/en/templates">English templates →</a></p></div></main>;
}
