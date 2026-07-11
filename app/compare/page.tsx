import { companies } from "@/lib/data";

const text = (v:string) => v === "yes" ? "가능" : v === "partial" ? "일부" : v === "no" ? "불가" : "확인 중";
export default function Compare(){return <main className="section"><div className="container">
  <h1>정책 비교</h1>
  <div className="tablewrap"><table><thead><tr><th>회사</th><th>사전 계획</th><th>계정 삭제</th><th>추모 계정</th><th>유족 접근</th><th>데이터 다운로드</th><th>법원 명령</th><th>특징</th></tr></thead>
  <tbody>{companies.map(c=><tr key={c.id}><td><strong>{c.company}</strong></td><td>{text(c.preDeathPlanning)}</td><td>{text(c.accountDeletion)}</td><td>{text(c.memorialAccount)}</td><td>{text(c.familyAccess)}</td><td>{text(c.dataDownload)}</td><td>{text(c.courtOrder)}</td><td>{c.philosophy}</td></tr>)}</tbody></table></div>
</div></main>}
