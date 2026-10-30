import Link from "next/link";
import { getPublishedGuides } from "@/lib/guides";
import { guideIndexStructuredData, guideMetadata, serializeGuideJsonLd } from "@/lib/guide-seo";
import styles from "./Guides.module.css";

export const metadata = guideMetadata("/guides", "디지털 유산 가이드", "고인 계정 정리를 시작하기 전 알아둘 내용과 데이터 다운로드·계정 삭제·추모 계정의 차이를 차분하게 살펴보세요.");

export default function GuidesPage() {
  const guides = getPublishedGuides();
  return <main className={styles.page}><div className={styles.column}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeGuideJsonLd(guideIndexStructuredData(guides)) }} />
    <nav aria-label="현재 위치" className={styles.breadcrumb}><Link href="/">홈</Link><span aria-hidden="true">/</span><span aria-current="page">가이드</span></nav>
    <header className={styles.header}><p className={styles.eyebrow}>차분히 알아보기</p><h1>디지털 유산 가이드</h1><p>계정을 정리하기 전에 필요한 개념과 확인 순서를 읽어보세요. 회사별 신청 조건은 공식 안내에서 다시 확인할 수 있습니다.</p></header>
    <ul className={styles.list}>{guides.map((guide) => <li key={guide.slug} className={styles.card}>
      <div className={styles.meta}><span>게시 <time dateTime={guide.date}>{guide.date}</time></span>{guide.updated && <span>수정 <time dateTime={guide.updated}>{guide.updated}</time></span>}</div>
      <h2><Link href={`/guides/${guide.slug}`}>{guide.title}</Link></h2><p>{guide.description}</p>
      {guide.tags.length > 0 && <ul className={styles.tags} aria-label="주제">{guide.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>}
    </li>)}</ul>
    {!guides.length && <p>가이드를 준비하고 있습니다.</p>}
    <p className={styles.notice}>가상자산 계정과 개인 지갑에 관한 한국 안내는 <Link href="/crypto">가상자산 안내</Link>에서 확인하세요.</p>
    <aside className={styles.cta}><h2>내 상황에 맞는 절차가 필요하신가요?</h2><p>누구의 계정인지, 어떤 도움이 필요한지 고르면 회사별 안내로 이어집니다.</p><Link href="/#start">안내 시작하기</Link></aside>
  </div></main>;
}
