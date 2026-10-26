import { getPublishedGuides } from "@/lib/guides";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

export function GET() {
  const links = [
    ["상황별 안내", "/"], ["디지털 유산 가이드", "/guides"], ["회사별 안내", "/services"],
    ["정책 비교", "/compare"], ["준비서류", "/prepare"], ["정책 업데이트", "/updates"],
    ...getPublishedGuides().map((guide) => [guide.title, `/guides/${guide.slug}`]),
  ];
  return new Response([
    "# 로그아웃 (LOGOUT)", "", "> 한국 디지털 유산의 계정 삭제·데이터 다운로드·추모 계정 절차를 이해하도록 돕는 안내 사이트입니다.", "",
    "실제 신청 조건은 해당 회사의 최신 공식 안내를 확인하세요. 글의 게시·수정일은 모든 회사 정책의 재검증일이 아닙니다.", "",
    "## 주요 페이지", "", ...links.map(([title, path]) => `- [${title}](${absoluteUrl(path)})`), "",
  ].join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
