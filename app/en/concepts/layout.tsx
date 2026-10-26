import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  locale: "en",
  koPath: "/concepts",
  title: "Visual directions",
  description: "Internal preview of visual directions for the Logout homepage.",
  index: false,
  follow: false,
  languages: false,
});

export default function EnglishConceptsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
