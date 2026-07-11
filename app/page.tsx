import { companies } from "@/lib/data";
import { CompanyCard } from "@/components/CompanyCard";

export default function Home() {
  return <main>
    <section className="hero"><div className="container">
      <p className="muted">Digital Legacy Guide</p>
      <h1>사라진 뒤에도<br/>남는 계정과 데이터</h1>
      <p>회사마다 흩어져 있는 사망 후 계정 처리 정책, 필요한 서류, 신청 경로를 한곳에서 찾고 비교합니다.</p>
      <input className="search" aria-label="회사 또는 서비스 검색" placeholder="회사 또는 서비스를 검색하세요" />
    </div></section>
    <section className="section"><div className="container">
      <h2>회사별 정책</h2>
      <div className="grid">{companies.map(c => <CompanyCard key={c.id} company={c}/>)}</div>
    </div></section>
  </main>;
}
