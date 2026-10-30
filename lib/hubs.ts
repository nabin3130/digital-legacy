export type HubCard = { number: string; title: string; description: string; href: string };

export const prepareGuides: HubCard[] = [
  { number: "01", title: "내 디지털 계정 목록 만들기", description: "주요 서비스와 보관할 기록을 종이에 정리해 두세요. 비밀번호는 적지 않습니다.", href: "/templates#inventory" },
  { number: "02", title: "다운로드·삭제·추모의 차이", description: "요청 목적마다 결과와 되돌릴 수 있는 범위가 다릅니다.", href: "/guides/download-delete-memorial-differences" },
  { number: "03", title: "공식 계정 관리 기능 확인하기", description: "유산 관리자, 비활성 계정 설정 등 서비스가 제공하는 기능을 살펴보세요.", href: "/services" },
  { number: "04", title: "가족에게 남길 안내 작성하기", description: "어디서 무엇을 확인할지 적고, 계정 비밀정보는 안전하게 별도 관리합니다.", href: "/templates#instructions" },
  { number: "05", title: "복구 수단 점검하기", description: "2단계 인증 복구 코드와 연락처를 최신 상태로 유지하세요.", href: "/templates#access" },
];

export const afterGuides: HubCard[] = [
  { number: "01", title: "먼저 할 일과 미뤄도 되는 일", description: "기록 보관 여부를 정하고, 계정 삭제는 영향을 확인한 뒤 결정하세요.", href: "/guides/before-managing-a-deceased-account" },
  { number: "02", title: "계정과 기록을 찾는 방법", description: "기기, 이메일, 결제 내역과 종이 기록을 차분히 확인하세요.", href: "/guides/korea-find-digital-accounts" },
  { number: "03", title: "요청 서류와 공식 신청 경로", description: "회사마다 신청자와 필요한 자료가 다르므로 공식 안내에서 확인하세요.", href: "/prepare#documents" },
  { number: "04", title: "다운로드·삭제·추모를 구분하기", description: "기록을 남기거나 계정을 종료하기 전에 가능한 선택지를 비교합니다.", href: "/guides/download-delete-memorial-differences" },
  { number: "05", title: "재산 조회는 정부24에서 확인하기", description: "온라인 계정 처리와 상속 재산 조회는 별도의 절차입니다.", href: "https://www.gov.kr/mw/AA020InfoCappView.do?CappBizCD=17400000001" },
];

export const prepareGuidesEn: HubCard[] = [
  { number: "01", title: "Make an account inventory", description: "List services and records to keep on paper. Do not write passwords on it.", href: "/en/templates#inventory" },
  { number: "02", title: "Download, delete, or memorialize?", description: "Each request has a different outcome and may be hard to reverse.", href: "/en/guides/download-delete-memorial-differences" },
  { number: "03", title: "Review official account settings", description: "Check legacy contact and inactive account options offered by each service.", href: "/en/services" },
  { number: "04", title: "Leave clear instructions", description: "Explain where to look and how to proceed. Keep credentials stored separately.", href: "/en/templates#instructions" },
  { number: "05", title: "Check account recovery", description: "Keep two-factor recovery codes and contact details up to date.", href: "/en/templates#access" },
];

export const afterGuidesEn: HubCard[] = [
  { number: "01", title: "What to do first", description: "Decide what to preserve and review the effect before requesting deletion.", href: "/en/guides/before-managing-a-deceased-account" },
  { number: "02", title: "Find accounts and records", description: "Check devices, email, payment records, and paper files at a steady pace.", href: "/en/guides/korea-find-digital-accounts" },
  { number: "03", title: "Documents and official requests", description: "Applicants and documents vary by company. Check the company’s own instructions.", href: "/en/prepare#documents" },
  { number: "04", title: "Compare your options", description: "Review what can be downloaded, deleted, or kept as a memorial.", href: "/en/guides/download-delete-memorial-differences" },
  { number: "05", title: "Check inheritance records on Gov.kr", description: "Online account requests are separate from administrative inheritance inquiries.", href: "https://www.gov.kr/mw/AA020InfoCappView.do?CappBizCD=17400000001" },
];

export const templates = [
  { id: "inventory", title: "디지털 계정 목록", en: "Digital account inventory", description: "서비스 이름, 계정 식별 힌트, 보관할 기록과 다음 행동을 적습니다.", file: "digital-account-inventory" },
  { id: "instructions", title: "가족에게 남기는 디지털 안내", en: "Digital instructions for family", description: "확인할 위치와 연락처를 남깁니다. 비밀번호나 복구 코드는 적지 마세요.", file: "family-instructions" },
  { id: "access", title: "복구 수단 점검표", en: "Account recovery checklist", description: "2단계 인증, 복구 코드와 연락 수단을 주기적으로 확인합니다.", file: "recovery-checklist" },
];

export const cryptoNotes = {
  ko: [
    "가상자산 거래소 계정과 개인 지갑은 확인 경로가 다릅니다. 거래소 계정은 해당 사업자의 공식 고객센터와 신청 요건을 확인하세요.",
    "개인 지갑의 복구 문구, 개인 키, 인증 코드는 종이 양식이나 문의 게시판에 적거나 타인에게 전달하지 마세요. 잃어버리면 접근이 불가능할 수 있습니다.",
    "상속·세금·재산 분배의 판단은 이 안내에서 다루지 않습니다. 상황에 맞는 법률·세무 전문가와 공식 기관에 확인하세요.",
  ],
  en: [
    "Exchange accounts and self-custody wallets have different request paths. Contact an exchange only through its official support channel and check its applicant requirements.",
    "Never write a wallet recovery phrase, private key, or authentication code on a paper form or send it through a support message. Losing recovery material may make access impossible.",
    "This page does not determine inheritance, tax, or distribution rights. Confirm your situation with a qualified professional and the relevant Korean authority.",
  ],
};
