import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import { getGuideHeadings, getPublishedGuide, getPublishedGuides, getRelatedGuides, guideHeadings } from "@/lib/guides";
import { guideMetadata, guideStructuredData, serializeGuideJsonLd } from "@/lib/guide-seo";
import styles from "../Guides.module.css";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return getPublishedGuides().map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props) {
  const guide = getPublishedGuide((await params).slug);
  if (!guide) notFound();
  return guideMetadata(`/guides/${guide.slug}`, guide.title, guide.description, guide);
}

export default async function GuidePage({ params }: Props) {
  const guide = getPublishedGuide((await params).slug);
  if (!guide) notFound();
  const headings = getGuideHeadings(guide.body);
  const related = getRelatedGuides(guide);
  return <main className={styles.page}><div className={styles.column}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeGuideJsonLd(guideStructuredData(guide)) }} />
    <nav aria-label="현재 위치" className={styles.breadcrumb}><Link href="/">홈</Link><span aria-hidden="true">/</span><Link href="/guides">가이드</Link><span aria-hidden="true">/</span><span aria-current="page">{guide.title}</span></nav>
    <article>
      <header className={styles.header}><p className={styles.eyebrow}>디지털 유산 가이드</p><h1>{guide.title}</h1>
        <div className={styles.meta}><span>게시 <time dateTime={guide.date}>{guide.date}</time></span>{guide.updated && <span>수정 <time dateTime={guide.updated}>{guide.updated}</time></span>}<span>글: 로그아웃</span></div>
      </header>
      <p className={styles.lead}>{guide.lead}</p>
      {headings.length >= 3 && <nav className={styles.toc} aria-label="이 글의 목차"><h2>이 글에서 알아볼 내용</h2><ol>{headings.map((heading) => <li key={heading.id} className={heading.depth === 3 ? styles.subheading : undefined}><a href={`#${heading.id}`}>{heading.title}</a></li>)}{guide.faq.length > 0 && <li><a href="#guide-faq">자주 묻는 질문</a></li>}</ol></nav>}
      <div className={styles.prose}><Markdown skipHtml remarkPlugins={[guideHeadings]}>{guide.body}</Markdown></div>
      {guide.faq.length > 0 && <section id="guide-faq" className={styles.faq} aria-labelledby="guide-faq-title"><h2 id="guide-faq-title">자주 묻는 질문</h2>{guide.faq.map((item) => <div key={item.question}><h3>{item.question}</h3><p>{item.answer}</p></div>)}</section>}
      <p className={styles.notice}>이 글은 확인 순서를 설명하는 일반 안내입니다. 글의 게시·수정일이 각 회사 정책의 재검증일을 뜻하지는 않습니다. 신청 전 회사별 공식 안내에서 최신 조건을 확인하세요.</p>
    </article>
    <aside className={styles.cta}><h2>이제 내 상황에 맞춰 확인해 보세요</h2><p>진행 상황은 이 기기에만 저장됩니다. 계정 비밀번호나 증빙서류를 입력할 필요가 없습니다.</p><Link href="/#start">안내 시작하기</Link></aside>
    {related.length > 0 && <section id="guide-related" className={styles.related} aria-labelledby="guide-related-title"><h2 id="guide-related-title">함께 읽으면 좋은 가이드</h2><ul>{related.map((item) => <li key={item.slug}><Link href={`/guides/${item.slug}`}>{item.title}</Link><p>{item.description}</p></li>)}</ul></section>}
    <p><Link href="/guides">가이드 목록으로</Link></p>
  </div></main>;
}
