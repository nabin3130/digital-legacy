import { notFound } from "next/navigation";
import { companies } from "@/lib/data";

export function generateStaticParams(){ return companies.map(c => ({ slug: c.slug })); }

export default async function CompanyPage({ params }: { params: Promise<{slug:string}> }) {
  const { slug } = await params;
  const company = companies.find(c => c.slug === slug);
  if (!company) notFound();
  return <main className="section"><div className="container">
    <p className="muted">{company.platform}</p>
    <h1>{company.company}</h1>
    <p>{company.summary}</p>
    <div className="detail">
      <section className="card"><h2>한눈에 보기</h2><p>{company.philosophy}</p><p className="muted">마지막 확인일 {company.lastUpdated}</p></section>
      <section className="card"><h2>필요한 서류</h2><ul>{company.requiredDocs.map(x=><li key={x}>{x}</li>)}</ul></section>
      <section className="card"><h2>가능한 것</h2><ul>{company.available.map(x=><li key={x}>{x}</li>)}</ul></section>
      <section className="card"><h2>불가능한 것</h2><ul>{company.unavailable.map(x=><li key={x}>{x}</li>)}</ul></section>
      <section className="card"><h2>주의사항</h2><ul>{company.limitations.map(x=><li key={x}>{x}</li>)}</ul></section>
      <section className="card"><h2>공식 신청 링크</h2>{company.officialLinks.map(x=><p key={x.label}>{x.label}</p>)}</section>
    </div>
  </div></main>;
}
