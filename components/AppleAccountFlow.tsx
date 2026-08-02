"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./GoogleAccountFlow.module.css";

type Audience = "mine" | "deceased";
type RouteId = "add-contact" | "share-key" | "request-access" | "download-data" | "delete-account" | "no-key";

const routes: Record<Audience, Array<{ id: RouteId; title: string; description: string }>> = {
  mine: [
    { id: "add-contact", title: "유산 연락처를 추가하고 싶어요", description: "사후에 내 계정 데이터에 접근할 사람을 미리 지정해요." },
    { id: "share-key", title: "접근 키를 공유하고 보관하고 싶어요", description: "유산 연락처가 나중에 사용할 접근 키를 안전하게 전달해요." },
  ],
  deceased: [
    { id: "request-access", title: "유산 연락처로 계정 접근을 요청하고 싶어요", description: "접근 키와 사망 증명서를 준비해 애플에 요청해요." },
    { id: "download-data", title: "승인된 데이터를 확인하고 내려받고 싶어요", description: "승인된 유산 연락처 계정으로 보관할 데이터를 내려받아요." },
    { id: "delete-account", title: "고인의 애플 계정 삭제를 요청하고 싶어요", description: "고인의 계정과 데이터를 영구 삭제하도록 요청해요." },
    { id: "no-key", title: "접근 키가 없을 때 절차를 확인하고 싶어요", description: "법원 명령 또는 지역에서 인정하는 법적 서류가 필요한 절차를 확인해요." },
  ],
};

export default function AppleAccountFlow() {
  const [audience, setAudience] = useState<Audience | null>(null);
  const [route, setRoute] = useState<RouteId | null>(null);

  useEffect(() => {
    function restore(event?: PopStateEvent) {
      const saved = event?.state?.appleAccountFlow;
      if (saved) { setAudience(saved.audience ?? null); setRoute(saved.route ?? null); return; }
      const params = new URLSearchParams(window.location.hash.slice(1));
      setAudience(params.get("account") as Audience | null);
      setRoute(params.get("route") as RouteId | null);
    }
    restore();
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, []);

  function navigate(next: { audience: Audience | null; route?: RouteId | null }) {
    const nextRoute = next.route ?? null;
    const params = new URLSearchParams();
    if (next.audience) params.set("account", next.audience);
    if (nextRoute) params.set("route", nextRoute);
    const hash = params.toString() ? `#${params.toString()}` : window.location.pathname;
    window.history.pushState({ appleAccountFlow: { audience: next.audience, route: nextRoute } }, "", hash);
    setAudience(next.audience); setRoute(nextRoute);
  }

  const reset = () => navigate({ audience: null });

  return <div className={styles.page}>
    <header className={styles.header}>
      <button type="button" className={styles.brand} onClick={reset} aria-label="애플 안내 처음으로">
        <img src="/logos/apple.svg" alt="" width="48" height="48" />
        <span><small>공식 절차 안내</small>애플</span>
      </button>
      {(audience || route) && <button type="button" className={styles.back} onClick={() => window.history.back()}>← 이전으로</button>}
    </header>

    {audience && <nav className={styles.contextNavigation} aria-label="애플 도움말 내 이동">
      <ol className={styles.breadcrumb}>
        <li><Link href="/#services">서비스</Link></li>
        <li><button type="button" onClick={reset}>애플</button></li>
        <li><button type="button" onClick={() => navigate({ audience })}>{audience === "mine" ? "내 애플 계정" : "고인의 애플 계정"}</button></li>
      </ol>
      {route && <div className={styles.quickNavigation}>
        <div className={styles.accountTabs} aria-label="계정 유형 선택">
          <button type="button" className={audience === "mine" ? styles.activeTab : ""} onClick={() => navigate({ audience: "mine" })}>내 애플 계정</button>
          <button type="button" className={audience === "deceased" ? styles.activeTab : ""} onClick={() => navigate({ audience: "deceased" })}>고인의 애플 계정</button>
        </div>
        <label className={styles.routeSelect}><span>다른 도움 보기</span><select value={route} onChange={(e) => navigate({ audience, route: e.target.value as RouteId })}>{routes[audience].map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
      </div>}
    </nav>}

    {!audience && <StepShell eyebrow="애플 계정" title="어떤 계정에 관한 도움이 필요한가요?" description="상황을 선택하면 필요한 공식 절차만 순서대로 안내해 드려요.">
      <Choice title="내 애플 계정" description="유산 연락처를 지정하고 접근 키를 준비하고 싶어요." onClick={() => navigate({ audience: "mine" })} />
      <Choice title="고인의 애플 계정" description="고인의 데이터에 접근하거나 계정을 처리하고 싶어요." onClick={() => navigate({ audience: "deceased" })} />
    </StepShell>}
    {audience && !route && <StepShell eyebrow={audience === "mine" ? "내 애플 계정" : "고인의 애플 계정"} title="무엇을 하고 싶은가요?" description="가장 가까운 항목을 선택해 주세요.">{routes[audience].map(item => <Choice key={item.id} title={item.title} description={item.description} onClick={() => navigate({ audience, route: item.id })} />)}</StepShell>}
    {route && <Detail route={route} />}
  </div>;
}

function StepShell({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: React.ReactNode }) {
  return <main className={`${styles.shell} ${styles.compact}`}><p className={styles.eyebrow}>{eyebrow}</p><h1>{title}</h1><p className={styles.lead}>{description}</p><div className={styles.choices}>{children}</div></main>;
}
function Choice({ title, description, onClick }: { title: string; description: string; onClick: () => void }) {
  return <button type="button" className={styles.choice} onClick={onClick}><span><strong>{title}</strong><small>{description}</small></span></button>;
}

const GUIDE = "https://support.apple.com/ko-kr/102631";
const ACCESS_KEY = "https://support.apple.com/ko-kr/102678";
const DIGITAL_LEGACY = "https://digital-legacy.apple.com/?r=1&language=KR-KO";

function Detail({ route }: { route: RouteId }) {
  if (route === "add-contact") return <DetailPage eyebrow="내 애플 계정" title="유산 연락처를 추가하고 싶어요" intro="iPhone·iPad 또는 Mac의 애플 계정 설정에서 사후 데이터에 접근할 유산 연락처를 한 명 이상 추가해요." sections={[["진행 방법", ["설정에서 내 이름과 로그인 및 보안을 선택해요.", "유산 연락처를 선택한 뒤 연락처를 추가해요.", "상대방에게 접근 키를 전달해요."]], ["꼭 알아둘 점", ["유산 연락처는 내 비밀번호를 받지 않아요.", "여러 명을 지정할 수 있고 나중에 변경하거나 삭제할 수 있어요."]]]} primary={{ label: "애플 안내 확인하기", href: GUIDE }} />;
  if (route === "share-key") return <DetailPage eyebrow="내 애플 계정" title="접근 키를 공유하고 보관하고 싶어요" intro="유산 연락처를 추가할 때 생성되는 접근 키를 iMessage로 보내거나 PDF·인쇄본으로 전달해 안전하게 보관해요." sections={[["공유 방법", ["상대방이 애플 기기를 사용하면 iMessage로 보내요.", "그 밖의 경우 접근 키 사본을 PDF로 저장하거나 인쇄해 전달해요."]], ["꼭 알아둘 점", ["접근 키는 사망 증명서와 함께 계정 접근 요청에 사용돼요.", "분실하지 않도록 유산 연락처와 보관 위치를 확인해 두세요."]]]} primary={{ label: "접근 키 안내 확인하기", href: ACCESS_KEY }} />;
  if (route === "request-access") return <DetailPage eyebrow="고인의 애플 계정" title="유산 연락처로 계정 접근을 요청하고 싶어요" intro="고인이 남긴 접근 키와 사망 증명서를 준비한 뒤 애플에 계정 접근을 요청해요." sections={[["유산 관리자로서 접근 권한을 요청하기 전", ["고인이 유산 연락처를 지정할 때 생성한 접근 키와 사망 증명서가 필요해요.", "요청이 승인되면 고인의 기존 애플 계정이 아니라 별도의 유산 연락처용 애플 계정으로 데이터에 접근해요.", "데이터에는 최초 승인일로부터 3년간 접근할 수 있으며, 이후 유산 연락처용 계정은 영구 삭제돼요.", "유산 연락처가 여러 명이면 각자 접근을 요청할 수 있고, 한 명이 계정 삭제를 결정하면 다른 유산 연락처의 접근도 종료돼요."]], ["유산 관리자가 접근할 수 있는 데이터", ["iCloud 사진, 메일, 연락처, 캘린더 및 미리 알림", "메모, iCloud에 저장된 메시지, 통화 기록 및 음성 메모", "iCloud Drive의 파일과 iCloud 백업", "건강 데이터와 Safari 책갈피 및 읽기 목록", "실제로 제공되는 데이터는 고인이 iCloud와 iCloud 백업에 저장한 내용에 따라 달라져요."]], ["유산 관리자가 접근할 수 없는 데이터", ["애플 계정으로 구입한 영화, 음악, 책 및 구독 항목", "앱 내 구입 항목", "iCloud 키체인에 저장된 결제 정보", "iCloud 키체인에 저장된 암호와 패스키"]], ["진행 방법", ["Digital Legacy 웹사이트에서 본인 확인을 해요.", "접근 키를 입력하고 사망 증명서를 제출해요.", "애플의 검토와 승인 결과를 기다려요."]]]} primary={{ label: "계정 접근 요청하기", href: DIGITAL_LEGACY }} />;
  if (route === "download-data") return <DetailPage eyebrow="고인의 애플 계정" title="승인된 데이터를 확인하고 내려받고 싶어요" intro="승인 후 유산 연락처 애플 계정으로 iCloud에 로그인하거나 애플 개인정보 페이지에서 보관할 데이터를 내려받아요." sections={[["준비할 것", ["승인된 유산 연락처 애플 계정", "접근 키"]], ["꼭 알아둘 점", ["승인된 기간 안에 필요한 데이터를 내려받아 보관해요.", "일부 구입 콘텐츠나 결제 정보처럼 제공되지 않는 데이터가 있을 수 있어요."]]]} primary={{ label: "애플 안내 확인하기", href: GUIDE }} />;
  if (route === "delete-account") return <DetailPage eyebrow="고인의 애플 계정" title="고인의 애플 계정 삭제를 요청하고 싶어요" intro="고인의 애플 계정과 데이터를 영구 삭제하려면 Digital Legacy 웹사이트에서 삭제 요청을 시작해요." warning="필요한 데이터가 있다면 계정을 삭제하기 전에 먼저 내려받아 주세요." sections={[["필요한 정보와 서류", ["요청자의 애플 계정", "고인의 애플 계정", "지역별로 요구되는 법적 서류"]], ["꼭 알아둘 점", ["삭제가 완료되면 계정과 데이터는 복구할 수 없어요.", "애플이 요청자의 권한과 제출 서류를 검토해요."]]]} primary={{ label: "삭제 요청 시작하기", href: DIGITAL_LEGACY }} />;
  return <DetailPage eyebrow="고인의 애플 계정" title="접근 키가 없을 때 절차를 확인하고 싶어요" intro="유산 연락처 접근 키가 없다면 법원 명령 또는 지역에서 인정하는 법적 서류를 준비해 애플 지원에 접근을 요청해야 할 수 있어요." sections={[["필요할 수 있는 서류", ["고인이 해당 애플 계정의 사용자였다는 확인", "요청자가 고인의 법적 대리인 또는 상속인임을 확인하는 서류", "계정 정보 공개를 명하는 법원 명령 또는 지역별 대체 법적 서류"]], ["꼭 알아둘 점", ["요구 서류와 처리 가능 여부는 국가와 지역에 따라 달라요.", "애플 지원의 안내에 따라 추가 자료를 제출해야 할 수 있어요."]]]} image={{ src: "/images/apple-no-access-key.png", alt: "Apple 디지털 유산 웹사이트에서 접근 키가 없을 때 선택하는 위치" }} primary={{ label: "법적 요청 안내 확인하기", href: DIGITAL_LEGACY }} />;
}

type ActionLink = { label: string; href: string };
function DetailPage({ eyebrow, title, intro, sections, warning, image, primary }: { eyebrow: string; title: string; intro: string; sections: Array<[string, string[]]>; warning?: string; image?: { src: string; alt: string }; primary: ActionLink }) {
  return <main className={`${styles.shell} ${styles.compact} ${styles.detail}`}><p className={styles.eyebrow}>{eyebrow}</p><h1>{title}</h1><p className={styles.lead}>{intro}</p>{warning && <div className={styles.warning}><strong>먼저 확인해 주세요</strong><p>{warning}</p></div>}<div className={styles.sections}>{sections.map(([heading, items]) => <section key={heading}><h2>{heading}</h2><ul>{items.map(item => <li key={item}>{item}</li>)}</ul></section>)}</div>{image && <figure className={styles.guideImage}><img src={image.src} alt={image.alt} /><figcaption>Apple 디지털 유산 페이지에서 아래의 ‘접근 키를 가지고 있지 않습니다’를 선택해요.</figcaption></figure>}<div className={styles.actions}><a className={styles.primary} href={primary.href} target="_blank" rel="noopener noreferrer">{primary.label}</a></div></main>;
}
