export type HubCard = { number: string; title: string; description: string; href: string };

export const prepareGuides: HubCard[] = [
  { number: "01", title: "다운로드·삭제·추모의 차이", description: "요청 목적마다 결과와 되돌릴 수 있는 범위가 다릅니다.", href: "/guides/download-delete-memorial-differences" },
  { number: "02", title: "공식 계정 관리 기능 확인하기", description: "유산 관리자와 비활성 계정 설정 등 회사가 제공하는 기능을 살펴보세요.", href: "/services" },
];

export const afterGuides: HubCard[] = [
  { number: "01", title: "먼저 할 일과 미뤄도 되는 일", description: "기록 보관 여부를 정하고, 계정 삭제는 영향을 확인한 뒤 결정하세요.", href: "/guides/before-managing-a-deceased-account" },
  { number: "02", title: "계정과 기록을 찾는 방법", description: "기기, 이메일, 결제 내역과 종이 기록을 차분히 확인하세요.", href: "/guides/korea-find-digital-accounts" },
  { number: "03", title: "회사별 신청 경로 확인하기", description: "신청자 조건과 필요한 자료는 각 서비스의 공식 안내에서 확인하세요.", href: "/services" },
  { number: "04", title: "다운로드·삭제·추모를 구분하기", description: "기록을 남기거나 계정을 종료하기 전에 가능한 선택지를 비교합니다.", href: "/guides/download-delete-memorial-differences" },
  { number: "05", title: "재산 조회는 정부24에서 확인하기", description: "온라인 계정 처리와 상속 재산 조회는 별도의 절차입니다.", href: "https://www.gov.kr/mw/AA020InfoCappView.do?CappBizCD=17400000001" },
];

export const prepareGuidesEn: HubCard[] = [
  { number: "01", title: "Download, delete, or memorialize?", description: "Each request has a different outcome and may be hard to reverse.", href: "/en/guides/download-delete-memorial-differences" },
  { number: "02", title: "Review official account settings", description: "Check legacy contact and inactive account options offered by each service.", href: "/en/services" },
];

export const afterGuidesEn: HubCard[] = [
  { number: "01", title: "What to do first", description: "Decide what to preserve and review the effect before requesting deletion.", href: "/en/guides/before-managing-a-deceased-account" },
  { number: "02", title: "Find accounts and records", description: "Check devices, email, payment records, and paper files at a steady pace.", href: "/en/guides/korea-find-digital-accounts" },
  { number: "03", title: "Check each service’s request process", description: "Applicant requirements and documents vary by company. Start with its official instructions.", href: "/en/services" },
  { number: "04", title: "Compare your options", description: "Review what can be downloaded, deleted, or kept as a memorial.", href: "/en/guides/download-delete-memorial-differences" },
  { number: "05", title: "Check inheritance records on Gov.kr", description: "Online account requests are separate from administrative inheritance inquiries.", href: "https://www.gov.kr/mw/AA020InfoCappView.do?CappBizCD=17400000001" },
];

