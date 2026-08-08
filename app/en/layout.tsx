import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Logout – Digital Legacy Guide", template: "%s | Logout" },
  description: "Understand official digital legacy policies, required documents, and account procedures in one place.",
  alternates: { languages: { "ko-KR": "/", en: "/en" } },
  openGraph: { locale: "en_US", siteName: "Logout" },
};

export default function EnglishLayout({ children }: { children: React.ReactNode }) { return <div className="english-site">{children}</div>; }
