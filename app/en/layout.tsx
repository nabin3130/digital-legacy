import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "LOGOUT – Digital Legacy Guide", template: "%s | LOGOUT" },
  description: "Find official guidance for preparing, downloading, memorializing, or deleting digital accounts.",
  alternates: { languages: { "ko-KR": "/", en: "/en" } },
  openGraph: { locale: "en_US", siteName: "LOGOUT" },
};

export default function EnglishLayout({ children }: { children: React.ReactNode }) { return <div className="english-site">{children}</div>; }
