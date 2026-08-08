"use client";

import { useEffect, useState } from "react";
import styles from "./GoogleAccountFlow.module.css";

type KnowsId = "yes" | "no";
type RouteId = "backup" | "delete" | "npay";

const officialHelpUrl = "https://help.naver.com/service/5640/contents/17441?lang=ko";
const routes: Array<{ id: RouteId; title: string; description: string }> = [
  { id: "backup", title: "공개된 게시물을 보관하고 싶어요", description: "로그인하지 않아도 볼 수 있는 블로그 등의 게시물을 파일로 받을 수 있는지 요청해요." },
  { id: "delete", title: "고인의 네이버 계정을 없애고 싶어요", description: "필요한 서류를 준비해서 계정 탈퇴를 요청해요." },
  { id: "npay", title: "Npay에 남은 금액이 있는지 알고 싶어요", description: "상속받을 수 있는 Npay 포인트나 머니가 남아 있는지 확인해요." },
];

export default function NaverAccountFlow() {
  const [knowsId, setKnowsId] = useState<KnowsId | null>(null);
  const [route, setRoute] = useState<RouteId | null>(null);

  useEffect(() => {
    function restoreFromHistory(event?: PopStateEvent) {
      const saved = event?.state?.naverAccountFlow;
      if (saved) {
        setKnowsId(saved.knowsId ?? null);
        setRoute(saved.route ?? null);
        return;
      }
      const params = new URLSearchParams(window.location.hash.slice(1));
      setKnowsId((params.get("knows-id") as KnowsId | null) ?? null);
      setRoute((params.get("route") as RouteId | null) ?? null);
    }
    restoreFromHistory();
    window.addEventListener("popstate", restoreFromHistory);
    return () => window.removeEventListener("popstate", restoreFromHistory);
  }, []);

  function navigate(next: { knowsId: KnowsId | null; route?: RouteId | null }) {
    const nextRoute = next.route ?? null;
    const params = new URLSearchParams();
    if (next.knowsId) params.set("knows-id", next.knowsId);
    if (nextRoute) params.set("route", nextRoute);
    const hash = params.toString() ? `#${params.toString()}` : window.location.pathname;
    window.history.pushState({ naverAccountFlow: { knowsId: next.knowsId, route: nextRoute } }, "", hash);
    setKnowsId(next.knowsId);
    setRoute(nextRoute);
  }

  function reset() { navigate({ knowsId: null }); }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.brand} onClick={reset} aria-label="네이버 안내 처음으로">
          <img src="/logos/naver.svg" alt="" width="48" height="48" />
          <span><small>공식 절차 안내</small>네이버</span>
        </button>
        {knowsId && <button type="button" className={styles.back} onClick={() => window.history.back()}>← 이전으로</button>}
      </header>

      {!knowsId && <StepShell eyebrow="고인의 네이버 계정" title="고인의 네이버 아이디를 알고 있나요?" description="네이버에 도움을 요청하려면 고인이 사용하던 네이버 아이디를 알고 있어야 해요.">
        <Choice title="네, 알고 있어요" description="필요한 도움을 선택하고 준비할 서류를 확인할게요." onClick={() => navigate({ knowsId: "yes" })} />
        <Choice title="아니요, 모르겠어요" description="아이디를 모를 때 알아두어야 할 내용을 알려드릴게요." onClick={() => navigate({ knowsId: "no" })} />
      </StepShell>}

      {knowsId === "yes" && !route && <StepShell eyebrow="고인의 네이버 계정" title="어떤 도움이 필요한가요?" description="지금 하려는 일과 가장 가까운 항목을 선택해 주세요.">
        {routes.map((item) => <Choice key={item.id} title={item.title} description={item.description} onClick={() => navigate({ knowsId: "yes", route: item.id })} />)}
      </StepShell>}

      {knowsId === "no" && <UnknownId onReset={reset} />}
      {route === "backup" && <BackupDetail />}
      {route === "delete" && <DeleteDetail />}
      {route === "npay" && <NpayDetail />}
    </div>
  );
}

function StepShell({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: React.ReactNode }) {
  return <main className={`${styles.shell} ${styles.compact}`}><p className={styles.eyebrow}>{eyebrow}</p><h1>{title}</h1><p className={styles.lead}>{description}</p><div className={styles.choices}>{children}</div></main>;
}

function Choice({ title, description, onClick }: { title: string; description: string; onClick: () => void }) {
  return <button type="button" className={styles.choice} onClick={onClick}><span><strong>{title}</strong><small>{description}</small></span></button>;
}

function UnknownId({ onReset }: { onReset: () => void }) {
  return <DetailPage eyebrow="고인의 네이버 계정" title="먼저 고인의 네이버 아이디를 확인해 주세요" intro="네이버는 가족이 고인의 아이디를 알고 있는 경우에만 사망 회원 관련 도움을 제공하고 있어요." note="가족이라도 네이버에 고인의 아이디나 비밀번호를 요청해서 받을 수는 없어요. 고인의 개인정보를 보호하기 위한 네이버의 원칙이에요." action={{ label: "처음으로 돌아가기", onClick: onReset }} />;
}

function BackupDetail() {
  return <DetailPage eyebrow="공개 게시물 보관" title="공개된 게시물의 백업을 요청해요" intro="로그인하지 않아도 누구나 볼 수 있는 고인의 블로그 게시물 등을 파일로 받을 수 있는지 네이버에 요청할 수 있어요." warning="메일이나 비공개 게시물처럼 로그인해야 볼 수 있는 정보는 받을 수 없어요. 고인의 아이디와 비밀번호도 제공되지 않아요." sections={[["준비할 서류", ["고인의 사망 사실을 확인할 수 있는 서류", "신청자와 고인의 가족관계를 확인할 수 있는 서류", "네이버가 요청하는 동의서"]]]} link={{ label: "네이버에 공개 게시물 백업 요청하기", href: officialHelpUrl }} />;
}

function DeleteDetail() {
  return <DetailPage eyebrow="고인의 계정 탈퇴" title="고인의 네이버 계정을 탈퇴시켜요" intro="고인의 사망 사실과 가족관계를 확인할 수 있는 서류를 제출하면 네이버에 계정 탈퇴를 요청할 수 있어요." warning="계정이 탈퇴되면 아이디와 데이터는 다시 복구할 수 없어요. 보관할 공개 게시물이 있다면 백업을 먼저 요청해 주세요." sections={[
    ["준비할 서류", ["고인의 사망 사실을 확인할 수 있는 서류", "신청자와 고인의 가족관계를 확인할 수 있는 서류", "네이버가 요청하는 동의서", "경우에 따라 상속관계를 확인할 추가 서류"]],
    ["서류를 제출할 때", ["공공기관에서 발급받은 서류를 준비해요.", "주민등록번호 뒤 7자리는 반드시 가려 주세요.", "가리지 않은 서류는 바로 파기되어 다시 접수해야 해요."]],
  ]} link={{ label: "네이버에 계정 탈퇴 요청하기", href: officialHelpUrl }} />;
}

function NpayDetail() {
  return <DetailPage eyebrow="Npay 포인트·머니" title="상속할 수 있는 금액이 남아 있는지 확인해요" intro="고인의 계정에 상속할 수 있는 Npay 포인트나 머니가 남아 있는지 네이버에 조회를 요청할 수 있어요." sections={[
    ["준비할 서류", ["고인의 사망 사실을 확인할 수 있는 서류", "신청자와 고인의 가족관계를 확인할 수 있는 서류", "네이버가 추가로 요청하는 상속 관련 서류"]],
    ["알아둘 점", ["계정을 탈퇴하지 않고 Npay 잔액만 환급받고 싶다면 Npay 고객센터에 따로 문의해야 해요."]],
  ]} link={{ label: "Npay 잔액 확인 방법 보기", href: officialHelpUrl }} />;
}

type Section = [string, string[]];
function DetailPage({ eyebrow, title, intro, warning, note, sections = [], link, action }: { eyebrow: string; title: string; intro: string; warning?: string; note?: string; sections?: Section[]; link?: { label: string; href: string }; action?: { label: string; onClick: () => void } }) {
  return <main className={`${styles.shell} ${styles.compact} ${styles.detail}`}><p className={styles.eyebrow}>{eyebrow}</p><h1>{title}</h1><p className={styles.lead}>{intro}</p>{warning && <div className={styles.warning}><strong>먼저 확인해 주세요</strong><p>{warning}</p></div>}{sections.length > 0 && <div className={styles.sections}>{sections.map(([heading, items]) => <section key={heading}><h2>{heading}</h2><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></section>)}</div>}{note && <p className={styles.note}>{note}</p>}<div className={styles.actions}>{action && <button type="button" className={styles.secondary} onClick={action.onClick}>{action.label}</button>}{link && <a className={styles.primary} href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>}</div></main>;
}
