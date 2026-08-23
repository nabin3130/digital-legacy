import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import CompanyPolicyOverview from "@/components/CompanyPolicyOverview";
import EnglishGoogleAccountFlow from "@/components/EnglishGoogleAccountFlow";
import EnglishAppleAccountFlow from "@/components/EnglishAppleAccountFlow";
import EnglishNaverAccountFlow from "@/components/EnglishNaverAccountFlow";
import EnglishCompanyAccountFlow from "@/components/EnglishCompanyAccountFlow";
import { companies } from "@/lib/data";
import { companyEnglish } from "@/lib/company-en";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const canonicalSlug = slug === "facebook" ? "meta" : slug;
  const company = companies.find((item) => item.slug === canonicalSlug);
  if (!company) return {};
  const english = companyEnglish[canonicalSlug];
  const title = `${english?.name ?? company.company} Digital Legacy Policy`;
  const description = english?.description ?? company.policyDescription ?? company.summary;
  return {
    title,
    description,
    alternates: {
      canonical: `/en/company/${canonicalSlug}`,
      languages: { "ko-KR": `/company/${canonicalSlug}`, en: `/en/company/${canonicalSlug}` },
    },
    openGraph: {
      type: "article",
      url: `/en/company/${canonicalSlug}`,
      title,
      description,
    },
  };
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

