import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  locale: "ko",
  koPath: "/concepts",
  title: "시각 방향 미리보기",
  description: "로그아웃 첫 화면의 시각 방향을 비교하는 내부 미리보기입니다.",
  index: false,
  follow: false,
  languages: false,
});

export default function ConceptsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
