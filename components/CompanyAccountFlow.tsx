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
  const displayName = displayNames[company.slug] ?? company.company;

  useEffect(() => {
    function restore(event?: PopStateEvent) {
      const saved = event?.state?.companyAccountFlow?.audience as Audience | undefined;
      if (saved) {
        setAudience(saved);
        return;
      }
      const params = new URLSearchParams(window.location.hash.slice(1));
      setAudience(params.get("account") as Audience | null);
    }

    restore();
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, []);

  function navigate(next: Audience | null) {
    const hash = next ? `#account=${next}` : window.location.pathname;
    window.history.pushState({ companyAccountFlow: { audience: next } }, "", hash);
    setAudience(next);
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.brand} onClick={() => navigate(null)} aria-label={`${displayName} 안내 처음으로`}>
          <img src={logos[company.slug]} alt="" width="48" height="48" />
          <span><small>공식 절차 안내</small>{displayName}</span>
        </button>
        {audience && <button type="button" className={styles.back} onClick={() => window.history.back()}>← 이전으로</button>}
      </header>

      {!audience ? (
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
      ) : (
        <ApplicationStepsView
          companyName={displayName}
          companyPolicy={company}
          preDeathSteps={preDeathSteps}
          postDeathSteps={postDeathSteps}
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
