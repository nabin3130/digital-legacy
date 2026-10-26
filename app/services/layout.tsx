import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  locale: "ko",
  koPath: "/services",
  title: "회사별 안내",
  description: "회사를 고르면 계정 삭제, 데이터 다운로드, 추모 계정 중 가능한 절차를 확인할 수 있습니다.",
});

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
