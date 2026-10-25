import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  locale: "en",
  koPath: "/prepare",
  title: "Documents",
  description: "Documents commonly needed before a digital account request are listed on the documents page.",
  index: false,
  follow: true,
});

export default function EnglishDocumentsPage() {
  redirect("/en/prepare#documents");
}
