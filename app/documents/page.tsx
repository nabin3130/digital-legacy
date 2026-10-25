import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  locale: "ko",
  koPath: "/prepare",
  title: "준비서류",
  description: "계정 정리 전에 자주 필요한 서류는 준비서류 페이지에서 확인합니다.",
  index: false,
  follow: true,
});

export default function DocumentsPage() {
  redirect("/prepare#documents");
}
