import Link from "next/link";
import { CompanyPolicy } from "@/lib/types";

const label = (v: CompanyPolicy["preDeathPlanning"]) => v === "yes" ? "지원" : v === "partial" ? "일부" : v === "no" ? "미지원" : "확인 중";

export function CompanyCard({ company }: { company: CompanyPolicy }) {
  return <Link href={`/company/${company.slug}`} className="card">
    <div className="muted">{company.category}</div>
    <h3>{company.company}</h3>
    <p className="muted">{company.summary}</p>
    <div className="badges">
      <span className="badge">사전 설정 {label(company.preDeathPlanning)}</span>
      <span className="badge">추모 계정 {label(company.memorialAccount)}</span>
      <span className="badge">데이터 {label(company.dataDownload)}</span>
    </div>
  </Link>;
}
