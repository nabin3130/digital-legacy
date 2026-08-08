import { notFound } from "next/navigation";
import ApplicationStepsView, {
  type ApplicationStep,
} from "@/components/ApplicationStepsView";
import GoogleAccountFlow from "@/components/GoogleAccountFlow";
import AppleAccountFlow from "@/components/AppleAccountFlow";
import NaverAccountFlow from "@/components/NaverAccountFlow";
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

  if (slug === "google") {
    return (
      <main className="section">
        <div className="container">
          <GoogleAccountFlow />
        </div>
      </main>
    );
  }

  if (slug === "apple") {
    return (
      <main className="section">
        <div className="container">
          <AppleAccountFlow />
        </div>
      </main>
    );
  }

  if (slug === "naver") {
    return (
      <main className="section">
        <div className="container">
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

  const companyName =
    slug === "kakao"
      ? "카카오"
      : companyKey;

  return (
    <main className="section">
      <div className="container">
        <p className="muted">Digital Legacy Application Hub</p>

        <ApplicationStepsView
          companyName={companyName}
          preDeathSteps={preDeathSteps}
          postDeathSteps={postDeathSteps}
        />
      </div>
    </main>
  );
}
