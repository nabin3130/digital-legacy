import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  locale: "en",
  koPath: "/services",
  title: "Company guides",
  description: "Choose a company to see which account deletion, data download, and memorial account steps are available.",
});

export default function EnglishServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
