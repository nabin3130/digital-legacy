import type { CompanyPolicy } from "@/lib/types";

const logos: Record<string, string> = {
  apple: "/logos/apple.svg",
  google: "/logos/google.svg",
  facebook: "/logos/meta.svg",
  instagram: "/logos/instagram.webp",
  samsung: "/logos/samsung.svg",
  naver: "/logos/naver.svg",
  kakao: "/logos/kakao.webp",
};

const displayNames: Record<string, string> = {
  apple: "애플",
  google: "구글",
  facebook: "페이스북",
  instagram: "인스타그램",
  samsung: "삼성",
  naver: "네이버",
  kakao: "카카오",
};

export default function CompanyPolicyOverview({ company }: { company: CompanyPolicy }) {
  const displayName = displayNames[company.slug] ?? company.company;

  return (
    <section id="company-overview" className="policy-overview" aria-labelledby="company-policy-title">
      <div className="policy-hero">
        <div className="policy-hero-heading">
          {logos[company.slug] && <img src={logos[company.slug]} alt="" width="64" height="64" />}
          <div>
            <p className="eyebrow">회사별 디지털 유산 안내</p>
            <h1>{displayName}</h1>
          </div>
        </div>
        <p className="policy-hero-description">{company.summary}</p>
        <div className="policy-services" aria-label={`${displayName} 적용 서비스`}>
          <strong>적용 서비스</strong>
          <ul>{company.services.map((service) => <li key={service}>{service}</li>)}</ul>
        </div>
      </div>

      <article className="policy-card">
        <p className="policy-card-label">사망 후 처리 방식</p>
        <h2 id="company-policy-title">{company.policyTitle}</h2>
        {company.policySubtitle && <p className="policy-subtitle">{company.policySubtitle}</p>}
        <p className="policy-description">{company.policyDescription}</p>
        {company.policyLink ? (
          <a href={company.policyLink} target="_blank" rel="noopener noreferrer" aria-label={`${displayName} ${company.policyButton} (새 창)`}>
            {company.policyButton} <span aria-hidden="true">↗</span>
          </a>
        ) : (
          <span className="policy-link-pending">공식 정책 링크 확인 중</span>
        )}
      </article>
    </section>
  );
}
