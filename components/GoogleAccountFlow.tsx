"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./GoogleAccountFlow.module.css";

type Audience = "mine" | "deceased";
type RouteId =
  | "prepare"
  | "download"
  | "delete-mine"
  | "receive-data"
  | "close-deceased"
  | "request-balance";
type ReceiverStatus = "designated" | "not-designated" | "unknown";

const routes: Record<Audience, Array<{ id: RouteId; title: string; description: string }>> = {
  mine: [
    { id: "prepare", title: "사후를 미리 준비하고 싶어요", description: "연락받을 사람과 공유할 데이터를 미리 정해요." },
    { id: "download", title: "내 데이터를 내려받고 싶어요", description: "사진, 이메일, 파일 등의 사본을 만들어 보관해요." },
    { id: "delete-mine", title: "내 구글 계정을 삭제하고 싶어요", description: "계정과 연결된 데이터를 확인한 뒤 삭제해요." },
  ],
  deceased: [
    { id: "receive-data", title: "고인의 데이터를 받고 싶어요", description: "지정 여부에 맞는 데이터 수령 절차를 확인해요." },
    { id: "close-deceased", title: "고인의 계정을 닫고 싶어요", description: "고인의 계정과 연결된 데이터 삭제를 요청해요." },
    { id: "request-balance", title: "계정에 남은 금액을 요청하고 싶어요", description: "지급받을 수 있는 금액이 있다면 구글에 요청해요." },
  ],
};

export default function GoogleAccountFlow() {
  const [audience, setAudience] = useState<Audience | null>(null);
  const [route, setRoute] = useState<RouteId | null>(null);
  const [receiverStatus, setReceiverStatus] = useState<ReceiverStatus | null>(null);

  useEffect(() => {
    function restoreFromHistory(event?: PopStateEvent) {
      const saved = event?.state?.googleAccountFlow;

      if (saved) {
        setAudience(saved.audience ?? null);
        setRoute(saved.route ?? null);
        setReceiverStatus(saved.receiverStatus ?? null);
        return;
      }

      const params = new URLSearchParams(window.location.hash.slice(1));
      setAudience((params.get("account") as Audience | null) ?? null);
      setRoute((params.get("route") as RouteId | null) ?? null);
      setReceiverStatus((params.get("receiver") as ReceiverStatus | null) ?? null);
    }

    restoreFromHistory();
    window.addEventListener("popstate", restoreFromHistory);
    return () => window.removeEventListener("popstate", restoreFromHistory);
  }, []);

  function navigate(next: {
    audience: Audience | null;
    route?: RouteId | null;
    receiverStatus?: ReceiverStatus | null;
  }) {
    const nextRoute = next.route ?? null;
    const nextReceiverStatus = next.receiverStatus ?? null;
    const params = new URLSearchParams();

    if (next.audience) params.set("account", next.audience);
    if (nextRoute) params.set("route", nextRoute);
    if (nextReceiverStatus) params.set("receiver", nextReceiverStatus);

    const hash = params.toString() ? `#${params.toString()}` : window.location.pathname;
    window.history.pushState(
      { googleAccountFlow: { audience: next.audience, route: nextRoute, receiverStatus: nextReceiverStatus } },
      "",
      hash,
    );
    setAudience(next.audience);
    setRoute(nextRoute);
    setReceiverStatus(nextReceiverStatus);
  }

  function reset() {
    navigate({ audience: null });
  }

  function goBack() {
    window.history.back();
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.brand} onClick={reset} aria-label="구글 안내 처음으로">
          <img src="/logos/google.svg" alt="" width="48" height="48" />
          <span><small>공식 절차 안내</small>구글</span>
        </button>
        {(audience || route) && <button type="button" className={styles.back} onClick={goBack}>← 이전으로</button>}
      </header>

      {audience && (
        <nav className={styles.contextNavigation} aria-label="구글 도움말 내 이동">
          <ol className={styles.breadcrumb}>
            <li><Link href="/#services">서비스</Link></li>
            <li><button type="button" onClick={reset}>구글</button></li>
            <li><button type="button" onClick={() => navigate({ audience })}>{audience === "mine" ? "내 구글 계정" : "고인의 구글 계정"}</button></li>
          </ol>

          {route && (
            <div className={styles.quickNavigation}>
              <div className={styles.accountTabs} aria-label="계정 유형 선택">
                <button
                  type="button"
                  className={audience === "mine" ? styles.activeTab : ""}
                  onClick={() => navigate({ audience: "mine" })}
                >
                  내 구글 계정
                </button>
                <button
                  type="button"
                  className={audience === "deceased" ? styles.activeTab : ""}
                  onClick={() => navigate({ audience: "deceased" })}
                >
                  고인의 구글 계정
                </button>
              </div>

              <label className={styles.routeSelect}>
                <span>다른 도움 보기</span>
                <select
                  value={route}
                  onChange={(event) => navigate({ audience, route: event.target.value as RouteId })}
                  aria-label="다른 도움 보기"
                >
                  {routes[audience].map((item) => (
                    <option value={item.id} key={item.id}>{item.title}</option>
                  ))}
                </select>
              </label>
            </div>
          )}
        </nav>
      )}

      {!audience && (
        <StepShell compact eyebrow="구글 계정" title="어떤 계정에 관한 도움이 필요한가요?" description="상황을 선택하면 필요한 공식 절차만 순서대로 안내해 드려요.">
          <Choice title="내 구글 계정" description="사후 계획을 설정하거나 내 데이터를 정리하고 싶어요." onClick={() => navigate({ audience: "mine" })} />
          <Choice title="고인의 구글 계정" description="고인의 데이터, 계정 또는 남은 금액을 처리하고 싶어요." onClick={() => navigate({ audience: "deceased" })} />
        </StepShell>
      )}

      {audience && !route && (
        <StepShell compact eyebrow={audience === "mine" ? "내 구글 계정" : "고인의 구글 계정"} title="무엇을 하고 싶은가요?" description="가장 가까운 항목을 선택해 주세요.">
          {routes[audience].map((item) => <Choice key={item.id} title={item.title} description={item.description} onClick={() => navigate({ audience, route: item.id })} />)}
        </StepShell>
      )}

      {route === "receive-data" && !receiverStatus && (
        <StepShell compact eyebrow="고인의 데이터 받기" title="고인이 생전에 나를 데이터 수신자로 지정했나요?" description="지정 여부는 신청 자격이 아니라 데이터를 받는 경로를 나누는 기준이에요.">
          <Choice title="지정했어요" description="구글에서 받은 안내 이메일을 통해 공유된 데이터를 내려받아요." onClick={() => navigate({ audience: "deceased", route, receiverStatus: "designated" })} />
          <Choice title="지정하지 않았어요" description="직계가족이나 법적 대리인 자격으로 데이터 제공을 요청해요." onClick={() => navigate({ audience: "deceased", route, receiverStatus: "not-designated" })} />
          <Choice title="잘 모르겠어요" description="안내 이메일을 먼저 확인하고, 없다면 데이터 제공을 요청해요." onClick={() => navigate({ audience: "deceased", route, receiverStatus: "unknown" })} />
        </StepShell>
      )}

      {route && route !== "receive-data" && <Detail route={route} />}
      {route === "receive-data" && receiverStatus && <DataRequestDetail status={receiverStatus} />}
    </div>
  );
}

function StepShell({ eyebrow, title, description, children, compact = false }: { eyebrow: string; title: string; description: string; children: React.ReactNode; compact?: boolean }) {
  return <main className={`${styles.shell} ${compact ? styles.compact : ""}`}><p className={styles.eyebrow}>{eyebrow}</p><h1>{title}</h1><p className={styles.lead}>{description}</p><div className={styles.choices}>{children}</div></main>;
}

function Choice({ title, description, onClick }: { title: string; description: string; onClick: () => void }) {
  return <button type="button" className={styles.choice} onClick={onClick}><span><strong>{title}</strong><small>{description}</small></span></button>;
}

function Detail({ route }: { route: Exclude<RouteId, "receive-data"> }) {
  if (route === "prepare") return <DetailPage eyebrow="내 구글 계정" title="사후를 미리 준비하고 싶어요" intro="계정을 오랫동안 사용하지 못하게 될 경우, 누구에게 알릴지와 어떤 데이터를 공유할지 미리 정해요." sections={[
    ["설정할 수 있는 내용", ["계정을 얼마 동안 사용하지 않으면 휴면 상태로 볼지", "휴면 전에 연락받을 전화번호와 이메일", "휴면 사실을 알리거나 데이터를 공유할 사람(최대 10명)", "사람별로 공유할 데이터", "계획 실행 후 계정을 자동으로 삭제할지"]],
    ["꼭 알아둘 점", ["사망 여부가 아니라 구글 계정의 활동 여부를 기준으로 실행돼요.", "지정한 사람에게 비밀번호나 로그인 권한이 전달되지는 않아요.", "설정은 나중에 변경하거나 사용 중지할 수 있어요."]],
  ]} note="구글에서는 이 기능을 ‘휴면 계정 관리자’라고 부릅니다." primary={{ label: "구글에서 사후 계획 설정하기", href: "https://myaccount.google.com/inactive?hl=ko" }} />;

  if (route === "download") return <DetailPage eyebrow="내 구글 계정" title="내 데이터를 내려받고 싶어요" intro="구글 테이크아웃에서 사진, 이메일, 파일 등의 사본을 만들어 보관해요." sections={[
    ["내려받을 수 있는 데이터", ["Gmail 이메일", "구글 포토의 사진과 동영상", "구글 드라이브의 문서와 파일", "캘린더, YouTube, 계정 활동 기록 등"]],
    ["진행 방법", ["내려받을 서비스와 데이터를 선택해요.", "파일을 받을 방법과 내보내기 유형을 정해요.", "파일 형식과 최대 크기를 정한 뒤 내보내기를 시작해요.", "이메일 안내가 오면 파일을 내려받아요."]],
    ["꼭 알아둘 점", ["데이터를 내려받아도 원본은 삭제되지 않아요.", "파일 생성에는 몇 분에서 며칠이 걸릴 수 있어요.", "계정 삭제 전에는 보관 파일을 다른 저장공간으로 옮겨 주세요."]],
  ]} primary={{ label: "구글 테이크아웃에서 데이터 내려받기", href: "https://takeout.google.com/?hl=ko" }} />;

  if (route === "delete-mine") return <DetailPage eyebrow="내 구글 계정" title="내 구글 계정을 삭제하고 싶어요" intro="더 이상 사용하지 않을 구글 계정과 계정에 연결된 데이터를 삭제해요." warning="삭제하기 전에 필요한 사진, 이메일, 문서를 내려받았는지 확인해 주세요." sections={[
    ["삭제 전에 해야 할 일", ["구글 테이크아웃에서 필요한 데이터를 내려받아요.", "이 이메일로 가입한 외부 서비스의 주소를 변경해요.", "구독과 정기 결제를 확인해요.", "필요한 데이터가 안전하게 저장되었는지 확인해요."]],
    ["꼭 알아둘 점", ["Gmail뿐 아니라 연결된 여러 구글 서비스와 데이터에 접근할 수 없게 돼요.", "계정으로 로그인하던 외부 서비스에 접근하지 못할 수 있어요.", "최근 삭제한 계정은 복구할 수도 있지만 시간이 지나면 복구하지 못할 수 있어요."]],
  ]} secondary={{ label: "내 데이터 먼저 내려받기", href: "https://takeout.google.com/?hl=ko" }} primary={{ label: "구글 계정 삭제하기", href: "https://support.google.com/accounts/answer/32046?hl=ko" }} />;

  if (route === "close-deceased") return <DetailPage eyebrow="고인의 구글 계정" title="고인의 계정을 닫고 싶어요" intro="고인의 직계가족이나 법적 대리인이 계정과 연결된 데이터의 삭제를 요청할 수 있어요." warning="데이터도 필요하다면 먼저 데이터 제공을 요청하세요. 계정을 닫은 뒤에는 고인의 데이터를 요청할 수 없어요." sections={[
    ["신청 전에 준비할 정보", ["신청자의 이름과 이메일 주소", "고인의 이름과 구글 계정 이메일 주소", "신원, 사망 사실, 신청 자격을 확인할 수 있는 서류"]],
    ["꼭 알아둘 점", ["구글이 신청 자격과 제출 내용을 검토한 뒤 결정해요.", "신청 단계에 따라 추가 서류를 요청받을 수 있어요.", "비밀번호나 로그인 정보는 제공하지 않아요."]],
  ]} primary={{ label: "구글에 계정 폐쇄 요청하기", href: "https://support.google.com/accounts/troubleshooter/6357590?hl=ko" }} />;

  return <DetailPage eyebrow="고인의 구글 계정" title="계정에 남은 금액을 요청하고 싶어요" intro="고인의 구글 계정에 지급받을 수 있는 금액이 있다면 구글에 지급을 요청해요." sections={[
    ["신청 전에 준비할 정보", ["신청자의 이름과 이메일 주소", "고인의 이름과 구글 계정 이메일 주소", "신청자와 고인의 관계", "구글이 요청하는 신원·사망 사실·신청 자격 관련 서류"]],
    ["꼭 알아둘 점", ["신청한다고 반드시 금액이 지급되는 것은 아니에요.", "신청 내용에 따라 추가 정보와 서류를 제출해야 할 수 있어요.", "비밀번호나 계정 로그인 권한은 제공되지 않아요."]],
  ]} aside={{ title: "상속 재산을 먼저 확인하고 싶다면", text: "안심상속 원스톱 서비스에서 고인의 금융거래, 토지, 자동차, 세금, 연금 등의 재산 내역을 한 번에 조회할 수 있어요. 사망일이 속한 달의 말일부터 1년 이내 신청할 수 있어요.", label: "안심상속 원스톱 서비스 확인하기", href: "https://www.gov.kr/portal/onestopSvc/safeInheritance" }} primary={{ label: "구글에 금액 지급 요청하기", href: "https://support.google.com/accounts/troubleshooter/6357590?hl=ko" }} />;
}

function DataRequestDetail({ status }: { status: ReceiverStatus }) {
  if (status === "designated") return <DetailPage eyebrow="고인의 데이터 받기" title="공유된 데이터를 내려받아요" intro="구글이 보낸 데이터 공유 안내 이메일의 링크를 통해 고인이 미리 선택한 데이터를 받을 수 있어요." sections={[
    ["진행 방법", ["구글이 보낸 안내 이메일을 열어요.", "이메일의 데이터 다운로드 링크를 선택해요.", "휴대전화 번호로 본인 확인을 진행해요.", "고인이 미리 선택한 데이터를 내려받아요."]],
    ["꼭 알아둘 점", ["고인의 계정에 로그인할 수 있는 것은 아니에요.", "고인이 선택한 데이터만 받을 수 있어요.", "다운로드할 수 있는 기간이 정해져 있을 수 있어요."]],
  ]} note="별도의 공통 신청 페이지가 아니라 구글에서 받은 안내 이메일을 열어 진행해 주세요." />;

  return <DetailPage eyebrow="고인의 데이터 받기" title="구글에 데이터 제공을 요청해요" intro={status === "unknown" ? "안내 이메일을 확인하고 받은 내역이 없다면, 직계가족이나 법적 대리인 자격으로 데이터 제공을 요청할 수 있어요." : "지정인이 아니어도 직계가족이나 법적 대리인 자격으로 데이터 제공을 요청할 수 있어요."} warning="계정을 먼저 폐쇄하면 이후에는 데이터를 요청할 수 없어요. 데이터 요청 결과가 나온 뒤 계정 폐쇄를 진행해 주세요." sections={[
    ["신청 전에 준비할 정보", ["신청자의 이름과 이메일 주소", "고인의 이름과 구글 계정 이메일 주소", "필요한 데이터의 종류와 요청 이유", "신원, 사망 사실, 신청 자격을 확인할 수 있는 서류"]],
    ["꼭 알아둘 점", ["신청한다고 데이터가 반드시 제공되는 것은 아니에요.", "구글이 신청 자격과 요청 사유를 개별적으로 검토해요.", "비밀번호나 로그인 정보는 제공하지 않아요."]],
  ]} primary={{ label: "고인의 데이터 제공 요청하기", href: "https://support.google.com/accounts/troubleshooter/6357590?hl=ko" }} />;
}

type ActionLink = { label: string; href: string };
function DetailPage({ eyebrow, title, intro, sections, warning, note, aside, primary, secondary }: { eyebrow: string; title: string; intro: string; sections: Array<[string, string[]]>; warning?: string; note?: string; aside?: { title: string; text: string; label: string; href: string }; primary?: ActionLink; secondary?: ActionLink }) {
  const hasRequiredDocuments = sections.some(([heading, items]) => heading.includes("준비") && items.some((item) => item.includes("서류")));
  return <main className={`${styles.shell} ${styles.compact} ${styles.detail}`}><p className={styles.eyebrow}>{eyebrow}</p><h1>{title}</h1><p className={styles.lead}>{intro}</p>{warning && <div className={styles.warning}><strong>먼저 확인해 주세요</strong><p>{warning}</p></div>}<div className={styles.sections}>{sections.map(([heading, items]) => <section key={heading}><h2>{heading}</h2><ul>{items.map(item => <li key={item}>{item}</li>)}</ul></section>)}</div>{hasRequiredDocuments && <Link className={styles.commonDocumentsLink} href="/documents">공통 서류에서 발급 방법 보기 →</Link>}{note && <p className={styles.note}>{note}</p>}{aside && <aside className={styles.aside}><h2>{aside.title}</h2><p>{aside.text}</p><a href={aside.href} target="_blank" rel="noopener noreferrer">{aside.label}</a></aside>}<div className={styles.actions}>{secondary && <a className={styles.secondary} href={secondary.href} target="_blank" rel="noopener noreferrer">{secondary.label}</a>}{primary && <a className={styles.primary} href={primary.href} target="_blank" rel="noopener noreferrer">{primary.label}</a>}</div></main>;
}
