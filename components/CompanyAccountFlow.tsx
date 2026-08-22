"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CompanyAccountSelector from "@/components/CompanyAccountSelector";
import type { ApplicationStep } from "@/components/ApplicationStepsView";
import type { CompanyPolicy } from "@/lib/types";
import styles from "./GoogleAccountFlow.module.css";

type Audience = "mine" | "deceased";

const logos: Record<string, string> = {
  meta: "/logos/meta.svg",
  instagram: "/logos/instagram.webp",
  samsung: "/logos/samsung.svg",
  kakao: "/logos/kakao.webp",
  x: "/logos/x.svg",
};

const displayNames: Record<string, string> = {
  meta: "페이스북",
  instagram: "인스타그램",
  samsung: "삼성",
  kakao: "카카오",
  x: "X",
};

export default function CompanyAccountFlow({
  company,
  preDeathSteps,
  postDeathSteps,
}: {
  company: CompanyPolicy;
  preDeathSteps: ApplicationStep[];
  postDeathSteps: ApplicationStep[];
}) {
  const [audience, setAudience] = useState<Audience | null>(null);
  const [routeId, setRouteId] = useState<number | null>(null);
  const displayName = displayNames[company.slug] ?? company.company;
  const activeSteps = audience === "mine" ? preDeathSteps : postDeathSteps;
  const selectedStep = activeSteps.find((step) => step.id === routeId) ?? null;

  useEffect(() => {
    function restore(event?: PopStateEvent) {
      const saved = event?.state?.companyAccountFlow?.audience as Audience | undefined;
      if (saved) {
        setAudience(saved);
        setRouteId(event?.state?.companyAccountFlow?.routeId ?? null);
        return;
      }
      const params = new URLSearchParams(window.location.hash.slice(1));
      setAudience(params.get("account") as Audience | null);
      const route = Number(params.get("route"));
      setRouteId(Number.isFinite(route) && route > 0 ? route : null);
    }

    restore();
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, []);

  function navigate(nextAudience: Audience | null, nextRouteId: number | null = null) {
    const params = new URLSearchParams();
    if (nextAudience) params.set("account", nextAudience);
    if (nextRouteId) params.set("route", String(nextRouteId));
    const hash = params.toString() ? `#${params.toString()}` : window.location.pathname;
    window.history.pushState({ companyAccountFlow: { audience: nextAudience, routeId: nextRouteId } }, "", hash);
    setAudience(nextAudience);
    setRouteId(nextRouteId);
  }

  return (
    <div className={styles.page}>
      {audience && <header className={styles.header}>
        <button type="button" className={styles.brand} onClick={() => navigate(null)} aria-label={`${displayName} 안내 처음으로`}>
          <img src={logos[company.slug]} alt="" width="48" height="48" />
          <span><small>공식 절차 안내</small>{displayName}</span>
        </button>
        {(audience || routeId) && <button type="button" className={styles.back} onClick={() => window.history.back()}>← 이전 단계</button>}
      </header>}

      {audience && (
        <nav className={styles.contextNavigation} aria-label={`${displayName} 도움말 내 이동`}>
          <ol className={styles.breadcrumb}>
            <li><a href="/services">서비스</a></li>
            <li><button type="button" onClick={() => navigate(null)}>{displayName}</button></li>
            <li><button type="button" onClick={() => navigate(audience)}>{audience === "mine" ? `내 ${displayName} 계정` : `고인의 ${displayName} 계정`}</button></li>
          </ol>

          {selectedStep && (
            <div className={styles.quickNavigation}>
              <div className={styles.accountTabs} aria-label="계정 유형 선택">
                <button type="button" className={audience === "mine" ? styles.activeTab : ""} onClick={() => navigate("mine")}>내 {displayName} 계정</button>
                <button type="button" className={audience === "deceased" ? styles.activeTab : ""} onClick={() => navigate("deceased")}>고인의 {displayName} 계정</button>
              </div>
              <label className={styles.routeSelect}>
                <span>다른 도움 보기</span>
                <select value={selectedStep.id} onChange={(event) => navigate(audience, Number(event.target.value))}>
                  {activeSteps.map((step) => <option value={step.id} key={step.id}>{step.title}</option>)}
                </select>
              </label>
            </div>
          )}
        </nav>
      )}

      {!audience && (
        <CompanyAccountSelector
          mine={{ title: `내 ${displayName} 계정`, description: "내 데이터를 정리하거나 계정을 미리 준비하고 싶어요.", onSelect: () => navigate("mine") }}
          deceased={{ title: `고인의 ${displayName} 계정`, description: "고인의 계정과 남은 기록을 정리하고 싶어요.", onSelect: () => navigate("deceased") }}
        />
      )}

      {audience && !selectedStep && (
        <main className={`${styles.shell} ${styles.compact}`}>
          <p className={styles.eyebrow}>{audience === "mine" ? `내 ${displayName} 계정` : `고인의 ${displayName} 계정`}</p>
          <h1>무엇을 하고 싶은가요?</h1>
          <p className={styles.lead}>가장 가까운 항목을 선택해 주세요.</p>
          <div className={styles.choices}>
            {activeSteps.map((step) => (
              <Choice key={step.id} title={step.title} description={step.description ?? "공식 절차를 확인해요."} onClick={() => navigate(audience, step.id)} />
            ))}
          </div>
        </main>
      )}

      {audience && selectedStep && (
        <StandardStepDetail companyName={displayName} audience={audience} step={selectedStep} />
      )}
    </div>
  );
}

function Choice({ title, description, onClick }: { title: string; description: string; onClick: () => void }) {
  return <button type="button" className={styles.choice} onClick={onClick}><span><strong>{title}</strong><small>{description}</small></span></button>;
}

function StandardStepDetail({ companyName, audience, step }: { companyName: string; audience: Audience; step: ApplicationStep }) {
  const storageKey = `digital-legacy-checklist-v1-${companyName.toLowerCase()}-${step.id}`;
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(localStorage.getItem(storageKey) === "true");
  }, [storageKey]);

  function updateChecklist(next: boolean) {
    setChecked(next);
    localStorage.setItem(storageKey, String(next));
  }

  const documents = step.required_documents?.split(/[,\n]/).map((item) => item.trim()).filter(Boolean) ?? [];
  const actionLabel = step.id===1?"데이터 다운로드 안내 보기":step.id===2?"계정 삭제 안내 보기":step.id===5?"추모 계정 신청 안내 보기":step.id===3?"고인 계정 정리 도움받기":"기록 보존 안내 보기";

  return (
    <main className={`${styles.shell} ${styles.compact} ${styles.detail}`}>
      <p className={styles.eyebrow}>{audience === "mine" ? `내 ${companyName} 계정` : `고인의 ${companyName} 계정`}</p>
      <h1>{step.title}</h1>
      {step.description && <p className={styles.lead}>{step.description}</p>}

      <div className={styles.sections}>
        {documents.length > 0 && (
          <section>
            <h2>준비할 서류</h2>
            <ul>{documents.map((document) => <li key={document}>{document}</li>)}</ul>
            <Link className={styles.commonDocumentsLink} href="/prepare#documents">준비 페이지에서 발급 방법 보기 →</Link>
          </section>
        )}
        {step.notes && (
          <section>
            <h2>꼭 알아둘 점</h2>
            <p className={styles.lead}>{step.notes}</p>
          </section>
        )}
      </div>

      <label className={styles.checklistOption}>
        <input type="checkbox" checked={checked} onChange={(event) => updateChecklist(event.target.checked)} />
        <span>이 안내를 확인했어요</span>
      </label>
      <p className={styles.checklistHelp} aria-live="polite">{checked ? "확인 상태를 이 기기에 저장했어요." : "선택하면 다음에 다시 왔을 때 확인 상태를 보여드려요."}</p>

      <div className={styles.actions}>
        <a className={styles.primary} href={step.url} target="_blank" rel="noopener noreferrer" aria-label={`${companyName} ${actionLabel} (새 창)`}>{actionLabel}</a>
      </div>
    </main>
  );
}
