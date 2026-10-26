"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import GuideCompletion from "@/components/GuideCompletion";
import CompanyGuideShell, { selectedGuideRoute } from "./CompanyGuideShell";
import CompanyAccountSelector from "@/components/CompanyAccountSelector";
import type { CompanyPolicy } from "@/lib/types";
import { companyEnglish, type EnglishAction } from "@/lib/company-en";
import styles from "./GoogleAccountFlow.module.css";

type Audience = "mine" | "deceased";

const logos: Record<string, string> = {
  meta: "/logos/meta.svg",
  instagram: "/logos/instagram.webp",
  samsung: "/logos/samsung.svg",
  kakao: "/logos/kakao.webp",
  x: "/logos/x.svg",
  apple: "/logos/apple.svg",
  google: "/logos/google.svg",
  naver: "/logos/naver.svg",
};

export default function EnglishCompanyAccountFlow({
  company,
  initialAudience = null,
}: {
  company: CompanyPolicy;
  initialAudience?: Audience | null;
}) {
  const [audience, setAudience] = useState<Audience | null>(initialAudience);
  const [actionId, setActionId] = useState<string | null>(null);
  const english = companyEnglish[company.slug];
  const displayName = english?.name ?? company.company;

  const activeActions = audience ? (english?.[audience] ?? []) : [];
  const selectedAction = selectedGuideRoute(activeActions, actionId) ?? null;

  useEffect(() => {
    function restore(event?: PopStateEvent) {
      const saved = event?.state?.englishCompanyAccountFlow;
      if (saved) {
        setAudience(saved.audience ?? null);
        setActionId(event?.state?.englishCompanyAccountFlow?.actionId ?? null);
        return;
      }
      const params = new URLSearchParams(window.location.hash.slice(1));

      const query = new URLSearchParams(window.location.search);
      const account = params.get("account") ?? query.get("audience") ?? initialAudience;
      setAudience(account === "mine" || account === "deceased" ? account : null);
      const goal = query.get("goal");
      const preferredIds = goal === "download" ? ["download", "archive", "media"] : goal === "delete" ? (account === "mine" ? ["delete"] : ["delete", "remove", "deactivate"]) : goal === "memorial" ? ["memorial", "memorialize"] : [];
      const actions = account === "mine" ? english?.mine : account === "deceased" ? english?.deceased : [];
      const goalAction = preferredIds.map(id => actions?.find(action => action.id === id)).find(Boolean);
      setActionId(params.get("route") ?? goalAction?.id ?? null);
    }

    restore();
    window.addEventListener("popstate", restore);
    const restoreHash = () => restore(new PopStateEvent("popstate", { state: window.history.state }));
    window.addEventListener("hashchange", restoreHash);
    return () => { window.removeEventListener("popstate", restore); window.removeEventListener("hashchange", restoreHash); };
  }, [initialAudience, english]);

  function navigate(nextAudience: Audience | null, nextActionId: string | null = null) {
    const params = new URLSearchParams();
    if (nextAudience) params.set("account", nextAudience);
    if (nextActionId) params.set("route", nextActionId);
    const hash = params.toString() ? `#${params.toString()}` : window.location.pathname;
    window.history.pushState(
      { englishCompanyAccountFlow: { audience: nextAudience, actionId: nextActionId } },
      "",
      hash,
    );
    setAudience(nextAudience);
    setActionId(nextActionId);
  }

  return (
    <div className={styles.page}>
      {!audience && (
        <CompanyAccountSelector
          locale="en"
          mine={{
            title: `My ${displayName} account`,
            description: `I want to manage my data or decide what happens to my ${displayName} account later.`,
            onSelect: () => navigate("mine"),
          }}
          deceased={{
            title: `${displayName} account for someone who died`,
            description: `I need to manage their account, data, or memorialized profile.`,
            onSelect: () => navigate("deceased"),
          }}
        />
      )}

      {audience && selectedAction && <CompanyGuideShell
        companyName={displayName}
        logo={logos[company.slug]}
        locale="en"
        audience={audience}
        routes={{ mine: english?.mine ?? [], deceased: english?.deceased ?? [] }}
        selectedRouteId={selectedAction.id}
        onReset={() => navigate(null)}
        onSelectAudience={next => navigate(next, next === audience ? selectedAction.id : null)}
        onSelectRoute={(next, id) => navigate(next, String(id))}
      >
        <StandardStepDetail companyName={displayName} audience={audience} action={selectedAction} />
      </CompanyGuideShell>}
    </div>
  );
}

function StandardStepDetail({
  companyName,
  audience,
  action,
}: {
  companyName: string;
  audience: Audience;
  action: EnglishAction;
}) {
  const sections = action.sections ?? [
    ["What to do", [action.guidance]],
  ];

  return (
    <main className={`${styles.shell} ${styles.compact} ${styles.detail}`}>
      <p className={styles.eyebrow}>
        {audience === "mine" ? `My ${companyName} account` : `${companyName} account for someone who died`}
      </p>
      <h1>{action.title}</h1>
      {action.description && <p className={styles.lead}>{action.description}</p>}

      {action.warning && (
        <div className={styles.warning}>
          <strong>Before you continue</strong>
          <p>{action.warning}</p>
        </div>
      )}

      <div className={styles.sections}>
        {sections.map(([heading, items]) => (
          <section key={heading}>
            <h2>{heading}</h2>
            <ul>
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
        {action.notes && (
          <section>
            <h2>Things to know</h2>
            <p className={styles.lead}>{action.notes}</p>
          </section>
        )}
      </div>

      <Link className={styles.commonDocumentsLink} href="/en/prepare#documents">
        View required documents
      </Link>

      <section className={styles.officialHandoff}>
        <h2>On {companyName}’s official site</h2>
        <ul>
          <li>{audience === "mine" ? "You may need to sign in." : "You may need to verify your identity and relationship to the person."}</li>
          <li>The exact steps and required documents may vary.</li>
          <li>LOGOUT never asks for or stores passwords, account credentials, or legal documents.</li>
        </ul>
      </section>

      <GuideCompletion company={companyName} task={action.title} href={`/en/company/${companyName.toLowerCase()}`} locale="en" />

      {action.link && (
        <div className={styles.actions}>
          <a
            className={styles.primary}
            href={action.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${action.linkLabel ?? "Open official page"} (opens in a new tab)`}
          >
            {action.linkLabel ?? "Open official page"}
          </a>
        </div>
      )}
    </main>
  );
}
