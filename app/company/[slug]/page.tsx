import { notFound, redirect } from "next/navigation";
import type { ApplicationStep } from "@/components/ApplicationStepsView";
import GoogleAccountFlow from "@/components/GoogleAccountFlow";
import AppleAccountFlow from "@/components/AppleAccountFlow";
import NaverAccountFlow from "@/components/NaverAccountFlow";
import CompanyPolicyOverview from "@/components/CompanyPolicyOverview";
import CompanyAccountFlow from "@/components/CompanyAccountFlow";
import { companies } from "@/lib/data";
import { createServerSupabaseClient } from "@/lib/supabase-server";

type CompanyPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

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

  const supabase = await createServerSupabaseClient();

  const companyKey =
    slug === "kakao"
      ? "Kakao"
      : slug.charAt(0).toUpperCase() + slug.slice(1);

  const { data, error } = await supabase
    .from("application_steps")
    .select("*")
    .eq("company", companyKey)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error(error);
    throw new Error("신청 정보를 불러오지 못했습니다.");
  }

  if (!data || data.length === 0) {
    notFound();
  }

  const steps = data as ApplicationStep[];

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
