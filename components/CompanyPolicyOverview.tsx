import type { CompanyPolicy } from "@/lib/types";
import Link from "next/link";
import styles from "./CompanySummary.module.css";
import { companyEnglish } from "@/lib/company-en";

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
  x: "엑스",
};

const koreanProducts:Record<string,string>={Gmail:"지메일",YouTube:"유튜브","Google Photos":"구글 포토","Google Drive":"구글 드라이브","Google Calendar":"구글 캘린더",iCloud:"아이클라우드",Photos:"사진",Notes:"메모",Mail:"메일","iCloud Drive":"아이클라우드 드라이브",Facebook:"페이스북",Messenger:"메신저",Instagram:"인스타그램","Instagram Direct":"인스타그램 다이렉트","Samsung Account":"삼성 계정","Samsung Cloud":"삼성 클라우드","Samsung Notes":"삼성 노트",Calendar:"캘린더","Voice Recorder":"음성 녹음","Kakao Account":"카카오 계정","KakaoTalk":"카카오톡","KakaoStory":"카카오스토리",Daum:"다음","Brunch Story":"브런치스토리",Posts:"게시물",Media:"미디어","Direct Messages":"쪽지",Spaces:"스페이스"};
function koreanize(text:string){return text.replaceAll("Google","구글").replaceAll("Apple","애플").replaceAll("Samsung","삼성").replaceAll("Facebook","페이스북").replaceAll("Instagram","인스타그램").replaceAll("iCloud","아이클라우드")}

export default function CompanyPolicyOverview({ company, locale = "ko" }: { company: CompanyPolicy; locale?: "ko" | "en" }) {
  const english = companyEnglish[company.slug];
  const isEnglish = locale === "en";
  const displayName = isEnglish ? (english?.name ?? company.company) : (displayNames[company.slug] ?? company.company);
  const policyTitle = isEnglish ? (english?.policyTitle ?? company.policyTitle) : company.policyTitle;
  const policySubtitle = isEnglish ? english?.policySubtitle : undefined;
  const description = isEnglish ? (english?.description ?? company.summary) : koreanize(company.policyDescription || company.summary);
  const button = isEnglish ? "View official guidance" : "공식 안내 확인하기";
  const policyLink = isEnglish ? (english?.policyLink ?? company.policyLink) : company.policyLink;
  const services = isEnglish ? (english?.services ?? company.services) : company.services.map(service=>koreanProducts[service]??koreanize(service));

  return (
    <section id="company-overview" className={styles.summary} aria-labelledby="company-policy-title">
      <p className={styles.breadcrumb}>{isEnglish ? "Digital legacy by company" : <Link href="/services">회사별 디지털 유산 안내</Link>}　›　{displayName}</p>
      <div className={styles.content}>
        <div>
          <div className={styles.identity}>
            {logos[company.slug] && <img src={logos[company.slug]} alt="" width="58" height="58" />}
            <div>
              <h1>{displayName}</h1>
              <p className={styles.policyName} id="company-policy-title">{policyTitle}{policySubtitle ? ` · ${policySubtitle}` : ""}</p>
            </div>
          </div>
          <p className={styles.description}>{description}</p>
          {policyLink && <a className={styles.policyLink} href={policyLink} target="_blank" rel="noopener noreferrer" aria-label={`${button} ${isEnglish ? "(opens in a new tab)" : "(새 창)"}`}>{button}</a>}
          {!isEnglish && <div className={styles.trustMeta}><span>공식 출처 기준</span><span>마지막 확인 {company.lastUpdated.replaceAll("-", ".")}</span><Link href={`/contact?subject=${encodeURIComponent(`${displayName} 정책 링크 제보`)}`}>잘못된 링크 알리기</Link></div>}
          {!isEnglish && <p className={styles.roleNote}>로그아웃은 절차를 이해하기 쉽게 안내하며, 실제 신청과 결정은 각 회사의 공식 사이트에서 진행합니다.</p>}
        </div>
        <div className={styles.services} aria-label={`${displayName} ${isEnglish ? "services" : "적용 서비스"}`}>
          <strong>{isEnglish ? "Services covered" : "적용 서비스"}</strong>
          <ul>{services.map((service) => <li key={service}>{service}</li>)}</ul>
        </div>
      </div>
    </section>
  );
}
