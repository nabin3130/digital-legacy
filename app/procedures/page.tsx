import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  locale: "ko",
  koPath: "/prepare",
  title: "진행 절차",
  description: "디지털 계정 정리의 진행 순서는 준비서류 페이지에서 확인합니다.",
  index: false,
  follow: true,
});

export default function ProceduresPage() {
  redirect("/prepare");
}
