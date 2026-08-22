export type LocalizedText = {
  ko: string;
  en: string;
};

export type CommonProcedure = {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  url: string | null;
  linkTodo?: string;
};

export type CommonDocument = {
  id: string;
  name: LocalizedText;
  purpose: LocalizedText;
  issuer: LocalizedText;
  issueMethod: LocalizedText;
  online: boolean;
  url: string | null;
  linkTodo?: string;
};

export const processFlow = [
  { ko: "사망 발생", en: "Death occurs" },
  { ko: "공통 행정 절차 확인", en: "Review common procedures" },
  { ko: "필요한 서류 준비", en: "Prepare documents" },
  { ko: "회사별 디지털 계정 정리", en: "Handle each digital account" },
] satisfies LocalizedText[];

export const commonProcedures: CommonProcedure[] = [
  {
    id: "government24",
    name: { ko: "정부24", en: "Government24" },
    description: {
      ko: "행정 민원과 각종 증명서 발급을 확인할 수 있는 정부 서비스",
      en: "Government service for civil applications and official certificates",
    },
    url: "https://www.gov.kr/",
  },
  {
    id: "efamily",
    name: { ko: "전자가족관계등록시스템", en: "Electronic Family Relations Registration System" },
    description: {
      ko: "가족관계증명서, 기본증명서 등 가족관계 관련 서류를 확인하고 발급하는 서비스",
      en: "Service for family relation and basic certificates",
    },
    url: "https://efamily.scourt.go.kr/",
  },
  {
    id: "safe-inheritance",
    name: { ko: "안심상속 원스톱 서비스", en: "One-stop Inheritance Service" },
    description: {
      ko: "돌아가신 분의 금융재산, 토지, 자동차, 세금 등 상속 관련 재산을 한 번에 조회할 수 있도록 안내하는 서비스",
      en: "One-stop guidance for checking a deceased person's financial assets, land, vehicles, taxes, and other inherited property",
    },
    url: "https://www.gov.kr/mw/AA020InfoCappView.do?CappBizCD=17400000001&tp_seq=02",
  },
  {
    id: "national-pension",
    name: { ko: "국민연금", en: "National Pension Service" },
    description: {
      ko: "유족연금이나 사망 관련 급여·절차를 확인할 수 있는 서비스",
      en: "Service for survivor pensions and death-related benefits and procedures",
    },
    url: "https://www.nps.or.kr/main.do",
  },
  {
    id: "health-insurance",
    name: { ko: "국민건강보험", en: "National Health Insurance Service" },
    description: {
      ko: "건강보험 자격과 사망 이후 필요한 관련 행정 절차를 확인할 수 있는 서비스",
      en: "Service for health insurance eligibility and related procedures after death",
    },
    url: "https://www.nhis.or.kr/nhis/index.do",
  },
  {
    id: "hometax",
    name: { ko: "홈택스", en: "Hometax" },
    description: {
      ko: "상속 및 세금과 관련된 내용을 확인할 수 있는 서비스",
      en: "Service for inheritance and tax information",
    },
    url: "https://www.hometax.go.kr/",
  },
];

export const commonDocuments: CommonDocument[] = [
  {
    id: "family-relation-certificate",
    name: { ko: "가족관계증명서", en: "Family Relation Certificate" },
    purpose: {
      ko: "신청자와 고인의 가족관계 확인",
      en: "Confirms the relationship between the applicant and the deceased",
    },
    issuer: {
      ko: "전자가족관계등록시스템 등",
      en: "Electronic Family Relations Registration System and other authorized channels",
    },
    issueMethod: {
      ko: "전자가족관계등록시스템에서 본인 인증 후 가족관계증명서를 선택해요.",
      en: "Verify your identity in the Electronic Family Relations Registration System and select a family relations certificate.",
    },
    online: true,
    url: "https://efamily.scourt.go.kr/cs/CsBltnWrtGuide.do?bltnbordId=0000007&guideCd=0000007001&guideYn=Y",
  },
  {
    id: "basic-certificate",
    name: { ko: "기본증명서", en: "Basic Certificate" },
    purpose: {
      ko: "고인의 신분 사항과 사망 사실 확인",
      en: "May be used to confirm the deceased person's identity details and death",
    },
    issuer: {
      ko: "전자가족관계등록시스템 등",
      en: "Electronic Family Relations Registration System and other authorized channels",
    },
    issueMethod: {
      ko: "전자가족관계등록시스템에서 본인 인증 후 기본증명서를 선택해요.",
      en: "Verify your identity in the Electronic Family Relations Registration System and select a basic certificate.",
    },
    online: true,
    url: "https://efamily.scourt.go.kr/cs/CsBltnWrtGuide.do?bltnbordId=0000007&guideCd=0000007002&guideYn=Y",
  },
  {
    id: "death-certificate",
    name: { ko: "사망진단서", en: "Death Certificate" },
    purpose: { ko: "사망 사실 확인", en: "Confirms the fact of death" },
    issuer: { ko: "병원 또는 의료기관", en: "Hospital or medical institution" },
    issueMethod: {
      ko: "사망을 확인한 병원이나 의료기관의 원무과에 요청해요.",
      en: "Request a copy from the administration desk of the hospital or medical institution that confirmed the death.",
    },
    online: false,
    url: null,
    linkTodo: "의료기관별 발급 방식이 달라 공통 온라인 발급 링크 없음",
  },
];
