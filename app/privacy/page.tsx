import type { Metadata } from "next";
import styles from "../PolicyPages.module.css";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "로그아웃 서비스의 개인정보 처리 기준과 이용자 권리를 안내합니다.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return <main className={styles.page}><div className="container">
    <header className={styles.header}><p className="eyebrow">PRIVACY</p><h1>개인정보처리방침</h1><p>로그아웃은 필요한 정보만 최소한으로 처리하고, 이용자가 자신의 정보가 어떻게 사용되는지 쉽게 이해할 수 있도록 안내합니다.</p><div className={styles.meta}><span>시행일 2026.08.22</span><span>최종 변경 2026.08.22</span></div></header>
    <article className={styles.body}>
      <section><h2>1. 처리하는 개인정보와 이용 목적</h2><table className={styles.table}><tbody><tr><th>문의 접수</th><td>연락받을 이메일, 문의 내용<br/>문의 확인과 답변을 위해 사용합니다.</td></tr><tr><th>자동 생성 정보</th><td>Google 광고 서비스 이용 과정에서 IP 주소, 브라우저·기기 정보, 방문 페이지, 쿠키 또는 유사 식별정보가 Google에 전달될 수 있습니다.</td></tr><tr><th>기기 내부 저장</th><td>선택한 안내 보기 방식, 체크리스트 상태와 진행 상태를 이용자의 브라우저에 저장합니다. 로그아웃 서버에는 전송하지 않습니다.</td></tr></tbody></table><p className={styles.notice}>로그아웃은 주민등록번호, 계정 비밀번호, 사망진단서, 가족관계증명서 또는 실제 계정 데이터를 입력받거나 저장하지 않습니다.</p></section>
      <section><h2>2. 개인정보의 보유 및 삭제</h2><ul><li>문의 이메일과 문의 내용: 답변 및 후속 처리 완료 후 30일 이내 삭제합니다. 다만 분쟁 대응이나 법령상 보관이 필요한 경우 해당 기간 동안 보관할 수 있습니다.</li><li>브라우저 저장 정보: 이용자가 브라우저 데이터를 삭제하거나 로그아웃의 ‘진행 기록 삭제’ 기능을 사용할 때 삭제됩니다.</li><li>Google 광고 관련 정보: Google의 정책과 이용자 설정에 따라 보관됩니다.</li></ul></section>
      <section><h2>3. 외부 서비스 이용</h2><h3>FormSubmit</h3><p>문의 폼에 입력한 이메일과 문의 내용은 이메일 전송을 위해 FormSubmit을 거쳐 운영자 이메일로 전달됩니다. FormSubmit은 전송 과정에서 보안과 서비스 제공에 필요한 정보를 처리할 수 있습니다. 민감한 개인정보나 계정 비밀번호, 증빙서류는 문의 내용에 입력하지 마세요.</p><p><a href="https://formsubmit.co/privacy.pdf" target="_blank" rel="noopener noreferrer">FormSubmit 개인정보 정책</a></p><h3>Google AdSense</h3><p>사이트 운영을 위해 Google AdSense를 사용할 수 있습니다. Google 또는 광고 파트너는 광고 제공, 부정 이용 방지와 효과 측정을 위해 쿠키, 웹 비콘, IP 주소 또는 기타 식별정보를 처리할 수 있습니다. 광고 개인 최적화 여부는 Google 광고 설정과 브라우저 설정에서 관리할 수 있습니다.</p><p><a href="https://policies.google.com/technologies/partner-sites?hl=ko" target="_blank" rel="noopener noreferrer">Google이 파트너 사이트 정보를 사용하는 방법</a></p></section>
      <section><h2>4. 이용자의 권리와 행사 방법</h2><p>이용자는 자신의 개인정보에 대해 열람, 정정, 삭제, 처리정지 또는 동의 철회를 요청할 수 있습니다. 문의 기록의 확인이나 삭제가 필요한 경우 아래 이메일로 요청해 주세요. 본인 확인이 필요한 경우 최소한의 정보만 추가로 요청할 수 있습니다.</p><p><a href="mailto:kimnabin01@gmail.com">kimnabin01@gmail.com</a></p></section>
      <section><h2>5. 쿠키와 브라우저 저장정보 관리</h2><p>이용자는 브라우저 설정에서 쿠키를 차단하거나 삭제할 수 있습니다. 브라우저 저장정보를 삭제하면 저장된 체크리스트와 진행 상태도 함께 사라질 수 있습니다. 광고 개인 최적화는 Google 광고 설정에서 관리할 수 있습니다.</p></section>
      <section><h2>6. 안전성 확보 조치</h2><p>로그아웃은 개인정보 입력을 최소화하고, HTTPS 통신을 사용하며, 운영자 계정에 대한 접근을 제한합니다. 문의 내용에는 계정 비밀번호, 신분증 사본, 증빙서류와 같은 민감한 정보를 입력하지 않도록 안내합니다.</p></section>
      <section><h2>7. 개인정보 보호 문의</h2><p>개인정보 처리와 관련한 문의, 불만 또는 권리 행사는 아래 연락처로 보내주세요.</p><table className={styles.table}><tbody><tr><th>담당</th><td>로그아웃 운영자</td></tr><tr><th>이메일</th><td><a href="mailto:kimnabin01@gmail.com">kimnabin01@gmail.com</a></td></tr></tbody></table></section>
      <section><h2>8. 처리방침의 변경</h2><p>이 방침이 변경되면 시행 전에 사이트의 정책 업데이트 게시판을 통해 변경 내용과 시행일을 안내합니다. 이전 변경 내역도 게시판에서 확인할 수 있습니다.</p></section>
    </article>
  </div></main>;
}
