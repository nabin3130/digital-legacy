"use client";

import { useEffect, useState } from "react";
import ApplicationStepsView, { type ApplicationStep } from "@/components/ApplicationStepsView";
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
      <header className={styles.header}>
        <button type="button" className={styles.brand} onClick={() => navigate(null)} aria-label={`${displayName} 안내 처음으로`}>
          <img src={logos[company.slug]} alt="" width="48" height="48" />
          <span><small>공식 절차 안내</small>{displayName}</span>
        </button>
        {(audience || routeId) && <button type="button" className={styles.back} onClick={() => window.history.back()}>← 이전으로</button>}
      </header>

      {audience && (
        <nav className={styles.contextNavigation} aria-label={`${displayName} 도움말 내 이동`}>
          <ol className={styles.breadcrumb}>
            <li><a href="/#services">서비스</a></li>
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
        <main className={`${styles.shell} ${styles.compact}`}>
          <p className={styles.eyebrow}>{displayName} 계정</p>
          <h1>어떤 계정에 관한 도움이 필요한가요?</h1>
          <p className={styles.lead}>상황을 선택하면 필요한 공식 절차만 순서대로 안내해 드려요.</p>
          <div className={styles.choices}>
            <Choice
              title={`내 ${displayName} 계정`}
              description="내 데이터를 정리하거나 계정의 사후 처리를 미리 준비하고 싶어요."
              onClick={() => navigate("mine")}
            />
            <Choice
              title={`고인의 ${displayName} 계정`}
              description="고인의 계정, 데이터 또는 남은 정보를 처리하고 싶어요."
              onClick={() => navigate("deceased")}
            />
          </div>
        </main>
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
        <ApplicationStepsView
          companyName={displayName}
          companyPolicy={company}
          preDeathSteps={audience === "mine" ? [selectedStep] : []}
          postDeathSteps={audience === "deceased" ? [selectedStep] : []}
          showOverview={false}
          visibleJourney={audience === "mine" ? "pre_death" : "post_death"}
        />
      )}
    </div>
  );
}

function Choice({ title, description, onClick }: { title: string; description: string; onClick: () => void }) {
  return <button type="button" className={styles.choice} onClick={onClick}><span><strong>{title}</strong><small>{description}</small></span></button>;
}
