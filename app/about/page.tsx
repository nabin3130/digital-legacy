import type { Metadata } from "next";
import Link from "next/link";
import styles from "./About.module.css";

export const metadata: Metadata = {
  title: "이야기",
  description: "흩어진 디지털 유산 정책을 누구나 쉽게 이해할 수 있도록 모으는 로그아웃 프로젝트의 시작과 방향을 소개합니다.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <article className={styles.article}>
        <header className={styles.heading}>
          <p className="eyebrow">ABOUT LOGOUT</p>
          <h1>로그아웃 프로젝트 이야기</h1>
          <p className={styles.question}>“살아있을 때는 개인정보지만, 죽으면 내 정보는 어떻게 될까?”</p>
          <p>이 질문에서 <strong>로그아웃</strong> 프로젝트는 시작되었습니다.</p>
        </header>

        <div className={styles.body}>
          <p>우리는 평생 온라인에서 살아갑니다. 사진을 남기고, 영상을 올리고, 이메일을 보내고, 블로그와 소셜미디어에 우리의 삶을 기록합니다. 하지만 삶이 끝난 뒤 이 디지털 기록은 어떻게 되는지, 그리고 가족은 무엇을 할 수 있는지 알고 있는 사람은 많지 않습니다.</p>

          <p>직접 여러 회사의 정책을 찾아보니 회사마다 절차와 철학이 모두 달랐습니다. 어떤 곳은 미리 유산 관리자를 지정할 수 있었고, 어떤 곳은 추모 계정을 운영했으며, 어떤 곳은 계정 삭제만 지원했습니다. 특히 국내 서비스는 관련 정책과 안내가 아직 부족하거나 모호한 경우도 많았습니다.</p>

          <p className={styles.statement}>그래서 이 프로젝트를 만들었습니다.</p>

          <p><strong>로그아웃</strong>은 흩어진 디지털 유산 정책을 한곳에 모아, 누구나 공식 절차를 쉽게 이해하고 다음 단계를 찾을 수 있도록 돕는 프로젝트입니다. 시작은 한국의 주요 서비스이지만, 앞으로 더 많은 국가와 서비스로 확장해 나가고 싶습니다.</p>

          <p>이 프로젝트는 제가 사랑하는 사람들을 떠올리며 만들었습니다.</p>

          <p>우리는 미리 유언장을 작성하고 보험을 준비하기도 합니다. 그렇다면 디지털 흔적도 삶을 마무리하기 전에 정리할 수 있어야 하지 않을까요?</p>

          <p>디지털 유산은 아직 법과 제도가 충분히 정립되지 않은 분야입니다. 기업마다 정책도 다르고, 디지털 데이터의 가치가 커질수록 앞으로 더 많은 논의가 필요할 것이라 생각합니다. 저는 이 프로젝트가 그 논의의 작은 시작점이 되었으면 합니다.</p>
        </div>

        <aside className={styles.contact}>
          <p>의견을 나누고 싶거나 커피챗을 원하신다면 언제든 이메일로 연락해 주세요.</p>
          <Link href="/contact">문의하기 →</Link>
        </aside>
      </article>
    </main>
  );
}
