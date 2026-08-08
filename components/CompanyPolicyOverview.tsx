import type { CompanyPolicy } from "@/lib/types";
import styles from "./CompanySummary.module.css";

const logos: Record<string, string> = {
  apple: "/logos/apple.svg",
  google: "/logos/google.svg",
  meta: "/logos/meta.svg",
  instagram: "/logos/instagram.webp",
  samsung: "/logos/samsung.svg",
  naver: "/logos/naver.svg",
  kakao: "/logos/kakao.webp",
  x: "/logos/x.svg",
};

const displayNames: Record<string, string> = {
  apple: "애플",
  google: "구글",
  meta: "메타",
  instagram: "인스타그램",
  samsung: "삼성",
  naver: "네이버",
  kakao: "카카오",
  x: "X",
};

export default function CompanyPolicyOverview({ company }: { company: CompanyPolicy }) {
  const displayName = displayNames[company.slug] ?? company.company;

  return (
    <section id="company-overview" className={styles.summary} aria-labelledby="company-policy-title">
      <p className={styles.breadcrumb}>회사별 디지털 유산 안내　›　{displayName}</p>
      <div className={styles.content}>
        <div>
          <div className={styles.identity}>
            {logos[company.slug] && <img src={logos[company.slug]} alt="" width="58" height="58" />}
            <div>
              <h1>{displayName}</h1>
              <p className={styles.policyName} id="company-policy-title">{company.policyTitle}{company.policySubtitle ? ` · ${company.policySubtitle}` : ""}</p>
            </div>
          </div>
          <p className={styles.description}>{company.policyDescription || company.summary}</p>
          {company.policyLink && <a className={styles.policyLink} href={company.policyLink} target="_blank" rel="noopener noreferrer" aria-label={`${displayName} ${company.policyButton} (새 창)`}>{company.policyButton} ↗</a>}
        </div>
        <div className={styles.services} aria-label={`${displayName} 적용 서비스`}>
          <strong>적용 서비스</strong>
          <ul>{company.services.map((service) => <li key={service}>{service}</li>)}</ul>
        </div>
      </div>
    </section>
  );
}
