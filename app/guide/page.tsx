const terms = [
  ["디지털 유산", "사망 후에도 남는 계정, 데이터, 게시물, 디지털 자산 전반"],
  ["디지털 유품", "고인이 온라인 서비스에서 남긴 데이터와 기록"],
  ["일신전속적 정보", "본인에게만 귀속되어 양도나 상속이 제한되는 정보"],
  ["추모 계정", "로그인은 막고 고인의 프로필과 게시물을 보존하는 계정 상태"],
  ["휴면 계정", "장기간 사용하지 않아 별도 보관 또는 삭제 대상이 된 계정"]
];
export default function Guide(){return <main className="section"><div className="container"><h1>용어 가이드</h1><div className="grid">{terms.map(([t,d])=><section className="card" key={t}><h3>{t}</h3><p className="muted">{d}</p></section>)}</div><section className="card" style={{marginTop:24}}><h2>가족의 계정을 정리해야 할 때</h2><ul><li>사망증명서와 가족관계 서류 준비</li><li>고인이 사전 지정 기능을 사용했는지 확인</li><li>계정 삭제와 데이터 백업 중 원하는 목표 결정</li><li>플랫폼 공식 신청 페이지 확인</li><li>처리 결과와 제출 서류 사본 보관</li></ul></section></div></main>}
