import type { Metadata } from "next";
import ContentHub from "@/components/ContentHub";
import { afterGuides } from "@/lib/hubs";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({ locale: "ko", koPath: "/after", title: "돌아가신 뒤", description: "고인의 디지털 계정을 찾고, 기록을 보관하고, 공식 절차를 확인하는 순서를 안내합니다." });

export default function AfterPage() {
  return <ContentHub locale="ko" label="사후 정리" title="돌아가신 뒤" intro="모든 일을 한 번에 처리하지 않아도 됩니다. 기록을 확인하고 필요한 절차를 골라 하나씩 진행해 보세요." guides={afterGuides} note="온라인 서비스 계정과 데이터의 처리 조건은 회사별로 다릅니다. 비밀번호로 로그인하는 대신 신청자 조건과 요청 가능한 범위를 공식 고객센터에서 확인하세요." />;
}
