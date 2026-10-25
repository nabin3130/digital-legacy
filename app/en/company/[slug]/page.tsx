import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import CompanyPolicyOverview from "@/components/CompanyPolicyOverview";
import EnglishGoogleAccountFlow from "@/components/EnglishGoogleAccountFlow";
import EnglishAppleAccountFlow from "@/components/EnglishAppleAccountFlow";
import EnglishNaverAccountFlow from "@/components/EnglishNaverAccountFlow";
import EnglishCompanyAccountFlow from "@/components/EnglishCompanyAccountFlow";
import { companies } from "@/lib/data";
import { companyEnglish } from "@/lib/company-en";
import { companyMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const canonicalSlug = slug === "facebook" ? "meta" : slug;
  const company = companies.find((item) => item.slug === canonicalSlug);
  if (!company) return { robots: { index: false, follow: false } };
  const english = companyEnglish[canonicalSlug];
  const description = english?.description ?? company.policyDescription ?? company.summary;
  return companyMetadata("en", canonicalSlug, description);
}

export default async function EnglishCompanyPage({ params }: Props) {
  const { slug } = await params;
  if (slug === "facebook") redirect("/en/company/meta");
  const company = companies.find((item) => item.slug === slug);
  if (!company) notFound();

  if (slug === "google") {
    return (
      <main className="section">
        <div className="container">
          <CompanyPolicyOverview company={company} locale="en" />
          <EnglishGoogleAccountFlow />
        </div>
      </main>
    );
  }

  if (slug === "apple") {
    return (
      <main className="section">
        <div className="container">
          <CompanyPolicyOverview company={company} locale="en" />
          <EnglishAppleAccountFlow />
        </div>
      </main>
    );
  }

  if (slug === "naver") {
    return (
      <main className="section">
        <div className="container">
          <CompanyPolicyOverview company={company} locale="en" />
          <EnglishNaverAccountFlow />
        </div>
      </main>
    );
  }

  return (
    <main className="section">
      <div className="container">
        <CompanyPolicyOverview company={company} locale="en" />
        <EnglishCompanyAccountFlow company={company} />
      </div>
    </main>
  );
}

