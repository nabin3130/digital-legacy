import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  locale: "en",
  koPath: "/prepare",
  title: "Procedures",
  description: "The usual order of steps for a digital account request is on the documents page.",
  index: false,
  follow: true,
});

export default function EnglishProceduresPage() {
  redirect("/en/prepare");
}
