export const policyUpdates: PolicyUpdate[] = [
  {
    date: "2026-10-25",
    category: { ko: "개인정보", en: "Privacy" },
    title: {
      ko: "문의 저장을 Supabase로 연동",
      en: "Contact inquiries can be stored in Supabase",
    },
    summary: {
      ko: "Supabase가 설정된 경우 문의 이메일과 내용을 운영자만 볼 수 있는 테이블에 저장합니다. 안내 진행 기록은 계속 기기에만 남고, 계정 정보와 증빙서류는 수집하지 않습니다. Supabase가 없으면 기존처럼 이메일로 전달됩니다.",
      en: "When Supabase is configured, contact emails and messages are stored in a table only the operator can read. Guide progress stays on the device, and account data or identity documents are not collected. Without Supabase, inquiries are still delivered by email.",
    },
  },
  {
    date: "2026-10-25",
    category: { ko: "운영 정책", en: "Policy" },
    title: {
      ko: "공식 정책 링크 재확인",
      en: "Official policy links reviewed",
    },
    summary: {
      ko: "카카오 추모 프로필·디지털 유산 도움말, 삼성 디지털 유산의 신청 기한과 접근 코드 요건, 인스타그램 기념 계정 관리자 안내를 현재 공식 페이지에 맞췄습니다. 애플, 구글, 페이스북, 네이버의 기존 핵심 링크는 열리며 내용이 맞는지 확인했습니다. X 도움말은 자동 조회가 거절되어 주소를 바꾸지 않았습니다.",
      en: "Updated Kakao memorial-profile and digital-legacy articles, Samsung’s one-year request window and access-code requirement, and Instagram legacy-contact guidance to the current official pages. Core Apple, Google, Facebook, and Naver links still open and match those pages. X Help rejected automated checks, so those URLs were left unchanged.",
    },
  },
  {
    date: "2026-08-23",
    category: { ko: "기능", en: "Feature" },
    title: {
      ko: "글로벌 영문 버전 1:1 완벽 동기화 및 인터랙티브 가이드 출시",
      en: "English version complete feature parity and interactive guide release",
    },
    summary: {
      ko: "한국어 최신 4단계 상황별 안내 시스템과 동일하게 8개 주요 플랫폼의 인터랙티브 가이드, 체크리스트, 공식 링크를 포함한 전면 영문 지원을 개시했습니다.",
      en: "Released full English parity including the 4-step situation guide, Google Inactive Account Manager, Apple Legacy Contact, Naver public post backup, and full company flows.",
    },
  },
  {
    date: "2026-08-22",
    category: { ko: "운영 정책", en: "Policy" },
    title: {
      ko: "주요 8개 플랫폼 디지털 유산 정책 종합 검증 및 개인정보처리방침 공개",
      en: "Comprehensive verification of 8 major platform digital legacy terms & privacy policy release",
    },
    summary: {
      ko: "구글, 애플, 메타, 인스타그램, 삼성, 네이버, 카카오, X의 공식 약관 및 신청 경로를 검증하고, 이용자 데이터 처리 기준과 권리를 명확히 안내했습니다.",
      en: "Verified official terms, required documents, and request paths for Apple, Google, Meta, Instagram, Samsung, Naver, Kakao, and X while defining clear user data protection standards.",
    },
  },
  {
    date: "2026-08-20",
    category: { ko: "서비스", en: "Service" },
    title: {
      ko: "로그아웃 디지털 유산 내비게이션 서비스 런칭",
      en: "Launched Logout digital legacy navigation service",
    },
    summary: {
      ko: "생전 계정 준비부터 사후 데이터 다운로드, 계정 삭제, 추모 프로필 전환까지 흩어진 디지털 유산 정책을 한곳에서 쉽게 안내합니다.",
      en: "Published step-by-step guides for posthumous account handling, required document preparations, and memorial profile conversions.",
    },
  },
];

