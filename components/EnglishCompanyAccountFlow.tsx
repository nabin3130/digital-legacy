"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
}: {
  company: CompanyPolicy;
}) {
  const [audience, setAudience] = useState<Audience | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);
  const english = companyEnglish[company.slug];
  const displayName = english?.name ?? company.company;

  const activeActions = audience ? (english?.[audience] ?? []) : [];
  const selectedAction = activeActions.find((item) => item.id === actionId) ?? null;

  useEffect(() => {
    function restore(event?: PopStateEvent) {
      const saved = event?.state?.englishCompanyAccountFlow?.audience as Audience | undefined;
      if (saved) {
        setAudience(saved);
        setActionId(event?.state?.englishCompanyAccountFlow?.actionId ?? null);
        return;
      }
      const params = new URLSearchParams(window.location.hash.slice(1));
      setAudience(params.get("account") as Audience | null);
      setActionId(params.get("route") ?? null);
    }

    restore();
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, []);

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
      {audience && (
        <header className={styles.header}>
          <button
            type="button"
            className={styles.brand}
            onClick={() => navigate(null)}
            aria-label={`${displayName} Guide Home`}
          >
            {logos[company.slug] && (
              <img src={logos[company.slug]} alt="" width="48" height="48" />
            )}
            <span>
              <small>Official Guide</small>
              {displayName}
            </span>
          </button>
          {(audience || actionId) && (
            <button type="button" className={styles.back} onClick={() => window.history.back()}>
              ← Back
            </button>
          )}
        </header>
      )}

      {audience && (
        <nav className={styles.contextNavigation} aria-label={`${displayName} navigation`}>
          <ol className={styles.breadcrumb}>
            <li><Link href="/en/#services">Services</Link></li>
            <li><button type="button" onClick={() => navigate(null)}>{displayName}</button></li>
            <li>
              <button type="button" onClick={() => navigate(audience)}>
                {audience === "mine" ? `My ${displayName} account` : `Deceased person’s ${displayName} account`}
              </button>
            </li>
          </ol>

          {selectedAction && (
            <div className={styles.quickNavigation}>
              <div className={styles.accountTabs} aria-label="Choose account type">
                <button
                  type="button"
                  className={audience === "mine" ? styles.activeTab : ""}
                  onClick={() => navigate("mine")}
                >
                  My {displayName} account
                </button>
                <button
                  type="button"
                  className={audience === "deceased" ? styles.activeTab : ""}
                  onClick={() => navigate("deceased")}
                >
                  Deceased person’s account
                </button>
              </div>
              <label className={styles.routeSelect}>
                <span>View other options</span>
                <select
                  value={selectedAction.id}
                  onChange={(event) => navigate(audience, event.target.value)}
                  aria-label="View other options"
                >
                  {activeActions.map((item) => (
                    <option value={item.id} key={item.id}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}
        </nav>
      )}

      {!audience && (
        <CompanyAccountSelector
          locale="en"
          mine={{
            title: `My ${displayName} account`,
            description: `I want to organize my personal data or set up posthumous preferences for my ${displayName} account.`,
            onSelect: () => navigate("mine"),
          }}
          deceased={{
            title: `A deceased person’s ${displayName} account`,
            description: `I need to handle the deceased person’s ${displayName} account, data, or memorialization.`,
            onSelect: () => navigate("deceased"),
          }}
        />
      )}


      {audience && !selectedAction && (
        <main className={`${styles.shell} ${styles.compact}`}>
          <p className={styles.eyebrow}>
            {audience === "mine" ? `My ${displayName} account` : `Deceased person’s ${displayName} account`}
          </p>
          <h1>What would you like to do?</h1>
          <p className={styles.lead}>Choose the option that best matches your situation.</p>
          <div className={styles.choices}>
            {activeActions.map((item) => (
              <Choice
                key={item.id}
                title={item.title}
                description={item.description}
                onClick={() => navigate(audience, item.id)}
              />
            ))}
          </div>
        </main>
      )}

      {audience && selectedAction && (
        <StandardStepDetail companyName={displayName} audience={audience} action={selectedAction} />
      )}
    </div>
  );
}

function Choice({
  title,
  description,
  onClick,
}: {
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button type="button" className={styles.choice} onClick={onClick}>
      <span>
        <strong>{title}</strong>
        <small>{description}</small>
      </span>
    </button>
  );
}

import GuideCompletion from "@/components/GuideCompletion";

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
    ["Procedure & Guidance", [action.guidance]],
  ];

  return (
    <main className={`${styles.shell} ${styles.compact} ${styles.detail}`}>
      <p className={styles.eyebrow}>
        {audience === "mine" ? `My ${companyName} account` : `Deceased person’s ${companyName} account`}
      </p>
      <h1>{action.title}</h1>
      {action.description && <p className={styles.lead}>{action.description}</p>}

      {action.warning && (
        <div className={styles.warning}>
          <strong>Please review first</strong>
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
            <h2>Important notes</h2>
            <p className={styles.lead}>{action.notes}</p>
          </section>
        )}
      </div>

      <Link className={styles.commonDocumentsLink} href="/en/prepare#documents">
        View common required documents and issuance guide →
      </Link>

      <section className={styles.officialHandoff}>
        <h2>When you open {companyName}'s official page</h2>
        <ul>
          <li>{audience === "mine" ? "Sign-in with your account may be required." : "Official identity verification and proof of relationship may be requested."}</li>
          <li>Specific procedures and required documents may vary based on platform policies.</li>
          <li>This guide never requests, handles, or stores any account credentials or legal certificates.</li>
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
            {action.linkLabel ?? "Open official page"} ↗
          </a>
        </div>
      )}
    </main>
  );
}

