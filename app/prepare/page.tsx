import type { Metadata } from "next";
import { commonDocuments, commonProcedures } from "@/lib/common-guidance";
import { pageMetadata } from "@/lib/seo";
import ContentHub from "@/components/ContentHub";
import { prepareGuides } from "@/lib/hubs";
import styles from "./Prepare.module.css";

export const metadata: Metadata = pageMetadata({
  locale: "ko",
  koPath: "/prepare",
  title: "미리 준비",
  description: "디지털 계정과 기록을 정리해 두는 방법, 가족에게 안내를 남기는 방법을 살펴봅니다.",
});

const safeInheritance = commonProcedures.find((item) => item.id === "safe-inheritance");

export default function PreparePage() {
  return (
    <>
    <ContentHub asSection locale="ko" label="미리 준비" title="미리 준비" intro="오늘 계정 목록과 설정을 정리해 두면, 나중에 가족이 필요한 경로를 찾는 데 도움이 됩니다." guides={prepareGuides} note="이 양식에는 비밀번호, 복구 코드, 비밀 복구 문구를 적지 마세요. 접근 정보는 신뢰할 수 있는 별도 보관 방법을 사용하세요." />
    <main className={styles.page}>
      <div className="container">
        <header className={styles.heading}>
          <p className="eyebrow">필요한 서류</p>
          <h2>신청 전에 필요한 서류 확인하기</h2>
          <p>요구 서류는 회사와 요청 목적에 따라 다릅니다. 아래 내용은 용도 파악을 위한 참고로 확인하세요.</p>
        </header>

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
    </>
  );
}
