import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import CompanyPolicyOverview from "@/components/CompanyPolicyOverview";
import EnglishCompanyGuide from "@/components/EnglishCompanyGuide";
import { companies } from "@/lib/data";
import { companyEnglish } from "@/lib/company-en";

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; const canonicalSlug = slug === "facebook" ? "meta" : slug; const company = companies.find((item) => item.slug === canonicalSlug); if (!company) return {};
  const english = companyEnglish[canonicalSlug]; const title = `${english?.name ?? company.company} digital legacy policy`; const description = english?.description ?? company.summary;
  return { title, description, alternates: { canonical: `/en/company/${canonicalSlug}`, languages: { "ko-KR": `/company/${canonicalSlug}`, en: `/en/company/${canonicalSlug}` } } };
}
export default async function EnglishCompanyPage({ params }: Props) {
  const { slug } = await params; if (slug === "facebook") redirect("/en/company/meta"); const company = companies.find((item) => item.slug === slug); if (!company) notFound();
  return <main className="section"><div className="container"><CompanyPolicyOverview company={company} locale="en" /><EnglishCompanyGuide company={company} /></div></main>;
}
