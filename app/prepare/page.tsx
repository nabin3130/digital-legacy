import type { Metadata } from "next";
import Link from "next/link";
import { commonDocuments, commonProcedures } from "@/lib/common-guidance";
import styles from "./Prepare.module.css";

export const metadata: Metadata = {
  title: "준비",
  description: "디지털 유산 절차에 자주 필요한 서류의 용도와 발급 방법을 빠르게 확인합니다.",
  alternates: { canonical: "/prepare" },
};

const safeInheritance = commonProcedures.find((item) => item.id === "safe-inheritance");

export default function PreparePage() {
  return (
    <main className={styles.page}>
      <div className="container">
        <header className={styles.heading}>
          <p className="eyebrow">준비서류</p>
          <h1>디지털 계정 처리를 준비해요</h1>
          <p>회사별 절차를 시작하기 전에 자주 필요한 서류와 진행 순서를 확인하세요.</p>
        </header>

        <section className={`${styles.section} ${styles.processSection}`} aria-labelledby="process-title">
          <div className={styles.sectionHeading}><h2 id="process-title">진행 순서</h2></div>
          <ol className={styles.flow}>
            <li><strong>1</strong><span>필요한 서류를 준비해요.</span></li>
            <li><strong>2</strong><span>회사를 선택해요.</span></li>
            <li><strong>3</strong><span>회사별 안내를 따라가요.</span></li>
          </ol>
          <Link className={styles.companyLink} href="/services">회사 선택하기</Link>
        </section>

        <section id="documents" className={styles.section} aria-labelledby="documents-title">
          <div className={styles.sectionHeading}>
            <h2 id="documents-title">공통적으로 필요한 서류</h2>
            <p>회사마다 조금씩 다르지만 대부분 아래 서류를 요구합니다.</p>
          </div>
          <div className={styles.documentGrid}>
            {commonDocuments.map((document) => (
              <article className={styles.documentCard} id={document.id} key={document.id}>
                <div>
                  <span className={styles.badge}>{document.online ? "온라인 발급" : "의료기관 발급"}</span>
                  <h3>{document.name.ko}</h3>
                </div>
                <dl>
                  <div><dt>언제 필요한가요?</dt><dd>{document.purpose.ko}</dd></div>
                  <div><dt>어떻게 발급하나요?</dt><dd>{document.issueMethod.ko}</dd></div>
                </dl>
                {document.url ? (
                  <a className={styles.primaryButton} href={document.url} target="_blank" rel="noopener noreferrer" aria-label={`${document.name.ko} 발급하기 (새 창)`}>발급하기</a>
                ) : (
                  <span className={styles.offlineButton}>병원에 발급 문의</span>
                )}
              </article>
            ))}
          </div>
        </section>

        {safeInheritance?.url && (
          <section className={styles.governmentSection} aria-labelledby="government-title">
            <p className="eyebrow">정부 서비스</p>
            <article className={styles.serviceCard}>
              <div>
                <h2 id="government-title">안심상속 원스톱 서비스</h2>
                <p>금융자산, 자동차, 토지, 국민연금 등 여러 행정 정보를 한 번에 조회할 수 있습니다.</p>
              </div>
              <a href={safeInheritance.url} target="_blank" rel="noopener noreferrer" aria-label="안심상속 원스톱 서비스 바로가기 (새 창)">바로가기</a>
            </article>
          </section>
        )}
      </div>
    </main>
  );
}
