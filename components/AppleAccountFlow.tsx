"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CompanyAccountSelector from "@/components/CompanyAccountSelector";
import styles from "./GoogleAccountFlow.module.css";

type Audience = "mine" | "deceased";
type RouteId = "add-contact" | "share-key" | "download" | "delete-mine" | "request-access" | "delete-account" | "no-key";

const routes: Record<Audience, Array<{ id: RouteId; title: string; description: string }>> = {
  mine: [
    { id: "add-contact", title: "유산 관리자를 추가하고 싶어요", description: "사후에 내 계정 데이터에 접근할 사람을 미리 지정해요." },
    { id: "share-key", title: "접근 키를 공유하고 보관하고 싶어요", description: "유산 관리자가 나중에 사용할 접근 키를 안전하게 전달해요." },
    { id: "download", title: "내 데이터를 다운로드하고 싶어요", description: "사진, 파일과 계정 정보의 사본을 요청해 보관해요." },
    { id: "delete-mine", title: "내 애플 계정을 삭제하고 싶어요", description: "필요한 데이터를 확인한 뒤 계정과 연결된 데이터를 삭제해요." },
  ],
  deceased: [
    { id: "request-access", title: "유산 관리자 접근 키가 있어요", description: "접근 키와 사망 증명서를 준비해 계정 접근을 요청해요." },
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
    {audience && <header className={styles.header}>
      <button type="button" className={styles.brand} onClick={reset} aria-label="애플 안내 처음으로">
        <img src="/logos/apple.svg" alt="" width="48" height="48" />
        <span><small>공식 절차 안내</small>애플</span>
      </button>
      {(audience || route) && <button type="button" className={styles.back} onClick={() => window.history.back()}>← 이전 단계</button>}
    </header>}

    {audience && <nav className={styles.contextNavigation} aria-label="애플 도움말 내 이동">
      <ol className={styles.breadcrumb}>
        <li><Link href="/services">서비스</Link></li>
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

    {!audience && <CompanyAccountSelector
      mine={{ title: "내 애플 계정", description: "유산 관리자를 지정하고 접근 키를 준비하고 싶어요.", onSelect: () => navigate({ audience: "mine" }) }}
      deceased={{ title: "고인의 애플 계정", description: "고인의 데이터에 접근하거나 계정을 정리하고 싶어요.", onSelect: () => navigate({ audience: "deceased" }) }}
    />}
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
const DECEASED_ACCOUNT_GUIDE = "https://support.apple.com/ko-kr/102431";
const DIGITAL_LEGACY = "https://digital-legacy.apple.com/?r=1&language=KR-KO";

function Detail({ route }: { route: RouteId }) {
  if (route === "add-contact") return <DetailPage eyebrow="내 애플 계정" title="유산 관리자를 추가하고 싶어요" intro="유산 관리자는 내가 사망한 뒤 애플 계정에 저장된 데이터에 접근할 수 있도록 미리 지정하는 사람이에요." sections={[["진행 방법", ["iPhone·iPad의 설정 또는 Mac의 시스템 설정에서 내 이름을 선택해요.", "로그인 및 보안에서 유산 관리자를 선택한 뒤 유산 관리자 추가를 선택해요.", "가족 공유 그룹에 없는 사람도 지정할 수 있으며 여러 명을 추가할 수 있어요.", "생성된 접근 키를 각 유산 관리자에게 전달해요."]], ["유산 관리자를 설정하지 않으면 어떻게 되나요?", ["유족이 계정 접근이나 삭제를 요청할 수는 있지만, 접근 키가 없으므로 법원 명령서나 지역에서 요구하는 별도 법적 서류가 필요할 수 있어요.", "확인 절차가 더 복잡하고 오래 걸릴 수 있으며 요청이 항상 승인되는 것은 아니에요.", "계정이 자동으로 가족에게 이전되거나 가족이 비밀번호만으로 데이터에 접근할 수 있는 것은 아니에요."]], ["꼭 알아둘 점", ["유산 관리자는 내 비밀번호를 받지 않아요.", "지정한 사람은 접근 키와 사망 증명서를 함께 제출해야 해요.", "유산 관리자는 나중에 변경하거나 제거할 수 있어요."]]]} secondary={{ label: "접근 키가 없을 때의 절차 확인하기", href: DIGITAL_LEGACY }} primary={{ label: "유산 관리자 설정 방법 확인하기", href: GUIDE }} />;
  if (route === "share-key") return <DetailPage eyebrow="내 애플 계정" title="접근 키를 공유하고 보관하고 싶어요" intro="유산 관리자를 추가할 때 생성되는 고유한 접근 키를 메시지로 보내거나 PDF·인쇄본으로 전달해 안전하게 보관해요." sections={[["공유 방법", ["상대방이 애플 기기를 사용하면 메시지로 보내요.", "그 밖의 경우 접근 키 사본을 PDF로 저장하거나 인쇄해 전달해요.", "유산 관리자를 변경하거나 제거했다면 최신 접근 키인지 다시 확인해요."]], ["꼭 알아둘 점", ["접근 키만으로는 데이터에 접근할 수 없어요.", "유산 관리자가 실제로 접근을 요청할 때는 접근 키와 사망 증명서가 함께 필요해요.", "분실하지 않도록 유산 관리자와 보관 위치를 확인해 두세요."]]]} primary={{ label: "접근 키 안내 확인하기", href: ACCESS_KEY }} />;
  if (route === "download") return <DetailPage eyebrow="내 애플 계정" title="내 데이터를 다운로드해요" intro="애플의 데이터 및 개인정보 보호 페이지에서 계정에 연결된 데이터의 사본을 요청할 수 있어요." sections={[["진행 방법", ["애플 계정으로 데이터 및 개인정보 보호 페이지에 로그인해요.", "데이터 사본 요청을 선택해요.", "보관하려는 데이터 항목과 파일 크기를 선택해 요청을 완료해요.", "준비 완료 안내를 받으면 정해진 기간 안에 파일을 내려받아요."]], ["꼭 알아둘 점", ["요청할 수 있는 데이터는 사용하는 애플 서비스와 국가·지역에 따라 달라질 수 있어요.", "데이터를 내려받아도 애플 서버의 원본이 자동으로 삭제되지는 않아요.", "계정을 삭제할 예정이라면 먼저 파일을 내려받아 안전한 곳에 보관해 주세요."]]]} primary={{ label: "애플에서 데이터 사본 요청하기", href: "https://privacy.apple.com/?language=ko_KR" }} />;
  if (route === "delete-mine") return <DetailPage eyebrow="내 애플 계정" title="내 애플 계정을 삭제하고 싶어요" intro="더 이상 사용하지 않을 애플 계정과 계정에 연결된 데이터를 영구 삭제해요." warning="삭제하기 전에 필요한 사진, 파일과 계정 정보를 따로 보관했는지 확인해 주세요." sections={[["삭제 전에 확인할 것", ["iCloud에 저장된 사진과 파일을 내려받아요.", "활성화된 구독과 결제 항목을 확인해요.", "이 계정으로 로그인한 다른 서비스를 확인해요."]], ["꼭 알아둘 점", ["삭제가 완료되면 계정과 데이터는 복구할 수 없어요.", "사용 중인 기기에서 로그아웃하거나 활성화 잠금 관련 사항을 먼저 확인해야 할 수 있어요."]]]} primary={{ label: "애플 계정 삭제 요청하기", href: "https://privacy.apple.com/?language=ko_KR" }} />;
  if (route === "request-access") return <DetailPage eyebrow="고인의 애플 계정" title="유산 관리자 접근 키가 있어요" intro="유산 관리자는 애플 계정이나 애플 기기가 없어도 됩니다. 고인의 사망 후 접근 키와 사망 증명서를 제출해 데이터 접근을 요청할 수 있습니다." sections={[["요청하기 전에 확인할 내용", ["본인이 고인의 유산 관리자로 지정되어 있어야 해요.", "고인이 전달한 접근 키와 사망 증명서가 필요해요.", "제출한 정보는 애플의 검토를 거쳐요.", "유산 관리자가 여러 명이면 각자 요청할 수 있고, 한 명이 계정 삭제를 요청하면 다른 관리자의 접근에도 영향을 줄 수 있어요."]], ["요청이 승인되면", ["고인의 기존 애플 계정으로 직접 로그인하는 방식이 아니에요.", "애플이 제공하는 별도의 유산 관리자용 계정으로 승인된 데이터에 접근해요.", "최초 승인일부터 3년 동안 접근할 수 있으며 이후 해당 계정은 삭제돼요.", "승인 기간 안에 필요한 데이터를 확인하고 내려받아 별도로 보관해요."]], ["접근할 수 있는 데이터", ["iCloud 사진, 메일, 연락처, 캘린더 및 미리 알림", "메모, iCloud에 저장된 메시지, 통화 기록 및 음성 메모", "iCloud Drive의 파일과 iCloud 백업", "건강 데이터와 Safari 책갈피 및 읽기 목록", "실제 제공 범위는 고인이 저장한 데이터와 서비스 설정에 따라 달라져요."]], ["접근할 수 없는 데이터", ["애플 계정으로 구입한 영화, 음악, 책 및 구독 항목", "앱 내 구입 항목", "애플 페이에 등록된 결제 정보", "키체인에 저장된 암호와 패스키"]], ["진행 방법", ["Digital Legacy 웹사이트에서 본인 확인을 해요.", "접근 키를 입력하고 사망 증명서를 제출해요.", "애플의 검토와 승인 결과를 기다려요.", "승인 후 유산 관리자용 계정으로 데이터를 확인하고 내려받아요."]]]} primary={{ label: "계정 접근 요청하기", href: DIGITAL_LEGACY }} />;
  if (route === "delete-account") return <DetailPage eyebrow="고인의 애플 계정" title="고인의 애플 계정 삭제를 요청하고 싶어요" intro="고인의 데이터에 접근할 필요가 없고 계정만 영구적으로 삭제하려는 경우 이용하는 절차예요." warning="필요한 데이터가 있다면 계정을 삭제하기 전에 먼저 접근 또는 내려받기 절차를 진행해 주세요." sections={[["필요한 정보와 서류", ["고인의 애플 계정 정보", "고인의 사망 증명서", "요청자와 고인의 관계 또는 법적 권한을 증명하는 서류", "국가·지역에 따라 요구되는 법원 명령서나 대체 서류"]], ["꼭 알아둘 점", ["삭제가 완료되면 계정과 데이터는 복구할 수 없어요.", "애플이 요청자의 권한과 제출 서류를 검토해요."]]]} primary={{ label: "고인의 계정 삭제 요청하기", href: DIGITAL_LEGACY }} />;
  return <DetailPage eyebrow="고인의 애플 계정" title="접근 키가 없을 때 절차를 확인하고 싶어요" intro="고인이 유산 관리자를 지정하지 않았거나 접근 키를 찾을 수 없다면, 법적 요청 절차를 확인해야 해요." sections={[["필요할 수 있는 정보와 서류", ["고인과의 관계를 증명하는 정보", "요청자가 고인의 법적 대리인 또는 상속인임을 증명하는 서류", "고인의 사망 증명서", "법원 명령서 또는 국가·지역에서 인정되는 대체 법적 서류"]], ["꼭 알아둘 점", ["요구 서류와 처리 가능 여부는 국가와 지역에 따라 달라요.", "애플의 안내에 따라 추가 자료를 제출해야 할 수 있어요.", "서류를 제출하더라도 요청이 반드시 승인되는 것은 아니에요."]]]} image={{ src: "/images/apple-no-access-key.png", alt: "Apple 디지털 유산 웹사이트에서 접근 키가 없을 때 선택하는 위치" }} primary={{ label: "법적 요청 안내 확인하기", href: DECEASED_ACCOUNT_GUIDE }} />;
}

type ActionLink = { label: string; href: string };
function koreanAppleText(text:string){return text.replaceAll("iCloud Drive","아이클라우드 드라이브").replaceAll("iCloud","아이클라우드").replaceAll("Safari","사파리").replaceAll("Digital Legacy","디지털 유산").replaceAll("Apple","애플")}
function DetailPage({ eyebrow, title, intro, sections, warning, image, primary, secondary }: { eyebrow: string; title: string; intro: string; sections: Array<[string, string[]]>; warning?: string; image?: { src: string; alt: string }; primary: ActionLink; secondary?: ActionLink }) {
  const hasRequiredDocuments = sections.some(([heading, items]) => (heading.includes("필요") || heading.includes("준비")) && items.some((item) => item.includes("서류") || item.includes("증명서")));
  return <main className={`${styles.shell} ${styles.compact} ${styles.detail}`}><p className={styles.eyebrow}>{koreanAppleText(eyebrow)}</p><h1>{koreanAppleText(title)}</h1><p className={styles.lead}>{koreanAppleText(intro)}</p>{warning && <div className={styles.warning}><strong>먼저 확인해 주세요</strong><p>{koreanAppleText(warning)}</p></div>}<div className={styles.sections}>{sections.map(([heading, items]) => <section key={heading}><h2>{koreanAppleText(heading)}</h2><ul>{items.map(item => <li key={item}>{koreanAppleText(item)}</li>)}</ul></section>)}</div>{hasRequiredDocuments && <Link className={styles.commonDocumentsLink} href="/prepare#documents">준비서류에서 발급 방법 보기 →</Link>}{image && <figure className={styles.guideImage}><figcaption>애플 디지털 유산 페이지에서 접근 키가 없을 때 선택하는 화면이에요.</figcaption><img src={image.src} alt={koreanAppleText(image.alt)} /></figure>}<div className={styles.actions}>{secondary && <a className={styles.secondary} href={secondary.href} target="_blank" rel="noopener noreferrer">{secondary.label}</a>}<a className={styles.primary} href={primary.href} target="_blank" rel="noopener noreferrer">{primary.label}</a></div></main>;
}
