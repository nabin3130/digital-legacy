import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import type { ApplicationStep } from "@/components/ApplicationStepsView";
import GoogleAccountFlow from "@/components/GoogleAccountFlow";
import AppleAccountFlow from "@/components/AppleAccountFlow";
import NaverAccountFlow from "@/components/NaverAccountFlow";
import CompanyPolicyOverview from "@/components/CompanyPolicyOverview";
import CompanyAccountFlow from "@/components/CompanyAccountFlow";
import { companies } from "@/lib/data";
import { xApplicationSteps } from "@/lib/x-guidance";
import { getCompanySteps } from "@/lib/company-guidance";
import { companyMetadata } from "@/lib/seo";

type CompanyPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: CompanyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const canonicalSlug = slug === "facebook" ? "meta" : slug;
  const company = companies.find((item) => item.slug === canonicalSlug);

  if (!company) return { robots: { index: false, follow: false } };

  return companyMetadata("ko", canonicalSlug, company.policyDescription || company.summary);
}

export default async function CompanyPage({
  params,
}: CompanyPageProps) {
  const { slug } = await params;
  if (slug === "facebook") redirect("/company/meta");
  const companyPolicy = companies.find((company) => company.slug === slug);

  if (!companyPolicy) notFound();

  if (slug === "google") {
    return (
      <main className="section">
        <div className="container">
          <CompanyPolicyOverview company={companyPolicy} />
          <GoogleAccountFlow />
        </div>
      </main>
    );
  }

  if (slug === "apple") {
    return (
      <main className="section">
        <div className="container">
          <CompanyPolicyOverview company={companyPolicy} />
          <AppleAccountFlow />
        </div>
      </main>
    );
  }

  if (slug === "naver") {
    return (
      <main className="section">
        <div className="container">
          <CompanyPolicyOverview company={companyPolicy} />
          <NaverAccountFlow />
        </div>
      </main>
    );
  }

  const steps: ApplicationStep[] = slug === "x" ? xApplicationSteps : getCompanySteps(companyPolicy);

  const preDeathSteps = steps.filter(
    (step) => step.journey === "pre_death"
  );

  const postDeathSteps = steps.filter(
    (step) => step.journey === "post_death"
  );

  return (
    <main className="section">
      <div className="container">
        <CompanyPolicyOverview company={companyPolicy} />
        <CompanyAccountFlow
          company={companyPolicy}
          preDeathSteps={preDeathSteps}
          postDeathSteps={postDeathSteps}
        />
      </div>
    </main>
  );
}
